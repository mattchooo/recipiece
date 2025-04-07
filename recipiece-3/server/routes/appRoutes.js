const express = require('express');
const passport = require('passport');
const appController = require('../controllers/appController');

const router = express.Router();

router.get('/api', appController.getAPI);
router.post('/create', appController.postSignup);
router.get('/check-auth', appController.getAuthentication);
router.post('/forgot-password', appController.postForgotPassword);
router.get('/reset-password/:token/:id', appController.getResetPassword);
router.put('/reset-password/:token/:id', appController.putResetPassword);
router.delete('/logout', appController.logout);

const authenticateMiddleware = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
});

router.post('/validate', authenticateMiddleware, (req, res) => {
  res.status(200).json({ message: 'Login successful.' });
});

router.post('/clearUserTable', appController.clearUserTable);


router.get('/login', (req, res) => {
  const errorMessage = req.flash('error');
  res.send({ message: errorMessage[0] });
  // handle server error messages eventually
});

router.get('/', (req, res) => {
  res.send({ message: 'This is the home page' });
});

module.exports = router;
