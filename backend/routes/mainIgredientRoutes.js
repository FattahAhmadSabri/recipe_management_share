const express = require("express")
const { addIngredientsController } = require("../controller/mainIngredientsController")
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router()

router.post("/main", addIngredientsController)

module.exports=router