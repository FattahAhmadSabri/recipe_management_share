const express = require("express");
const {
  addRecipeController,
  getRecipeController,
  updateRecipeController,
  getRecipeByIdController,
  deleteRecipeController,
} = require("../controller/recipeController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadsMiddleware");
const router = express.Router();

router.post(
  "/recipe",
  upload.single("file"),
  authMiddleware,
  authorizeRoles("user"),
  addRecipeController,
);

router.get("/recipe/:id", getRecipeByIdController);

router.get("/recipe", getRecipeController);

router.put(
  "/recipe/:id",
  authMiddleware,
  authorizeRoles("user"),
  upload.single("image"),
  updateRecipeController,
);

router.delete("/recipe/:id", authMiddleware, deleteRecipeController);

module.exports = router;
