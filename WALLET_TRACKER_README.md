# Onchain Wallet Tracker - Web3 RPC Integration

## Overview

The Onchain Wallet Tracker is a trustless, real-time wallet monitoring system that uses direct Web3 RPC calls to query blockchain data. Unlike third-party APIs, this approach provides verifiable, censorship-resistant access to wallet positions across multiple EVM-compatible chains.

## Key Features

### 🔗 Direct RPC Integration
- **No API Dependencies**: Queries blockchain nodes directly via JSON-RPC
- **Multi-Chain Support**: Ethereum, Arbitrum, Base, Optimism, Polygon, BNB Chain
- **Public RPC Endpoints**: Uses LlamaRPC public endpoints (no authentication required)

### 💰 Position Tracking
- **Native Balance**: ETH/MATIC/BNB balance queries via `eth_getBalance`
- **ERC20 Tokens**: Standard token balance queries with metadata (symbol, name, decimals)
- **ERC4626 Vaults**: Vault share balances with underlying asset detection
- **Batch Scanning**: Efficient parallel queries for multiple assets

### 🗄️ Persistent Storage
- **Wallet Lists**: Track multiple wallets with persistent storage via `useKV`
- **Cached Data**: Store fetched balances locally to reduce RPC calls
- **Refresh on Demand**: Manual refresh button to update positions

## Architecture

### Web3 RPC Library (`src/lib/web3Rpc.ts`)

Core functions for blockchain interaction:

#### Balance Queries
```typescript
// Get native ETH balance
getEthBalance(address: string, chain: Chain): Promise<string>

// Get ERC20 token balance
getTokenBalance(tokenAddress: string, walletAddress: string, chain: Chain): Promise<string>

// Get token metadata + balance in one call
getTokenBalanceWithMetadata(tokenAddress: string, walletAddress: string, chain: Chain): Promise<TokenBalance>
```

#### Vault Position Queries
```typescript
// Get vault shares for a wallet
getVaultShares(vaultAddress: string, walletAddress: string, chain: Chain): Promise<string>

// Get underlying asset address (ERC4626)
getVaultAsset(vaultAddress: string, chain: Chain): Promise<string>

// Get full vault position data
getVaultPosition(vaultAddress: string, walletAddress: string, chain: Chain): Promise<VaultPosition | null>

// Scan multiple vaults in parallel
scanWalletForVaults(walletAddress: string, vaultAddresses: string[], chain: Chain): Promise<VaultPosition[]>
```

#### Utility Functions
```typescript
// Validate Ethereum address format
isValidAddress(address: string): boolean

// Format address for display (0x1234...5678)
formatAddress(address: string): string

// Format balance with decimals
formatBalance(balance: string, decimals: number): string
```

### RPC Method Reference

#### `eth_getBalance`
Retrieves native token balance (ETH, MATIC, BNB) for an address.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "latest"],
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x8ac7230489e80000"
}
```

#### `eth_call` - ERC20 balanceOf
Retrieves token balance for an address.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [
    {
      "to": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "data": "0x70a08231000000000000000000000000742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    },
    "latest"
  ],
  "id": 2
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": "0x00000000000000000000000000000000000000000000000000000002540be400"
}
```

#### ABI Method Selectors

The library uses these Ethereum function selectors:

```typescript
// ERC20
ERC20_BALANCE_OF = '0x70a08231'  // balanceOf(address)
ERC20_DECIMALS   = '0x313ce567'  // decimals()
ERC20_SYMBOL     = '0x95d89b41'  // symbol()
ERC20_NAME       = '0x06fdde03'  // name()

// ERC4626
ERC4626_BALANCE_OF    = '0x70a08231'  // balanceOf(address)
ERC4626_ASSET         = '0x38d52e0f'  // asset()
ERC4626_TOTAL_ASSETS  = '0x01e1d114'  // totalAssets()
ERC4626_TOTAL_SUPPLY  = '0x18160ddd'  // totalSupply()
```

### UI Component (`src/components/WalletTracker.tsx`)

React component with three main sections:

#### 1. Wallet Input
- Address validation (checksummed Ethereum address format)
- Chain selector dropdown
- "Track Wallet" button triggers RPC scan

#### 2. Tracked Wallets List
- Displays all tracked wallet addresses
- Shows last update timestamp
- Copy, refresh, and remove actions

#### 3. Position Tabs
Each tracked wallet has three tabs:
- **Overview**: Summary metrics (native balance, token count, vault count)
- **Tokens**: Detailed ERC20 token holdings with symbols and balances
- **Vaults**: ERC4626 vault positions with share amounts and underlying assets

## Data Flow

```
User Input (Address + Chain)
    ↓
Address Validation
    ↓
RPC Queries (Parallel)
    ├─→ eth_getBalance (native token)
    ├─→ eth_call → balanceOf (each ERC20)
    └─→ eth_call → balanceOf (each vault)
    ↓
Format & Cache Results
    ↓
Persist to useKV Storage
    ↓
Display in UI Tabs
```

## Configuration

### Supported Chains

```typescript
const RPC_ENDPOINTS: Record<Chain, string> = {
  ethereum: 'https://eth.llamarpc.com',
  arbitrum: 'https://arbitrum.llamarpc.com',
  base: 'https://base.llamarpc.com',
  optimism: 'https://optimism.llamarpc.com',
  polygon: 'https://polygon.llamarpc.com',
  bsc: 'https://binance.llamarpc.com',
};
```

### Common Token Addresses

Pre-configured token lists for each chain (USDC, USDT, DAI, WBTC):

```typescript
const COMMON_TOKENS: Record<Chain, { address: string; symbol: string }[]> = {
  ethereum: [
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
    // ...
  ],
  // ... other chains
};
```

## Storage Schema

### KV Store Keys

**`tracked-wallets`** - Array of wallet addresses
```json
["0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"]
```

**`wallet-data-cache`** - Wallet balance data
```json
{
  "0x47ac0...": {
    "address": "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
    "ethBalance": "0x8ac7230489e80000",
    "ethBalanceFormatted": "10.0",
    "tokenBalances": [...],
    "vaultPositions": [],
    "lastUpdated": 1710500000000
  }
}
```

**`vault-positions-cache`** - Vault share data
```json
{
  "0x47ac0...": [
    {
      "vaultAddress": "0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c",
      "vaultName": "Aave V3 USDC",
      "protocol": "Aave",
      "chain": "ethereum",
      "shares": "0x00000000000000000000000000000000000000000000000000038d7ea4c68000",
      "sharesFormatted": "1000.0",
      "underlyingAsset": "USDC"
    }
  ]
}
```

## Performance Considerations

### Parallel RPC Calls
The library uses `Promise.all()` to query multiple tokens/vaults simultaneously:

```typescript
const positions = await Promise.all(
  vaultAddresses.map(vaultAddress =>
    getVaultPosition(vaultAddress, walletAddress, chain)
  )
);
```

### Caching Strategy
- Fetched data is stored in `useKV` for persistence
- Manual refresh required to update (prevents excessive RPC calls)
- Cache includes timestamp for staleness detection

### RPC Rate Limits
- Public endpoints may have rate limits (typically 10-30 RPS)
- Implement exponential backoff for production use
- Consider upgrading to dedicated RPC provider (Alchemy, Infura, QuickNode)

## Error Handling

### Address Validation
```typescript
if (!isValidAddress(address)) {
  setError('Invalid Ethereum address format');
  return;
}
```

### RPC Errors
```typescript
try {
  const data = await rpcCall(chain, method, params);
} catch (error) {
  console.error('RPC call failed:', error);
  toast.error('Failed to fetch wallet data');
}
```

### Null Position Filtering
Vaults with zero balance return `null` and are filtered:
```typescript
const positions = await Promise.all(...);
return positions.filter((p): p is VaultPosition => p !== null);
```

## Future Enhancements

### Historical Balance Tracking
- Store balance snapshots at intervals
- Display balance change over time
- Calculate PnL for vault positions

### Multi-Chain Aggregation
- Query same wallet across all chains simultaneously
- Aggregate total portfolio value
- Cross-chain position correlation

### Price Feed Integration
- Fetch USD prices from DEX oracles (Uniswap TWAP, Chainlink)
- Calculate position values in USD
- Display portfolio allocation charts

### Transaction History
- Query `eth_getLogs` for Transfer events
- Build transaction timeline
- Calculate realized PnL from deposits/withdrawals

### ERC4626 Share Value
- Calculate `convertToAssets(shares)` for accurate position value
- Display APY earned since deposit
- Track vault performance over time

### Advanced Token Detection
- Scan all Transfer events to discover unknown tokens
- Use token list registries (Uniswap, CoinGecko)
- Automatic NFT detection (ERC721/ERC1155)

## Security Notes

⚠️ **Important Considerations:**

1. **Address Privacy**: Wallet addresses are public on blockchain, but tracking lists are stored locally
2. **RPC Trust**: Public RPC endpoints can see your queries (use dedicated RPC or local node for privacy)
3. **Input Validation**: Always validate addresses before querying to prevent malformed RPC calls
4. **No Private Keys**: This feature only reads blockchain data; it never handles private keys
5. **Phishing Risk**: Verify you're using legitimate RPC endpoints (HTTPS required)

## Integration with Yield Terminal

The Wallet Tracker integrates with existing vault data:

```typescript
// Scan wallet for positions in known vaults
const vaultAddresses = VAULTS
  .filter(v => v.chain === selectedChain)
  .map(v => v.vaultAddress);

const positions = await scanWalletForVaults(
  walletAddress,
  vaultAddresses,
  chain
);
```

This allows users to:
1. View vault details in the Vault Explorer
2. Track their positions in those vaults via Wallet Tracker
3. Monitor performance across their DeFi portfolio

## Testing

### Manual Testing Steps

1. **Add Valid Wallet**
   - Navigate to Wallet Tracker page
   - Enter address: `0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503`
   - Select chain: Ethereum
   - Click "Track Wallet"
   - Verify balance data loads

2. **View Positions**
   - Check Overview tab for summary metrics
   - Check Tokens tab for ERC20 holdings
   - Check Vaults tab for vault positions

3. **Refresh Data**
   - Click refresh icon
   - Verify loading state
   - Confirm updated timestamp

4. **Remove Wallet**
   - Click "Remove" button
   - Verify wallet disappears from list
   - Check KV storage cleared

### Example Wallet Addresses for Testing

- **Vitalik's Address**: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
- **Uniswap Router**: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`
- **Maker DAO Treasury**: `0x9759A6Ac90977b93B58547b4A71c78317f391A28`

## Troubleshooting

### "Failed to fetch wallet data"
- Check internet connection
- Verify RPC endpoint is reachable
- Try different chain (endpoint might be down)
- Check browser console for detailed error

### "Invalid Ethereum address format"
- Ensure address starts with `0x`
- Verify address is 42 characters (0x + 40 hex)
- Remove any spaces or special characters

### Positions not showing
- Wallet may have no holdings on selected chain
- Try refreshing data (RPC might have returned stale data)
- Verify vault addresses in VAULTS array are correct
- Check that vaults support ERC4626 standard

### Slow loading
- Public RPC endpoints can be slow during high traffic
- Consider rate limiting (batch requests with delays)
- Upgrade to paid RPC provider for better performance

## Resources

- [Ethereum JSON-RPC Specification](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- [ERC20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
- [ERC4626 Vault Standard](https://eips.ethereum.org/EIPS/eip-4626)
- [LlamaNodes Public RPC](https://llamanodes.com/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)

---

**Built with**: Direct RPC calls • No external dependencies • Trustless verification • Open source

**Supported by**: Yield Terminal institutional DeFi intelligence platform
