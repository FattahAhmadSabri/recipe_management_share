const { DataTypes } = require("sequelize");

const sequelize = require("../utils/dbConfig");

const Recipe = sequelize.define("recipe", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },

  recipeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  method: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  cuisine: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  cookingTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  preparationTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  marinationTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  soakingTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  serves: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  makes: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  otherNames: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  tags: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  keywords: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  ratingCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Recipe;
