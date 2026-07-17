const transactionModel = require("../models/transactionmodel")
const ledgerModel = require("../models/ledgermodel")
const accountModel = require("../models/accountmodel")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")
/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */
async function createTransactionController(req, res) {

    /**
     * Step 1: Validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })
    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })
    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
        })
    }
    /**
     * Step 2: Validate idempotency key
     */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })
    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already completed",
                transaction: isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still in progress"
            })
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction has failed. Please try again"
            })
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction wasreversed. Please try again"
            })
        }
    }
    /**
     * Step 3: Check account status
     */
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both accounts must be active to perform a transaction"
        })
    }
    /**
     * Step 4: Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance()
    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient funds. Current balance is ${balance} and cannot transfer ${amount} the requested amount`
        })
    }
    /**
     * Step 5: Create transaction (PENDING)
     */
    const session = await mongoose.startSession()
    session.startTransaction()
    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        idempotencyKey,
        status: "PENDING",
    }, { session })
    const debitledgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    }, { session })
    const creditledgerEntry = await ledgerModel.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
    }, { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession
    /**
     * Step 10: Send email notification
     */
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })
}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }

//Initiating a transaction session to ensure atomicity of the operations
    const session = await mongoose.startSession()
    session.startTransaction() // Start a new transaction session

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([ {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    } ], { session }) //{ session } ensures that the ledger entry is created within the same transaction session

    const creditLedgerEntry = await ledgerModel.create([ {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    } ], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session }) // Save the transaction with the session (entries still waiting to be permannently saved to the database)

    await session.commitTransaction() // Commit the transaction to the database
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })


}
module.exports = {
    createTransactionController,
    createInitialFundsTransaction
}