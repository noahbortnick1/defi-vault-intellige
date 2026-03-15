# Blockchain & Wallet Access

Yield Terminal now includes comprehensive blockchain and wallet connectivity, allowing users to:

- **Connect MetaMask** for live wallet tracking
- **Track any wallet address** manually without connection
- **Read real-time onchain data** from multiple chains
- **Scan for vault positions** automatically across protocols
- **Monitor token balances** and DeFi positions live

## Features

### 1. Wallet Connection

#### MetaMask Integration
- One-click connection to MetaMask browser extension
- Automatic account and network detection
- Real-time updates when switching accounts or networks
- Support for all major EVM chains (Ethereum, Arbitrum, Base, Optimism, Polygon, BSC)

#### Manual Address Tracking
- Track any Ethereum address without wallet connection
- View-only mode for portfolio monitoring
- Perfect for institutional treasury tracking

### 2. Live Blockchain Data

The platform reads live data directly from blockchain RPC endpoints:

- **Token Balances**: ERC20 token balances with metadata
- **Vault Positions**: ERC4626 vault shares and underlying assets
- **ETH Balance**: Native token balance
- **Multi-chain Support**: Query across 6+ chains

### 3. Portfolio Analytics

Combined onchain and aggregated data views:

- **Demo Portfolios**: Pre-configured institutional portfolios (DAO, Hedge Fund, Family Office)
- **Live Wallet Data**: Real-time onchain positions
- **Exposure Analysis**: Asset, protocol, and chain breakdowns
- **Risk Scoring**: Portfolio-level risk assessment

## Architecture

### Wallet Connection Hook

`useWalletConnect()` - React hook for managing wallet state

```typescript
const {
  connection,        // Current connection status and address
  isConnecting,      // Loading state
  error,             // Error messages
  connectMetaMask,   // Connect MetaMask
  connectManual,     // Add manual address
  switchChain,       // Switch to different chain
  disconnect,        // Disconnect wallet
  getChainName,      // Convert chainId to chain name
} = useWalletConnect();
```

### Web3 RPC Functions

Direct blockchain interaction utilities in `src/lib/web3Rpc.ts`:

```typescript
// Balance queries
await getEthBalance(address, chain)
await getTokenBalance(tokenAddress, walletAddress, chain)
await getTokenBalanceWithMetadata(tokenAddress, walletAddress, chain)

// ERC4626 Vault queries
await getVaultShares(vaultAddress, walletAddress, chain)
await getVaultAsset(vaultAddress, chain)
await getVaultTotalAssets(vaultAddress, chain)
await getVaultPosition(vaultAddress, walletAddress, chain)

// Wallet scanning
await scanWalletForVaults(walletAddress, vaultAddresses, chain)
await getWalletData(address, chains, knownTokens)
```

### Components

#### `<WalletConnect />`
Dialog-based wallet connection component with:
- MetaMask connection flow
- Manual address input
- Connected wallet display
- Chain switcher
- Disconnect button

#### `<PortfolioWithWallet />`
Full portfolio analytics page with:
- Wallet connection integration
- Demo portfolio selector
- Live onchain data tab
- Token balance display
- Vault position scanner
- Exposure charts

## Supported Chains

| Chain | Chain ID | RPC Endpoint |
|-------|----------|--------------|
| Ethereum | 1 | LlamaRPC |
| Arbitrum | 42161 | LlamaRPC |
| Base | 8453 | LlamaRPC |
| Optimism | 10 | LlamaRPC |
| Polygon | 137 | LlamaRPC |
| BSC | 56 | LlamaRPC |

## Usage Examples

### Basic Wallet Connection

```typescript
import { WalletConnect } from '@/components/WalletConnect';

function MyComponent() {
  const handleConnect = (address: string) => {
    console.log('Connected:', address);
  };

  return (
    <WalletConnect 
      onConnect={handleConnect}
      onDisconnect={() => console.log('Disconnected')}
    />
  );
}
```

### Reading Token Balances

```typescript
import { getTokenBalanceWithMetadata } from '@/lib/web3Rpc';

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const walletAddress = '0x...';

const balance = await getTokenBalanceWithMetadata(
  USDC_ADDRESS,
  walletAddress,
  'ethereum'
);

console.log(`${balance.balanceFormatted} ${balance.symbol}`);
```

### Scanning for Vault Positions

```typescript
import { scanWalletForVaults } from '@/lib/web3Rpc';
import { VAULTS } from '@/lib/mockData';

const walletAddress = '0x...';
const vaultAddresses = VAULTS
  .filter(v => v.chain === 'ethereum')
  .map(v => v.vaultAddress);

const positions = await scanWalletForVaults(
  walletAddress,
  vaultAddresses,
  'ethereum'
);

console.log(`Found ${positions.length} vault positions`);
```

## Technical Details

### RPC Configuration

The platform uses public RPC endpoints via LlamaRPC:
- No API keys required for basic usage
- Rate limits apply to public endpoints
- Fallback to custom RPC endpoints supported

### State Management

Wallet connection state is persisted using the Spark KV store:
- Connection survives page refreshes
- Automatically reconnects on load
- Listeners update state on account/network changes

### Error Handling

Comprehensive error handling for:
- Missing MetaMask installation
- User rejection of connection
- Invalid addresses
- Network switching failures
- RPC call failures

## Security Considerations

1. **View-Only Access**: The platform never requests transaction signing
2. **No Private Keys**: Wallet connection uses standard Web3 provider pattern
3. **Public Data**: Only reads public blockchain data
4. **Address Validation**: All addresses validated before RPC calls
5. **No Backend Storage**: Wallet addresses stored locally only

## Future Enhancements

Planned features for future iterations:

- [ ] WalletConnect v2 integration
- [ ] Coinbase Wallet support
- [ ] Hardware wallet support (Ledger, Trezor)
- [ ] Multi-wallet tracking
- [ ] Historical balance snapshots
- [ ] Transaction history parsing
- [ ] ENS domain resolution
- [ ] Solana wallet support
- [ ] Custom RPC endpoint configuration
- [ ] Batch balance queries optimization

## Navigation

The wallet-enabled portfolio can be accessed:
- Click **Portfolio** in the main navigation
- Page automatically shows demo portfolios
- Click **Connect Wallet** to use MetaMask
- Or manually enter any address to track

## Integration with Other Features

### Rankings Integration
- Filter vaults based on wallet holdings
- "Show only my vaults" filter coming soon

### Report Generation
- Generate portfolio reports for connected wallets
- Include live onchain data in DD reports

### Yield Radar
- Subscribe to alerts for wallet positions
- Get notified of vault APY changes

## Troubleshooting

### MetaMask not detected
- Ensure MetaMask extension is installed
- Refresh the page after installation
- Check browser console for errors

### RPC calls failing
- Check network connectivity
- Public RPCs may have rate limits
- Try refreshing after a few seconds

### Positions not showing
- Ensure you're on the correct network
- Vault may not be ERC4626 compliant
- Some protocols use non-standard interfaces

## Documentation Links

- [Web3 RPC Documentation](https://github.com/ethereum/execution-apis)
- [ERC4626 Standard](https://eips.ethereum.org/EIPS/eip-4626)
- [MetaMask Docs](https://docs.metamask.io/)
- [LlamaRPC](https://llamanodes.com/)
