// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;


import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}

contract HEGIC is ERC20("HEGIC", "HEGIC") {
  constructor(uint supply) {
    _mint(msg.sender, supply);
  }
}

contract rHEGIC is ERC20("rHEGIC", "rHEGIC") {
  constructor(uint supply) {
    _mint(msg.sender, supply);
  }
}
