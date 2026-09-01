const {addMainIngrdients, getMainIngredients} = require("../service/mainIngredientSerive")
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const addIngredientsController =async (req , res) =>{
    try {
        
        const response = await addMainIngrdients(req.body)
          return successResponse(res, 201, "added Main Ingredients", response);
    } catch (error) {
         return errorResponse(res, 500, error.message);
    }
}

const getIngredientController = async (req ,res)=>{
  try {
      const response = await getMainIngredients()
      return successResponse(res, 200, "get Main Ingredients", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}

module.exports = {addIngredientsController, getIngredientController}