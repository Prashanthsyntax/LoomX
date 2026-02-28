const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    amount: {
      type: Number,
      required: true,
    },

    tenureMonths: {
      type: Number,
      required: true,
    },

    purpose: String,

    // 🔥 AI Required Fields
    person_age: Number,
    person_income: Number,
    person_home_ownership: String,
    person_emp_length: Number,
    loan_intent: String,
    loan_grade: String,
    loan_int_rate: Number,
    loan_percent_income: Number,
    cb_person_default_on_file: String,
    cb_person_cred_hist_length: Number,

    status: {
      type: String,
      enum: [
        "pending",
        "ai_review",
        "approved",
        "rejected",
        "funded",
        "completed",
        "defaulted",
      ],
      default: "pending",
    },

    aiDecision: String,
    aiRiskScore: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);