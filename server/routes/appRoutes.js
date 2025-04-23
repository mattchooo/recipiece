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

router.post('/validate', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Server error during authentication' });
    if (!user) return res.status(401).json({ error: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ success: true, user: { id: user.id, email: user.email } });
    });
  })(req, res, next);
});

router.post('/clearUserTable', appController.clearUserTable);


router.get('/login', (req, res) => {
  const errorMessage = req.flash('error');
  res.send({ message: errorMessage[0] });
});

router.get('/', (req, res) => {
  res.send({ message: 'This is the home page' });
});

module.exports = router;
