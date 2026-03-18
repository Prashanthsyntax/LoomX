const axios = require("axios");
const Loan = require("../models/Loan.model");
const AIEvaluation = require("../models/AIEvaluation.model");

exports.checkAI = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);

    const AI_API_URL = process.env.AI_API_URL;

    if (!loan)
      return res.status(404).json({ message: "Loan not found" });

    // 🔥 Call Flask AI Server
    const response = await axios.post(
      `${AI_API_URL}/api/ai/predict`,
      loan.customerData
    );

    const { eligible, score, risk, reason } = response.data;

    // Update Loan
    loan.aiScore = score;
    loan.aiRiskLevel = risk;
    loan.status = eligible ? "SAFE" : "REJECTED";
    await loan.save();

    // Save AI Evaluation record
    await AIEvaluation.create({
      loan: loan._id,
      borrower: loan.borrower,
      creditScore: score,
      riskLevel: risk,
      decision: eligible ? "SAFE" : "REJECTED",
    });

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};