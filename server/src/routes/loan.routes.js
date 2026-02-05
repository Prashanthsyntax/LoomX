const express = require("express");
const router = express.Router();
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

module.exports = router;
