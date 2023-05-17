const Sequelize = require('sequelize')

module.exports = sequelize.define('Teachers', {
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email:{
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    password:{
        type: Sequelize.STRING(255),
        allowNull: false,
        validate:{
            min: 8
        }
    }
});