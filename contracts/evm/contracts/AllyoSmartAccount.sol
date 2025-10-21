// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AllyoSmartAccount is Ownable {
    struct Policy {
        uint256 dailyLimit;
        uint256 timelockSeconds;
        bool paused;
        bool coldMode;
    }

    Policy public policy;

    event QueuedTransfer(address indexed to, uint256 amount, bytes32 queueId);

    constructor(address owner_) Ownable(owner_) {}

    function setPolicy(Policy calldata next) external onlyOwner {
        policy = next;
    }

    function queueTransfer(address to, uint256 amount) external onlyOwner returns (bytes32 queueId) {
        require(!policy.paused, "PAUSED");
        queueId = keccak256(abi.encodePacked(to, amount, block.timestamp));
        emit QueuedTransfer(to, amount, queueId);
    }
}
