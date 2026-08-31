const { addRecipeTypeService } = require("../service/recipeTypeService");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");
const addRecipeTypeController = async (req, res) => {
  try {
    
    const response = await addRecipeTypeService(req.body);
    return successResponse(res, 200, "User updated successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { addRecipeTypeController };
