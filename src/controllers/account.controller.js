const accountModel = require("../models/accountmodel")


//creating a user's account
async function createAccountController(req, res) {

    const user = req.user; //geting user details

    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })
}
async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}
async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;
    const account = await accountModel.findOne(
        { _id: accountId, //account exists?
         user: req.user._id //account belongs to the authenticated user?
        });
         /**
          * Check if the account exists and belongs to the authenticated user
          */
         if (!account) {
            return res.status(404).json({
                message: "Account not found"
            })
         }
        const balance = await account.getbalance(); //get the balance of the account
        res.status(200).json({
            balance
        });
}

module.exports={
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}