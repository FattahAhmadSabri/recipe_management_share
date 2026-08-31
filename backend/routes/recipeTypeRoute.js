const { addRecipeTypeController } =require("../controller/recipeTypeController")
const express = require("express")
const router = express.Router()

router.post("/recipe-type", addRecipeTypeController)

module.exports = router

