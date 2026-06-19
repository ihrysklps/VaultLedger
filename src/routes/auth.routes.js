const express = require("express")
const authController = require("../controllers/auth.controller")
const router = express.Router()

router.post("/register",authController.userRegisteredController)
router.post("/login",authController.userLoginController)

module.exports = router