const User = require("../model/userSchema");
const Recipe = require("../model/recipeSchema");
const MainIngredient = require("../model/mainIngredientSchema");
const RecipeType = require("./recipeTypeSchema");
const Reply = require("./replySchema")



User.hasMany(Recipe, {
  foreignKey: "userId",
});

Recipe.belongsTo(User, {
  foreignKey: "userId",
});



MainIngredient.hasMany(Recipe, {
  foreignKey: "mainIngredientId",
});

Recipe.belongsTo(MainIngredient, {
  foreignKey: "mainIngredientId",
});



RecipeType.hasMany(Recipe, {
  foreignKey: "recipeTypeId",
});

Recipe.belongsTo(RecipeType, {
  foreignKey: "recipeTypeId",
});

User.hasMany(Reply, {
  foreignKey: "userId"
})

Reply.belongsTo(User,{
  foreignKey: "userId"
})

Recipe.hasMany(Reply,{
  foreignKey: "recipeId"
})

Reply.belongsTo(Recipe,{
  foreignKey: "recipeId"
})




module.exports = {
  User,
  Recipe,
  MainIngredient,
  RecipeType,
  Reply
};