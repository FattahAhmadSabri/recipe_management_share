
const User = require("../model/userSchema")
const Recipe = require("../model/recipeSchema")

User.hasMany(Recipe,{
    foreignKey: "userId"
})

Recipe.belongsTo(User,
    {foreignKey: "userId"}
)

module.exports ={
    User,Recipe
}