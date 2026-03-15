# Yield Terminal Documentation

## Overview

Yield Terminal is a DeFi yield intelligence platform that provides institutional-grade analytics, financial reporting, and risk analysis for yield strategies, vaults, and on-chain portfolios.

The platform bridges traditional financial reporting with crypto-native strategy analytics, enabling allocators, DAOs, and researchers to evaluate yield strategies with greater transparency.

Yield Terminal provides:

- Vault discovery and analytics
- Strategy classification
- Risk scoring
- GAAP-style financial reporting
- Portfolio intelligence
- Yield rankings
- Research and documentation
- Capital allocation engine
- Developer APIs

The platform aims to become a Bloomberg-style terminal for DeFi yield strategies.

---

## Platform Architecture

Yield Terminal consists of several core subsystems.

```
Data Indexers
    ↓
Normalization Layer
    ↓
Vault Database
    ↓
Risk Engine
    ↓
Financial Reporting Engine
    ↓
API Layer
    ↓
Dashboard / Developer API
```

### Core Components

| Component | Description |
|-----------|-------------|
| Indexer | Collects vault and yield data from on-chain sources |
| Database | Stores normalized vault, portfolio, and historical data |
| Risk Engine | Calculates risk scores for strategies |
| Financial Engine | Generates financial statements and NAV |
| Allocation Engine | Recommends vault allocations based on user constraints |
| Research Library | Aggregates whitepapers, audits, and governance proposals |
| API | Provides structured access to all platform data |
| Frontend | Dashboard and reporting interface |

---

## Vault Intelligence

The Vault Intelligence module indexes yield strategies across DeFi protocols.

Each vault entry contains:

- Protocol
- Chain
- Asset
- Strategy type
- TVL
- APY
- Risk score
- Allocation score
- Dependencies
- Yield sources

Example vault object:

```json
{
  "name": "Morpho USDC Optimizer",
  "protocol": "Morpho",
  "chain": "Ethereum",
  "asset": "USDC",
  "strategy_type": "leveraged_lending",
  "apy": 8.4,
  "tvl": 21000000,
  "risk_score": 3.1
}
```

---

## Strategy Classification

Vaults are automatically categorized into strategy types.

| Strategy | Description |
|----------|-------------|
| Lending | Depositing assets into lending markets |
| LP | Liquidity provision in AMMs |
| Leveraged Lending | Recursive borrowing strategies |
| Delta Neutral | Market neutral funding strategies |
| Yield Tokenization | PT/YT yield splitting |
| Options | Options selling strategies |
| Staking | Validator or restaking rewards |

---

## Risk Engine

The platform calculates a risk score between 0 and 10 for every vault.

### Risk Factors

| Risk Factor | Description |
|-------------|-------------|
| Contract Risk | Upgradeability and admin privileges |
| Dependency Risk | External protocol dependencies |
| Oracle Risk | Dependence on price feeds |
| Liquidity Risk | Exit liquidity depth |
| Strategy Complexity | Operational complexity |
| TVL Volatility | Stability of capital in the vault |

### Risk Score Formula

```
RiskScore =
  0.25 × ContractRisk
+ 0.20 × DependencyRisk
+ 0.10 × OracleRisk
+ 0.20 × LiquidityRisk
+ 0.15 × StrategyComplexity
+ 0.10 × TVLVolatility
```

### Risk Bands

| Score | Category |
|-------|----------|
| 0–2 | Very Low Risk |
| 2–4 | Low Risk |
| 4–6 | Medium Risk |
| 6–8 | High Risk |
| 8–10 | Extreme Risk |

---

## Vault Rankings

Vaults are ranked based on a composite allocation score.

### Factors Used

- Yield
- Risk score
- Liquidity
- TVL growth
- Audit coverage

### Ranking Formula

```
AllocationScore =
  0.35 × YieldScore
+ 0.25 × (10 - RiskScore)
+ 0.20 × LiquidityScore
+ 0.10 × TVLGrowth
+ 0.10 × AuditScore
```

### Ranking Modes

- **Risk Adjusted** — Balanced weighting for conservative allocations
- **Highest Yield** — APY-optimized for yield-seeking strategies
- **Institutional** — Liquidity and audit-weighted for large allocations
- **Liquidity Optimized** — Exit capacity prioritized

---

## Financial Reporting

Yield Terminal provides institution-style financial statements for vaults.

### Balance Sheet

```
Assets
  Supplied assets
  Idle balances
  Accrued rewards

Liabilities
  Borrow positions
  Fees payable

Net Assets
  Vault NAV
```

### Income Statement

```
Revenue
  Lending income
  Incentives
  Trading fees

Expenses
  Borrow cost
  Management fees
  Execution cost

Net Income
```

### Flow of Funds

```
Deposits
Withdrawals
Rewards claimed
Rebalances
Net capital flows
```

---

## Portfolio Intelligence

Yield Terminal can analyze any wallet or treasury.

### Portfolio Reports Include

**Asset Allocation**
```
USDC  59%
ETH   25%
WBTC  16%
```

**Strategy Allocation**
```
Lending        40%
LP             30%
Delta Neutral  20%
Options        10%
```

**Protocol Exposure**
- Morpho
- Yearn
- Aave
- Pendle

**Chain Exposure**
- Ethereum
- Arbitrum
- Base

---

## Research Library

The research module aggregates documentation and strategy analysis.

### Supported Research Types

- Protocol whitepapers
- Audit reports
- Strategy documentation
- Governance proposals
- Research notes

Each vault links to relevant documentation.

---

## Allocation Engine

The allocation engine recommends vault allocations based on user constraints.

### Example Input

```
Asset:     USDC
Capital:   $10M
Max Risk:  4
Liquidity: High
```

### Example Output

```
Allocation Plan

Yearn USDC     → $4M   (40%)
Morpho USDC    → $3M   (30%)
Aave Lending   → $2M   (20%)
Pendle PT      → $1M   (10%)
```

### Allocation Algorithm

Vaults are scored by risk-adjusted yield weighted by liquidity score. Allocations are capped at 40% per vault to enforce diversification. Only active vaults matching the asset, risk, and liquidity constraints are eligible.

---

## API

### Base Path

```
/api/v1
```

### Vaults

```
GET /vaults
GET /vaults/:address
GET /vaults/:address/risk
GET /vaults/:address/financials
```

### Rankings

```
GET /rankings
GET /rankings?mode=risk_adjusted
GET /rankings?mode=highest_yield
GET /rankings?mode=institutional
GET /rankings?mode=best_liquidity
```

### Portfolio

```
GET /portfolio/:wallet
GET /portfolio/:wallet/exposure
GET /portfolio/:wallet/positions
GET /portfolio/:wallet/financials
```

### Reports

```
GET /reports/vault/:address
GET /reports/portfolio/:wallet
```

### Research

```
GET /research
GET /research/vault/:address
GET /research/protocol/:name
```

### Allocation

```
POST /allocation/simulate
POST /allocation/execute
```

---

## Data Sources

Yield Terminal aggregates data from multiple sources.

### Primary Sources

1. **On-Chain Data** — Smart contract state, vault balances, token transfers, lending positions, liquidity pools
2. **Protocol Registries** — Yearn, Beefy, Enzyme, Morpho, Pendle market registries
3. **Public Data Feeds** — DeFiLlama public datasets, protocol subgraphs, governance proposals

### Supported Chains

- Ethereum
- Arbitrum
- Base
- Optimism
- Polygon

---

## Data and API Philosophy

Yield Terminal is built on open blockchain data and publicly available protocol information. The platform does not rely on proprietary APIs from third-party analytics platforms.

### Core Principles

1. **Direct On-Chain Data** — Primary data is obtained directly from blockchain networks
2. **Protocol-Level Integrations** — Native integration with protocol registries
3. **Open Data Sources** — Public datasets validated against on-chain data
4. **Independent Data Processing** — All analytics produced by internal pipelines

All collected data is processed through Yield Terminal's internal analytics pipeline, performing:

- Strategy classification
- Yield attribution
- Risk modeling
- Liquidity analysis
- Financial statement generation

---

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui + Radix UI
- Recharts
- React Query

### Backend

- FastAPI
- Pydantic
- Python 3.11+

### Indexer

- Python 3.11+
- Web3.py / ethers

---

## Long-Term Vision

Yield Terminal aims to become the intelligence layer for DeFi yield strategies.

By combining:

- Strategy analytics
- Financial reporting
- Risk modeling
- Portfolio monitoring
- Capital allocation
- Research library

the platform provides a unified environment for analyzing and deploying capital across DeFi — a Bloomberg Terminal for on-chain yield.


## Architecture

### System Components

```
┌─────────────┐
│   Frontend  │  React/TypeScript dashboard
└──────┬──────┘
       │ HTTP
┌──────▼──────┐
│   Backend   │  FastAPI REST API
└──────┬──────┘
       │
┌──────▼──────┐
│  PostgreSQL │  Data storage (future)
└─────────────┘

┌─────────────┐
│   Indexer   │  Data ingestion from protocols
└──────┬──────┘
       │
       ▼
   JSON Seed
```

### Technology Stack

**Frontend**
- React 19
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Recharts
- React Query

**Backend**
- FastAPI
- Pydantic
- Python 3.11+
- PostgreSQL (future)

**Indexer**
- Python 3.11+
- Requests
- Protocol adapters

## API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

Currently, no authentication required. API key authentication coming soon.

### Endpoints

#### Health Check

```http
GET /api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### List Vaults

```http
GET /api/v1/vaults
```

Query Parameters:
- `chain` (optional): Filter by blockchain
- `protocol` (optional): Filter by protocol
- `min_apy` (optional): Minimum APY threshold

Response:
```json
{
  "vaults": [
    {
      "id": "vault-1",
      "address": "0x1234...",
      "name": "Aave USDC Vault",
      "protocol": "aave",
      "chain": "ethereum",
      "asset": "USDC",
      "apy": 8.5,
      "tvl": 125000000,
      "risk_score": 3.2,
      "strategy": "Lend asset on Aave...",
      "dependencies": ["Chainlink Oracles"],
      "upgradeability": "timelock",
      "oracle_type": "chainlink",
      "liquidity_depth": 250000000,
      "source": "defillama",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Get Vault Details

```http
GET /api/v1/vaults/{address}
```

Path Parameters:
- `address`: Vault contract address

Response: Single vault object (see above)

#### Get Vault Risk Analysis

```http
GET /api/v1/vaults/{address}/risk
```

Path Parameters:
- `address`: Vault contract address

Response:
```json
{
  "vault_id": "vault-1",
  "overall_score": 3.2,
  "level": "low",
  "factors": {
    "protocol_dependency": 3.0,
    "oracle_risk": 2.0,
    "upgradeability_risk": 3.0,
    "liquidity_risk": 5.0
  }
}
```

Risk Levels:
- `low`: Score 0-3
- `medium`: Score 3-6
- `high`: Score 6-10

#### Get Portfolio

```http
GET /api/v1/portfolio/{wallet}
```

Path Parameters:
- `wallet`: Wallet address

Response:
```json
{
  "wallet_address": "0xabcd...",
  "total_value": 500000,
  "positions": [
    {
      "vault_id": "vault-1",
      "vault_name": "Aave USDC Vault",
      "amount": 100000,
      "value_usd": 100000
    }
  ],
  "asset_breakdown": {
    "USDC": 250000,
    "ETH": 150000,
    "DAI": 100000
  },
  "protocol_exposure": {
    "aave": 200000,
    "compound": 300000
  }
}
```

## Risk Model

### Risk Score Calculation

Risk score is a weighted composite (0-10 scale) of four factors:

1. **Protocol Dependency Risk** (30% weight)
   - 0 dependencies: 2.0
   - 1 dependency: 3.0
   - 2 dependencies: 5.0
   - 3 dependencies: 7.0
   - 4+ dependencies: 9.0

2. **Oracle Risk** (25% weight)
   - None: 1.0
   - Chainlink: 2.0
   - Uniswap TWAP: 5.0
   - Internal: 8.0

3. **Upgradeability Risk** (25% weight)
   - Immutable: 1.0
   - Timelock: 3.0
   - Multisig: 6.0
   - EOA: 10.0

4. **Liquidity Risk** (20% weight)
   - Depth/TVL ratio >= 3x: 2.0
   - Depth/TVL ratio >= 2x: 3.0
   - Depth/TVL ratio >= 1.5x: 5.0
   - Depth/TVL ratio >= 1x: 7.0
   - Depth/TVL ratio < 1x: 9.0

### Risk Level Classification

- **Low Risk** (0-3): Conservative, battle-tested protocols
- **Medium Risk** (3-6): Moderate risk, established protocols
- **High Risk** (6-10): Higher risk, complex strategies

## Data Sources

### Current Sources

1. **DeFiLlama Yields API**
   - URL: https://yields.llama.fi/pools
   - Coverage: 100+ protocols across 50+ chains
   - Update frequency: Real-time

### Future Sources

- Yearn Finance API
- Morpho API
- Beefy Finance API
- Direct onchain reads

## Development

### Local Setup

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd defi-vault-intelligence
   ```

2. **Run indexer** (seed data)
   ```bash
   cd indexer
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python run_indexer.py
   ```

3. **Start backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. **Start frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Setup

```bash
docker-compose up
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deployment

### Environment Variables

**Backend**
```env
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=https://yourdomain.com
SEED_DATA_PATH=/app/data/vaults.json
```

**Frontend**
```env
VITE_API_URL=https://api.yourdomain.com
```

### Production Considerations

1. **Security**
   - Add API key authentication
   - Enable rate limiting
   - Use HTTPS
   - Secure CORS origins

2. **Database**
   - Migrate from JSON to PostgreSQL
   - Set up connection pooling
   - Configure backups

3. **Caching**
   - Add Redis for API responses
   - Cache risk calculations
   - TTL based on data freshness

4. **Monitoring**
   - Set up logging
   - Add health checks
   - Monitor API latency
   - Track error rates

## Support

- GitHub Issues: [project-repo]/issues
- Documentation: /docs
- API Reference: http://localhost:8000/docs

## License

MIT
