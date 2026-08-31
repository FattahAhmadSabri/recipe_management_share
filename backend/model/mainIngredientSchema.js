const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const MainIngredient = sequelize.define("mainIngredient", {
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

module.exports = MainIngredient;