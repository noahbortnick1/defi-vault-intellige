import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  ArrowLeft,
  ShieldCheck,
  TrendUp,
  Warning,
  CheckCircle,
  Info,
  ChartBar,
  Network,
  Lock,
  Drop,
  Vault,
} from '@phosphor-icons/react';
import { VAULTS } from '@/lib/mockData';
import { generateVaultDDReport } from '@/lib/reports';
import { formatCurrency, formatPercent, getRiskBgColor } from '@/lib/format';
import type { VaultDDReport } from '@/lib/types';

interface VaultReportViewProps {
  vaultId: string;
  renderNav: () => JSX.Element;
  onNavigateBack: () => void;
}

export function VaultReportView({ vaultId, renderNav, onNavigateBack }: VaultReportViewProps) {
  const report: VaultDDReport | null = useMemo(() => {
    const vault = VAULTS.find(v => v.id === vaultId);
    if (!vault) return null;
    return generateVaultDDReport(vault);
  }, [vaultId]);

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

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'strong-buy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'buy': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'hold': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'avoid': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSustainabilityColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={onNavigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={18} />
            Back to Rankings
          </Button>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileText className="text-accent" size={28} weight="duotone" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Vault Due Diligence Report</h1>
              <p className="text-muted-foreground">
                Generated {new Date(report.generatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`text-lg py-2 px-4 ${getRecommendationColor(report.summary.recommendation)}`}>
                {report.summary.recommendation.replace('-', ' ').toUpperCase()}
              </Badge>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">Overall Score</div>
                <div className="text-3xl font-bold text-accent">{report.summary.overallScore}/100</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vault Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">APY:</span>
                <span className="font-semibold text-accent">{formatPercent(report.vault.apy)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVL:</span>
                <span className="font-semibold">{formatCurrency(report.vault.tvl)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain:</span>
                <Badge variant="outline">{report.vault.chain}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk:</span>
                <Badge className={getRiskBgColor(report.vault.riskBand)}>
                  {report.vault.riskBand}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Real Yield:</span>
                <span className="font-semibold">{formatPercent(report.vault.realYield)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audits:</span>
                <span className="font-semibold">{report.contractRisk.audits.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dependencies:</span>
                <span className="font-semibold">{report.dependencies.complexity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Liquidity:</span>
                <span className="font-semibold">{report.liquidityProfile.liquidityDepth}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={24} weight="duotone" className="text-accent" />
              Key Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.summary.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vault size={24} weight="duotone" className="text-accent" />
              Strategy Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
              <p>{report.strategy.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Mechanism</div>
                <p className="text-sm">{report.strategy.mechanism}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Complexity</div>
                <Badge variant={report.strategy.complexity === 'low' ? 'outline' : 'secondary'}>
                  {report.strategy.complexity}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp size={24} weight="duotone" className="text-accent" />
              Yield Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.yieldSources.sources.map((source, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{source.name}</span>
                    <Badge variant="outline" className={getSustainabilityColor(source.sustainability)}>
                      {source.sustainability} sustainability
                    </Badge>
                  </div>
                  <span className="font-semibold">{source.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={source.percentage} className="mb-2" />
                <p className="text-sm text-muted-foreground">{source.description}</p>
                {idx < report.yieldSources.sources.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Analysis:</span> {report.yieldSources.analysis}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network size={24} weight="duotone" className="text-accent" />
              Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.dependencies.list.map((dep) => (
                <div key={dep.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{dep.name}</span>
                    <Badge variant={dep.criticality === 'high' ? 'destructive' : 'outline'}>
                      {dep.criticality}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Type: <span className="text-foreground">{dep.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{dep.notes}</p>
                </div>
              ))}
            </div>
            {report.dependencies.criticalDependencies.length > 0 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Warning size={20} className="text-yellow-400 mt-0.5" weight="fill" />
                  <div>
                    <div className="font-medium mb-1">Critical Dependencies</div>
                    <p className="text-sm text-muted-foreground">
                      {report.dependencies.criticalDependencies.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Analysis:</span> {report.dependencies.analysis}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={24} weight="duotone" className="text-accent" />
              Contract Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Upgradeability</div>
                <div className="flex items-center gap-2">
                  {report.contractRisk.isUpgradeable ? (
                    <Warning size={20} className="text-yellow-400" weight="fill" />
                  ) : (
                    <ShieldCheck size={20} className="text-green-400" weight="fill" />
                  )}
                  <span>{report.contractRisk.isUpgradeable ? 'Upgradeable' : 'Immutable'}</span>
                </div>
              </div>

              {report.contractRisk.timelockDuration && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Timelock</div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-green-400" weight="fill" />
                    <span>{report.contractRisk.timelockDuration}</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Security Score</div>
                <div className="text-2xl font-bold text-accent">{report.contractRisk.score}/10</div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Audits</div>
                <div className="text-2xl font-bold">{report.contractRisk.audits.length}</div>
              </div>
            </div>

            {report.contractRisk.audits.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-3">Audit History</div>
                <div className="space-y-2">
                  {report.contractRisk.audits.map((audit, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-medium">{audit.auditor}</div>
                        <div className="text-sm text-muted-foreground">{audit.scope}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{audit.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Analysis:</span> {report.contractRisk.analysis}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Drop size={24} weight="duotone" className="text-accent" />
              Liquidity Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Liquidity Depth</div>
                <div className="text-lg font-semibold">{report.liquidityProfile.liquidityDepth}</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Exit Capacity</div>
                <div className="text-lg font-semibold">{report.liquidityProfile.exitCapacity}</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Concentration Risk</div>
                <div className="text-lg font-semibold">{report.liquidityProfile.concentrationRisk}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Liquidity Score</div>
              <Progress value={report.liquidityProfile.score} className="mb-2" />
              <div className="text-sm text-muted-foreground">{report.liquidityProfile.score.toFixed(1)}/100</div>
            </div>
          </CardContent>
        </Card>

        {report.redFlags.length > 0 && (
          <Card className="mb-6 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Warning size={24} weight="duotone" />
                Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Warning size={20} className="text-red-400 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar size={24} weight="duotone" className="text-accent" />
              Overall Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <div className="text-4xl font-bold text-accent">{report.overallRisk.score.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
              </div>
              <div>
                <Badge className={`text-lg py-2 px-4 ${getRiskBgColor(report.overallRisk.band)}`}>
                  {report.overallRisk.band.toUpperCase()} RISK
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {report.overallRisk.breakdown.map((factor) => (
                <div key={factor.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{factor.label}</span>
                      <Badge variant="outline" className="text-xs">{(factor.weight * 100).toFixed(0)}% weight</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      +{factor.scoreContribution.toFixed(2)} to risk
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{factor.explanation}</p>
                  {factor !== report.overallRisk.breakdown[report.overallRisk.breakdown.length - 1] && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
