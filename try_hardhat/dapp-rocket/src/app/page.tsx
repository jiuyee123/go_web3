"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getRocketContract } from "./lib/RocketContract";

export default function Home() {
  const [rocketName, setRocketName] = useState("");
  const [rocketStatus, setRocketStatus] = useState("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const contractAddress = "0xEe3b70D05e922f859BE2bE5216d763878055f497"; // Replace with your actual deployed contract address

  useEffect(() => {
    if (window.ethereum) {
      // Initialize the provider with MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      getContractData(provider);
    } else {
      console.error("Please install MetaMask!");
    }
  }, []);

  const getContractData = async (provider: ethers.BrowserProvider) => {
    const rocketContract = await getRocketContract(provider, contractAddress);
    const name = await rocketContract.name();
    const status = await rocketContract.status();
    setRocketName(name);
    setRocketStatus(status);
  };

  const launchRocket = async () => {
    if (!provider) return;

    const rocketContract = await getRocketContract(provider, contractAddress);
    const tx = await rocketContract.launch();
    await tx.wait();
    getContractData(provider); // Refresh contract data after transaction
  };

  return (
    <div>
      <h1>Rocket DApp</h1>
      <p>Name: {rocketName}</p>
      <p>Status: {rocketStatus}</p>
      <button onClick={launchRocket}>Launch Rocket</button>
    </div>
  );
}
