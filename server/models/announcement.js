const Sequelize = require('sequelize');
const sequelize = require('../database');

const Announcement = sequelize.define('announcement', {
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    tag: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Announcement;