import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet,
  MagnifyingGlass,
  Coins,
  Vault,
  ArrowClockwise,
  Warning,
  CheckCircle,
  Copy,
  CurrencyEth,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  getWalletData,
  getVaultPosition,
  isValidAddress,
  formatAddress,
  scanWalletForVaults,
  type WalletData,
  type VaultPosition,
  type TokenBalance,
} from '@/lib/web3Rpc';
import { VAULTS } from '@/lib/mockData';
import type { Chain } from '@/lib/types';

const CHAIN_NAMES: Record<Chain, string> = {
  ethereum: 'Ethereum',
  arbitrum: 'Arbitrum',
  base: 'Base',
  optimism: 'Optimism',
  polygon: 'Polygon',
  bsc: 'BNB Chain',
};

const COMMON_TOKENS: Record<Chain, { address: string; symbol: string }[]> = {
  ethereum: [
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC' },
  ],
  arbitrum: [
    { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC' },
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT' },
    { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', symbol: 'DAI' },
  ],
  base: [
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC' },
  ],
  optimism: [
    { address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', symbol: 'USDC' },
    { address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', symbol: 'USDT' },
    { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', symbol: 'DAI' },
  ],
  polygon: [
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC' },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT' },
    { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', symbol: 'DAI' },
  ],
  bsc: [
    { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC' },
    { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT' },
  ],
};

export function WalletTracker() {
  const [inputAddress, setInputAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState<Chain>('ethereum');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [trackedWallets, setTrackedWallets] = useKV<string[]>('tracked-wallets', []);
  const [walletDataCache, setWalletDataCache] = useKV<Record<string, WalletData>>('wallet-data-cache', {});
  const [vaultPositionsCache, setVaultPositionsCache] = useKV<Record<string, VaultPosition[]>>('vault-positions-cache', {});

  const safeTrackedWallets = trackedWallets || [];
  const safeWalletDataCache = walletDataCache || {};
  const safeVaultPositionsCache = vaultPositionsCache || {};

  const handleAddWallet = async () => {
    if (!inputAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    const normalizedAddress = inputAddress.trim().toLowerCase();
    
    if (!isValidAddress(normalizedAddress)) {
      setError('Invalid Ethereum address format');
      return;
    }

    if (safeTrackedWallets.includes(normalizedAddress)) {
      setError('Wallet already tracked');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokens = COMMON_TOKENS[selectedChain].map(t => ({
        address: t.address,
        chain: selectedChain,
      }));

      const walletData = await getWalletData(normalizedAddress, [selectedChain], tokens);

      const vaultAddresses = VAULTS
        .filter(v => v.chain === selectedChain)
        .map(v => v.vaultAddress);

      const vaultPositions = await scanWalletForVaults(
        normalizedAddress,
        vaultAddresses,
        selectedChain
      );

      setTrackedWallets(current => [...(current || []), normalizedAddress]);
      
      setWalletDataCache(current => ({
        ...(current || {}),
        [normalizedAddress]: walletData,
      }));

      setVaultPositionsCache(current => ({
        ...(current || {}),
        [normalizedAddress]: vaultPositions,
      }));

      toast.success('Wallet added successfully!');
      setInputAddress('');
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to fetch wallet data. Please try again.');
      toast.error('Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshWallet = async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const tokens = COMMON_TOKENS[selectedChain].map(t => ({
        address: t.address,
        chain: selectedChain,
      }));

      const walletData = await getWalletData(address, [selectedChain], tokens);

      const vaultAddresses = VAULTS
        .filter(v => v.chain === selectedChain)
        .map(v => v.vaultAddress);

      const vaultPositions = await scanWalletForVaults(
        address,
        vaultAddresses,
        selectedChain
      );

      setWalletDataCache(current => ({
        ...(current || {}),
        [address]: walletData,
      }));

      setVaultPositionsCache(current => ({
        ...(current || {}),
        [address]: vaultPositions,
      }));

      toast.success('Wallet data refreshed!');
    } catch (err) {
      console.error('Error refreshing wallet:', err);
      toast.error('Failed to refresh wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveWallet = (address: string) => {
    setTrackedWallets(current => 
      (current || []).filter(a => a !== address)
    );

    setWalletDataCache(current => {
      const updated = { ...(current || {}) };
      delete updated[address];
      return updated;
    });

    setVaultPositionsCache(current => {
      const updated = { ...(current || {}) };
      delete updated[address];
      return updated;
    });

    toast.success('Wallet removed');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet size={24} />
                Onchain Wallet Tracker
              </CardTitle>
              <CardDescription>
                Track real wallet positions via Web3 RPC across multiple chains
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              Live RPC Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="0x... (Ethereum address)"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWallet()}
              className="flex-1"
              id="wallet-address-input"
            />
            <Select value={selectedChain} onValueChange={(v) => setSelectedChain(v as Chain)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHAIN_NAMES).map(([chain, name]) => (
                  <SelectItem key={chain} value={chain}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddWallet} disabled={isLoading}>
              <MagnifyingGlass className="mr-2" size={18} />
              {isLoading ? 'Scanning...' : 'Track Wallet'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <Warning className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {safeTrackedWallets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet size={48} className="mx-auto mb-3 opacity-50" />
              <p>No wallets tracked yet</p>
              <p className="text-sm">Enter an address above to start tracking onchain positions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {safeTrackedWallets.map((address) => {
        const walletData = safeWalletDataCache[address];
        const vaultPositions = safeVaultPositionsCache[address] || [];

        return (
          <Card key={address}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Wallet size={20} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-mono">
                      {formatAddress(address)}
                    </CardTitle>
                    <CardDescription>
                      {CHAIN_NAMES[selectedChain]} · Last updated:{' '}
                      {walletData
                        ? new Date(walletData.lastUpdated).toLocaleTimeString()
                        : 'Never'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(address)}
                  >
                    <Copy size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRefreshWallet(address)}
                    disabled={isLoading}
                  >
                    <ArrowClockwise size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveWallet(address)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!walletData ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Loading wallet data...</p>
                </div>
              ) : (
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tokens">Tokens</TabsTrigger>
                    <TabsTrigger value="vaults">Vault Positions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <CurrencyEth size={16} />
                          <span className="text-sm">Native Balance</span>
                        </div>
                        <p className="text-2xl font-semibold">
                          {walletData.ethBalanceFormatted} ETH
                        </p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Coins size={16} />
                          <span className="text-sm">Token Holdings</span>
                        </div>
                        <p className="text-2xl font-semibold">
                          {walletData.tokenBalances.length} tokens
                        </p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Vault size={16} />
                          <span className="text-sm">Vault Positions</span>
                        </div>
                        <p className="text-2xl font-semibold">
                          {vaultPositions.length} vaults
                        </p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <CheckCircle size={16} />
                          <span className="text-sm">Data Source</span>
                        </div>
                        <p className="text-sm font-semibold text-accent">
                          Live RPC · {CHAIN_NAMES[selectedChain]}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tokens" className="space-y-3">
                    {walletData.tokenBalances.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Coins size={48} className="mx-auto mb-3 opacity-50" />
                        <p>No token balances found</p>
                      </div>
                    ) : (
                      walletData.tokenBalances.map((token, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{token.symbol}</p>
                            <p className="text-sm text-muted-foreground">{token.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{token.balanceFormatted}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {formatAddress(token.contractAddress)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="vaults" className="space-y-3">
                    {vaultPositions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Vault size={48} className="mx-auto mb-3 opacity-50" />
                        <p>No vault positions found</p>
                        <p className="text-sm">
                          This wallet has no deposits in tracked vaults on {CHAIN_NAMES[selectedChain]}
                        </p>
                      </div>
                    ) : (
                      vaultPositions.map((position, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-muted/50 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{position.vaultName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {position.protocol}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {CHAIN_NAMES[position.chain]}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{position.sharesFormatted} shares</p>
                              <p className="text-sm text-muted-foreground">
                                {position.underlyingAsset}
                              </p>
                            </div>
                          </div>
                          <Separator />
                          <p className="text-xs text-muted-foreground font-mono">
                            {position.vaultAddress}
                          </p>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
