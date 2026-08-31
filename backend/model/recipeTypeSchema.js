const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const RecipeType = sequelize.define("recipeType", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = RecipeType;
