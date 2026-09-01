const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Reply = sequelize.define("reply", {
    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    reply :{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = Reply