'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stock_name: {
        type: Sequelize.STRING
      },
      entry_date: {
        type: Sequelize.DATE
      },
      due_date: {
        type: Sequelize.DATE
      },
      type: {
        type: Sequelize.STRING
      },
      stage: {
        type: Sequelize.STRING
      },
      primary_analyst: {
        type: Sequelize.STRING
      },
      secondary_analyst: {
        type: Sequelize.STRING
      },
      sedol: {
        type: Sequelize.INTEGER
      },
      isin: {
        type: Sequelize.INTEGER
      },
      link_1: {
        type: Sequelize.STRING
      },
      link_2: {
        type: Sequelize.STRING
      },
      link_3: {
        type: Sequelize.STRING
      },
      link_4: {
        type: Sequelize.STRING
      },
      link_5: {
        type: Sequelize.STRING
      },
      other: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cards');
  }
};