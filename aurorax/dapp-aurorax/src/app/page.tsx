"use client";

import { useState } from "react";
import {
  useContractWrite,
  useContractRead,
  usePrepareContractWrite,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseAbi } from "viem";

const rockContractAddress = "0xEe3b70D05e922f859BE2bE5216d763878055f497"; // Replace with your contract address
const rocketContractABI = parseAbi([
  "function name() view returns (string)",
  "function status() view returns (string)",
  "function launch()",
]);

const lockContractAddress = "0x98Aa3176AD568019e76a9dB5471b95fC677e1E75";
const lockContractABI = parseAbi([
  "function unlockTime() view returns (uint256)",
  "function withdraw()",
]);

export default function Home() {
  const [rocketName, setRocketName] = useState("");
  const [rocketStatus, setRocketStatus] = useState("");
  const [lockName, setLockName] = useState("");

  const { data: rocketNameData } = useContractRead({
    address: rockContractAddress,
    abi: rocketContractABI,
    functionName: "name",
    watch: true,
  });

  const { data: rocketStatusData } = useContractRead({
    address: rockContractAddress,
    abi: rocketContractABI,
    functionName: "status",
    watch: true,
  });

  const { write: launchRocket } = useContractWrite({
    address: rockContractAddress,
    abi: rocketContractABI,
    functionName: "launch",
  });

  const handleLaunch = () => {
    launchRocket();
  };

  const {
    data: unlockTimeData,
    isError,
    error,
    isLoading,
  } = useContractRead({
    address: lockContractAddress,
    abi: lockContractABI,
    functionName: "unlockTime", // 调用合约中的 unlockTime 函数
    watch: true, // 可选，是否自动监听变化
  });

  // 解析 unlockTime 的返回值
  const unlockTime = unlockTimeData;
  // ? new Date(unlockTimeData * 1000).toLocaleString()
  // : null;

  const { config, error: estimateError } = usePrepareContractWrite({
    address: lockContractAddress,
    abi: lockContractABI,
    functionName: "withdraw",
  });

  // 配置合约写操作
  const {
    write: doWithDraw,
    data: withdrawData,
    // isError,
    // error,
  } = useContractWrite(config);

  const handleWithDraw = async () => {
    // 检查是否有估算错误
    if (estimateError) {
      console.log("Gas estimation error: ", estimateError.message);
      return;
    }

    // 检查 `doWithDraw` 是否定义
    if (doWithDraw) {
      console.log("Executing withdraw...");
      doWithDraw(); // 继续执行合约调用
    } else {
      console.log("Withdraw function is not available.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rocket Launch App</h1>
      <ConnectButton />
      <div className="mt-4">
        <h2>Information for Rocket</h2>
        <p>Rocket Name: {rocketNameData as string}</p>
        <p>Rocket Status: {rocketStatusData as string}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleLaunch}
        >
          Launch Rocket
        </button>

        <h2>Information for Locks</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleWithDraw}
        >
          Withdraw
        </button>
        {/* <h2>Unlock Time</h2>
        {unlockTimeData ? (
          <p>Unlock Time: {unlockTimeData.toString()}</p>
        ) : (
          <p>Loading unlock time...</p>
        )}
        {isError && <p>Error: {error?.message}</p>} */}

        <div className="mt-4">
          <h2>Unlock Time</h2>
          {isLoading && <p>Loading unlock time...</p>}
          {isError && <p>Error: {error?.message}</p>}
          {unlockTime ? (
            <p>Unlock Time: {unlockTime}</p>
          ) : (
            <p>No unlock time available</p>
          )}
        </div>
      </div>
    </div>
  );
}
