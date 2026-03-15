import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChartLine, 
  TrendUp, 
  CurrencyDollar, 
  ArrowsDownUp,
  FileText,
  Warning
} from '@phosphor-icons/react';
import { formatCurrency, formatPercent } from '@/lib/format';
import { financialApi } from '@/lib/financialApi';
import type { VaultFinancials } from '@/lib/types';

interface VaultFinancialsViewProps {
  vaultId: string;
  vaultName: string;
}

export function VaultFinancialsView({ vaultId, vaultName }: VaultFinancialsViewProps) {
  const [financials, setFinancials] = useState<VaultFinancials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinancials = async () => {
      setLoading(true);
      const data = await financialApi.getVaultFinancials(vaultId);
      setFinancials(data);
      setLoading(false);
    };
    loadFinancials();
  }, [vaultId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading financial statements...
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
            Financial data not available for this vault.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { balanceSheet, incomeStatement, flowOfFunds, navHistory, positionNotes } = financials;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Financial Statements</h2>
          <p className="text-muted-foreground">
            Institutional-style financial reporting for {vaultName}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Warning className="mr-1" size={14} />
          GAAP-Style Format
        </Badge>
      </div>

      <Tabs defaultValue="balance-sheet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="balance-sheet">
            <ChartLine className="mr-2" size={16} />
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="income">
            <TrendUp className="mr-2" size={16} />
            Income Statement
          </TabsTrigger>
          <TabsTrigger value="flows">
            <ArrowsDownUp className="mr-2" size={16} />
            Flow of Funds
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="mr-2" size={16} />
            Position Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance-sheet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLine size={24} className="text-accent" />
                Vault Balance Sheet
              </CardTitle>
              <CardDescription>
                Snapshot of economic position as of {balanceSheet.asOfDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-foreground">Assets</h4>
                  <div className="space-y-2 ml-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Gross Assets</span>
                      <span className="font-mono font-semibold">{formatCurrency(balanceSheet.grossAssets)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Accrued Rewards Receivable</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.accruedRewards)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 font-semibold">
                      <span>Total Assets</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.grossAssets + balanceSheet.accruedRewards)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-foreground">Liabilities</h4>
                  <div className="space-y-2 ml-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Outstanding Liabilities</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.liabilities)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Fees Payable</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.accruedFees)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 font-semibold">
                      <span>Total Liabilities</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.liabilities + balanceSheet.accruedFees)}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                  <h4 className="font-semibold text-lg mb-3 text-accent">Net Assets (NAV)</h4>
                  <div className="space-y-2 ml-4">
                    <div className="flex justify-between items-center py-2 text-lg">
                      <span className="font-semibold">Net Asset Value</span>
                      <span className="font-mono font-bold text-accent">{formatCurrency(balanceSheet.netAssets)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 text-sm text-muted-foreground border-t border-accent/20 pt-2">
                      <span>Shares Outstanding</span>
                      <span className="font-mono">{balanceSheet.sharesOutstanding.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 text-sm">
                      <span className="font-semibold">NAV per Share</span>
                      <span className="font-mono font-bold">${balanceSheet.navPerShare.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NAV History (30 Days)</CardTitle>
              <CardDescription>Net Asset Value per share over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-1">
                {navHistory.slice(-30).map((point, idx) => {
                  const height = ((point.navPerShare - Math.min(...navHistory.map(p => p.navPerShare))) / 
                    (Math.max(...navHistory.map(p => p.navPerShare)) - Math.min(...navHistory.map(p => p.navPerShare)))) * 100;
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-accent/40 hover:bg-accent/60 transition-colors rounded-t"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`${point.date}: $${point.navPerShare.toFixed(4)}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{navHistory[0]?.date}</span>
                <span>{navHistory[navHistory.length - 1]?.date}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={24} className="text-accent" />
                Vault Income Statement
              </CardTitle>
              <CardDescription>
                Performance for period {incomeStatement.periodStart} to {incomeStatement.periodEnd}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-foreground">Revenue</h4>
                  <div className="space-y-2 ml-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Lending Income</span>
                      <span className="font-mono">{formatCurrency(incomeStatement.lendingIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Incentive Income</span>
                      <span className="font-mono">{formatCurrency(incomeStatement.incentiveIncome)}</span>
                    </div>
                    {incomeStatement.tradingFeeIncome > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Trading Fee Income</span>
                        <span className="font-mono">{formatCurrency(incomeStatement.tradingFeeIncome)}</span>
                      </div>
                    )}
                    {incomeStatement.stakingIncome > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Staking Income</span>
                        <span className="font-mono">{formatCurrency(incomeStatement.stakingIncome)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 font-semibold">
                      <span>Total Revenue</span>
                      <span className="font-mono">
                        {formatCurrency(
                          incomeStatement.lendingIncome + 
                          incomeStatement.incentiveIncome + 
                          incomeStatement.tradingFeeIncome + 
                          incomeStatement.stakingIncome
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-foreground">Expenses</h4>
                  <div className="space-y-2 ml-4">
                    {incomeStatement.borrowCost > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Borrow Costs</span>
                        <span className="font-mono text-destructive">({formatCurrency(incomeStatement.borrowCost)})</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Gas / Execution Costs</span>
                      <span className="font-mono text-destructive">({formatCurrency(incomeStatement.gasCost)})</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Management Fees</span>
                      <span className="font-mono text-destructive">({formatCurrency(incomeStatement.managementFees)})</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Performance Fees</span>
                      <span className="font-mono text-destructive">({formatCurrency(incomeStatement.performanceFees)})</span>
                    </div>
                    <div className="flex justify-between items-center py-2 font-semibold">
                      <span>Total Expenses</span>
                      <span className="font-mono text-destructive">
                        ({formatCurrency(
                          incomeStatement.borrowCost + 
                          incomeStatement.gasCost + 
                          incomeStatement.managementFees + 
                          incomeStatement.performanceFees
                        )})
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg text-accent">Net Investment Income</h4>
                    <span className="font-mono font-bold text-2xl text-accent">
                      {formatCurrency(incomeStatement.netIncome)}
                    </span>
                  </div>
                </div>
              </div>

              <Card className="border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-base">Income Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Lending', value: incomeStatement.lendingIncome, total: incomeStatement.lendingIncome + incomeStatement.incentiveIncome + incomeStatement.tradingFeeIncome },
                      { label: 'Incentives', value: incomeStatement.incentiveIncome, total: incomeStatement.lendingIncome + incomeStatement.incentiveIncome + incomeStatement.tradingFeeIncome },
                      incomeStatement.tradingFeeIncome > 0 ? { label: 'Trading Fees', value: incomeStatement.tradingFeeIncome, total: incomeStatement.lendingIncome + incomeStatement.incentiveIncome + incomeStatement.tradingFeeIncome } : null
                    ].filter(Boolean).map((item) => {
                      if (!item) return null;
                      const percentage = (item.value / item.total) * 100;
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.label}</span>
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
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowsDownUp size={24} className="text-accent" />
                Flow of Funds
              </CardTitle>
              <CardDescription>
                Capital movements for period {flowOfFunds.periodStart} to {flowOfFunds.periodEnd}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-accent/20 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CurrencyDollar size={20} className="text-green-500" />
                      Inflows
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Deposits</span>
                      <span className="font-mono font-semibold text-green-500">
                        {formatCurrency(flowOfFunds.deposits)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rewards Claimed</span>
                      <span className="font-mono font-semibold text-green-500">
                        {formatCurrency(flowOfFunds.rewardsClaimed)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold">Total Inflows</span>
                      <span className="font-mono font-bold text-green-500">
                        {formatCurrency(flowOfFunds.deposits + flowOfFunds.rewardsClaimed)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-accent/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CurrencyDollar size={20} className="text-red-500" />
                      Outflows
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Withdrawals</span>
                      <span className="font-mono font-semibold text-red-500">
                        {formatCurrency(flowOfFunds.withdrawals)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rebalance Volume</span>
                      <span className="font-mono text-muted-foreground">
                        {formatCurrency(flowOfFunds.rebalanceVolume)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold">Total Outflows</span>
                      <span className="font-mono font-bold text-red-500">
                        {formatCurrency(flowOfFunds.withdrawals)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-accent/30 bg-accent/10">
                <CardContent className="py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-lg text-accent mb-1">Net Flow</h4>
                      <p className="text-sm text-muted-foreground">
                        {flowOfFunds.netFlow >= 0 ? 'Net deposits to vault' : 'Net withdrawals from vault'}
                      </p>
                    </div>
                    <span className={`font-mono font-bold text-3xl ${flowOfFunds.netFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {flowOfFunds.netFlow >= 0 ? '+' : ''}{formatCurrency(flowOfFunds.netFlow)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={24} className="text-accent" />
                Position Notes & Disclosures
              </CardTitle>
              <CardDescription>
                Detailed position information and risk disclosures for institutional analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">Protocol Dependencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {positionNotes.protocolDependencies.map((protocol) => (
                      <Badge key={protocol} variant="outline">{protocol}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">Oracle Dependencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {positionNotes.oracleDependencies.map((oracle) => (
                      <Badge key={oracle} variant="outline">{oracle}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">Upgradeability</h4>
                  <p className="text-sm text-muted-foreground">{positionNotes.upgradeability}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">Liquidity Assumptions</h4>
                  <p className="text-sm text-muted-foreground">{positionNotes.liquidityAssumptions}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">Token Concentration</h4>
                  <p className="text-sm text-muted-foreground">{positionNotes.tokenConcentration}</p>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-semibold mb-2 text-accent">Leverage Analysis</h4>
                  <p className="text-sm text-foreground">{positionNotes.leverage}</p>
                </div>
              </div>

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
                    Digital asset accounting, valuation of LP positions, treatment of protocol incentives, and recognition 
                    of unrealized gains/losses may differ from traditional GAAP standards. These statements are intended 
                    for informational and analytical purposes to support allocation decisions.
                  </p>
                  <p className="font-semibold text-foreground">
                    Always conduct independent due diligence and consult with qualified financial and legal advisors before 
                    making allocation decisions.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
