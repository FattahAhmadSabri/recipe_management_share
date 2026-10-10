const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Follow = sequelize.define(
  "follow",
  {
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["followerId", "followingId"],
      },
    ],
    timestamps: true,
  },
);

module.exports = Follow;
