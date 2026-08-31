const User = require("../model/userSchema");
const Recipe = require("../model/recipeSchema");
const MainIngredient = require("../model/mainIngredientSchema");
const RecipeType = require("./recipeTypeSchema");



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


module.exports = {
  User,
  Recipe,
  MainIngredient,
  RecipeType,
};