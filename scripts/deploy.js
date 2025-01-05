const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // EDU Token adresi - Open Campus Codex ağındaki EDU token adresi
  const eduTokenAddress = "0x104A0F99728D5a79dbEbB4a0a58eCcb456e82411";

  // Deploy NFT Contract
  console.log("Deploying MentorshipNFT...");
  const MentorshipNFT = await ethers.getContractFactory("MentorshipNFT");
  const mentorshipNFT = await MentorshipNFT.deploy();
  await mentorshipNFT.waitForDeployment();
  const nftAddress = await mentorshipNFT.getAddress();
  console.log("MentorshipNFT deployed to:", nftAddress);

  // Deploy MentorshipSystem
  console.log("Deploying MentorshipSystem...");
  const MentorshipSystem = await ethers.getContractFactory("MentorshipSystem");
  const mentorshipSystem = await MentorshipSystem.deploy(eduTokenAddress);
  await mentorshipSystem.waitForDeployment();
  const systemAddress = await mentorshipSystem.getAddress();
  console.log("MentorshipSystem deployed to:", systemAddress);

  // Set up NFT minter role
  console.log("Setting up NFT minter role...");
  await mentorshipNFT.setMinterRole(systemAddress, true);
  console.log("Minter role granted to MentorshipSystem");

  // Set NFT contract in MentorshipSystem
  console.log("Setting NFT contract in MentorshipSystem...");
  await mentorshipSystem.setNFTContract(nftAddress);
  console.log("NFT contract set in MentorshipSystem");

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("EDU Token:", eduTokenAddress);
  console.log("MentorshipNFT:", nftAddress);
  console.log("MentorshipSystem:", systemAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 