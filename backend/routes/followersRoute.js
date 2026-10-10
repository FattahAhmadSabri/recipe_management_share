const express = require("express");
const {
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
} = require("../controller/followersController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/follow/:followingId", authMiddleware, followUserController);
router.delete("/follow/:followingId", authMiddleware, unfollowUserController);
router.get("/followers/me", authMiddleware, getFollowersController);
router.get("/following/me", authMiddleware, getFollowingController);
router.get("/followers/:userId", getFollowersController);
router.get("/following/:userId", getFollowingController);

module.exports = router;
