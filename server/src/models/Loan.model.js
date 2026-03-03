const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    // 👤 Borrower email
    borrowerEmail: {
      type: String,
      required: true,
    },

    // 👤 Lender email
    lenderEmail: {
      type: String,
      required: true,
    },

    // Loan data
    person_age: Number,
    person_income: Number,
    person_home_ownership: String,
    person_emp_length: Number,
    loan_intent: String,
    loan_grade: String,
    loan_amnt: Number,
    loan_int_rate: Number,
    loan_percent_income: Number,
    cb_person_default_on_file: String,
    cb_person_cred_hist_length: Number,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "ai_review"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);