const express = require('express');
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require('path');
const { exec } = require("child_process");
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const User = require('./models/user');
const { Recipe } = require('./models/recipe');
const Announcement = require('./models/announcement');

const appRoutes = require('./routes/appRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

require('./config/passport')(passport);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); 
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

const imageDir = path.join(__dirname, '..', 'uploaded_images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

// Better for multiple clients
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  const user = req.user;

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }
  
  const ext = path.extname(req.file.originalname);
  const newFilename = `${user.id}${ext}`;
  const newPath = path.join(imageDir, newFilename);
  
  fs.renameSync(req.file.path, newPath);
  
  exec(`python3 ../predict-food-items.py ${user.id}`, async (err, stdout, stderr) => {
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image file:", unlinkErr);
      }
    });
    
    if (err) {
      console.error(`Error processing image: ${stderr}`);
      return res.status(500).json({ error: "Failed to process image" });
    }

    try {
      const recipes = JSON.parse(stdout);
      const saved = await Promise.all(
        recipes.map(recipe =>
          Recipe.create({
              userId: user.id,
              mealId: recipe.id,
              name: recipe.name,
              matchPercent: recipe.matchPercent,
              ingredients: recipe.ingredients.join(', '),
              instructions: recipe.instructions,
              source: recipe.source,
              thumbnail: recipe.thumbnail
          })
      ));
      res.json({ recipes: saved });
    } catch (e) {
      console.error("Error parsing recipe output:", e);
      res.status(500).json({ error: "Failed to parse recipe output" });
    }
  });
});

app.get("/recipes/history", async (req, res) => {
  const user = req.user;

  try {
      const recipes = await Recipe.findAll({
          where: { userId: user.id },
          order: [['createdAt', 'DESC']],
          limit: 50
      });
      res.json({ recipes });
  } catch (err) {
      res.status(500).json({ error: "Failed to fetch past recipes" });
  }
});

app.use(appRoutes);
app.use(announcementRoutes);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

User.sync()
  .then(() => console.log("User table and model successfully synced!"))
  .catch(() => console.log("Error syncing the user table and model."));

Announcement.sync()
  .then(() => console.log("Announcement table and model successfully synced!"))
  .catch(() => console.log("Error syncing the announcement table and model."));


