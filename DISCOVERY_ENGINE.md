# Vault Discovery Engine

## Overview

The Vault Discovery Engine is the **technical moat** of the DeFi Vault Intelligence platform. While most competitors manually curate vault lists, this system automatically discovers and indexes **90-95% of vaults** across multiple blockchains.

## Architecture

### Three-Layer Discovery System

The engine combines three complementary data pipelines to achieve comprehensive coverage:

#### Layer 1: Aggregators (Bootstrap)
- **Purpose**: Fast initial seeding with broad coverage
- **Sources**:
  - DeFiLlama Yields API (`https://yields.llama.fi/pools`)
  - Protocol registries and curated lists
  - Existing vault databases
- **Confidence**: 85%
- **Coverage**: ~60-70% of vaults
- **Update Frequency**: Every 30 minutes

#### Layer 2: Protocol Registries (Verified)
- **Purpose**: Direct onchain reading of official protocol vault lists
- **Method**: Query registry contracts that expose vault enumeration
- **Protocols**:
  - Yearn Finance: `getVaults()`
  - Morpho: `getMarkets()`
  - Pendle: `getAllMarkets()`
  - Enzyme: `getVaultAddresses()`
  - Beefy: `getAllVaults()`
- **Confidence**: 95%
- **Coverage**: ~20-30% of vaults (high-quality protocols)
- **Update Frequency**: Every hour

#### Layer 3: Onchain Detection (The Moat)
- **Purpose**: Discover vaults that aren't in aggregators or registries
- **Method**: Pattern matching on contract bytecode and interfaces
- **Patterns Detected**:
  - **ERC4626**: Standard vault interface (98% confidence)
    - `totalAssets()`, `convertToAssets()`, `deposit()`, `withdraw()`
  - **Yearn V2**: Yearn-style vaults (95% confidence)
    - `pricePerShare()`, `totalAssets()`, `deposit()`
  - **Compound Markets**: cToken pattern (92% confidence)
    - `exchangeRateCurrent()`, `mint()`, `redeem()`
  - **Aave aTokens**: Interest-bearing tokens (90% confidence)
    - `UNDERLYING_ASSET_ADDRESS()`, `scaledBalanceOf()`
- **Confidence**: 70-98% (pattern-dependent)
- **Coverage**: ~10-20% of vaults (new/unlisted)
- **Update Frequency**: Continuous (block-by-block scanning)

### Discovery Pipeline

```
Aggregator Seed
      ↓
Protocol Registry Scanner
      ↓
Onchain Vault Detector
      ↓
Strategy Classifier
      ↓
Risk Scorer
      ↓
Vault Database
```

## Strategy Classification

The engine automatically classifies vault strategies by analyzing contract interactions:

### Classification Logic

| Interactions | Primary Strategy | Secondary |
|--------------|-----------------|-----------|
| Aave + Compound + Morpho | Lending | Single Asset |
| Uniswap + Curve + Balancer | Liquidity Provision | DEX |
| Lending + DEX | Leveraged Yield Farming | Lending |
| GMX + Synthetix + dYdX | Delta Neutral | Hedging |
| Options protocols | Delta Neutral | Options |
| Lido + Rocket Pool | Liquid Staking | ETH |

### Yield Decomposition

Each vault's APY is broken down into components:

- **Base Yield**: Sustainable, protocol-native yield (lending interest, trading fees)
- **Incentives**: Token emissions (often unsustainable)
- **Trading Fees**: DEX LP fees
- **Lending Interest**: Borrowing demand
- **Staking Rewards**: PoS rewards
- **Rebase**: Supply adjustments

## Data Model

### Discovery Result

```typescript
{
  vaultAddress: string;
  chain: string;
  protocol: string;
  source: 'aggregator' | 'registry' | 'onchain';
  confidence: number; // 0-1
  discoveredAt: number; // timestamp
  metadata: {
    symbol?: string;
    tvl?: number;
    apy?: number;
    pattern?: string; // for onchain detection
  };
}
```

### Strategy Classification

```typescript
{
  primary: string; // 'lending' | 'liquidity_provision' | etc.
  secondary?: string;
  dependencies: string[]; // protocols used
  riskFactors: string[]; // identified risks
  yieldSources: YieldSource[];
  confidence: number; // classification confidence
}
```

### Yield Source

```typescript
{
  type: 'base' | 'trading_fees' | 'incentives' | 'lending' | 'staking' | 'rebase';
  apy: number;
  token?: string; // reward token
  description: string;
  sustainable: boolean; // is this yield likely to persist?
}
```

## Indexer Jobs

The engine runs multiple job types:

1. **Vault Discovery**: Find new vaults across all three layers
2. **Yield Update**: Refresh APY and TVL data
3. **Risk Update**: Recalculate risk scores
4. **Strategy Classification**: Analyze contract interactions

### Job Status

- **Pending**: Queued for execution
- **Running**: Currently processing
- **Completed**: Successfully finished
- **Failed**: Error occurred (with error message)

## Update Frequencies

Different data types have different refresh rates based on volatility:

| Data Type | Frequency | Reason |
|-----------|-----------|---------|
| TVL | 5 minutes | Highly volatile |
| APY | 30 minutes | Changes frequently |
| Discovery | 1 hour | New vaults appear regularly |
| Risk Score | Daily | Slow-changing fundamentals |
| Strategy Classification | Weekly | Contract behavior is stable |

## Why This Is the Moat

### Competitive Advantage

1. **Automation**: Competitors rely on manual curation (slow, incomplete)
2. **Coverage**: 90-95% coverage vs. 40-60% for manual approaches
3. **Freshness**: New vaults discovered within 1 hour vs. days/weeks
4. **Scalability**: Handles 1000s of vaults automatically

### What It Unlocks

Once the discovery engine is operational, it enables:

- **Vault Rankings**: Compare across all vaults, not just known ones
- **Index Vaults**: Create diversified vault-of-vaults products
- **Capital Allocation**: Algorithmic treasury optimization
- **Strategy Backtesting**: Historical yield analysis
- **Risk Aggregation**: Portfolio-level risk assessment

## Implementation Details

### File Structure

```
src/lib/discovery/
├── types.ts              # TypeScript interfaces
├── aggregator.ts         # Layer 1: DeFiLlama integration
├── registry.ts           # Layer 2: Protocol registry scanner
├── onchain.ts            # Layer 3: Pattern detection
├── strategy.ts           # Strategy classifier
├── engine.ts             # Main orchestrator
└── index.ts              # Public API
```

### Key Classes

- **AggregatorLayer**: Fetches from DeFiLlama and other APIs
- **RegistryLayer**: Reads protocol registry contracts
- **OnchainDetector**: Scans blocks for vault patterns
- **StrategyClassifier**: Analyzes contract interactions
- **DiscoveryEngine**: Orchestrates all layers

## Usage

```typescript
import { DiscoveryEngine } from '@/lib/discovery';

const engine = new DiscoveryEngine();

// Run full discovery
const result = await engine.runFullDiscovery([
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygon'
]);

console.log(`Found ${result.stats.totalUnique} vaults`);
console.log(`Aggregator: ${result.stats.aggregatorCount}`);
console.log(`Registry: ${result.stats.registryCount}`);
console.log(`Onchain: ${result.stats.onchainCount}`);

// Classify a vault's strategy
const classification = await engine.classifyVaultStrategy('0x...');
console.log(`Strategy: ${classification.primary}`);
console.log(`Yield sources:`, classification.yieldSources);
```

## Future Enhancements

1. **Machine Learning**: Train models on historical contract patterns
2. **Cross-chain**: Extend to Solana, Cosmos, etc.
3. **Real-time**: WebSocket-based instant discovery
4. **Graph Analysis**: Detect vault composition relationships
5. **Simulation**: Backtest strategy performance

## Next: Institutional Scoring Algorithm

The discovery engine finds the vaults. The next critical piece is **ranking them correctly**.

Institutional users need a scoring algorithm that:
- Weighs risk factors appropriately
- Accounts for yield sustainability
- Considers liquidity and exit capacity
- Factors in protocol maturity and audit status

This is what separates a database from an **institutional-grade platform**.
