const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()

/** POST
 * Creating a new account for the user
 */
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)

/** GET
 * Getting all accounts of the user
 */
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController)

/** GET
 * Getting the balance of a specific account
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)

module.exports = router