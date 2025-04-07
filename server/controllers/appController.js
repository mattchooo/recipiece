// server/controllers/appController.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');


const appController = {
    getAPI: (req, res) => {
      res.send({ message: "API is working!" });
    },
  
    postSignup: async (req, res) => {
        try {
            const { username, name, email, password } = req.body;
            console.log('Signup received:', req.body);
        
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
              return res.status(400).json({ error: 'Email already in use' });
            }
        
            const newUser = await User.create({
              username,
              name,
              email,
              password
            });
        
            console.log('User created:', newUser.id);
        
            res.status(201).json({ message: 'User successfully registered', userId: newUser.id });
          } catch (error) {
            console.error('Error during signup:', error);
            res.status(500).json({ error: 'Server error during signup' });
          }
    },
  
    getAuthentication: (req, res) => {
      if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
      } else {
        res.json({ authenticated: false });
      }
    },
  
    postForgotPassword: (req, res) => {
      res.send({ message: "Forgot password handler" });
      const { email } = req.body;
      console.log('Forgot password received:', req.body);
    },
  
    getResetPassword: (req, res) => {
      res.send({ message: "Reset password (GET)" });
    },
  
    putResetPassword: (req, res) => {
      res.send({ message: "Reset password (PUT)" });
    },
  
    logout: (req, res) => {
      req.logout(err => {
        if (err) {
          return res.status(500).json({ error: 'Logout failed.' });
        }
        req.session.destroy(err => {
            if (err) {
              return res.status(500).json({ error: 'Session destruction failed.' });
            }
      
            res.clearCookie('connect.sid'); 
            console.log("User logged out and session destroyed.");
            res.json({ message: 'Logged out and session destroyed.' });
          });
      });
    },
  
    clearUserTable: async (req, res) => {
      try {
        const User = require('../models/user');
        await User.destroy({ where: {} });
        res.send({ message: "User table cleared." });
      } catch (err) {
        res.status(500).send({ error: "Failed to clear user table." });
      }
    }
  };
  
  module.exports = appController;
  