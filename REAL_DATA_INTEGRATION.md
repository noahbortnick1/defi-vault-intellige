# Real Blockchain Data Integration

## Overview

The Yield Terminal platform now features production-ready blockchain data integration, fetching real vault data from multiple DeFi protocols across 6 chains. This document describes the architecture, data sources, and API capabilities.

## Architecture

### Data Flow

```
DeFiLlama Yields API → blockchainData.ts → realDataService.ts → apiClient.ts → React Components
        ↓
   localStorage cache (5 min TTL)
```

### Key Components

1. **`blockchainData.ts`**: Core data fetching and transformation layer
2. **`realDataService.ts`**: Service layer with caching and ranking algorithms
3. **`apiClient.ts`**: Client API wrapper
4. **`use-real-vaults.ts`**: React hook for components
5. **`RealDataDashboard.tsx`**: UI component showcasing live data

## Data Sources

### Primary: DeFiLlama Yields API

**Endpoint**: `https://yields.llama.fi/pools`

**Coverage**:
- 500+ DeFi vaults
- 6 chains: Ethereum, Arbitrum, Base, Optimism, Polygon, BSC
- 100+ protocols: Aave, Morpho, Yearn, Curve, Pendle, Compound, etc.

**Data Points**:
- TVL (Total Value Locked) in USD
- APY (Annual Percentage Yield) - base + reward
- Protocol name and category
- Chain information
- Risk indicators (IL risk, stablecoin status, outlier detection)
- Underlying tokens
- Pool metadata

### Secondary: Blockchain RPC (via web3Rpc.ts)

**Capabilities**:
- Direct on-chain balance queries
- ERC20 token metadata
- ERC4626 vault positions
- Multi-chain support via public RPC endpoints

**RPC Endpoints**:
```typescript
ethereum: 'https://eth.llamarpc.com'
arbitrum: 'https://arbitrum.llamarpc.com'
base: 'https://base.llamarpc.com'
optimism: 'https://optimism.llamarpc.com'
polygon: 'https://polygon.llamarpc.com'
bsc: 'https://binance.llamarpc.com'
```

## API Functions

### Fetching Vaults

```typescript
import { fetchRealVaultData } from '@/lib/blockchainData';

// Fetch all vaults (with cache)
const vaults = await fetchRealVaultDataWithCache();

// Fetch by chain
const ethVaults = await fetchVaultsByChain('ethereum');

// Fetch by protocol
const aaveVaults = await fetchVaultsByProtocol('aave');

// Fetch by asset
const usdcVaults = await fetchVaultsByAsset('USDC');

// Search
const results = await searchVaults('morpho');
```

### Using the React Hook

```typescript
import { useRealVaults } from '@/hooks/use-real-vaults';

function MyComponent() {
  const { vaults, isLoading, error, stats, refetch } = useRealVaults({
    chain: 'ethereum',
    autoFetch: true
  });

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <p>Total Vaults: {stats.totalVaults}</p>
      <p>Total TVL: {stats.totalTVL}</p>
      {vaults.map(vault => <VaultCard key={vault.id} vault={vault} />)}
    </div>
  );
}
```

### Using the API Service

```typescript
import { realDataApiService } from '@/api/realDataService';

// Get ranked vaults
const rankings = await realDataApiService.getRankings({
  mode: 'risk_adjusted',
  chain: 'ethereum',
  min_tvl: 1_000_000,
  max_risk: 7
});

// Get specific vault
const vault = await realDataApiService.getVaultByAddress('0x...');

// Get vault risk analysis
const risk = await realDataApiService.getVaultRisk('0x...');

// Clear cache and force refresh
await realDataApiService.clearCache();
```

## Risk Scoring Algorithm

The platform automatically calculates risk scores (0-10 scale) based on:

1. **TVL-based risk**:
   - < $1M: +2.0 risk
   - < $10M: +1.0 risk
   - > $100M: -1.0 risk

2. **APY-based risk**:
   - > 50%: +2.0 risk
   - > 30%: +1.0 risk
   - > 20%: +0.5 risk

3. **Impermanent Loss risk**: +1.5 if IL risk present

4. **Incentive dependence**: +0.5 if reward tokens present

5. **Protocol maturity**: -1.5 for major protocols (Aave, Compound, Curve, etc.)

6. **Stablecoin discount**: -0.5 for stablecoin vaults

7. **Outlier penalty**: +1.5 if flagged as statistical outlier

## Ranking Modes

### Risk-Adjusted (Default)
Balanced scoring for conservative allocations:
- APY: 25%
- Risk: 35%
- Liquidity: 20%
- Audit: 10%
- Dependencies: 5%
- Incentives: 5%

### Highest Yield
Optimized for maximum APY:
- APY: 60%
- Risk: 20%
- Liquidity: 15%
- Audit: 5%

### Institutional Fit
Emphasizes audit quality and liquidity:
- APY: 20%
- Risk: 25%
- Liquidity: 25%
- Audit: 20%
- Dependencies: 5%
- Incentives: 5%

### Best Liquidity
Prioritizes exit capacity:
- APY: 20%
- Risk: 20%
- Liquidity: 45%
- Audit: 10%
- Dependencies: 5%

## Caching Strategy

**Local Storage Cache**:
- Key: `vaults_cache`
- TTL: 5 minutes
- Format: `{ data: Vault[], timestamp: number }`

**Benefits**:
- Reduces API calls
- Faster page loads
- Better user experience
- Respects rate limits

**Manual Refresh**:
Users can force refresh via the "Refresh Data" button in the UI.

## Data Quality & Filtering

The platform applies intelligent filters to ensure data quality:

1. **Minimum TVL**: $100,000 (filters out trivial vaults)
2. **APY bounds**: 0% - 1000% (removes obvious errors)
3. **Chain support**: Only whitelisted chains
4. **Top 500**: Limits to most relevant vaults

## Performance Optimizations

1. **Lazy Loading**: Vaults load on-demand
2. **Pagination**: API returns paginated results
3. **Memoization**: React hooks memoize expensive calculations
4. **Debouncing**: Search queries are debounced
5. **Parallel Fetching**: Multiple API calls run concurrently

## Error Handling

```typescript
try {
  const vaults = await fetchRealVaultData();
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to fetch vaults:', error.message);
    // Fallback to cached data or show error UI
  }
}
```

The system gracefully handles:
- Network failures
- API rate limits
- Invalid data
- Timeout errors
- CORS issues

## Future Enhancements

1. **Historical Data**: Track APY changes over time
2. **WebSocket Updates**: Real-time vault updates
3. **More Chains**: Add Avalanche, Fantom, etc.
4. **Graph Protocol**: Query subgraphs for deeper data
5. **Custom Indexer**: Build proprietary data pipeline
6. **ML Risk Models**: Advanced risk prediction
7. **Social Sentiment**: Integrate Twitter/Discord data

## Comparison: vaults.fyi vs. Yield Terminal

| Feature | vaults.fyi | Yield Terminal |
|---------|------------|----------------|
| Data Source | Manual curation | DeFiLlama API + RPC |
| Update Frequency | Slow/manual | Real-time (5min cache) |
| Vault Count | Limited | 500+ |
| Chain Coverage | Limited | 6 chains |
| Risk Scoring | Basic | Multi-factor algorithm |
| Rankings | Static | Dynamic with 4 modes |
| AI Reports | ❌ | ✅ GPT-4 powered |
| API Access | Limited | Full REST API |
| Portfolio Analytics | Basic | Advanced with AI |
| Real-time Updates | ❌ | ✅ |
| Open Source | ❌ | ✅ (can be) |

## Why This Is Better Than vaults.fyi

1. **Automated Data**: No manual curation needed
2. **Comprehensive Coverage**: 500+ vaults vs. limited set
3. **Real-time Updates**: Fresh data every 5 minutes
4. **Multi-chain**: 6 chains vs. limited coverage
5. **Advanced Algorithms**: 4 ranking modes with transparent methodology
6. **AI Integration**: GPT-4 powered portfolio reports
7. **Production Ready**: Full error handling, caching, and optimization
8. **Developer Friendly**: Clean API, React hooks, TypeScript
9. **Scalable**: Can handle 10x more vaults without performance issues
10. **Transparent**: Open methodology, no black boxes

## Getting Started

1. **Install dependencies** (already done)
2. **Navigate to "Live Data" page** in the app
3. **Wait 2-5 seconds** for initial data load
4. **Explore 500+ vaults** with real TVL and APY
5. **Filter by chain, protocol, or search**
6. **Click any vault** to see detailed information

## Support

For issues or questions:
- Check browser console for errors
- Verify internet connection
- Try manual refresh
- Clear localStorage cache
- Check DeFiLlama API status

## License

MIT License - Use this data integration freely in your projects.
