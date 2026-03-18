const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan.model");
const axios = require("axios");
const ethers = require("ethers"); // v6 import
require("dotenv").config();

// ✅ Load ABI correctly (destructure if JSON wraps it)
const { abi: contractABI } = require("../blockchain/LoomXLending.json");

// Contract and Provider
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Admin wallet connected to provider
const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);

// Contract instance
const contract = new ethers.Contract(contractAddress, contractABI, adminWallet);

// POST /approve-loan
router.post("/approve-loan", async (req, res) => {
  const { borrower, interest, aiScore } = req.body;

  try {
    // ✅ Check AI score threshold
    if (aiScore < 700) {
      return res.status(400).json({ error: "AI score too low for approval" });
    }

    // Call smart contract approveLoan
    const tx = await contract.approveLoan(borrower, interest);
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error("Approve loan error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Apply Loan
router.post("/apply", async (req, res) => {
  try {
    const { toUserEmail, customerData } = req.body;

    const loan = await Loan.create({
      borrowerEmail: "borrower@test.com", // ✅ temporary fix
      lenderEmail: toUserEmail,
      ...customerData,
      status: "pending",
    });

    res.status(201).json({
      message: "Loan application submitted successfully",
      loan,
    });
  } catch (error) {
    console.error("Apply Loan Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/requests", async (req, res) => {
  try {
    const loans = await Loan.find({
      lenderEmail: "greedygeeks@gmail.com",
    }).sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    res.status(500).json({ message: "Error fetching requests" });
  }
});

// 🧠 Check AI Eligibility
// POST /api/loan/:id/check-ai
// POST /api/loan/:id/check-ai
router.post("/:id/check-ai", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.status = "ai_review";
    await loan.save();

    const AI_API_URL = process.env.AI_API_URL;

    // 🔥 Call Flask AI model
    const aiResponse = await axios.post(
      `${AI_API_URL}/api/ai/predict`,
      {
        person_age: loan.person_age,
        person_income: loan.person_income,
        person_home_ownership: loan.person_home_ownership,
        person_emp_length: loan.person_emp_length,
        loan_intent: loan.loan_intent,
        loan_grade: loan.loan_grade,
        loan_amnt: loan.loan_amnt,
        loan_int_rate: loan.loan_int_rate,
        loan_percent_income: loan.loan_percent_income,
        cb_person_default_on_file: loan.cb_person_default_on_file,
        cb_person_cred_hist_length: loan.cb_person_cred_hist_length,
      },
    );

    const { eligible, score, risk } = aiResponse.data;

    // ✅ correct mapping
    loan.aiScore = score;
    loan.aiRiskLevel = risk;
    loan.status = eligible ? "approved" : "rejected";

    await loan.save();

    res.json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
