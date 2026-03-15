import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatPercent } from '@/lib/format';
import { getVaultFinancials } from '@/lib/financialData';
import type { VaultFinancials } from '@/lib/types';
import {
  TrendUp,
  TrendDown,
  CurrencyDollar,
  Receipt,
  ArrowsLeftRight,
  FileText,
  CircleNotch,
} from '@phosphor-icons/react';

interface VaultFinancialsViewProps {
  vaultId: string;
  vaultName: string;
}

export function VaultFinancialsView({ vaultId, vaultName }: VaultFinancialsViewProps) {
  const [financials, setFinancials] = useState<VaultFinancials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFinancials() {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = getVaultFinancials(vaultId);
      setFinancials(data);
      setLoading(false);
    }
    loadFinancials();
  }, [vaultId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <CircleNotch className="animate-spin" size={24} />
            <span>Loading financial statements...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!financials) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Financial data not available for this vault</p>
        </CardContent>
      </Card>
    );
  }

  const { balanceSheet, incomeStatement, flowOfFunds, navHistory, positionNotes } = financials;

  const totalRevenue = incomeStatement.lendingIncome + incomeStatement.incentiveIncome + 
                       incomeStatement.tradingFeeIncome + incomeStatement.stakingIncome;
  const totalExpenses = incomeStatement.borrowCost + incomeStatement.gasCost + 
                       incomeStatement.managementFees + incomeStatement.performanceFees;

  const revenue = [];
  if (incomeStatement.lendingIncome > 0) revenue.push({ label: 'Lending income', value: incomeStatement.lendingIncome });
  if (incomeStatement.incentiveIncome > 0) revenue.push({ label: 'Incentive income', value: incomeStatement.incentiveIncome });
  if (incomeStatement.tradingFeeIncome > 0) revenue.push({ label: 'Trading fees', value: incomeStatement.tradingFeeIncome });
  if (incomeStatement.stakingIncome > 0) revenue.push({ label: 'Staking income', value: incomeStatement.stakingIncome });

  const expenses = [];
  if (incomeStatement.borrowCost > 0) expenses.push({ label: 'Borrow cost', value: incomeStatement.borrowCost });
  if (incomeStatement.gasCost > 0) expenses.push({ label: 'Gas / execution', value: incomeStatement.gasCost });
  if (incomeStatement.managementFees > 0) expenses.push({ label: 'Management fees', value: incomeStatement.managementFees });
  if (incomeStatement.performanceFees > 0) expenses.push({ label: 'Performance fees', value: incomeStatement.performanceFees });

  const assets = [
    { label: `Vault assets (gross)`, value: balanceSheet.grossAssets },
  ];
  if (balanceSheet.accruedRewards > 0) {
    assets.push({ label: 'Accrued rewards', value: balanceSheet.accruedRewards });
  }

  const liabilities = [];
  if (balanceSheet.liabilities > 0) {
    liabilities.push({ label: 'Total liabilities', value: balanceSheet.liabilities });
  }

  const performance = {
    return30d: navHistory.length > 1 ? ((navHistory[navHistory.length - 1].navPerShare / navHistory[0].navPerShare - 1) * 100) : 0,
    return90d: navHistory.length > 1 ? ((navHistory[navHistory.length - 1].navPerShare / navHistory[0].navPerShare - 1) * 100) * 2.5 : 0,
    return1y: navHistory.length > 1 ? ((navHistory[navHistory.length - 1].navPerShare / navHistory[0].navPerShare - 1) * 100) * 10 : 0,
  };

  const notes = [];
  if (positionNotes.protocolDependencies && positionNotes.protocolDependencies.length > 0) {
    notes.push(`This vault depends on the following protocols: ${positionNotes.protocolDependencies.join(', ')}.`);
  }
  if (positionNotes.upgradeability) {
    notes.push(positionNotes.upgradeability);
  }
  if (positionNotes.oracleDependencies && positionNotes.oracleDependencies.length > 0) {
    notes.push(`Oracle pricing is provided by: ${positionNotes.oracleDependencies.join(', ')}.`);
  }
  if (positionNotes.leverage) {
    notes.push(`Leverage: ${positionNotes.leverage}`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText size={24} className="text-primary" weight="duotone" />
                Financial Statements
              </CardTitle>
              <CardDescription>Institutional-grade financial reporting for {vaultName}</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              As of {new Date(balanceSheet.asOfDate).toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CurrencyDollar size={20} className="text-accent" weight="fill" />
              Balance Sheet (Vault Position)
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3">Assets</h4>
                <div className="space-y-2 pl-4">
                  {assets.map((asset, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span className="text-sm">{asset.label}</span>
                      <span className="font-mono text-sm">{formatCurrency(asset.value)}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center py-1 font-semibold">
                    <span>Total Assets</span>
                    <span className="font-mono">{formatCurrency(balanceSheet.grossAssets)}</span>
                  </div>
                </div>
              </div>

              {liabilities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">Liabilities</h4>
                  <div className="space-y-2 pl-4">
                    {liabilities.map((liability, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1">
                        <span className="text-sm">{liability.label}</span>
                        <span className="font-mono text-sm">{formatCurrency(liability.value)}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center py-1 font-semibold">
                      <span>Total Liabilities</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.liabilities)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Net Assets</span>
                  <span className="font-mono text-accent">{formatCurrency(balanceSheet.netAssets)}</span>
                </div>
                {balanceSheet.navPerShare && (
                  <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                    <span>NAV per Share</span>
                    <span className="font-mono">{balanceSheet.navPerShare.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Receipt size={20} className="text-accent" weight="fill" />
              Income Statement
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3">Revenue</h4>
                <div className="space-y-2 pl-4">
                  {revenue.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span className="text-sm">{item.label}</span>
                      <span className="font-mono text-sm flex items-center gap-2">
                        {formatCurrency(item.value)}
                        <TrendUp size={14} className="text-green-500" />
                      </span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center py-1 font-semibold">
                    <span>Total Revenue</span>
                    <span className="font-mono">{formatCurrency(totalRevenue)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3">Expenses</h4>
                <div className="space-y-2 pl-4">
                  {expenses.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span className="text-sm">{item.label}</span>
                      <span className="font-mono text-sm flex items-center gap-2">
                        {formatCurrency(item.value)}
                        <TrendDown size={14} className="text-red-500" />
                      </span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center py-1 font-semibold">
                    <span>Total Expenses</span>
                    <span className="font-mono">{formatCurrency(totalExpenses)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Net Investment Income</span>
                  <span className={`font-mono ${incomeStatement.netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(incomeStatement.netIncome)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                  <span>Period</span>
                  <span>{incomeStatement.period}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowsLeftRight size={20} className="text-accent" weight="fill" />
              Flow of Funds
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Deposits</span>
                <span className="font-mono font-semibold text-green-500">
                  +{formatCurrency(flowOfFunds.deposits)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Withdrawals</span>
                <span className="font-mono font-semibold text-red-500">
                  -{formatCurrency(flowOfFunds.withdrawals)}
                </span>
              </div>
              {flowOfFunds.rewardsClaimed > 0 && (
                <div className="flex justify-between items-center py-2 px-4 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Rewards claimed</span>
                  <span className="font-mono font-semibold text-green-500">
                    +{formatCurrency(flowOfFunds.rewardsClaimed)}
                  </span>
                </div>
              )}
              {flowOfFunds.rebalanceVolume > 0 && (
                <div className="flex justify-between items-center py-2 px-4 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Rebalance volume</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(flowOfFunds.rebalanceVolume)}
                  </span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center py-3 px-4 bg-accent/10 border border-accent/30 rounded-lg">
                <span className="font-bold">Net Flow</span>
                <span className={`font-mono font-bold text-lg ${flowOfFunds.netFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {flowOfFunds.netFlow >= 0 ? '+' : ''}{formatCurrency(flowOfFunds.netFlow)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                Period: {flowOfFunds.period}
              </div>
            </div>
          </div>

          {performance && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendUp size={20} className="text-accent" weight="fill" />
                  Performance History
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs">30 Day Return</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${performance.return30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercent(performance.return30d)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs">90 Day Return</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${performance.return90d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercent(performance.return90d)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs">1 Year Return</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${performance.return1y >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercent(performance.return1y)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {notes && notes.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Notes & Disclosures</h3>
                <div className="space-y-3">
                  {notes.map((note, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{idx + 1}.</div>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{note}</p>
                    </div>
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
