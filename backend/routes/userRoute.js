const express = require("express");
const {
  addUserController,
  loginController,
  updateUserController,
  getAllUsersController,
  updateUserForAdminController,
  deleteUserController,
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

router.post("/user/create", addUserController);
router.post("/user/login", loginController);
router.put("/user/update", authMiddleware, updateUserController);
router.get(
  "/user",
  authMiddleware,

  getAllUsersController,
);
router.put(
  "/user/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateUserForAdminController,
);
router.delete(
  "/user/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteUserController,
);

module.exports = router;
