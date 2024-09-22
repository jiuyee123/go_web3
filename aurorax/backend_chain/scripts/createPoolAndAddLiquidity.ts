import hre from "hardhat";
import { Pool, Position } from "@uniswap/v3-sdk";
import { Token, Percent, CurrencyAmount } from "@uniswap/sdk-core";
import { abi as INonfungiblePositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';

const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // Uniswap V3 的 Position Manager 合约地址

const MY_TOKEN_ADDRESS = "0xD37bBDb027798F3465865cF18446d8A0cd2c0BB7"; // 您自己的代币地址
const USDC_ADDRESS = "0x2C032Aa43D119D7bf4Adc42583F1f94f3bf3023a"; // USDC 地址
const FEE_TIER = 3000; // 手续费等级，0.3%

async function main() {
    const [deployer] = await hre.ethers.getSigners(); // 使用 hre.ethers 获取 signers

    // Uniswap Token 设置
    const myToken = new Token(1, MY_TOKEN_ADDRESS, 18, "ARX", "Aurorax");
    const usdc = new Token(1, USDC_ADDRESS, 6, "USDC", "USD Coin");

    // 获取 NonfungiblePositionManager 合约实例
    const positionManager = new hre.ethers.Contract(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        INonfungiblePositionManagerABI,
        deployer
    );

    // 设置初始价格和流动性
    const amountMyToken = CurrencyAmount.fromRawAmount(myToken, hre.ethers.parseUnits("10", 18).toString());
    const amountUsdc = CurrencyAmount.fromRawAmount(usdc, hre.ethers.parseUnits("5000", 6).toString());

    // 设置价格区间
    const tickLower = -887220; // 最小 tick（价格区间下界）
    const tickUpper = 887220;  // 最大 tick（价格区间上界）

    // 添加流动性
    console.log("Adding liquidity...");
    const mintTx = await positionManager.mint({
        token0: MY_TOKEN_ADDRESS,
        token1: USDC_ADDRESS,
        fee: FEE_TIER,
        tickLower: tickLower,
        tickUpper: tickUpper,
        amount0Desired: amountMyToken.quotient.toString(),
        amount1Desired: amountUsdc.quotient.toString(),
        amount0Min: 0,
        amount1Min: 0,
        recipient: deployer.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10, // 10 分钟
    });

    await mintTx.wait();
    console.log("Liquidity added successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
