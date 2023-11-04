//Import the sequlize constructor from sequleize
const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequalize = new Sequelize(
    process.env.JAWSDB_URL ||
    process.env.DB_NAME,
    process.env.DB_USERNAME,
     process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    // Turn off sql logging in terminal
    logging: false
});

//Export the connection object
module.exports = sequalize;
