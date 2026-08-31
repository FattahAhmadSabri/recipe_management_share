const addMainIngrdients = require("../service/mainIngredientSerive")
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const addIngredientsController =async (req , res) =>{
    try {
        
        const response = await addMainIngrdients(req.body)
          return successResponse(res, 200, "User updated successfully", response);
    } catch (error) {
         return errorResponse(res, 500, error.message);
    }
}

module.exports = {addIngredientsController}