const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const RecipeRating = sequelize.define(
  "RecipeRating",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "recipeId"],
      },
    ],
  },
);

module.exports = RecipeRating;
