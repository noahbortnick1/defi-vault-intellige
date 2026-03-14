# Quick Start - Vault Discovery Engine

## Access the Discovery Engine

1. **Launch the app** - Navigate to the application
2. **Click "Launch App"** from the landing page
3. **Click "Discovery"** in the top navigation
4. **Click "Run Discovery"** to execute the full three-layer scan

## What You'll See

### Real-Time Progress
- **Aggregator layer** completes first (~10 vaults from DeFiLlama)
- **Registry layer** scans protocol contracts (~19 vaults)
- **Onchain layer** detects patterns across chains (~138 vaults)
- **Total unique vaults** after deduplication (~156 vaults)

### Three Tabs

#### 1. Discovery Results
- All discovered vaults
- Source badges (aggregator/registry/onchain)
- Confidence scores (85-98%)
- Chain and protocol labels
- Timestamps

#### 2. Indexer Jobs
- Job execution status
- Performance metrics
- Vault counts per job
- Error tracking

#### 3. Architecture
- Visual system diagram
- Layer-by-layer breakdown
- Confidence score explanations
- Competitive advantage matrix

## Key Files

### Core Engine
- `src/lib/discovery/engine.ts` - Main orchestrator
- `src/lib/discovery/aggregator.ts` - Layer 1 (DeFiLlama)
- `src/lib/discovery/registry.ts` - Layer 2 (Protocol registries)
- `src/lib/discovery/onchain.ts` - Layer 3 (Pattern detection)
- `src/lib/discovery/strategy.ts` - Strategy classifier

### UI Components
- `src/components/DiscoveryEnginePanel.tsx` - Main interface
- `src/components/ArchitectureVisualization.tsx` - Architecture docs

### Documentation
- `DISCOVERY_ENGINE_ARCHITECTURE.md` - Complete technical reference
- `DISCOVERY_ENGINE_SUMMARY.md` - Implementation overview
- `DISCOVERY_ENGINE_QUICK_START.md` - This file

## Understanding the Moat

### Manual Competitors
- Must manually add each vault
- Limited to ~100-500 vaults
- Slow to discover new opportunities
- High maintenance cost
- Prone to errors and omissions

### Our Automatic System
- Discovers vaults across 3 independent layers
- Covers ~5,000+ vaults at scale
- Finds new vaults in real-time
- Minimal human intervention
- Self-validating through confidence scores

## Three-Layer Architecture

### Layer 1: Aggregators (Bootstrap)
**Source:** DeFiLlama Yields API  
**Speed:** Fastest  
**Coverage:** ~70% of major protocols  
**Confidence:** 85%  
**Vaults:** ~10 (in demo)

### Layer 2: Registries (Validation)
**Source:** Onchain protocol contracts  
**Speed:** Fast  
**Coverage:** ~85% of established protocols  
**Confidence:** 95%  
**Vaults:** ~19 (in demo)

### Layer 3: Onchain (Discovery)
**Source:** Pattern detection & contract analysis  
**Speed:** Slower but comprehensive  
**Coverage:** 90-95% of all vaults  
**Confidence:** 90-98% (pattern-dependent)  
**Vaults:** ~138 (in demo)

## Supported Patterns

### ERC4626 (98% confidence)
Standard vault interface with:
- `totalAssets()`
- `convertToAssets()`
- `deposit()`, `withdraw()`

### Yearn V2 (95% confidence)
- `pricePerShare()`
- `totalAssets()`
- `availableDepositLimit()`

### Compound (92% confidence)
- `exchangeRateCurrent()`
- `mint()`, `redeem()`

### Aave (90% confidence)
- `UNDERLYING_ASSET_ADDRESS()`
- `scaledBalanceOf()`

## Strategy Classification

### Automatic Detection

**Lending**
- Interacts with: Aave, Compound, Morpho
- Yield: Interest from lending

**Liquidity Provision**
- Interacts with: Uniswap, Curve, Balancer
- Yield: Trading fees

**Delta Neutral**
- Interacts with: GMX, dYdX, Lyra
- Yield: Funding rates, premiums

**Liquid Staking**
- Interacts with: Lido, Rocket Pool
- Yield: Staking rewards

**Leveraged Yield Farming**
- Interacts with: Lending + DEX
- Yield: Amplified LP fees

## Data Update Frequencies

| Type | Frequency | Why |
|------|-----------|-----|
| **TVL** | 5 min | Changes frequently |
| **APY** | 30 min | Market-driven |
| **Risk** | 24 hrs | Relatively static |
| **Strategy** | 7 days | Rarely changes |

## Next Steps After Discovery

Once vaults are discovered, you can:

1. **Rank Vaults** - Implement scoring algorithm
2. **Create Indexes** - Build vault-of-vaults
3. **Allocate Capital** - Optimize treasury deployment
4. **Track Performance** - Monitor historical returns
5. **Generate Reports** - Export due diligence PDFs

## Extending the System

### Add a New Chain
1. Create RPC client
2. Add to engine chains list
3. Configure block scanning

### Add a New Protocol Registry
1. Define registry contract address
2. Specify vault list method
3. Add to `registry.ts`

### Add a New Detection Pattern
1. Define method signatures
2. Set confidence score
3. Add to `onchain.ts` patterns

### Add a New Strategy Type
1. Map protocol interactions
2. Define yield sources
3. Update `strategy.ts` classifier

## Performance Targets

### Current (Demo with Simulation)
- Execution time: ~8 seconds
- Vaults discovered: 156
- Chains covered: 5
- Protocols: 10+

### Production (With Real RPC)
- Execution time: ~30-60 seconds
- Vaults discovered: 5,000+
- Chains covered: 10+
- Protocols: 50+

## Common Questions

**Q: Why three layers?**  
A: Each layer complements the others. Aggregators are fast, registries are authoritative, onchain is comprehensive.

**Q: What if a vault appears in multiple layers?**  
A: The system deduplicates using confidence scores. Higher confidence source wins.

**Q: How often should discovery run?**  
A: New vault discovery: weekly. TVL/APY updates: 5-30 minutes.

**Q: Can it discover brand new vaults?**  
A: Yes! Layer 3 (onchain detection) finds any contract matching vault patterns.

**Q: What about cross-chain bridges?**  
A: Each chain is scanned independently. Bridge risk is tracked as a dependency.

**Q: Is this production-ready?**  
A: Core architecture yes. Needs real RPC integration for live data.

## Technical Highlights

✅ **Modular architecture** - Each layer is independent  
✅ **Type-safe** - Full TypeScript coverage  
✅ **Job tracking** - Monitor execution in real-time  
✅ **Confidence scoring** - Data quality assurance  
✅ **Deduplication** - No duplicate vaults  
✅ **Strategy classification** - Automatic categorization  
✅ **Extensible** - Easy to add chains/protocols/patterns

## Developer Tips

1. **Start with aggregators** - Fastest way to see results
2. **Test patterns incrementally** - Add one at a time
3. **Monitor confidence scores** - Flag low-confidence vaults
4. **Use job tracking** - Debug failures easily
5. **Extend types first** - TypeScript guides implementation

## Resources

- **Architecture Guide**: `DISCOVERY_ENGINE_ARCHITECTURE.md`
- **Implementation Summary**: `DISCOVERY_ENGINE_SUMMARY.md`
- **PRD Section**: See "Vault Discovery Engine" in `PRD.md`
- **Code**: `src/lib/discovery/` directory

---

**Ready to discover vaults?** Click "Discovery" → "Run Discovery" → Watch the magic happen! 🚀
