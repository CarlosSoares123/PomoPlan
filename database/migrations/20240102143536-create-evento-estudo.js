'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventoEstudos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      titulo: {
        type: Sequelize.STRING
      },
      categoria: {
        type: Sequelize.STRING
      },
      inicio: {
        type: Sequelize.DATE
      },
      fim: {
        type: Sequelize.DATE
      },
      duracao: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      dia: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventoEstudos');
  }
};