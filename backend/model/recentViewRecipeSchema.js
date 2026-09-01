const sequelize = require("../utils/dbConfig");
const {DataTypes} = require("sequelize")
const RecentView = sequelize.define("recentview", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  viewedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = RecentView;
