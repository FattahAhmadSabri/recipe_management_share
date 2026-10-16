const {
  deleteFavoriteRecipeService,
  getFavoriteRecipesByUserService,
} = require("../service/favoritesCollectionsService");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const deleteFavoriteRecipeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId || req.body.recipeId;

    const response = await deleteFavoriteRecipeService(userId, recipeId);
    return successResponse(res, 200, "Recipe removed from favorites", response);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const getFavoriteRecipesController = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return errorResponse(res, 400, "User id is required");
    }

    const response = await getFavoriteRecipesByUserService(userId);
    return successResponse(
      res,
      200,
      "Favorite recipes fetched successfully",
      response,
    );
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  deleteFavoriteRecipeController,
  getFavoriteRecipesController,
};
