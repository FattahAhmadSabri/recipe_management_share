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
    collectionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["collectionId", "recipeId"],
      },
    ],
  },
);

module.exports = Favorite;
