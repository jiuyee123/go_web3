import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// 设置代币合约的初始名称和符号
const TOKEN_NAME = "USDC Coin";
const TOKEN_SYMBOL = "USDC";

const TokenModule = buildModule("CustomUSDCTokenModule", (m) => {
    // 获取代币名称和符号参数，如果没有指定，则使用默认值
  const tokenName = m.getParameter<string>("tokenName", TOKEN_NAME);
  const tokenSymbol = m.getParameter<string>("tokenSymbol", TOKEN_SYMBOL);

    const token = m.contract("CustomUSDCToken",  [tokenName, tokenSymbol])

    return {token}
});

export default TokenModule;