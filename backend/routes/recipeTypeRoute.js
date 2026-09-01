const {
  addRecipeTypeController,
  getRecipeTypeController,
} = require("../controller/recipeTypeController");
const express = require("express");
const router = express.Router();

router.post("/recipe-type", addRecipeTypeController);

router.get("/recipe-type", getRecipeTypeController);
module.exports = router;
