const object = require('../config/config.json');
const Sequelize = require('sequelize')


const db = object.development.database
const user = object.development.username
const password = object.development.password
const sequelize = new Sequelize(db, user, password, { 
    host: 'mysqlserver-900.mysql.database.azure.com', 
    dialect: 'mysql', 
    operatorsAliases: false 
});

module.exports = sequelize

global.sequelize = sequelize;