import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ShieldCheck, Star, FileText, TrendUp, Warning, CheckCircle, Info, CircleNotch } from '@phosphor-icons/react';
import { useVaultApi } from '@/hooks/use-vault-api';
import { formatCurrency, formatPercent, formatDate, getRiskBgColor, getChainName, getStrategyLabel, formatAddress } from '@/lib/format';

interface VaultDetailProps {
  vaultId: string;
  onNavigateBack: () => void;
  renderNav: () => React.ReactNode;
  watchlist: string[];
  onToggleWatchlist: (vaultId: string) => void;
}

export function VaultDetail({ vaultId, onNavigateBack, renderNav, watchlist, onToggleWatchlist }: VaultDetailProps) {
  const { vault, loading, error } = useVaultApi(vaultId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {renderNav()}
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CircleNotch className="animate-spin" size={24} />
              <span>Loading vault details from API...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {renderNav()}
        <div className="container mx-auto px-6 py-12">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Failed to load vault: {error.message}</p>
              <Button onClick={onNavigateBack} className="mt-4">
                Back to Vaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!vault) {
    return (
      <div className="min-h-screen bg-background">
        {renderNav()}
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-muted-foreground">Vault not found</p>
          <Button onClick={onNavigateBack} className="mt-4">
            Back to Vaults
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onNavigateBack}>
            <ArrowLeft className="mr-2" size={18} />
            Back to Vaults
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2" size={16} />
              Generate Report
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleWatchlist(vault.id)}
            >
              <Star
                size={20}
                weight={watchlist.includes(vault.id) ? 'fill' : 'regular'}
                className={watchlist.includes(vault.id) ? 'text-yellow-400' : ''}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-4xl font-bold">{vault.name}</h2>
              {vault.verified && (
                <ShieldCheck className="text-accent" size={32} weight="fill" />
              )}
              {vault.institutionalGrade && (
                <Badge variant="outline" className="border-accent/50 text-accent text-sm">
                  Institutional Grade
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{vault.protocolName}</Badge>
              <Badge variant="outline">{getChainName(vault.chain)}</Badge>
              <Badge variant="outline">{vault.asset}</Badge>
              <Badge variant="outline">{getStrategyLabel(vault.strategyType)}</Badge>
              <Badge className={getRiskBgColor(vault.riskLevel)}>
                {vault.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Current APY</CardDescription>
                <CardTitle className="text-3xl text-accent">{formatPercent(vault.apy)}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Real: {formatPercent(vault.realYield)} | Incentives: {formatPercent(vault.incentiveYield)}
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Value Locked</CardDescription>
                <CardTitle className="text-3xl">{formatCurrency(vault.tvl)}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Liquidity: {vault.liquidityScore.toFixed(1)}/10
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Risk Score</CardDescription>
                <CardTitle className={`text-3xl ${getRiskBgColor(vault.riskLevel).split(' ')[1]}`}>
                  {vault.riskScore.toFixed(1)} / 10
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {vault.riskBand} profile
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Inception</CardDescription>
                <CardTitle className="text-xl">{formatDate(vault.inception)}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Updated {vault.sourceWindow} ago
                </p>
              </CardHeader>
            </Card>
          </div>

          {vault.redFlags.length > 0 && (
            <Card className="border-2 border-destructive/50 bg-destructive/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Warning className="text-destructive" size={24} weight="fill" />
                  <CardTitle className="text-destructive">Red Flags ({vault.redFlags.length})</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vault.redFlags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                      <Badge className={
                        flag.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        flag.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        flag.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }>
                        {flag.severity.toUpperCase()}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{flag.category}</p>
                        <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Detected: {formatDate(flag.detectedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
              <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              <TabsTrigger value="audits">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{vault.strategyDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vault Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Contract Address</p>
                      <p className="font-mono text-sm">{formatAddress(vault.vaultAddress, 10, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant="outline" className="capitalize">{vault.status}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Strategy Type</p>
                      <p className="font-medium">{getStrategyLabel(vault.strategyType)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Asset</p>
                      <p className="font-medium">{vault.asset}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Protocol Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Protocol</p>
                      <p className="font-medium">{vault.protocol.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <p className="font-medium">{vault.protocol.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Protocol TVL</p>
                      <p className="font-medium">{formatCurrency(vault.protocol.tvl)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Maturity Score</p>
                      <p className="font-medium">{vault.protocol.maturityScore.toFixed(1)} / 10</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Audits</p>
                      <p className="font-medium">{vault.protocol.auditSummary.count} completed</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Last Audit</p>
                      <p className="font-medium">{formatDate(vault.protocol.auditSummary.lastAuditDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="yield" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Yield Breakdown</CardTitle>
                  <CardDescription>Understanding where yields come from and their sustainability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vault.apyBreakdown.map((source, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="font-medium capitalize">{source.type.replace('-', ' ')}</p>
                            {source.sustainable ? (
                              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                                <CheckCircle size={12} className="mr-1" />
                                Sustainable
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                                <Info size={12} className="mr-1" />
                                May Decline
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-accent">{formatPercent(source.apy)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                        <p className="text-xs text-muted-foreground">Paid in: {source.token}</p>
                        <Progress 
                          value={(source.apy / vault.apy) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Real Yield</CardDescription>
                    <CardTitle className="text-2xl text-green-400">{formatPercent(vault.realYield)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((vault.realYield / vault.apy) * 100).toFixed(0)}% of total
                    </p>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Incentive Yield</CardDescription>
                    <CardTitle className="text-2xl text-yellow-400">{formatPercent(vault.incentiveYield)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((vault.incentiveYield / vault.apy) * 100).toFixed(0)}% of total
                    </p>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Fee Yield</CardDescription>
                    <CardTitle className="text-2xl text-blue-400">{formatPercent(vault.feeYield)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((vault.feeYield / vault.apy) * 100).toFixed(0)}% of total
                    </p>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Factor Analysis</CardTitle>
                  <CardDescription>
                    Overall Risk Score: <span className={`font-bold ${getRiskBgColor(vault.riskLevel).split(' ')[1]}`}>
                      {vault.riskScore.toFixed(1)} / 10
                    </span> ({vault.riskBand} profile)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {vault.riskFactors.map((factor, idx) => (
                      <div key={idx} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold">{factor.label}</p>
                              <Badge variant="outline" className="text-xs">
                                Weight: {(factor.weight * 100).toFixed(0)}%
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{factor.explanation}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-caption text-muted-foreground mb-1">Score</p>
                            <p className="text-2xl font-bold">{factor.score.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Contributes {factor.scoreContribution.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-background p-3 rounded-md">
                          <p className="text-sm font-medium mb-2 text-accent">Mitigations:</p>
                          <ul className="space-y-1">
                            {factor.mitigations.map((mitigation, midx) => (
                              <li key={midx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                                <span>{mitigation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dependencies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Protocol Dependencies</CardTitle>
                  <CardDescription>External protocols this vault depends on</CardDescription>
                </CardHeader>
                <CardContent>
                  {vault.dependencies.length > 0 ? (
                    <div className="space-y-3">
                      {vault.dependencies.map((dep, idx) => (
                        <div key={idx} className="flex items-start justify-between p-4 border border-border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium">{dep.protocol}</p>
                              <Badge variant="outline" className="text-xs">{dep.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{dep.description}</p>
                          </div>
                          <Badge className={
                            dep.criticality === 'critical' ? 'bg-red-500/20 text-red-400 ml-4' :
                            dep.criticality === 'high' ? 'bg-orange-500/20 text-orange-400 ml-4' :
                            dep.criticality === 'medium' ? 'bg-yellow-500/20 text-yellow-400 ml-4' :
                            'bg-green-500/20 text-green-400 ml-4'
                          }>
                            {dep.criticality.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No external dependencies</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Governance Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Governance Type</p>
                      <p className="font-medium text-lg capitalize">{vault.governance.type.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Details</p>
                      <p className="text-muted-foreground">{vault.governance.details}</p>
                    </div>
                    {vault.governance.timelock && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Timelock Period</p>
                        <p className="font-medium">{vault.governance.timelock}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Admin Control</p>
                        <Badge variant={vault.governance.adminControl ? 'destructive' : 'outline'}>
                          {vault.governance.adminControl ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Upgradeable</p>
                        <Badge variant={vault.governance.upgradeability ? 'secondary' : 'outline'}>
                          {vault.governance.upgradeability ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Audits</CardTitle>
                  <CardDescription>{vault.audits.length} audit(s) completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vault.audits.map((audit, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg">{audit.firm}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(audit.date)}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2" size={14} />
                            View Report
                          </Button>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Scope:</p>
                          <div className="flex flex-wrap gap-2">
                            {audit.scope.map((item, sidx) => (
                              <Badge key={sidx} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Issues Found:</p>
                          <div className="grid grid-cols-4 gap-3">
                            <div className="text-center p-2 bg-red-500/10 rounded">
                              <p className="text-2xl font-bold text-red-400">{audit.issues.critical}</p>
                              <p className="text-xs text-muted-foreground">Critical</p>
                            </div>
                            <div className="text-center p-2 bg-orange-500/10 rounded">
                              <p className="text-2xl font-bold text-orange-400">{audit.issues.high}</p>
                              <p className="text-xs text-muted-foreground">High</p>
                            </div>
                            <div className="text-center p-2 bg-yellow-500/10 rounded">
                              <p className="text-2xl font-bold text-yellow-400">{audit.issues.medium}</p>
                              <p className="text-xs text-muted-foreground">Medium</p>
                            </div>
                            <div className="text-center p-2 bg-gray-500/10 rounded">
                              <p className="text-2xl font-bold text-gray-400">{audit.issues.low}</p>
                              <p className="text-xs text-muted-foreground">Low</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
