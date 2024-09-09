import { ethers } from "ethers";

const rocketAbi = [
  "function name() view returns (string)",
  "function status() view returns (string)",
  "function launch() public"
];

// Get the Rocket contract instance
export const getRocketContract = async (provider: ethers.BrowserProvider, contractAddress: string) => {
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, rocketAbi, signer);
};
