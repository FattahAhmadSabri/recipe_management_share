const express = require("express")
const { addIngredientsController, getIngredientController } = require("../controller/mainIngredientsController")
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router()

router.post("/main", addIngredientsController)
router.get("/main", getIngredientController)

module.exports=router