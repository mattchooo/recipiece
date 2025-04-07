const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { isAlpha } = require('validator');
const sequelize = require('../database');
const bcrypt = require('bcrypt');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: {
                args: true,
                msg: 'Invalid email format.'
            }
        }
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            isValidName(value) {
                const nameParts = value.split(' ');
                const isValid = nameParts.every(part => isAlpha(part));

                if (!isValid) {
                    throw new Error('First and last name should only contain letters.');
                }
            }
        }
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    resetToken: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    }
});

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error('Incorrect password');
    }
    throw new Error('Incorrect username');
}

module.exports = User;