// server/controllers/appController.js
const sendEmail = require('../config/emailservice');
const crypto = require('crypto');
const User = require('../models/user');
const {Op} = require('sequelize');


const appController = {
    getAPI: (req, res) => {
      res.send({ message: "API is working!" });
    },
  
    postSignup: async (req, res) => {
        try {
            const { username, name, email, password } = req.body;
            console.log('Signup received:', req.body);
        
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
              return res.status(400).json({ error: 'Email already in use' });
            }

            const existingUsername = await User.findOne({ where: { username } });
            if (existingUsername) {
              return res.status(400).json({ error: 'Username already in use' });
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
  
    postForgotPassword: async (req, res) => {
      const { email } = req.body;
    
      try {
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
          return res.status(404).json({ error: 'Could not find user.' });
        }
    
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
        user.resetToken = hashedToken;
        user.resetTokenExpires = Date.now() + 30 * 60 * 1000; // 30 min
        await user.save();
    
        const resetURL = `http://localhost:3000/reset-password/${resetToken}/${user.id}`;
        const message = `
          Hello ${user.name || 'user'},
          
          You requested a password reset. Click the link below to reset your password:
    
          ${resetURL}
    
          This link will expire in 30 minutes.
    
          If you did not request this, please ignore this email.
        `;
    
        await sendEmail({
          email: user.email,
          subject: 'Password Reset Instructions',
          message: message
        });
    
        res.status(200).json({ message: 'Password reset email sent.' });
        console.log("Forgot password email sent.");
    
      } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Internal server error.' });
      }
    },
  
    getResetPassword: async (req, res) => {
      const { token, id } = req.params;
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
      try {
        const user = await User.findOne({
          where: {
            id,
            resetToken: hashedToken,
            resetTokenExpires: { [Op.gt]: Date.now() }
          }
        });
    
        if (!user) {
          return res.status(400).json({ error: 'Invalid or expired token' });
        }
    
        res.status(200).json({ message: 'Token is valid' });
      } catch (err) {
        console.error("Get reset password error:", err);
        res.status(500).json({ error: "Server error" });
      }
    },
  
    putResetPassword: async (req, res) => {
      const { token, id } = req.params;
      const { password } = req.body;
    
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
      try {
        const user = await User.findOne({
          where: {
            id,
            resetToken: hashedToken,
            resetTokenExpires: { [Op.gt]: Date.now() }
          }
        });
    
        if (!user) {
          return res.status(400).json({ error: 'Token is invalid or has expired' });
        }
    
        user.password = password;
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();
    
        res.status(200).json({ message: 'Password updated successfully' });
        console.log("Password updated successfully.");
      } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ error: "Server error while resetting password" });
      }
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
  