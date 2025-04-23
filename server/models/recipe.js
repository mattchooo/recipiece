const Sequelize = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Recipe = sequelize.define('recipe', {
    id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false
    },
    fridgeId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false
    },
    mealId: Sequelize.DataTypes.STRING,
    name: Sequelize.DataTypes.STRING,
    matchPercent: Sequelize.DataTypes.INTEGER,
    ingredients: Sequelize.DataTypes.TEXT,
    instructions: Sequelize.DataTypes.TEXT,
    source: Sequelize.DataTypes.STRING,
    thumbnail: Sequelize.DataTypes.STRING,
    saved: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    }
});

User.hasMany(Recipe, { foreignKey: 'userId' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

module.exports = { Recipe };