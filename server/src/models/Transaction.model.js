const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },

    amount: Number,

    transactionType: {
      type: String,
      default: "LOAN_TRANSFER",
    },

    blockchainHash: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);