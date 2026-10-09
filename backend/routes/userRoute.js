const express = require("express");
const {
  addUserController,
  loginController,
  updateUserController, getAllUsersController
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/user/create", addUserController);
router.post("/user/login", loginController);
router.put("/user/update", authMiddleware, updateUserController);
router.get("/user", getAllUsersController);

module.exports = router;
