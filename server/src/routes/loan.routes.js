const express = require("express");
const router = express.Router();
const contract = require("../blockchain/contract");
const { ethers } = require("ethers");

// STEP 1: User requests loan (AI mock)
router.post("/approve-loan", async (req, res) => {
  try {
    const { borrower, interest } = req.body;

    // MOCK AI LOGIC (replace later)
    const creditScore = 1; // 1 = approved

    if (creditScore !== 1) {
      return res.status(403).json({ message: "Loan rejected by AI" });
    }

    const tx = await contract.approveLoan(
      borrower,
      ethers.parseEther(interest)
    );

    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
