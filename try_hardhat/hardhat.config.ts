import { HardhatUserConfig, vars } from "hardhat/config";

import "@nomicfoundation/hardhat-toolbox";

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and set the Hardhat configuration variable
// ALCHEMY_API_KEY to the key
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");

// Replace this private key with your Sepolia test account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  etherscan: {
    apiKey: "QMR87U5F9SJWF3YZ258ZI4W528BISA44AT",
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};

export default config;
