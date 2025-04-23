const Sequelize = require('sequelize');
const sequelize = require('../database');

const Meal = sequelize.define('meal', {
  mealId: {
    type: Sequelize.DataTypes.STRING,
    primaryKey: true
  },
  name: Sequelize.DataTypes.STRING,
  ingredients: Sequelize.DataTypes.TEXT,
  instructions: Sequelize.DataTypes.TEXT,
  source: Sequelize.DataTypes.STRING,
  thumbnail: Sequelize.DataTypes.STRING,
  saveCount: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Meal;
