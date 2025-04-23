const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const { Recipe } = require('../models/recipe');

const imageDir = path.join(__dirname, '..', 'uploaded_images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

const recipeController = {
  uploadRecipeImage: (req, res) => {
    console.log('[uploadRecipeImage] Upload request received');
    const user = req.user;
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const newFilename = req.file.originalname;
    const newPath = path.join(imageDir, newFilename);
    fs.renameSync(req.file.path, newPath);

    const pythonPath = 'C:\\Python313\\python.exe';
    const scriptPath = path.join(__dirname, '..', 'predict-food-items.py');

    exec(`"${pythonPath}" "${scriptPath}" "${newPath}"`, async (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing Python script:\n${stderr}`);
        return res.status(500).json({ error: 'Failed to process image' });
      }

      try {
        const cleaned = stdout.trim();
        const recipes = JSON.parse(cleaned);
        console.log(recipes);

        const fridgeId = uuidv4();

        const saved = await Promise.all(
          recipes
            .filter(recipe => recipe && recipe.id)
            .map(recipe =>
              Recipe.create({
                userId: user.id,
                fridgeId,
                mealId: recipe.id,
                name: recipe.name,
                matchPercent: recipe.matchPercent,
                ingredients: recipe.ingredients.join(', '),
                instructions: recipe.instructions,
                source: recipe.source,
                thumbnail: recipe.thumbnail
              })
            )
        )

        res.json({ recipes: saved, fridgeId });
        console.log("Mission complete.");

        fs.unlink(newPath, (unlinkErr) => {
          if (unlinkErr) {
            console.warn('Warning: Could not delete image file:', unlinkErr);
          } else {
            console.log('Image file deleted:', newPath);
          }
        });
      } catch (e) {
        console.error('Error parsing recipe output:', e);
        res.status(500).json({ error: 'Invalid JSON from Python script' });
      }
    });
  },

  getRecipeHistory: async (req, res) => {
    const user = req.user;
    try {
      const recipes = await Recipe.findAll({
        where: { userId: user.id, saved: true },
        order: [['createdAt', 'DESC']],
        limit: 50
      });
      res.json({ recipes });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch past recipes' });
    }
  },

  getRecipesByFridgeId: async (req, res) => {
    const { fridgeId } = req.params;
    console.log(`[getRecipesByFridgeId] Fridge ID received: ${req.params.fridgeId}`);

    try {
      const recipes = await Recipe.findAll({
        where: { fridgeId },
        order: [['matchPercent', 'DESC']]
      });

      res.json({ recipes });
    } catch (err) {
      console.error('Error fetching recipes by fridgeId:', err);
      res.status(500).json({ error: 'Failed to fetch batch recipes' });
    }
  },

  getRecipeByMealId: async (req, res) => {
    const { mealId } = req.params;
    const user = req.user;

    try {
      const recipe = await Recipe.findOne({
        where: {
          userId: user.id,
          mealId: mealId
        }
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      res.json({ recipe });
    } catch (err) {
      console.error('Error fetching recipe by mealId:', err);
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  },

  confirmSelectedRecipes: async (req, res) => {
    console.log(`💾 [confirmSelectedRecipes] Confirming selected IDs for user ${req.user?.id}`);
    console.log('Selected IDs:', req.body.selectedIds);
    const user = req.user;
    const { selectedIds } = req.body;

    try {
      await Recipe.update(
        { saved: true },
        { where: { userId: user.id, id: selectedIds } }
      );
      res.json({ success: true });
    } catch (err) {
      console.error('Error confirming recipes:', err);
      res.status(500).json({ error: 'Failed to confirm recipes' });
    }
  },

  getSaveCountByMealId: async (req, res) => {
    const { mealId } = req.params;

    try {
      const count = await Recipe.count({
        where: {
          mealId,
          saved: true
        }
      });

      res.json({ count });
    } catch (err) {
      console.error('Error fetching save count:', err);
      res.status(500).json({ error: 'Failed to fetch save count' });
    }
  },

  getAllRecipes: async (req, res) => {

    try {
      const [recipes] = await Recipe.sequelize.query(`
        SELECT * FROM recipes r
        INNER JOIN (
          SELECT mealId, MAX(createdAt) AS latest
          FROM recipes
          GROUP BY mealId
        ) latest_recipes
        ON r.mealId = latest_recipes.mealId AND r.createdAt = latest_recipes.latest
        ORDER BY r.createdAt DESC
      `);

      res.json({ recipes });
    } catch (err) {
      console.error('Error fetching all recipes:', err);
      res.status(500).json({ error: 'Failed to fetch all recipes' });
    }
  }
};

module.exports = recipeController;
