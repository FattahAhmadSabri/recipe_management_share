const express = require("express");
const {
  addIngredientsController,
  getIngredientController,
  updateIngredientController,
  deleteIngredientController,
} = require("../controller/mainIngredientsController");
const authorizeRoles = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/main",
  authMiddleware,
  authorizeRoles("admin"),
  addIngredientsController,
);
router.put(
  "/main/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateIngredientController,
);
router.delete(
  "/main/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteIngredientController,
);
router.get("/main", getIngredientController);

module.exports = router;
