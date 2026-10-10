const User = require("../model/userSchema");
const Recipe = require("../model/recipeSchema");
const MainIngredient = require("../model/mainIngredientSchema");
const RecipeType = require("./recipeTypeSchema");
const Reply = require("./replySchema");
const RecentView = require("./recentViewRecipeSchema");
const Follow = require("./followersSchema");
const Favorite = require("./favoritesCollectionsSchema");

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
  foreignKey: "userId",
});

Reply.belongsTo(User, {
  foreignKey: "userId",
});

Recipe.hasMany(Reply, {
  foreignKey: "recipeId",
});

Reply.belongsTo(Recipe, {
  foreignKey: "recipeId",
});

Recipe.hasMany(RecentView, {
  foreignKey: "recipeId",
});

RecentView.belongsTo(Recipe, {
  foreignKey: "recipeId",
});

User.hasMany(RecentView, {
  foreignKey: "userId",
});

RecentView.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Follow, {
  foreignKey: "followerId",
  as: "followings",
  onDelete: "CASCADE",
});

User.hasMany(Follow, {
  foreignKey: "followingId",
  as: "followers",
  onDelete: "CASCADE",
});

Follow.belongsTo(User, {
  foreignKey: "followerId",
  as: "follower",
});

Follow.belongsTo(User, {
  foreignKey: "followingId",
  as: "followingUser",
});

User.belongsToMany(Recipe, {
  through: Favorite,
  foreignKey: "userId",
  otherKey: "recipeId",
  as: "favoriteRecipes",
});

Recipe.belongsToMany(User, {
  through: Favorite,
  foreignKey: "recipeId",
  otherKey: "userId",
  as: "favoritedBy",
});

module.exports = {
  User,
  Recipe,
  MainIngredient,
  RecipeType,
  Reply,
  RecentView,
  Follow,
  Favorite,
};
