const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./database');

const User = require('./models/user');
const { Recipe } = require('./models/recipe');

const appRoutes = require('./routes/appRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

require('./config/passport')(passport);
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: 'your-secret-key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    secure: false, 
    httpOnly: true
  }
}));
sessionStore.sync();

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

app.use(appRoutes);
app.use('/recipes', recipeRoutes);


app.listen(5000, () => {
  console.log("Server started on port 5000");
});

User.sync()
  .then(() => console.log("User table and model successfully synced!"))
  .catch(() => console.log("Error syncing the user table and model."));

Recipe.sync()
  .then(() => console.log("Recipe table and model successfully synced!"))
  .catch(err => console.log("Error syncing the recipe table and model:", err));
