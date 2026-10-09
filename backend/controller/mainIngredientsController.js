const {
  addMainIngrdients,
  getMainIngredients,
  updateMainIngredient,
  deleteMainIngredient,
} = require("../service/mainIngredientSerive");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const addIngredientsController = async (req, res) => {
  try {
    const response = await addMainIngrdients(req.body);
    return successResponse(res, 201, "added Main Ingredients", response);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const getIngredientController = async (req, res) => {
  try {
    const response = await getMainIngredients();
    return successResponse(res, 200, "get Main Ingredients", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateIngredientController = async (req, res) => {
  try {
    const response = await updateMainIngredient(req.params.id, req.body.name);
    return successResponse(res, 200, "Main ingredient updated", response);
  } catch (error) {
    const statusCode =
      error.statusCode ||
      (error.name === "SequelizeUniqueConstraintError" ? 409 : 500);
    return errorResponse(res, statusCode, error.message);
  }
};

const deleteIngredientController = async (req, res) => {
  try {
    const response = await deleteMainIngredient(req.params.id);
    return successResponse(res, 200, "Main ingredient deleted", response);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  addIngredientsController,
  getIngredientController,
  updateIngredientController,
  deleteIngredientController,
};
