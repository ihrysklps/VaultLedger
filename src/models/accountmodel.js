const mongoose = require("mongoose")
const ledgerModel = require("./ledgermodel")

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index: true /*if we later need to access a user's account then for fast retreival 
                    we use index. It used a data satructure B PLUS TREE*/
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be either ACTIVE, FROZEN or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 })

/**
 * ledger model aggregation pipeline to calculate the balance of the account by summing up the debit and credit transactions associated with the account. 
 * The balance is calculated as total credit minus total debit. 
 * If there are no transactions, the balance is returned as 0.
 */
accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] }
            }
        }
    ])
    if (balanceData.length === 0) {
        return 0
    }
    return balanceData[0].balance //balanceData is an array of objects, we need to access the first object and then access the balance property to get the actual balance value.

}
const accountModel = mongoose.model("account", accountSchema)



module.exports = accountModel