"use client";

import { useAccount } from "wagmi";
import ContractReader from "./LockContractReader";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ClientContent() {
  const { isConnected } = useAccount();

  return (
    <>
      <ConnectButton />
      {isConnected ? (
        <div className="mt-4">
          <ContractReader />
        </div>
      ) : (
        <div className="mt-4">
          Please connect your wallet to read contract data.
        </div>
      )}
    </>
  );
}
