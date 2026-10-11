const { Favorite, Recipe, User } = require("../model");

const normalizeRecipeImage = (image) => {
  if (!image) {
    return "https://placehold.co/600x400/f5f5f5/8b0000?text=Recipe";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("recipes/")) {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${image}`;
  }

  return image;
};

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
  const favorites = await Favorite.findAll({
    where: { userId },
    include: [
      {
        model: Recipe,
        as: "recipe",
        include: [
          {
            model: User,
            as: "author",
            attributes: { exclude: ["password"] },
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return favorites.map((favorite) => {
    const favoriteJson = favorite.toJSON();

    if (favoriteJson.recipe) {
      favoriteJson.recipe = {
        ...favoriteJson.recipe,
        image: normalizeRecipeImage(favoriteJson.recipe.image),
      };
    }

    return favoriteJson;
  });
};

module.exports = {
  addFavoriteRecipeService,
  deleteFavoriteRecipeService,
  getFavoriteRecipesByUserService,
};
