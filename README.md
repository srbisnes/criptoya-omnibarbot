# OmniArb — CriptoYa Arbitrage Engine

**AI-ready omnichaín arbitrage scanner** that feeds live from [CriptoYa](https://criptoya.com/api). Detects CEX-to-CEX spreads across LatAm and global exchanges, calculates estimated net profit after fees, and is architected for Layer 0-3 settlement (LayerZero / CCTP / Hyperlane).

## Problem
Traders lose edge because spreads between exchanges (Ripio, Lemon, Belo, Binance P2P, Bybit, etc.) are short-lived and hard to scan manually. Fees, transfer costs and timing kill most “arb” opportunities.

## Solution
- Real-time aggregation from CriptoYa’s public API (no key required, 120 req/min).
- Automatic opportunity ranking by profit % after fee buffer.
- Clean dark dashboard ready for institutional or retail use.
- Settlement vault contract prepared for on-chain profit recording and future omnichaín messaging.

## Architecture
```
CriptoYa API  →  Next.js API Route (/api/scan)
                     ↓
              Opportunity Engine (lib/criptoya.ts)
                     ↓
         Live Dashboard (app/page.tsx)
                     ↓
   (Future) Wallet + Bridge + ArbSettlementVault.sol
```

## Tech Stack
- Frontend: Next.js 15 App Router, React 19, Tailwind, TypeScript
- Data: CriptoYa aggregated + per-exchange endpoints
- Contracts: Solidity 0.8.24 + Foundry (demo vault)
- Deployment: Vercel-ready

## Local Setup
```bash
cd criptoya-omnibarbot
cp .env.example .env.local
npm install
npm run dev
```
Open http://localhost:3000

## Contracts
```bash
cd contracts
forge build
forge test   # add tests as needed
```

## Environment
See `.env.example`. No secrets required for basic scanning.

## Security Notes
- Public API only — no private keys in this version.
- Always simulate transfers and verify liquidity before real execution.
- Fee buffer is conservative estimate; real costs vary by network and exchange.
- Contract is a demo; add access control, pausability and oracle verification before mainnet.

## Roadmap
- [ ] Wallet connect + one-click “simulate execution”
- [ ] Real-time WebSocket where available
- [ ] AI ranking (probability, latency risk, historical success)
- [ ] Bridge cost integration (LayerZero, CCTP, Axelar)
- [ ] Funding-rate / basis overlay
- [ ] Alert webhooks / Telegram

---
Built by Elcryptoboy · Omnichaín Architect  
Powered by CriptoYa public data.
