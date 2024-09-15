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
        expect(await myToken.totalSupply()).to.equal(ownerBalance);
      });
});