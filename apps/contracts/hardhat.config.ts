import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();
const config: HardhatUserConfig = {
  solidity: "0.8.24",networks: {
    viction: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
    zksync: {
      url: process.env.RPC_URL2,
      accounts: [process.env.PRIVATE_KEY!],
    }
  }
};

export default config;
