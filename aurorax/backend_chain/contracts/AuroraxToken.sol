// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuroraxToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(msg.sender) {
        // 铸造初始供应量给合约部署者
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // 允许合约所有者铸造新代币
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // 允许代币持有者销毁自己的代币
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
