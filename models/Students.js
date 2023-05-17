const Sequelize = require('sequelize')

module.exports = sequelize.define('Students', {
    roll:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING(255),
    dob: Sequelize.DATE(6),
    score: Sequelize.INTEGER(110),
});