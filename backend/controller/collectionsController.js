const {
  getCollectionsByUserService,
  createCollectionService,
  addRecipeToCollectionService,
  removeRecipeFromCollectionService,
} = require("../service/collectionsService");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const getCollectionsController = async (req, res) => {
  try {
    const collections = await getCollectionsByUserService(req.user.id);
    return successResponse(
      res,
      200,
      "Collections fetched successfully",
      collections,
    );
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const createCollectionController = async (req, res) => {
  try {
    const collection = await createCollectionService(
      req.user.id,
      req.body.name,
    );
    return successResponse(
      res,
      201,
      "Collection created successfully",
      collection,
    );
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const addRecipeToCollectionController = async (req, res) => {
  try {
    const favorite = await addRecipeToCollectionService(
      req.user.id,
      req.params.collectionId,
      req.params.recipeId,
    );
    return successResponse(res, 201, "Recipe added to collection", favorite);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const removeRecipeFromCollectionController = async (req, res) => {
  try {
    const result = await removeRecipeFromCollectionService(
      req.user.id,
      req.params.collectionId,
      req.params.recipeId,
    );
    return successResponse(res, 200, "Recipe removed from collection", result);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  getCollectionsController,
  createCollectionController,
  addRecipeToCollectionController,
  removeRecipeFromCollectionController,
};
