pragma solidity 0.7.6;
// SPDX-License-Identifier: GPL-3.0-or-later
// Forked from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/drafts/rSwap.sol

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title rSwap
 * @dev A token swap contract that can release its token balance gradually
 */
contract rSwap is Ownable {
    // solhint-disable not-rely-on-time

    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event TokensSwapped(address account, uint256 amount);

    // Durations and timestamps are expressed in UNIX time, the same units as block.timestamp.
    uint256 public immutable start;
    uint256 public immutable duration;
    IERC20 public immutable rHEGIC;
    IERC20 public immutable HEGIC;

    uint public released;

    /**
     * @dev Creates a contract that swap its balance of HEGIC token to the rHEGIC
     * @param _start the time (as Unix time) at which point swap starts
     * @param _duration duration in seconds of the period in which the tokens will unlock
     */
    constructor (uint256 _start, uint256 _duration, IERC20 _rHEGIC, IERC20 _HEGIC) {
        // solhint-disable-next-line max-line-length
        require(_duration > 0, "TokenSwap: duration is 0");
        // solhint-disable-next-line max-line-length
        require(_start.add(_duration) > block.timestamp, "rSwap: final time is before current time");

        duration = _duration;
        start = _start;
        rHEGIC =_rHEGIC;
        HEGIC = _HEGIC;
    }

    function swap(uint amount) external {
        require(availableAmount() > amount, "rSwap: no tokens are due");

        rHEGIC.safeTransferFrom(msg.sender, address(this), amount);
        released = released.add(amount);
        HEGIC.safeTransfer(msg.sender, amount);

        emit TokensSwapped(msg.sender, amount);
    }

    function withdrawERC20(IERC20 token) external onlyOwner {
        token.safeTransfer(owner(), token.balanceOf(address(this)));
    }

    /**
     * @dev Calculates the amount that has already unlocked but hasn't been swapped yet.
     */
    function availableAmount() public view returns (uint256) {
        return totalUnlockedAmount().sub(released);
    }

    /**
     * @dev Calculates the amount that has already unlocked.
     */
    function totalUnlockedAmount() public view returns (uint256) {
        uint256 currentBalance = HEGIC.balanceOf(address(this));
        uint256 totalBalance = currentBalance.add(released);
        if(block.timestamp < start)
            return 0;
        if (block.timestamp >= start.add(duration)) {
            return totalBalance;
        } else {
            return totalBalance.mul(block.timestamp.sub(start)).div(duration);
        }
    }
}
