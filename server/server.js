const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

require('./config/passport')(passport);

const User = require('./models/user');
const Announcement = require('./models/announcement');

const app = express();

const appRoutes = require('./routes/appRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

<<<<<<< Updated upstream
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
=======
require('./config/passport')(passport);
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
>>>>>>> Stashed changes

// Express session initialization:
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



app.use(appRoutes);
app.use(announcementRoutes);

app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

<<<<<<< Updated upstream
User.sync().then((data) => {
  console.log("User table and model successfully synced!");
}).catch((err) => {
  console.log("Error syncing the user table and model.");
});

Announcement.sync().then((data) => {
  console.log("Announcement table and model successfully synced!");
}).catch((err) => {
  console.log("Error syncing the announcement table and model.");
})
=======
User.sync({ alter: true })
  .then(() => console.log("User model updated with latest schema."))
  .catch(err => console.log("User sync error:", err));

Announcement.sync({ alter: true })
  .then(() => console.log("Announcement model updated with latest schema."))
  .catch(err => console.log("Announcement sync error:", err));
>>>>>>> Stashed changes


