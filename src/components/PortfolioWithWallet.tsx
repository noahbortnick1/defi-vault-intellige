import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet,
  Briefcase,
  TrendUp,
  TrendDown,
  ChartBar,
  Coins,
  Network,
  Sparkle,
  ArrowClockwise,
  Download,
  Warning,
} from '@phosphor-icons/react';
import { WalletConnect } from './WalletConnect';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { formatCurrency, formatPercent, getChainName } from '@/lib/format';
import {
  portfolioApi,
  DEMO_WALLETS,
  type PositionsApiResponse,
  type ExposureApiResponse,
  type SummaryApiResponse,
} from '@/lib/portfolioApi';
import {
  getWalletData,
  scanWalletForVaults,
  type WalletData,
  type VaultPosition,
} from '@/lib/web3Rpc';
import { VAULTS } from '@/lib/mockData';
import type { Chain } from '@/lib/types';
import { toast } from 'sonner';

interface PortfolioWithWalletProps {
  renderNav: () => React.ReactNode;
}

export function PortfolioWithWallet({ renderNav }: PortfolioWithWalletProps) {
  const { connection } = useWalletConnect();
  const [selectedView, setSelectedView] = useState<'connected' | 'demo'>('demo');
  const [selectedChain, setSelectedChain] = useState<Chain>('ethereum');
  
  const [positions, setPositions] = useState<PositionsApiResponse | null>(null);
  const [exposure, setExposure] = useState<ExposureApiResponse | null>(null);
  const [summary, setSummary] = useState<SummaryApiResponse | null>(null);
  
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [vaultPositions, setVaultPositions] = useState<VaultPosition[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadDemoPortfolio = async (wallet: string) => {
    setLoading(true);
    try {
      const [positionsData, exposureData, summaryData] = await Promise.all([
        portfolioApi.getPositions(wallet),
        portfolioApi.getExposure(wallet),
        portfolioApi.getSummary(wallet),
      ]);

      setPositions(positionsData);
      setExposure(exposureData);
      setSummary(summaryData);
    } catch (err) {
      toast.error('Failed to load demo portfolio');
    } finally {
      setLoading(false);
    }
  };

  const loadConnectedWallet = async (address: string) => {
    setRefreshing(true);
    try {
      const knownTokens = [
        { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', chain: 'ethereum' as Chain },
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', chain: 'ethereum' as Chain },
        { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', chain: 'ethereum' as Chain },
      ];

      const data = await getWalletData(address, [selectedChain], knownTokens);
      setWalletData(data);

      const vaultAddresses = VAULTS
        .filter(v => v.chain === selectedChain)
        .map(v => v.vaultAddress);

      const positions = await scanWalletForVaults(address, vaultAddresses, selectedChain);
      setVaultPositions(positions);

      toast.success('Wallet data refreshed');
    } catch (err) {
      toast.error('Failed to load wallet data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (connection?.isConnected && selectedView === 'connected') {
      loadConnectedWallet(connection.address);
    } else if (selectedView === 'demo') {
      loadDemoPortfolio(DEMO_WALLETS[0].address);
    }
  }, [connection, selectedView, selectedChain]);

  const handleConnect = (address: string) => {
    setSelectedView('connected');
    loadConnectedWallet(address);
  };

  const handleDisconnect = () => {
    setSelectedView('demo');
    setWalletData(null);
    setVaultPositions([]);
    loadDemoPortfolio(DEMO_WALLETS[0].address);
  };

  const getRiskColor = (score: number) => {
    if (score <= 3.5) return 'text-green-400';
    if (score <= 6.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio Analytics</h1>
            <p className="text-lg text-muted-foreground">
              Track wallet positions, analyze exposure, and monitor yield
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <WalletConnect 
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Demo Portfolios</CardTitle>
                    <CardDescription>Explore sample institutional portfolios</CardDescription>
                  </div>
                  {connection?.isConnected && (
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      Live Data
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DEMO_WALLETS.map((wallet) => (
                    <Button
                      key={wallet.address}
                      variant={selectedView === 'demo' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedView('demo');
                        loadDemoPortfolio(wallet.address);
                      }}
                    >
                      <Briefcase className="mr-2" size={16} />
                      {wallet.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <ChartBar className="mr-2" size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="positions">
              <Coins className="mr-2" size={16} />
              Positions
            </TabsTrigger>
            <TabsTrigger value="exposure">
              <Network className="mr-2" size={16} />
              Exposure
            </TabsTrigger>
            {connection?.isConnected && selectedView === 'connected' && (
              <TabsTrigger value="onchain">
                <Wallet className="mr-2" size={16} />
                Onchain Data
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  Loading portfolio data...
                </CardContent>
              </Card>
            ) : summary ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Total Value</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(summary.total_value)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Positions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.position_count}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Risk Score</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getRiskColor(summary.estimated_risk_score)}`}>
                        {summary.estimated_risk_score.toFixed(1)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Primary Asset</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.largest_asset}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">Largest Protocol</span>
                        <span className="font-semibold">{summary.largest_protocol}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">Largest Chain</span>
                        <span className="font-semibold">{getChainName(summary.largest_chain)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <Warning className="h-4 w-4" />
                <AlertDescription>
                  Connect a wallet or select a demo portfolio to view analytics
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="positions">
            {positions && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Positions</CardTitle>
                  <CardDescription>{positions.items.length} positions tracked</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {positions.items.map((position) => (
                      <div
                        key={position.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold">{position.protocol}</div>
                          <div className="text-sm text-muted-foreground">
                            {position.asset} · {getChainName(position.chain)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(position.value)}</div>
                          {position.pnl !== 0 && (
                            <div className={`text-sm flex items-center gap-1 ${position.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {position.pnl > 0 ? <TrendUp size={14} /> : <TrendDown size={14} />}
                              {formatCurrency(Math.abs(position.pnl))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="exposure">
            {exposure && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Exposure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {exposure.asset_exposure.map((item) => (
                        <div key={item.asset} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.asset}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatPercent(item.weight * 100)}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full transition-all"
                              style={{ width: `${item.weight * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Protocol Exposure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {exposure.protocol_exposure.map((item) => (
                        <div key={item.protocol} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.protocol}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatPercent(item.weight * 100)}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${item.weight * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {connection?.isConnected && selectedView === 'connected' && (
            <TabsContent value="onchain">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Live Blockchain Data</CardTitle>
                        <CardDescription>Real-time onchain balances and positions</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadConnectedWallet(connection.address)}
                        disabled={refreshing}
                      >
                        <ArrowClockwise className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={16} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {walletData && (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">ETH Balance</div>
                          <div className="text-xl font-bold">{walletData.ethBalanceFormatted} ETH</div>
                        </div>

                        {walletData.tokenBalances.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">Token Balances</h4>
                            <div className="space-y-2">
                              {walletData.tokenBalances.map((token) => (
                                <div
                                  key={token.contractAddress}
                                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                >
                                  <div>
                                    <div className="font-medium">{token.symbol}</div>
                                    <div className="text-xs text-muted-foreground">{token.name}</div>
                                  </div>
                                  <div className="text-right font-mono">
                                    {token.balanceFormatted}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {vaultPositions.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">Vault Positions</h4>
                            <div className="space-y-2">
                              {vaultPositions.map((position) => (
                                <div
                                  key={position.vaultAddress}
                                  className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-lg"
                                >
                                  <div>
                                    <div className="font-medium">{position.vaultName}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {position.protocol} · {position.underlyingAsset}
                                    </div>
                                  </div>
                                  <div className="text-right font-mono">
                                    {position.sharesFormatted} shares
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {walletData.tokenBalances.length === 0 && vaultPositions.length === 0 && (
                          <Alert>
                            <Warning className="h-4 w-4" />
                            <AlertDescription>
                              No token balances or vault positions found on {getChainName(selectedChain)}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
