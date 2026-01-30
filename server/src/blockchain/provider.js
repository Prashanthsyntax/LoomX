const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const signer = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY,
  provider
);

module.exports = { provider, signer };
