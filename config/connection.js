const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequalize = new Sequelize(
    process.env.JAWSDB_URL ||
    process.env.DB_NAME,
    process.env.DB_USERNAME,
     process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
 
    logging: false
});


module.exports = sequalize;
