import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TrendUp,
  TrendDown,
  Download,
  Briefcase,
  ShieldWarning,
  MagnifyingGlass,
  Warning,
  ChartBar,
  Coins,
  Network,
} from '@phosphor-icons/react';
import {
  portfolioApi,
  DEMO_WALLETS,
  type PositionsApiResponse,
  type ExposureApiResponse,
  type SummaryApiResponse,
} from '@/lib/portfolioApi';
import { formatCurrency, formatPercent, getChainName } from '@/lib/format';

interface PortfolioApiViewProps {
  renderNav: () => React.ReactNode;
}

export function PortfolioApiView({ renderNav }: PortfolioApiViewProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [inputWallet, setInputWallet] = useState('');
  const [positions, setPositions] = useState<PositionsApiResponse | null>(null);
  const [exposure, setExposure] = useState<ExposureApiResponse | null>(null);
  const [summary, setSummary] = useState<SummaryApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = async (wallet: string) => {
    if (!wallet) return;

    setLoading(true);
    setError(null);

    try {
      const [positionsData, exposureData, summaryData] = await Promise.all([
        portfolioApi.getPositions(wallet),
        portfolioApi.getExposure(wallet),
        portfolioApi.getSummary(wallet),
      ]);

      setPositions(positionsData);
      setExposure(exposureData);
      setSummary(summaryData);
      setWalletAddress(wallet);
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio');
      setPositions(null);
      setExposure(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadPortfolio(inputWallet);
  };

  const loadDemoWallet = (address: string) => {
    setInputWallet(address);
    loadPortfolio(address);
  };

  useEffect(() => {
    loadDemoWallet(DEMO_WALLETS[0].address);
  }, []);

  const getRiskColor = (score: number) => {
    if (score <= 3.5) return 'text-green-400';
    if (score <= 6.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Portfolio Analytics</h2>
            <p className="text-muted-foreground">
              Real-time portfolio tracking powered by API endpoints
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wallet Address</CardTitle>
              <CardDescription>Enter a wallet address or select a demo portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="0x..."
                  value={inputWallet}
                  onChange={(e) => setInputWallet(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  <MagnifyingGlass className="mr-2" size={18} />
                  {loading ? 'Loading...' : 'Search'}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {DEMO_WALLETS.map((demo) => (
                  <Button
                    key={demo.address}
                    variant={walletAddress === demo.address ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => loadDemoWallet(demo.address)}
                  >
                    {demo.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <Warning className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          )}

          {!loading && summary && (
            <>
              <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-background">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={24} className="text-accent" />
                    <CardTitle className="text-2xl">Portfolio Overview</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-caption text-muted-foreground mb-2">Total Value</p>
                      <p className="text-metric text-foreground text-3xl">
                        {formatCurrency(summary.summary.total_value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground mb-2">24H Change</p>
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-metric text-3xl ${
                            summary.summary.daily_change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {summary.summary.daily_change >= 0 ? '+' : ''}
                          {formatCurrency(summary.summary.daily_change, 0)}
                        </p>
                        {summary.summary.daily_change >= 0 ? (
                          <TrendUp size={24} className="text-green-400" weight="bold" />
                        ) : (
                          <TrendDown size={24} className="text-red-400" weight="bold" />
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          summary.summary.daily_change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {summary.summary.daily_change >= 0 ? '+' : ''}
                        {formatPercent(summary.summary.daily_change_percent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground mb-2">Total Yield</p>
                      <p className="text-metric text-accent text-3xl">
                        {formatCurrency(summary.summary.total_yield_earned)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPercent(summary.summary.yield_rate_30d)} 30d rate
                      </p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground mb-2">Risk Score</p>
                      <p className={`text-metric text-3xl ${getRiskColor(summary.summary.avg_risk_score)}`}>
                        {summary.summary.avg_risk_score.toFixed(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {summary.summary.protocol_count} protocols
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {positions && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Positions</CardTitle>
                        <CardDescription>{positions.total_positions} active vault positions</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2" size={16} />
                        Export CSV
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Vault</TableHead>
                            <TableHead>Protocol</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead>Chain</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead className="text-right">APY</TableHead>
                            <TableHead className="text-right">PnL</TableHead>
                            <TableHead className="text-right">Share</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {positions.positions.map((position) => (
                            <TableRow key={position.id}>
                              <TableCell className="font-medium">{position.vault_name}</TableCell>
                              <TableCell>{position.protocol}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{position.asset}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{getChainName(position.chain as any)}</Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {formatCurrency(position.value)}
                              </TableCell>
                              <TableCell className="text-right text-accent">
                                {formatPercent(position.apy)}
                              </TableCell>
                              <TableCell
                                className={`text-right font-mono ${
                                  position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}
                              >
                                {position.pnl >= 0 ? '+' : ''}
                                {formatCurrency(position.pnl, 0)}
                                <span className="text-xs ml-1">
                                  ({position.pnl >= 0 ? '+' : ''}
                                  {formatPercent(position.pnl_percent)})
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatPercent(position.share_of_portfolio)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {exposure && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <ChartBar size={20} className="text-accent" />
                        <CardTitle>Protocol Exposure</CardTitle>
                      </div>
                      <CardDescription>Distribution across DeFi protocols</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {exposure.protocol_exposure.map((protocol) => (
                          <div key={protocol.protocol}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{protocol.protocol}</span>
                              <span className="text-sm text-muted-foreground">
                                {formatPercent(protocol.percentage)}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${protocol.percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {protocol.vaults} vaults
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatCurrency(protocol.value)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Coins size={20} className="text-accent" />
                        <CardTitle>Asset Breakdown</CardTitle>
                      </div>
                      <CardDescription>Portfolio composition by asset</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {exposure.asset_breakdown.map((asset) => (
                          <div key={asset.asset}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{asset.asset}</span>
                              <span className="text-sm text-muted-foreground">
                                {formatPercent(asset.percentage)}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${asset.percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {Object.keys(asset.chains).length} chains
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatCurrency(asset.value)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Network size={20} className="text-accent" />
                        <CardTitle>Chain Distribution</CardTitle>
                      </div>
                      <CardDescription>Assets across blockchains</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {exposure.chain_exposure.map((chain) => (
                          <div key={chain.chain}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium capitalize">{chain.chain}</span>
                              <span className="text-sm text-muted-foreground">
                                {formatPercent(chain.percentage)}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: `${chain.percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {chain.positions} positions
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatCurrency(chain.value)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <ShieldWarning size={20} className="text-accent" />
                        <CardTitle>Risk Metrics</CardTitle>
                      </div>
                      <CardDescription>Portfolio risk analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Overall Risk</span>
                          <span className={`text-sm font-semibold ${getRiskColor(summary.risk_metrics.overall_risk)}`}>
                            {summary.risk_metrics.overall_risk.toFixed(2)}/10
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Risk-Adjusted Return</span>
                          <span className="text-sm font-semibold text-accent">
                            {summary.risk_metrics.risk_adjusted_return.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Concentration Risk</span>
                          <span className="text-sm font-semibold">
                            {summary.risk_metrics.concentration_risk.toFixed(2)}/10
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Liquidity Risk</span>
                          <span className="text-sm font-semibold">
                            {summary.risk_metrics.liquidity_risk.toFixed(2)}/10
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Protocol Risk</span>
                          <span className="text-sm font-semibold">
                            {summary.risk_metrics.protocol_risk.toFixed(2)}/10
                          </span>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Performance</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">7d</p>
                              <p className="text-sm font-semibold text-green-400">
                                +{formatPercent(summary.performance_7d)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">30d</p>
                              <p className="text-sm font-semibold text-green-400">
                                +{formatPercent(summary.performance_30d)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">90d</p>
                              <p className="text-sm font-semibold text-green-400">
                                +{formatPercent(summary.performance_90d)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
