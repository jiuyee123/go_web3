"use client";

import { useState } from "react";
import { useContractWrite, useContractRead } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseAbi } from "viem";

const contractAddress = "0xEe3b70D05e922f859BE2bE5216d763878055f497"; // Replace with your contract address
const contractABI = parseAbi([
  "function name() view returns (string)",
  "function status() view returns (string)",
  "function launch()",
]);

export default function Home() {
  const [rocketName, setRocketName] = useState("");
  const [rocketStatus, setRocketStatus] = useState("");

  const { data: nameData } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "name",
    watch: true,
  });

  const { data: statusData } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "status",
    watch: true,
  });

  const { write: launchRocket } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "launch",
  });

  const handleLaunch = () => {
    launchRocket();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rocket Launch App</h1>
      <ConnectButton />
      <div className="mt-4">
        <p>Rocket Name: {nameData as string}</p>
        <p>Rocket Status: {statusData as string}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleLaunch}
        >
          Launch Rocket
        </button>
      </div>
    </div>
  );
}
