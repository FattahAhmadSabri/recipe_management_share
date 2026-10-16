const express = require("express");
const {
  deleteFavoriteRecipeController,
  getFavoriteRecipesController,
} = require("../controller/favoritesCollectionsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.delete(
  "/favorite/:recipeId",
  authMiddleware,
  deleteFavoriteRecipeController,
);
router.get("/favorites/me", authMiddleware, getFavoriteRecipesController);
router.get("/favorites/:userId", getFavoriteRecipesController);

module.exports = router;
