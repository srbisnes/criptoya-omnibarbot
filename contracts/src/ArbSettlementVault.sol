// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ArbSettlementVault
 * @notice Demo omnichaín settlement vault for arbitrage profits.
 *         In production: integrate LayerZero OApp or CCTP for cross-chain USDT settlement.
 *         Current version: simple deposit/withdraw + profit recording for simulation.
 */
contract ArbSettlementVault {
    address public owner;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public realizedProfit;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event ProfitRecorded(address indexed user, uint256 profit, string buyExchange, string sellExchange);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "insufficient");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Called after successful arb execution (off-chain verified or via oracle)
    function recordProfit(address user, uint256 profit, string calldata buyEx, string calldata sellEx) external onlyOwner {
        realizedProfit[user] += profit;
        emit ProfitRecorded(user, profit, buyEx, sellEx);
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
