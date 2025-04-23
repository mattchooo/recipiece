const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const recipeController = require('../controllers/recipeController');
const ensureAuthenticated = require('../middleware/authentication');

const imageDir = path.join(__dirname, '..', 'uploaded_images');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/all', recipeController.getAllRecipes);
router.get('/history', ensureAuthenticated, recipeController.getRecipeHistory);
router.get('/:mealId', ensureAuthenticated, recipeController.getRecipeByMealId);
router.post('/confirm', ensureAuthenticated, recipeController.confirmSelectedRecipes);
router.get('/savecount/:mealId', ensureAuthenticated, recipeController.getSaveCountByMealId);
router.post('/upload', ensureAuthenticated, upload.single('image'), recipeController.uploadRecipeImage);
router.get('/batch/:fridgeId', ensureAuthenticated, recipeController.getRecipesByFridgeId);


module.exports = router;
