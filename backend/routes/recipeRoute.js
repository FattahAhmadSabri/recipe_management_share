const express = require("express");
const {
  addRecipeController,
  getRecipeController,
  updateRecipeController,
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


router.get("/recipe", getRecipeController);


router.put(
  "/recipe/:id",
  authMiddleware,
  authorizeRoles("user"),
  upload.single("image"),
  updateRecipeController,
);

module.exports = router;
