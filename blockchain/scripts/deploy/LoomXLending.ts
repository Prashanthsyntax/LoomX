import { ethers } from "hardhat";

async function main() {
  console.log("Deploying LoomXLending...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const LoomXLending = await ethers.getContractFactory("LoomXLending");

  const lending = await LoomXLending.deploy({
    gasLimit: 3_000_000, // ✅ SAFE for this contract
  });

  await lending.waitForDeployment();

  console.log("✅ LoomXLending deployed to:", await lending.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
