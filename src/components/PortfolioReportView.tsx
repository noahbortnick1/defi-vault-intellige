import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  ArrowLeft,
  Briefcase,
  ChartPie,
  TrendUp,
  Network,
  Warning,
  Info,
} from '@phosphor-icons/react';
import { DEMO_PORTFOLIOS } from '@/lib/mockData';
import { generatePortfolioDDReport } from '@/lib/reports';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { PortfolioDDReport } from '@/lib/types';

interface PortfolioReportViewProps {
  portfolioId: string;
  renderNav: () => JSX.Element;
  onNavigateBack: () => void;
}

export function PortfolioReportView({ portfolioId, renderNav, onNavigateBack }: PortfolioReportViewProps) {
  const report: PortfolioDDReport | null = useMemo(() => {
    const portfolio = DEMO_PORTFOLIOS.find(p => p.id === portfolioId);
    if (!portfolio) return null;
    return generatePortfolioDDReport(portfolio);
  }, [portfolioId]);

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        {renderNav()}
        <div className="container mx-auto px-6 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Report not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={onNavigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={18} />
            Back to Portfolio
          </Button>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileText className="text-accent" size={28} weight="duotone" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Portfolio Analysis Report</h1>
              <p className="text-muted-foreground">
                {report.portfolio.name} • Generated {new Date(report.generatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(report.summary.totalValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{report.summary.positionCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Overall Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{report.summary.overallRisk.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Diversification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{report.summary.diversificationScore}</div>
            </CardContent>
          </Card>
        </div>

        {report.summary.keyFindings.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={24} weight="duotone" className="text-accent" />
                Key Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.summary.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Info size={20} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase size={24} weight="duotone" className="text-accent" />
              Largest Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.positions.largest.map((position, idx) => (
                <div key={position.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-muted-foreground">#{idx + 1}</div>
                    <div>
                      <div className="font-semibold">{position.protocol}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{position.asset}</Badge>
                        <Badge variant="outline" className="text-xs">{position.chain}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(position.value)}</div>
                    <div className="text-sm text-muted-foreground">
                      {position.share.toFixed(1)}% of portfolio
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPie size={24} weight="duotone" className="text-accent" />
                Asset Exposure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(report.exposure.byAsset).map(([asset, data]) => (
                <div key={asset}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{asset}</span>
                      <Badge variant="outline" className="text-xs">{data.count} positions</Badge>
                    </div>
                    <span className="font-semibold">{data.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={data.percentage} className="mb-1" />
                  <div className="text-sm text-muted-foreground">{formatCurrency(data.value)}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network size={24} weight="duotone" className="text-accent" />
                Protocol Exposure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(report.exposure.byProtocol).map(([protocol, data]) => (
                <div key={protocol}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{protocol}</span>
                      <Badge variant="outline" className="text-xs">{data.count} positions</Badge>
                    </div>
                    <span className="font-semibold">{data.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={data.percentage} className="mb-1" />
                  <div className="text-sm text-muted-foreground">{formatCurrency(data.value)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartPie size={24} weight="duotone" className="text-accent" />
              Chain Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(report.exposure.byChain).map(([chain, data]) => (
              <div key={chain}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{chain}</span>
                    <Badge variant="outline" className="text-xs">{data.count} positions</Badge>
                  </div>
                  <span className="font-semibold">{data.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={data.percentage} className="mb-1" />
                <div className="text-sm text-muted-foreground">{formatCurrency(data.value)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warning size={24} weight="duotone" className="text-accent" />
              Concentration Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Herfindahl Index</div>
                <div className="text-2xl font-bold">{report.concentrationRisk.herfindahlIndex}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Lower is better (0 = perfectly diversified, 1 = fully concentrated)
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Top 3 Concentration</div>
                <div className="text-2xl font-bold">{report.concentrationRisk.topThreeConcentration}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Percentage of portfolio in top 3 positions
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm mb-3">
                <span className="font-medium">Analysis:</span> {report.concentrationRisk.analysis}
              </p>
            </div>

            {report.concentrationRisk.recommendations.length > 0 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="font-medium mb-2 flex items-center gap-2">
                  <Warning size={20} className="text-yellow-400" weight="fill" />
                  Recommendations
                </div>
                <ul className="space-y-1">
                  {report.concentrationRisk.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp size={24} weight="duotone" className="text-accent" />
              Yield Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Yield</div>
                <div className="text-3xl font-bold text-accent">{formatPercent(report.yieldAnalysis.totalYield)}</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Average Yield per Position</div>
                <div className="text-3xl font-bold text-accent">{formatPercent(report.yieldAnalysis.avgYield)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
