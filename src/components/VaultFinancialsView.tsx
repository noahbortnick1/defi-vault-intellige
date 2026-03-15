import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { VaultFinancials } from '@/lib/types';
import {
  TrendUp,
  TrendDown,
  Receipt,
  ArrowsLeftRight,
  FileText,
  CurrencyDollar,
} from '@phosphor-icons/react';

interface VaultFinancialsViewProps {
  financials: VaultFinancials;
  vaultName: string;
}

export function VaultFinancialsView({ financials, vaultName }: VaultFinancialsViewProps) {
  const { balanceSheet, incomeStatement, flowOfFunds, performance, notes } = financials;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={24} className="text-primary" weight="duotone" />
              <CardTitle>Financial Statements</CardTitle>
            </div>
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
                  <span className="font-mono">{formatCurrency(balanceSheet.totalLiabilities)}</span>
                </div>
              </div>
            </div>

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
                {incomeStatement.revenue.map((item, idx) => (
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
                  <span className="font-mono">{formatCurrency(incomeStatement.totalRevenue)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">Expenses</h4>
              <div className="space-y-2 pl-4">
                {incomeStatement.expenses.map((item, idx) => (
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
                  <span className="font-mono">{formatCurrency(incomeStatement.totalExpenses)}</span>
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
            {flowOfFunds.flows.map((flow, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 px-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">{flow.label}</span>
                <span className={`font-mono font-semibold ${flow.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {flow.value >= 0 ? '+' : ''}{formatCurrency(flow.value)}
                </span>
              </div>
            ))}
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
  );
}
