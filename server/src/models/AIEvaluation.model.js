const mongoose = require("mongoose");

const aiEvaluationSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },

    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    creditScore: Number,
    riskLevel: String,
    decision: String, // SAFE / REJECTED
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIEvaluation", aiEvaluationSchema);