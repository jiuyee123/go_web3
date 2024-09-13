// components/ContractReader.tsx
"use client";

import { useReadContract } from "wagmi";

const CONTRACT_ADDRESS = "0x98Aa3176AD568019e76a9dB5471b95fC677e1E75";
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "unlockTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export default function ContractReader() {
  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "unlockTime",
  });

  if (isLoading) return <div>Fetching unlock time...</div>;
  if (isError) return <div>Error fetching unlock time</div>;

  return <div>Unlock Time: {data?.toString()}</div>;
}
