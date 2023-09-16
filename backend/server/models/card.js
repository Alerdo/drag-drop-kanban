'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Card.init({
    stock_name: DataTypes.STRING,
    entry_date: DataTypes.DATE,
    due_date: DataTypes.DATE,
    type: DataTypes.STRING,
    stage: DataTypes.STRING,
    primary_analyst: DataTypes.STRING,
    secondary_analyst: DataTypes.STRING,
    sedol: DataTypes.INTEGER,
    isin: DataTypes.INTEGER,
    link_1: DataTypes.STRING,
    link_2: DataTypes.STRING,
    link_3: DataTypes.STRING,
    link_4: DataTypes.STRING,
    link_5: DataTypes.STRING,
    other: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};