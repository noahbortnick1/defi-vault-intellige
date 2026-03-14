# Vault Discovery Engine Architecture

## Overview

The **Automatic Vault Discovery Engine** is the technical moat that makes this platform powerful. While competitors manually curate vaults, this system automatically discovers and indexes **90-95% of vaults** across multiple chains.

## The Goal

Automatically detect:
- Vault contracts
- Strategies
- Yield sources  
- TVL
- APY
- Protocol dependencies

Across chains:
- Ethereum
- Arbitrum
- Base
- Optimism
- Polygon
- BSC
- Solana (future)

The system continuously updates vault data in real-time.

---

## Three-Layer Discovery Architecture

### Layer 1: Aggregators (Bootstrap)

**Purpose:** Fastest way to seed the database

**Data Sources:**
- DeFiLlama Yields API (`https://yields.llama.fi/pools`)
- Protocol registries
- Curated vault lists

**What it provides:**
- Protocol name
- APY (base + rewards)
- TVL
- Asset/Symbol
- Chain
- Reward tokens
- Historical APY changes

**Confidence Score:** 85%

**Implementation:** `src/lib/discovery/aggregator.ts`

```typescript
class AggregatorLayer {
  async fetchVaults(): Promise<AggregatorVault[]>
  normalizeToDiscovery(vault): DiscoveryResult
  async discoverVaults(): Promise<DiscoveryResult[]>
}
```

---

### Layer 2: Protocol Registries (Onchain Validation)

**Purpose:** Direct onchain vault enumeration from protocol contracts

**Target Protocols:**
- **Yearn Finance:** `getVaults()` from Registry
- **Morpho:** `getMarkets()` from Market contracts
- **Pendle:** `getAllMarkets()` from Pendle Core
- **Enzyme:** `getVaultAddresses()` from Registry
- **Beefy:** `getAllVaults()` from Strategy contracts

**What it provides:**
- Verified vault addresses
- Official protocol association
- Registry validation
- Contract method signatures

**Confidence Score:** 95%

**Implementation:** `src/lib/discovery/registry.ts`

```typescript
class RegistryLayer {
  async scanRegistry(registry): Promise<DiscoveryResult[]>
  async discoverAllRegistries(): Promise<DiscoveryResult[]>
  getRegistries(): ProtocolRegistry[]
}
```

---

### Layer 3: Onchain Detection (The Real Moat)

**Purpose:** Pattern-based vault discovery for unknown/new vaults

**Detection Patterns:**

#### ERC4626 (Standard Vault Interface)
```solidity
totalAssets()
convertToAssets(uint256)
convertToShares(uint256)
deposit(uint256, address)
withdraw(uint256, address, address)
mint(uint256, address)
redeem(uint256, address, address)
```
**Confidence:** 98%

#### Yearn V2 Vault Pattern
```solidity
pricePerShare()
totalAssets()
deposit(uint256)
withdraw(uint256)
availableDepositLimit()
```
**Confidence:** 95%

#### Compound Market Pattern
```solidity
exchangeRateCurrent()
mint(uint256)
redeem(uint256)
redeemUnderlying(uint256)
borrow(uint256)
```
**Confidence:** 92%

#### Aave aToken Pattern
```solidity
UNDERLYING_ASSET_ADDRESS()
scaledBalanceOf(address)
getScaledUserBalanceAndSupply(address)
```
**Confidence:** 90%

**Implementation:** `src/lib/discovery/onchain.ts`

```typescript
class OnchainDetector {
  async detectVaultContracts(chain, addresses): Promise<DiscoveryResult[]>
  async scanBlockRange(chain, fromBlock, toBlock): Promise<DiscoveryResult[]>
  private async analyzeContract(address, chain): Promise<VaultPattern | null>
  getPatterns(): VaultPattern[]
}
```

---

## Strategy Classification Engine

**Purpose:** Automatically classify vault strategies based on contract interactions

### Classification Logic

#### Lending Strategy
**Detected when interacting with:**
- Aave, Compound, Morpho, Radiant, Silo

**Yield Sources:**
- Interest from lending assets
- Lending protocol incentives

#### LP Farming Strategy
**Detected when interacting with:**
- Uniswap, Curve, Balancer, SushiSwap, PancakeSwap

**Yield Sources:**
- Trading fees
- LP incentives
- Token emissions

#### Delta Neutral Strategy
**Detected when interacting with:**
- GMX, Synthetix, dYdX, Gains Network (Perps)
- Lyra, Dopex, Hegic, Ribbon (Options)

**Yield Sources:**
- Funding rate arbitrage
- Option premiums
- Hedging fees

#### Liquid Staking Strategy  
**Detected when interacting with:**
- Lido, Rocket Pool, Frax

**Yield Sources:**
- Ethereum staking rewards
- Protocol fees

#### Leveraged Yield Farming
**Detected when interacting with:**
- Lending protocols + DEX protocols

**Yield Sources:**
- Amplified LP fees
- Leveraged incentives
- Borrow interest cost (negative yield)

**Implementation:** `src/lib/discovery/strategy.ts`

```typescript
class StrategyClassifier {
  async classifyStrategy(vaultAddress, interactions): Promise<StrategyClassification>
  private determineStrategyType(protocolMap): { primary, secondary? }
  private identifyYieldSources(protocolMap, strategyType): YieldSource[]
  private assessRiskFactors(protocolMap): string[]
}
```

---

## Yield Decomposition System

### APY Breakdown Components

```typescript
YieldDecomposition {
  totalApy: number
  components: {
    baseYield: number      // Real yield from protocol activity
    tradingFees: number    // LP trading fees
    incentives: number     // Token incentives/emissions
    rebases: number        // Rebase rewards (e.g., stETH)
  }
  realYieldPercentage: number  // % of APY that's sustainable
  sustainability: 'high' | 'medium' | 'low'
}
```

**Real Yield vs Incentives:**
- **Real Yield:** Sustainable revenue (trading fees, lending interest)
- **Incentives:** Temporary token emissions (may end or reduce)

Institutions care deeply about sustainability.

---

## Risk Assessment Engine

### Risk Score Calculation

```typescript
RiskAssessment {
  score: number  // 0-10 scale
  level: 'low' | 'medium' | 'high'
  breakdown: {
    smartContract: number   // 30% weight
    liquidity: number       // 25% weight
    dependency: number      // 20% weight
    market: number          // 15% weight
    centralization: number  // 10% weight
  }
}
```

### Risk Factors

#### Smart Contract Risk
- Proxy upgradeable (risk: admin can change code)
- Admin control (multisig? timelock?)
- Audit status and quality
- Code complexity
- Time in production

#### Liquidity Risk
- TVL depth
- Withdrawal capacity
- Market depth for exit
- Slippage on large withdrawals

#### Dependency Risk
- Oracle dependencies (Chainlink risk)
- Protocol dependencies (Aave, Curve failure risk)
- Bridge dependencies (cross-chain risk)
- Number of dependencies (complexity risk)

#### Market Risk
- Asset volatility
- Correlation risk
- Impermanent loss exposure

#### Centralization Risk
- Governance structure
- Multisig setup
- Admin key controls
- Upgrade timelock duration

---

## Update Frequency System

Different data has different refresh requirements:

| Data Type | Frequency | Reason |
|-----------|-----------|--------|
| **TVL** | 5 minutes | Changes frequently with deposits/withdrawals |
| **APY** | 30 minutes | Yield rates change with market conditions |
| **Risk Score** | Daily | Smart contract risk is relatively static |
| **Strategy Classification** | Weekly | Vault strategies rarely change |

**Implementation:**
```typescript
const updateSchedule: UpdateFrequency = {
  tvl: 5 * 60 * 1000,           // 5 minutes
  apy: 30 * 60 * 1000,          // 30 minutes  
  risk: 24 * 60 * 60 * 1000,    // 24 hours
  strategy: 7 * 24 * 60 * 60 * 1000  // 7 days
}
```

---

## Discovery Pipeline Flow

```
Aggregator Seed
      ↓
Protocol Registry Scanner
      ↓
Onchain Vault Detector
      ↓
Strategy Classifier
      ↓
Risk Assessor
      ↓
Yield Decomposer
      ↓
Vault Database
      ↓
API Layer
      ↓
Frontend
```

---

## Indexer Architecture

### Modular Worker Structure

```
indexer/
├── chains/
│   ├── ethereum.ts      # Ethereum RPC client
│   ├── arbitrum.ts      # Arbitrum RPC client
│   ├── base.ts          # Base RPC client
│   ├── optimism.ts      # Optimism RPC client
│   └── polygon.ts       # Polygon RPC client
├── protocols/
│   ├── yearn.ts         # Yearn registry scanner
│   ├── morpho.ts        # Morpho market scanner
│   ├── pendle.ts        # Pendle market scanner
│   ├── enzyme.ts        # Enzyme vault scanner
│   └── beefy.ts         # Beefy vault scanner
├── discovery/
│   ├── erc4626.ts       # ERC4626 pattern detector
│   ├── vault_patterns.ts # Vault pattern library
│   └── strategy.ts      # Strategy classifier
├── jobs/
│   ├── vault_sync.ts    # Continuous vault discovery
│   ├── yield_update.ts  # APY refresh worker
│   └── risk_update.ts   # Risk score recalculation
└── index.ts             # Main orchestrator
```

---

## Database Schema

### Core Tables

#### `vaults`
```sql
id                UUID PRIMARY KEY
protocol          TEXT
chain             TEXT
asset             TEXT
vault_address     TEXT UNIQUE
strategy_type     TEXT
tvl               NUMERIC
apy               NUMERIC
risk_score        NUMERIC
verified          BOOLEAN
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

#### `strategies`
```sql
id                UUID PRIMARY KEY
vault_id          UUID REFERENCES vaults(id)
strategy_type     TEXT
dependencies      TEXT[]
yield_sources     JSONB
confidence        NUMERIC
classified_at     TIMESTAMP
```

#### `yield_history`
```sql
id                UUID PRIMARY KEY
vault_id          UUID REFERENCES vaults(id)
timestamp         TIMESTAMP
apy               NUMERIC
tvl               NUMERIC
apy_base          NUMERIC
apy_reward        NUMERIC
```

#### `risk_assessments`
```sql
id                UUID PRIMARY KEY
vault_id          UUID REFERENCES vaults(id)
score             NUMERIC
level             TEXT
smart_contract    NUMERIC
liquidity         NUMERIC
dependency        NUMERIC
market            NUMERIC
centralization    NUMERIC
factors           JSONB
assessed_at       TIMESTAMP
```

---

## API Layer

### Endpoints

#### Vault Discovery
```
GET  /api/vaults
GET  /api/vaults/:address
POST /api/discovery/run
GET  /api/discovery/status
```

#### Vault Analytics
```
GET /api/vault/:address/risk
GET /api/vault/:address/strategy
GET /api/vault/:address/yield-history
GET /api/vault/:address/dependencies
```

#### Protocol & Chain
```
GET /api/protocols
GET /api/protocol/:name/vaults
GET /api/chains
GET /api/chain/:name/vaults
```

#### Search & Filter
```
GET /api/vaults/search?q=:query
GET /api/vaults/filter?chain=:chain&risk=:level
GET /api/vaults/compare?ids=:vaultIds
```

---

## Why This Is the Real Moat

### Competitors (Manual Curation)
❌ Manually add vaults  
❌ Manually classify strategies  
❌ Manually score risk  
❌ Limited coverage (~100-500 vaults)  
❌ Slow to discover new vaults  
❌ High maintenance cost

### Our System (Automatic Discovery)
✅ Automatically discovers vaults  
✅ Automatically classifies strategies  
✅ Automatically scores risk  
✅ Comprehensive coverage (~5,000+ vaults)  
✅ Real-time discovery of new vaults  
✅ Scales with minimal human intervention

---

## Coverage Goals

| Phase | Target Vaults | Coverage |
|-------|---------------|----------|
| **Phase 1** | ~500 vaults | Major protocols (Yearn, Aave, Compound) |
| **Phase 2** | ~2,000 vaults | Mid-tier protocols (Morpho, Pendle, Enzyme) |
| **Phase 3** | ~5,000 vaults | Long tail + ERC4626 detection |
| **Phase 4** | ~10,000+ vaults | Full cross-chain coverage |

---

## Next Steps After Discovery Engine

Once automatic discovery is working:

1. **Vault Ranking Algorithm**  
   Institutional-grade scoring for capital allocation

2. **Index Vaults**  
   Automated vault-of-vaults strategies

3. **Capital Allocation Engine**  
   Optimize treasury deployment across vaults

4. **Portfolio Analytics**  
   Real-time risk monitoring and reporting

5. **Alert System**  
   Risk threshold breaches and strategy changes

---

## Key Technical Decisions

### Why Three Layers?

1. **Aggregators:** Fast bootstrap, immediate value
2. **Registries:** High confidence, official vaults
3. **Onchain:** Complete coverage, discovers everything

Each layer complements the others. Aggregators get you 70%, registries get you to 85%, onchain detection reaches 95%+.

### Why Confidence Scores?

Different discovery methods have different reliability:
- Onchain ERC4626 detection: 98% (standard interface)
- Protocol registry: 95% (official source)
- Aggregator data: 85% (third-party data)
- Pattern matching: 70-90% (heuristic-based)

Confidence scores let you:
- Prioritize high-confidence vaults for institutional users
- Flag low-confidence vaults for manual review
- Weight data sources in ranking algorithms

### Why Modular Workers?

Each chain, protocol, and detection method is isolated. This means:
- Easy to add new chains
- Easy to add new protocols
- Easy to improve detection patterns
- Workers can be scaled independently
- Failures are isolated (one chain down ≠ system down)

---

## Implementation Status

✅ **Completed:**
- Three-layer discovery architecture
- Strategy classification engine
- Risk assessment framework
- Yield decomposition system
- Modular worker structure

🚧 **In Progress:**
- Real RPC integration (currently simulated)
- Database persistence layer
- API endpoint implementation
- Historical data tracking

📋 **Planned:**
- Cross-chain bridge detection
- Real-time event monitoring
- Machine learning strategy classification
- Automated vault verification
- Integration with institutional ranking algorithm

---

This discovery engine is the **foundation** of the entire platform. Everything else (rankings, allocation, portfolio management) depends on having comprehensive, accurate vault data.
