# bridge-economics-dashboard

Public-facing dashboard showing BRIDGE platform economics — tokenomics, reserves, TVL, supply feeds across the DLT + Ethereum/L2s + Solana.

## What it shows

- **Total value locked (TVL)** per chain + per asset
- **Issued supply** per BRIDGE-issued token (BTT, bPKR, bUSD, bGOLD, bWHEAT, bRICE) per chain
- **Reserves backing ratio** per stablecoin/commodity — live attestation data from bridge-tokenization-register
- **24h volume + tx count** platform-wide
- **Active wallets + identities** (aggregate only — no PII)
- **Revenue run-rate** per revenue stream (TxFees / FXSpread / CustodyFees / Subscriptions / FloatInterest)
- **Treasury book allocation** (HOT / COLD / OPS / CUSTOMER / RESERVE)
- **Fee schedule + customer pricing**

## Data sources

All via the BRIDGE public API at `gateway.service.d.bridgeintelligence.ltd`:

- `/api/v1/assets` — tokenization-register asset catalog + live attestations
- `/api/v1/tokens/{symbol}/supply` — per-token supply across chains
- `/api/v1/market/*` — marketdata mark prices
- `/api/v1/rates/*` — oracle reference rates

Uses a **public read-only API key** (`bridge-public-read-2026`, scope: `economics:public:read`) built into the dashboard. Rate-limited to 100rpm per client IP.

## Tech stack

- Vite 6 + React 19 + TypeScript
- Tailwind + shadcn/ui (same theme tokens as bridge-wallet + bridge-hq)
- `@bridge-intelligence/sdk` for API calls
- Hosted at `economics.service.d.bridgeintelligence.ltd` (and eventually `binari.digital/economics` on public DNS)

## Dev

```bash
npm install
npm run dev                    # http://localhost:5173
npm run build                  # production bundle
```

## Deploy

Same pipeline as other frontends in the ecosystem: Docker → Harbor → kustomize → ArgoCD. See `k8s/` for manifests once they land.

## License
MIT
