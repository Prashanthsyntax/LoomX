import { ethers } from "hardhat";

async function main() {
  const LoomXLending = await ethers.getContractFactory("LoomXLending");

  const lending = await LoomXLending.deploy({
    gasLimit: 3_000_000, // explicit safe limit
  });

  await lending.waitForDeployment();

  console.log("LoomXLending deployed to:", await lending.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
