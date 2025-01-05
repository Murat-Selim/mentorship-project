require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    opencampus: {
      url: "https://rpc.open-campus-codex.gelato.digital/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 656476
    }
  },
  paths: {
    sources: "./src/contracts",
    tests: "./src/contracts",
    cache: "./cache",
    artifacts: "./src/artifacts"
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || ""

    }
  },
  sourcify: {
    enabled: true
  },
    customChains: [
      {
        network: "opencampus",
        chainId: 656476,
        urls: {
          apiURL: "https://opencampus-codex.blockscout.com/api",
          browserURL: "https://opencampus-codex.blockscout.com"
        }
      }
    ]
};