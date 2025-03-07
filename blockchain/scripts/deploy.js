const hre = require("hardhat");

async function main() {
  console.log("Deploying FisherySupplyChain contract...");

  const FisherySupplyChain = await hre.ethers.getContractFactory("FisherySupplyChain");
  const fisherySupplyChain = await FisherySupplyChain.deploy();

  await fisherySupplyChain.waitForDeployment();

  console.log(
    `FisherySupplyChain deployed to ${await fisherySupplyChain.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});