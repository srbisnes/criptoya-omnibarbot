# Omnichaín Settlement Notes

## Current State
`ArbSettlementVault` is a minimal deposit/withdraw + profit recording contract. It demonstrates how realized arb profit can be tracked on-chain.

## Production Path
1. User buys USDT on cheapest CEX (detected by OmniArb).
2. Withdraw to a controlled wallet or directly to a bridge.
3. Bridge via CCTP (USDC) or LayerZero OFT / Stargate for USDT.
4. Sell on destination exchange at higher bid.
5. Optionally call `recordProfit` via a relayer or owner after verification.

## Recommended Protocols
- **LayerZero**: for general message + OFT
- **CCTP (Circle)**: native USDC burn/mint
- **Hyperlane / Axelar**: alternatives
- **Chainlink CCIP**: enterprise-grade

Integrate price oracles (Chainlink, Pyth) for on-chain validation of the spread before settlement.
