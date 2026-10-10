const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Favorite = sequelize.define(
  "favorite",
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
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "recipeId"],
      },
    ],
  }
);

module.exports = Favorite;