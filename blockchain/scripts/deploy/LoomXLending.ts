import { ethers } from "hardhat";

async function main() {
  console.log("Deploying LoomXLending...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Get contract factory
  const LoomXLending = await ethers.getContractFactory("LoomXLending");

  // Deploy contract with gas limit
  const lending = await LoomXLending.deploy({
    gasLimit: 3_000_000, // optimized
  });

  await lending.waitForDeployment();

  console.log("✅ LoomXLending deployed at:", await lending.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
