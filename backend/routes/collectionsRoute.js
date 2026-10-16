const express = require("express");
const {
  getCollectionsController,
  createCollectionController,
  addRecipeToCollectionController,
  removeRecipeFromCollectionController,
} = require("../controller/collectionsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/collections/me", authMiddleware, getCollectionsController);
router.post("/collections", authMiddleware, createCollectionController);
router.post(
  "/collections/:collectionId/recipes/:recipeId",
  authMiddleware,
  addRecipeToCollectionController,
);
router.delete(
  "/collections/:collectionId/recipes/:recipeId",
  authMiddleware,
  removeRecipeFromCollectionController,
);

module.exports = router;
