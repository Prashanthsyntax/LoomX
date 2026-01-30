const { ethers } = require("ethers");
require("dotenv").config();

const artifact = require("../blockchain/LoomXLending.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY,
  provider
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  artifact.abi, // ✅ IMPORTANT
  wallet
);

module.exports = contract;
