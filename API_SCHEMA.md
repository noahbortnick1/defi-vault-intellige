# Yield Terminal API Schema

## Base Path
`/api/v1`

## Implementation Status

All MVP endpoints are implemented in-memory using seeded data. The architecture is designed to allow easy replacement with real backend adapters later.

---

## Endpoints

### 1. Health Check

**GET** `/api/v1/health`

Checks API status.

**Response:**
```json
{
  "status": "ok",
  "service": "yield-terminal-api",
  "version": "1.0.0"
}
```

**Implementation:**
```typescript
const health = await apiClient.health();
```

---

### 2. Vaults

**GET** `/api/v1/vaults`

List vaults with filters.

**Query Parameters:**
- `asset` - Filter by asset (e.g., USDC, ETH)
- `chain` - Filter by chain (e.g., Ethereum, Arbitrum)
- `protocol` - Filter by protocol (e.g., Morpho, Yearn)
- `strategy_type` - Filter by strategy type (lending, lp, leveraged_lending, etc.)
- `min_apy` - Minimum APY
- `max_risk` - Maximum risk score
- `sort` - Sort field (default: allocation_score)
- `order` - Sort order (asc/desc, default: desc)
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "items": [
    {
      "id": "vault_001",
      "name": "Morpho USDC Optimizer",
      "address": "0x123abc",
      "protocol": "Morpho",
      "chain": "Ethereum",
      "asset": "USDC",
      "strategy_type": "leveraged_lending",
      "apy": 8.4,
      "tvl": 21000000,
      "risk_score": 3.1,
      "allocation_score": 76,
      "updated_at": "2026-03-14T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

**Implementation:**
```typescript
const response = await apiClient.getVaults({
  asset: 'USDC',
  chain: 'Ethereum',
  min_apy: 5,
  max_risk: 4,
});
```

---

**GET** `/api/v1/vaults/:address`

Get detailed vault information.

**Response:**
```json
{
  "id": "vault_001",
  "name": "Morpho USDC Optimizer",
  "address": "0x123abc",
  "protocol": "Morpho",
  "chain": "Ethereum",
  "asset": "USDC",
  "strategy_type": "leveraged_lending",
  "apy": 8.4,
  "tvl": 21000000,
  "risk_score": 3.1,
  "allocation_score": 76,
  "strategy": "Looped USDC lending strategy on Morpho",
  "dependencies": ["Morpho", "Aave", "Chainlink"],
  "oracle_type": "Chainlink",
  "upgradeability": "multisig_upgradeable",
  "liquidity_depth": "medium",
  "yield_sources": ["borrow_interest", "incentives"],
  "source": "defillama",
  "updated_at": "2026-03-14T10:00:00Z"
}
```

**Implementation:**
```typescript
const vault = await apiClient.getVault('0x123abc');
```

---

**GET** `/api/v1/vaults/:address/risk`

Get risk assessment for a vault.

**Response:**
```json
{
  "address": "0x123abc",
  "risk_score": 3.1,
  "band": "low",
  "factors": {
    "contract_risk": 4,
    "dependency_risk": 3,
    "oracle_risk": 2,
    "liquidity_risk": 3,
    "strategy_complexity": 6,
    "tvl_volatility": 2
  },
  "notes": [
    "Upgradeable via multisig",
    "Depends on Chainlink oracle",
    "Medium exit liquidity"
  ]
}
```

**Implementation:**
```typescript
const risk = await apiClient.getVaultRisk('0x123abc');
```

---

### 3. Rankings

**GET** `/api/v1/rankings`

Get ranked vaults based on different scoring modes.

**Query Parameters:**
- `mode` - Ranking mode (risk_adjusted, highest_yield, institutional, best_liquidity)
- `asset` - Filter by asset
- `chain` - Filter by chain
- `strategy_type` - Filter by strategy type
- `limit` - Number of results (default: 25)

**Ranking Modes:**

1. **risk_adjusted** (default) - Balanced weighting
   - APY: 25%
   - Risk Score: 35%
   - Liquidity: 20%
   - Audit Quality: 10%
   - Dependency Complexity: 5%
   - Incentive Dependence: 5%

2. **highest_yield** - Maximum APY focus
   - APY: 60%
   - Risk Score: 20%
   - Liquidity: 15%
   - Audit Quality: 5%

3. **institutional** - Conservative, audit-focused
   - APY: 20%
   - Risk Score: 25%
   - Liquidity: 25%
   - Audit Quality: 20%
   - Dependency Complexity: 5%
   - Incentive Dependence: 5%

4. **best_liquidity** - Prioritizes exit capacity
   - APY: 20%
   - Risk Score: 20%
   - Liquidity: 45%
   - Audit Quality: 10%
   - Dependency Complexity: 5%

**Response:**
```json
{
  "mode": "risk_adjusted",
  "items": [
    {
      "rank": 1,
      "vault_address": "0x456def",
      "name": "Yearn USDC",
      "protocol": "Yearn",
      "chain": "Ethereum",
      "asset": "USDC",
      "apy": 6.4,
      "risk_score": 2.1,
      "allocation_score": 91,
      "liquidity_depth": "high"
    }
  ]
}
```

**Implementation:**
```typescript
const rankings = await apiClient.getRankings({
  mode: 'risk_adjusted',
  asset: 'USDC',
  limit: 25,
});
```

---

### 4. Portfolio

**GET** `/api/v1/portfolio/:wallet`

Get portfolio overview for a wallet address.

**Response:**
```json
{
  "wallet_address": "0xabc...",
  "total_value": 8421532.19,
  "positions": [
    {
      "id": "pos_001",
      "protocol": "Morpho",
      "chain": "Ethereum",
      "position_type": "vault",
      "asset": "USDC",
      "value": 2100000,
      "cost_basis": 2000000,
      "pnl": 100000,
      "vault_address": "0x123abc"
    }
  ],
  "asset_breakdown": [
    { "asset": "USDC", "value": 5000000, "weight": 0.59 },
    { "asset": "ETH", "value": 2100000, "weight": 0.25 }
  ],
  "protocol_exposure": [
    { "protocol": "Morpho", "value": 2100000, "weight": 0.25 }
  ],
  "chain_exposure": [
    { "chain": "Ethereum", "value": 7000000, "weight": 0.83 }
  ]
}
```

**Implementation:**
```typescript
const portfolio = await apiClient.getPortfolio('0xabc...');
```

---

### 5. Reports

**GET** `/api/v1/reports/vault/:address`

Generate comprehensive due diligence report for a vault.

**Response:**
```json
{
  "vault": {
    "name": "Morpho USDC Optimizer",
    "address": "0x123abc",
    "protocol": "Morpho",
    "chain": "Ethereum",
    "asset": "USDC",
    "apy": 8.4,
    "tvl": 21000000
  },
  "strategy_summary": "Looped USDC lending strategy on Morpho",
  "yield_sources": [
    "borrow_interest",
    "token_incentives"
  ],
  "dependencies": [
    "Morpho",
    "Aave",
    "Chainlink"
  ],
  "contract_risk": {
    "upgradeability": "multisig_upgradeable",
    "timelock": "24h",
    "audits": ["Trail of Bits"]
  },
  "liquidity_profile": {
    "depth": "medium",
    "withdrawal_risk": "moderate"
  },
  "overall_risk_score": 3.1,
  "red_flags": [
    "Depends on external oracle",
    "Incentive component may be unstable"
  ]
}
```

**Implementation:**
```typescript
const report = await apiClient.getVaultReport('0x123abc');
```

---

## Type Definitions

### Core Types

```typescript
type StrategyType = 
  | 'lending'
  | 'lp'
  | 'leveraged_lending'
  | 'delta_neutral'
  | 'yield_tokenization'
  | 'options'
  | 'staking';

type RiskBand = 'low' | 'medium' | 'high';
type LiquidityDepth = 'low' | 'medium' | 'high';
type Upgradeability = 
  | 'immutable'
  | 'timelock_upgradeable'
  | 'multisig_upgradeable'
  | 'admin_upgradeable';

interface Vault {
  id: string;
  name: string;
  address: string;
  protocol: string;
  chain: string;
  asset: string;
  strategy_type: StrategyType;
  apy: number;
  tvl: number;
  risk_score: number;
  allocation_score: number;
  strategy?: string;
  dependencies?: string[];
  oracle_type?: string;
  upgradeability?: Upgradeability;
  liquidity_depth?: LiquidityDepth;
  yield_sources?: string[];
  source?: string;
  updated_at: string;
}

interface Position {
  id: string;
  protocol: string;
  chain: string;
  position_type: string;
  asset: string;
  value: number;
  cost_basis?: number;
  pnl?: number;
  vault_address?: string | null;
}
```

---

## Usage Example

```typescript
import { apiClient } from '@/api';

async function analyzeVault(address: string) {
  const vault = await apiClient.getVault(address);
  if (!vault) return null;

  const risk = await apiClient.getVaultRisk(address);
  const report = await apiClient.getVaultReport(address);

  return {
    vault,
    risk,
    report,
  };
}

async function getTopVaults() {
  const rankings = await apiClient.getRankings({
    mode: 'institutional',
    asset: 'USDC',
    limit: 10,
  });
  
  return rankings.items;
}

async function analyzePortfolio(walletAddress: string) {
  const portfolio = await apiClient.getPortfolio(walletAddress);
  
  console.log(`Total Value: $${portfolio.total_value.toLocaleString()}`);
  console.log(`Positions: ${portfolio.positions.length}`);
  console.log(`Top Asset: ${portfolio.asset_breakdown[0].asset}`);
  
  return portfolio;
}
```

---

## Architecture Notes

### Current Implementation
- All endpoints use in-memory seeded data
- No external API calls or database queries
- Fast, deterministic responses for development

### Migration Path
The architecture is designed for easy backend integration:

1. Replace `ApiService` methods with HTTP fetch calls
2. Point to real backend endpoints
3. Add authentication headers
4. Add error handling and retry logic
5. Add caching layer (React Query)

Example migration:
```typescript
// Before (current):
async getVaults(params: VaultsQueryParams) {
  return apiService.getVaults(params);
}

// After (with real backend):
async getVaults(params: VaultsQueryParams) {
  const query = new URLSearchParams(params as any);
  const response = await fetch(`${API_BASE}/vaults?${query}`);
  return response.json();
}
```

---

## Seeded Data

The API includes 10 seeded vaults across major protocols:
- Morpho USDC Optimizer
- Yearn USDC
- Pendle PT-USDC
- Aave V3 USDC
- Beefy USDC-USDT LP
- Gearbox USDC Leveraged
- Compound III USDC
- Notional USDC Fixed
- Sommelier Real Yield USD
- Maple USDC

Sample portfolio includes 8 positions across multiple protocols and chains.

---

## Next Steps

### Phase 2 Endpoints (Not Yet Implemented)
- `GET /api/v1/portfolio/:wallet/positions`
- `GET /api/v1/portfolio/:wallet/exposure`
- `GET /api/v1/portfolio/:wallet/summary`
- `GET /api/v1/reports/portfolio/:wallet`
- `GET /api/v1/reports/allocation/:wallet`
- `GET /api/v1/research`
- `GET /api/v1/research/vault/:address`
- `GET /api/v1/research/protocol/:name`
- `GET /api/v1/meta/filters`

### Database Schema Recommendation

For real implementation, recommended schema:

```sql
-- Vaults table
CREATE TABLE vaults (
  id VARCHAR(255) PRIMARY KEY,
  address VARCHAR(42) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  protocol VARCHAR(100) NOT NULL,
  chain VARCHAR(50) NOT NULL,
  asset VARCHAR(20) NOT NULL,
  strategy_type VARCHAR(50) NOT NULL,
  apy DECIMAL(10, 2),
  tvl BIGINT,
  risk_score DECIMAL(3, 1),
  allocation_score INT,
  strategy TEXT,
  oracle_type VARCHAR(50),
  upgradeability VARCHAR(50),
  liquidity_depth VARCHAR(20),
  source VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_asset (asset),
  INDEX idx_chain (chain),
  INDEX idx_protocol (protocol),
  INDEX idx_strategy_type (strategy_type)
);

-- Vault dependencies (many-to-many)
CREATE TABLE vault_dependencies (
  vault_id VARCHAR(255) REFERENCES vaults(id),
  dependency VARCHAR(100),
  PRIMARY KEY (vault_id, dependency)
);

-- Vault yield sources (many-to-many)
CREATE TABLE vault_yield_sources (
  vault_id VARCHAR(255) REFERENCES vaults(id),
  yield_source VARCHAR(100),
  PRIMARY KEY (vault_id, yield_source)
);

-- Risk assessments
CREATE TABLE vault_risks (
  address VARCHAR(42) PRIMARY KEY,
  risk_score DECIMAL(3, 1),
  band VARCHAR(20),
  contract_risk INT,
  dependency_risk INT,
  oracle_risk INT,
  liquidity_risk INT,
  strategy_complexity INT,
  tvl_volatility INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Positions (for portfolio tracking)
CREATE TABLE positions (
  id VARCHAR(255) PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  protocol VARCHAR(100) NOT NULL,
  chain VARCHAR(50) NOT NULL,
  position_type VARCHAR(50) NOT NULL,
  asset VARCHAR(20) NOT NULL,
  value BIGINT,
  cost_basis BIGINT,
  vault_address VARCHAR(42),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_wallet (wallet_address),
  INDEX idx_protocol (protocol)
);
```
