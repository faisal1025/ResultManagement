'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('teachers', {
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
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable('teachers');
    
  }
};
