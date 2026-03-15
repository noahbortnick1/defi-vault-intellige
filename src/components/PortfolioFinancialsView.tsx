import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { PortfolioFinancials } from '@/lib/types';
import {
  FileText,
  ChartPie,
  TrendUp,
  Warning,
  CheckCircle,
  CurrencyDollar,
  Sparkle,
} from '@phosphor-icons/react';

interface PortfolioFinancialsViewProps {
  financials: PortfolioFinancials;
  portfolioName: string;
}

export function PortfolioFinancialsView({ financials, portfolioName }: PortfolioFinancialsViewProps) {
  const { summary, balanceSheet, exposure, concentrationRisks, recommendations } = financials;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText size={24} className="text-primary" weight="duotone" />
                Portfolio Financial Report
              </CardTitle>
              <CardDescription>Institutional treasury analytics for {portfolioName}</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Generated {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkle size={20} className="text-accent" weight="fill" />
              Portfolio Summary
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">Total Value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">Positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.positionCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">Est. Risk Score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{summary.estimatedRiskScore.toFixed(1)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">30D Yield</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {summary.yieldGenerated30d ? formatPercent(summary.yieldGenerated30d) : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Largest Asset</span>
                <span className="font-semibold">{summary.largestAsset}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Largest Protocol</span>
                <span className="font-semibold">{summary.largestProtocol}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Largest Chain</span>
                <span className="font-semibold">{summary.largestChain}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CurrencyDollar size={20} className="text-accent" weight="fill" />
              Balance Sheet
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3">Assets</h4>
                <div className="space-y-2 pl-4">
                  {balanceSheet.assets.map((asset, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span className="text-sm">{asset.label}</span>
                      <span className="font-mono text-sm">{formatCurrency(asset.value)}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center py-1 font-semibold">
                    <span>Total Assets</span>
                    <span className="font-mono">{formatCurrency(balanceSheet.totalAssets)}</span>
                  </div>
                </div>
              </div>

              {balanceSheet.liabilities && balanceSheet.liabilities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">Liabilities</h4>
                  <div className="space-y-2 pl-4">
                    {balanceSheet.liabilities.map((liability, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1">
                        <span className="text-sm">{liability.label}</span>
                        <span className="font-mono text-sm">{formatCurrency(liability.value)}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center py-1 font-semibold">
                      <span>Total Liabilities</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.totalLiabilities || 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Net Assets</span>
                  <span className="font-mono text-accent">{formatCurrency(balanceSheet.netAssets)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ChartPie size={20} className="text-accent" weight="fill" />
              Exposure Analysis
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm mb-3">Asset Exposure</h4>
                <div className="space-y-2">
                  {exposure.assetExposure.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.asset}</span>
                        <span className="font-mono">{formatPercent(item.percentage * 100)}</span>
                      </div>
                      <Progress value={item.percentage * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3">Protocol Exposure</h4>
                <div className="space-y-2">
                  {exposure.protocolExposure.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.protocol}</span>
                        <span className="font-mono">{formatPercent(item.percentage * 100)}</span>
                      </div>
                      <Progress value={item.percentage * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {exposure.strategyExposure && exposure.strategyExposure.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-3">Strategy Allocation</h4>
                  <div className="space-y-2">
                    {exposure.strategyExposure.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{item.strategy.replace('_', ' ')}</span>
                          <span className="font-mono">{formatPercent(item.percentage * 100)}</span>
                        </div>
                        <Progress value={item.percentage * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {exposure.chainExposure && exposure.chainExposure.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-3">Chain Exposure</h4>
                  <div className="space-y-2">
                    {exposure.chainExposure.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.chain}</span>
                          <span className="font-mono">{formatPercent(item.percentage * 100)}</span>
                        </div>
                        <Progress value={item.percentage * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {concentrationRisks && concentrationRisks.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Warning size={20} className="text-amber-500" weight="fill" />
                  Concentration Risks
                </h3>
                
                <div className="space-y-3">
                  {concentrationRisks.map((risk, idx) => (
                    <Alert key={idx} className="border-amber-500/30 bg-amber-500/5">
                      <Warning className="h-4 w-4 text-amber-500" />
                      <AlertDescription className="text-sm">
                        {risk}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </>
          )}

          {recommendations && recommendations.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendUp size={20} className="text-green-500" weight="fill" />
                  Recommendations
                </h3>
                
                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <Alert key={idx} className="border-green-500/30 bg-green-500/5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-sm">
                        {rec}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
