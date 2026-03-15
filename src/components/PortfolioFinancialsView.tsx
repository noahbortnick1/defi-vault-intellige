import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChartBar, 
  TrendUp, 
  CurrencyDollar,
  FileText,
  Warning
} from '@phosphor-icons/react';
import { formatCurrency, formatPercent } from '@/lib/format';
import { financialApi } from '@/lib/financialApi';
import type { PortfolioFinancials } from '@/lib/types';

interface PortfolioFinancialsViewProps {
  portfolioId: string;
  portfolioName: string;
}

export function PortfolioFinancialsView({ portfolioId, portfolioName }: PortfolioFinancialsViewProps) {
  const [financials, setFinancials] = useState<PortfolioFinancials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinancials = async () => {
      setLoading(true);
      const data = await financialApi.getPortfolioFinancials(portfolioId);
      setFinancials(data);
      setLoading(false);
    };
    loadFinancials();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading financial summary...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!financials) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Financial data not available for this portfolio.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { summary, incomeBySource, exposure, positions } = financials;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Treasury Financial Summary</h2>
          <p className="text-muted-foreground">
            Institutional-style financial reporting for {portfolioName}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Warning className="mr-1" size={14} />
          GAAP-Style Format
        </Badge>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">
            <ChartBar className="mr-2" size={16} />
            Summary
          </TabsTrigger>
          <TabsTrigger value="income">
            <TrendUp className="mr-2" size={16} />
            Income
          </TabsTrigger>
          <TabsTrigger value="exposure">
            <CurrencyDollar className="mr-2" size={16} />
            Exposure
          </TabsTrigger>
          <TabsTrigger value="positions">
            <FileText className="mr-2" size={16} />
            Positions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar size={24} className="text-accent" />
                Treasury Balance Sheet
              </CardTitle>
              <CardDescription>
                Consolidated position as of {summary.asOfDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Total Assets</span>
                    <span className="font-mono font-semibold text-lg">{formatCurrency(summary.totalAssets)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Total Liabilities</span>
                    <span className="font-mono text-destructive">({formatCurrency(summary.totalLiabilities)})</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Net Assets</span>
                    <span className="font-mono font-bold text-2xl text-accent">{formatCurrency(summary.netAssets)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-500/20 bg-green-500/5">
                    <CardHeader>
                      <CardTitle className="text-base">Realized Gains</CardTitle>
                      <CardDescription>Locked-in profits from closed positions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold font-mono text-green-500">
                        +{formatCurrency(summary.realizedGains)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/20 bg-accent/5">
                    <CardHeader>
                      <CardTitle className="text-base">Unrealized Gains</CardTitle>
                      <CardDescription>Mark-to-market on current positions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold font-mono text-accent">
                        +{formatCurrency(summary.unrealizedGains)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-accent/30 bg-accent/10">
                  <CardContent className="py-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-lg text-accent mb-1">Total Gains</h4>
                        <p className="text-sm text-muted-foreground">Realized + Unrealized</p>
                      </div>
                      <span className="font-mono font-bold text-3xl text-accent">
                        +{formatCurrency(summary.realizedGains + summary.unrealizedGains)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={24} className="text-accent" />
                Income by Source
              </CardTitle>
              <CardDescription>
                Revenue breakdown across yield sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {Object.entries(incomeBySource).map(([source, amount]) => {
                  const totalIncome = Object.values(incomeBySource).reduce((a, b) => a + b, 0);
                  const percentage = (amount / totalIncome) * 100;
                  return (
                    <div key={source} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{source}</span>
                        <div className="text-right">
                          <span className="font-mono font-semibold mr-3">{formatCurrency(amount)}</span>
                          <span className="text-sm text-muted-foreground">{formatPercent(percentage / 100)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <Card className="border-accent/30 bg-accent/10">
                <CardContent className="py-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg text-accent">Total Income (MTD)</h4>
                    <span className="font-mono font-bold text-2xl text-accent">
                      {formatCurrency(Object.values(incomeBySource).reduce((a, b) => a + b, 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exposure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Asset Exposure</CardTitle>
                <CardDescription>Allocation by underlying asset</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(exposure.byAsset).map(([asset, amount]) => {
                  const total = Object.values(exposure.byAsset).reduce((a, b) => a + b, 0);
                  const percentage = (amount / total) * 100;
                  return (
                    <div key={asset} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{asset}</span>
                        <span className="font-mono">{formatPercent(percentage / 100)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Protocol Exposure</CardTitle>
                <CardDescription>Allocation by protocol</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(exposure.byProtocol).map(([protocol, amount]) => {
                  const total = Object.values(exposure.byProtocol).reduce((a, b) => a + b, 0);
                  const percentage = (amount / total) * 100;
                  return (
                    <div key={protocol} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{protocol}</span>
                        <span className="font-mono">{formatPercent(percentage / 100)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Strategy Exposure</CardTitle>
                <CardDescription>Allocation by strategy type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(exposure.byStrategy).map(([strategy, amount]) => {
                  const total = Object.values(exposure.byStrategy).reduce((a, b) => a + b, 0);
                  const percentage = (amount / total) * 100;
                  return (
                    <div key={strategy} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{strategy}</span>
                        <span className="font-mono">{formatPercent(percentage / 100)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chain Exposure</CardTitle>
                <CardDescription>Allocation by blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(exposure.byChain).map(([chain, amount]) => {
                  const total = Object.values(exposure.byChain).reduce((a, b) => a + b, 0);
                  const percentage = (amount / total) * 100;
                  return (
                    <div key={chain} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{chain}</span>
                        <span className="font-mono">{formatPercent(percentage / 100)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={24} className="text-accent" />
                Position Statement
              </CardTitle>
              <CardDescription>
                Individual positions with cost basis and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map((position, idx) => (
                  <Card key={idx} className="border-muted">
                    <CardContent className="py-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{position.vault}</h4>
                            <p className="text-sm text-muted-foreground">Cost Basis: {formatCurrency(position.cost)}</p>
                          </div>
                          <Badge variant={position.unrealizedGain >= 0 ? "default" : "destructive"}>
                            {position.unrealizedGain >= 0 ? '+' : ''}{formatPercent(position.unrealizedGain / position.cost)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Market Value</p>
                            <p className="font-mono font-semibold">{formatCurrency(position.marketValue)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Unrealized Gain</p>
                            <p className={`font-mono font-semibold ${position.unrealizedGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {position.unrealizedGain >= 0 ? '+' : ''}{formatCurrency(position.unrealizedGain)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Yield to Date</p>
                            <p className="font-mono font-semibold text-accent">
                              +{formatCurrency(position.yieldToDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              <Card className="border-accent/30 bg-accent/10">
                <CardContent className="py-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
                      <p className="font-mono font-bold text-lg">
                        {formatCurrency(positions.reduce((sum, p) => sum + p.cost, 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Market Value</p>
                      <p className="font-mono font-bold text-lg text-accent">
                        {formatCurrency(positions.reduce((sum, p) => sum + p.marketValue, 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Yield</p>
                      <p className="font-mono font-bold text-lg text-accent">
                        +{formatCurrency(positions.reduce((sum, p) => sum + p.yieldToDate, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Warning size={20} className="text-yellow-500" />
                Important Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                These financial statements are presented in a GAAP-style format for institutional analysis and comparability. 
                They are not audited financial statements and should not be considered GAAP-compliant or equivalent to 
                traditional financial reporting.
              </p>
              <p>
                Position valuations, cost basis calculations, and gain/loss recognition may differ from traditional accounting 
                standards. These statements are intended for informational purposes to support treasury management and allocation decisions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
