import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendUp, TrendDown, Download, Briefcase, ShieldWarning } from '@phosphor-icons/react';
import { DEMO_PORTFOLIOS } from '@/lib/mockData';
import { formatCurrency, formatPercent, getRiskBgColor } from '@/lib/format';

interface PortfolioViewProps {
  portfolioId: string;
  onSelectPortfolio: (id: string) => void;
  renderNav: () => React.ReactNode;
}

export function PortfolioView({ portfolioId, onSelectPortfolio, renderNav }: PortfolioViewProps) {
  const portfolio = DEMO_PORTFOLIOS.find(p => p.id === portfolioId);

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background">
        {renderNav()}
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-muted-foreground">Portfolio not found</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Portfolio Analytics</h2>
              <p className="text-muted-foreground">
                Monitor treasury exposure and risk across DeFi protocols
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={portfolioId} onValueChange={onSelectPortfolio}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_PORTFOLIOS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2" size={16} />
                Export
              </Button>
            </div>
          </div>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-background">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={24} className="text-accent" />
                <CardTitle className="text-2xl">{portfolio.name}</CardTitle>
              </div>
              <Badge className="w-fit capitalize" variant="outline">
                {portfolio.ownerType.replace('-', ' ')}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-caption text-muted-foreground mb-2">Net Worth</p>
                  <p className="text-metric text-foreground text-3xl">{formatCurrency(portfolio.netWorth)}</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground mb-2">24H Change</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-metric text-3xl ${portfolio.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {portfolio.dailyChange >= 0 ? '+' : ''}{formatCurrency(portfolio.dailyChange, 0)}
                    </p>
                    {portfolio.dailyChange >= 0 ? (
                      <TrendUp size={24} className="text-green-400" weight="bold" />
                    ) : (
                      <TrendDown size={24} className="text-red-400" weight="bold" />
                    )}
                  </div>
                  <p className={`text-sm ${portfolio.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolio.dailyChange >= 0 ? '+' : ''}{formatPercent(portfolio.dailyChangePercent)}
                  </p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground mb-2">Total Yield</p>
                  <p className="text-metric text-accent text-3xl">{formatCurrency(portfolio.totalYield)}</p>
                  <p className="text-sm text-accent">+{formatPercent(portfolio.totalYieldPercent)} APY</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground mb-2">Portfolio Risk</p>
                  <p className={`text-metric text-3xl ${getRiskColor(portfolio.riskScore)}`}>
                    {portfolio.riskScore.toFixed(1)} / 10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {portfolio.riskScore <= 3.5 ? 'Conservative' : portfolio.riskScore <= 6 ? 'Moderate' : 'Aggressive'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Positions ({portfolio.positions.length})</CardTitle>
                <CardDescription>Active vault allocations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolio.positions.map((position) => (
                    <div key={position.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold">{position.vaultName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{position.protocol}</Badge>
                            <Badge variant="outline" className="text-xs">{position.asset}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatCurrency(position.value)}</p>
                          <p className="text-xs text-muted-foreground">{position.shareOfPortfolio.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">APY</p>
                          <p className="font-medium text-accent">{formatPercent(position.apy)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Yield Earned</p>
                          <p className="font-medium text-green-400">+{formatCurrency(position.yieldEarned, 0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Risk</p>
                          <p className={`font-medium ${getRiskColor(position.riskScore)}`}>
                            {position.riskScore.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exposure Analysis</CardTitle>
                <CardDescription>Portfolio concentration by dimension</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Asset Exposure</p>
                  </div>
                  <div className="space-y-2">
                    {portfolio.assetExposure.map((exposure) => (
                      <div key={exposure.asset} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{exposure.asset}</span>
                          <span className="font-medium">{exposure.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${exposure.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Protocol Exposure</p>
                  </div>
                  <div className="space-y-2">
                    {portfolio.protocolExposure.map((exposure) => (
                      <div key={exposure.protocol} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{exposure.protocol}</span>
                          <span className="font-medium">{exposure.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${exposure.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Strategy Exposure</p>
                  </div>
                  <div className="space-y-2">
                    {portfolio.strategyExposure.map((exposure) => (
                      <div key={exposure.strategy} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {exposure.strategy.replace('-', ' ')}
                          </span>
                          <span className="font-medium">{exposure.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${exposure.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Chain Exposure</p>
                  </div>
                  <div className="space-y-2">
                    {portfolio.chainExposure.map((exposure) => (
                      <div key={exposure.chain} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{exposure.chain}</span>
                          <span className="font-medium">{exposure.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${exposure.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Portfolio-level risk analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldWarning size={20} className="text-muted-foreground" />
                    <p className="font-medium">Concentration Risk</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {portfolio.protocolExposure[0].percentage > 50
                      ? `High concentration in ${portfolio.protocolExposure[0].protocol} (${portfolio.protocolExposure[0].percentage.toFixed(0)}%). Consider diversification.`
                      : 'Well diversified across protocols. No single protocol exceeds 50% exposure.'}
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldWarning size={20} className="text-muted-foreground" />
                    <p className="font-medium">Strategy Diversification</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {portfolio.strategyExposure.length === 1
                      ? `100% allocated to ${portfolio.strategyExposure[0].strategy} strategy. Consider diversifying strategies.`
                      : `Diversified across ${portfolio.strategyExposure.length} strategies. Balanced approach to yield generation.`}
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldWarning size={20} className="text-muted-foreground" />
                    <p className="font-medium">Chain Risk</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {portfolio.chainExposure.length === 1
                      ? `100% on ${portfolio.chainExposure[0].chain}. Consider multi-chain allocation to reduce smart contract risk.`
                      : `Multi-chain allocation across ${portfolio.chainExposure.length} networks reduces single-point failure risk.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
