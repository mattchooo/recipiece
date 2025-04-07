const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'recipiece-database', 
    'root', 
    'mattchoo',
    {dialect: 'mysql', host: 'localhost', port: 3307}
);

sequelize.authenticate().then(() => {
    console.log("Connection successful!");
}).catch((err) => {
    console.log("Error connecting to database:", err);
});

console.log("Another task.");

module.exports = sequelize;

//port: 3307, password: mattchoo