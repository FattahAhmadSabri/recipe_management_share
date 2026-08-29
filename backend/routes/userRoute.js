const express = require("express");
const {
  addUserController,
  loginController,
  updateUserController,
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/user/create", addUserController);
router.post("/user/login", loginController);
router.put("/user/update", authMiddleware, updateUserController);

module.exports = router;
