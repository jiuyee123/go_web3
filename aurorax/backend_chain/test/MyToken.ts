const { expect } = require("chai");
import hre from "hardhat";
import { MyToken } from "../typechain-types"; // 自动生成的类型
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";


describe("MyToken", function() {

    let myToken: MyToken;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;

    beforeEach(async function () {
        // 获取合约工厂
        const MyTokenFactory = await hre.ethers.getContractFactory("MyToken");

        // 获取 Signer
        [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();

        // 部署合约
        myToken = (await MyTokenFactory.deploy("Aurorax", "AUR")) as MyToken;
    });

    it("部署后，所有代币都分配给合约拥有者", async function () {
        const ownerBalance = await myToken.balanceOf(owner.address);
    
        // 使用 console.log 打印合约拥有者的代币余额
        console.log("Owner balance after deployment:", hre.ethers.formatUnits(ownerBalance, 18));
    
        expect(await myToken.totalSupply()).to.equal(ownerBalance);
      });
    
      it("转账代币应更新余额", async function () {
        await myToken.transfer(addr1.address, hre.ethers.parseUnits("100", 18));
        
        // 使用 console.log 打印 addr1 的余额
        const addr1Balance = await myToken.balanceOf(addr1.address);
        console.log("Address 1 balance after transfer:", hre.ethers.formatUnits(addr1Balance, 18));
    
        expect(addr1Balance).to.equal(hre.ethers.parseUnits("100", 18));
      });

      it("应正确处理授权和转账", async function () {
        // 拥有者授权 addr1 可以支出 200 代币
        await myToken.approve(addr1.address, 200);
        expect(await myToken.allowance(owner.address, addr1.address)).to.equal(200);
    
        // addr1 从拥有者账户转移 100 代币到 addr2
        await myToken.connect(addr1).transferFrom(owner.address, addr2.address, 100);
        expect(await myToken.balanceOf(addr2.address)).to.equal(100);
    
        // 授权余额应更新
        expect(await myToken.allowance(owner.address, addr1.address)).to.equal(100);
      });
      it("只有拥有者可以铸造代币", async function () {
        // 拥有者铸造 500 代币给 addr1
        await myToken.mint(addr1.address, 500);
        expect(await myToken.balanceOf(addr1.address)).to.equal(500);
        expect(await myToken.totalSupply()).to.equal(
          hre.ethers.parseUnits("1000000", 18) + BigInt(500)
        );
    
        // 非拥有者尝试铸造代币应被拒绝
        await expect(myToken.connect(addr1).mint(addr1.address, 500)).to.be.revertedWithCustomError(
            myToken, "OwnableUnauthorizedAccount"
        );
        // try {
        //     await myToken.connect(addr1).mint(addr1.address, 500);
        // } catch (error: any) {
        //     console.log("Caught error:", error.message);
        // }
      });
    
      it("代币持有者可以销毁自己的代币，totalSupply 应该减少", async function () {
        // 初始 totalSupply
        const initialTotalSupply = await myToken.totalSupply();
    
        // 拥有者销毁 1000 代币
        await myToken.burn(hre.ethers.parseUnits("1000", 18));
    
        // 检查 totalSupply 是否减少了 1000
        const currentTotalSupply = await myToken.totalSupply();
        expect(currentTotalSupply).to.equal(initialTotalSupply- (hre.ethers.parseUnits("1000", 18)));
        // 非持有者尝试销毁代币应被拒绝
        // try {
        //     await expect(
        //         myToken.connect(addr1).burn(1000)
        //     ).to.be.revertedWith("ERC20: burn amount exceeds balance");
        // } catch(error: any) {
        //     console.log("Caught error:", error.message);
        // }

        await expect(myToken.connect(addr1).burn(hre.ethers.parseUnits("1000", 18)))
        .to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance");
        
      });
});