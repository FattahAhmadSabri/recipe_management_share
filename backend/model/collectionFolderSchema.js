const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Collection = sequelize.define("Collection", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

module.exports = Collection;
