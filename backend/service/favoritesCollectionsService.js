const { Favorite, Recipe, User } = require("../model");

const addFavoriteRecipeService = async (userId, recipeId) => {
  if (!userId || !recipeId) {
    const error = new Error("User id and recipe id are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(userId);
  const recipe = await Recipe.findByPk(recipeId);

  if (!user || !recipe) {
    const error = new Error("User or recipe not found");
    error.statusCode = 404;
    throw error;
  }

  const existingFavorite = await Favorite.findOne({
    where: { userId, recipeId },
  });

  if (existingFavorite) {
    const error = new Error("Recipe already added to favorites");
    error.statusCode = 409;
    throw error;
  }

  return Favorite.create({ userId, recipeId });
};

const deleteFavoriteRecipeService = async (userId, recipeId) => {
  if (!userId || !recipeId) {
    const error = new Error("User id and recipe id are required");
    error.statusCode = 400;
    throw error;
  }

  const deletedCount = await Favorite.destroy({
    where: { userId, recipeId },
  });

  if (deletedCount === 0) {
    const error = new Error("Favorite recipe not found");
    error.statusCode = 404;
    throw error;
  }

  return { userId, recipeId };
};

const getFavoriteRecipesByUserService = async (userId) => {
  return Favorite.findAll({
    where: { userId },
    include: [
      {
        model: Recipe,
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  addFavoriteRecipeService,
  deleteFavoriteRecipeService,
  getFavoriteRecipesByUserService,
};
