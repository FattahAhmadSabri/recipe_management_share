const express = require("express");
const {
  addReplyController,
  getReplyController,
  getAllReplyByrecipeIdController,
  updateReplyByIdController,
  deleteReplyByRecipeId,
} = require("../controller/replyController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

router.post(
  "/reply/:recipeId",
  authMiddleware,
  authorizeRoles("user"),
  addReplyController,
);
router.get("/reply/", getReplyController);
router.get("/reply/:recipeId", getAllReplyByrecipeIdController);
router.patch(
  "/reply/:id",
  authMiddleware,
  authorizeRoles("user", "admin"),
  updateReplyByIdController,
);
router.delete(
  "/reply/:id",
  authMiddleware,
  authorizeRoles("user", "admin"),
  deleteReplyByRecipeId,
);

module.exports = router;
