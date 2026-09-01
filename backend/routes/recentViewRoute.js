const express = require("express")
const {getRecentviewByIPController} = require("../controller/recentViewController")
const router = express.Router()
router.get(
  "/recent-view",
  getRecentviewByIPController
);

module.exports =router