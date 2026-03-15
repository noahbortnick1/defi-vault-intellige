import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Sparkle,
  TrendUp,
  TrendDown,
  Warning,
  ShieldCheck,
  Lightbulb,
  ChartBar,
  Target,
  List,
  CheckCircle,
  XCircle,
  ArrowRight,
  Download,
} from '@phosphor-icons/react';
import type {
  AIEnhancedPortfolioReport,
  PositionsApiResponse,
  ExposureApiResponse,
  SummaryApiResponse,
} from '@/lib/portfolioApi';
import { generateAIEnhancedPortfolioReport } from '@/lib/aiPortfolioReport';
import { formatCurrency, formatPercent } from '@/lib/format';

interface AIPortfolioReportViewProps {
  walletAddress: string;
  positions: PositionsApiResponse;
  exposure: ExposureApiResponse;
  summary: SummaryApiResponse;
  renderNav: () => JSX.Element;
  onNavigateBack: () => void;
}

export function AIPortfolioReportView({
  walletAddress,
  positions,
  exposure,
  summary,
  renderNav,
  onNavigateBack,
}: AIPortfolioReportViewProps) {
  const [report, setReport] = useState<AIEnhancedPortfolioReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const aiReport = await generateAIEnhancedPortfolioReport(positions, exposure, summary);
        setReport(aiReport);
      } catch (err: any) {
        setError(err.message || 'Failed to generate AI report');
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [walletAddress]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'good':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'fair':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'concerning':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'reduce':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'increase':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'maintain':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'near-term':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'monitor':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {renderNav()}
        <div className="container mx-auto px-6 py-12">
          <div className="mb-6">
            <Button variant="ghost" onClick={onNavigateBack} className="mb-4">
              <ArrowLeft className="mr-2" size={18} />
              Back to Portfolio
            </Button>
            <div className="flex items-center gap-3 mb-6">
              <Sparkle className="text-accent animate-pulse" size={32} weight="duotone" />
              <div>
                <h1 className="text-4xl font-bold">Generating AI Report...</h1>
                <p className="text-muted-foreground">Analyzing portfolio and generating insights</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-64" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background">
        {renderNav()}
        <div className="container mx-auto px-6 py-12">
          <Button variant="ghost" onClick={onNavigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={18} />
            Back to Portfolio
          </Button>
          <Alert className="border-destructive">
            <Warning className="h-4 w-4" />
            <AlertDescription>{error || 'Failed to generate report'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={onNavigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={18} />
            Back to Portfolio
          </Button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl">
                <Sparkle className="text-accent" size={32} weight="duotone" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI-Enhanced Portfolio Report</h1>
                <p className="text-muted-foreground">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} • Generated{' '}
                  {new Date(report.generatedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <Button variant="outline">
              <Download className="mr-2" size={18} />
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(report.currentState.totalValue)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.currentState.positionCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {report.currentState.overallRisk.toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Avg APY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {report.currentState.averageAPY.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="diversification">Diversification</TabsTrigger>
            <TabsTrigger value="action">Action Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Portfolio Health Assessment</CardTitle>
                  <Badge className={getHealthColor(report.insights.executiveSummary.portfolioHealth)}>
                    {report.insights.executiveSummary.portfolioHealth.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {report.insights.executiveSummary.overallAssessment}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={24} weight="duotone" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.insights.executiveSummary.keyStrengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Warning size={24} weight="duotone" />
                    Key Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.insights.executiveSummary.keyWeaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Warning className="text-yellow-400 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="text-accent" size={24} weight="duotone" />
                  Immediate Actions
                </CardTitle>
                <CardDescription>Priority actions to take in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.insights.executiveSummary.immediateActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-card rounded-lg">
                      <Badge variant="outline" className="mt-0.5">
                        {idx + 1}
                      </Badge>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ShieldCheck className="text-accent" size={28} weight="duotone" />
                  Concentration Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Risk Level:</span>
                  <Badge
                    className={getRiskLevelColor(
                      report.insights.riskAnalysis.concentrationRisk.level
                    )}
                  >
                    {report.insights.riskAnalysis.concentrationRisk.level.toUpperCase()}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.insights.riskAnalysis.concentrationRisk.assessment}
                  </p>
                </div>

                {report.insights.riskAnalysis.concentrationRisk.concerns.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-yellow-400">Concerns</h4>
                    <ul className="space-y-1">
                      {report.insights.riskAnalysis.concentrationRisk.concerns.map(
                        (concern, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                            <Warning className="text-yellow-400 flex-shrink-0 mt-0.5" size={14} />
                            {concern}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2 text-accent">Recommendations</h4>
                  <ul className="space-y-1">
                    {report.insights.riskAnalysis.concentrationRisk.recommendations.map(
                      (rec, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <ArrowRight className="text-accent flex-shrink-0 mt-0.5" size={14} />
                          {rec}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Top Asset</div>
                    <div className="text-lg font-bold">
                      {report.currentState.concentrationMetrics.topAssetConcentration.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Top Protocol</div>
                    <div className="text-lg font-bold">
                      {report.currentState.concentrationMetrics.topProtocolConcentration.toFixed(
                        1
                      )}
                      %
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Top Chain</div>
                    <div className="text-lg font-bold">
                      {report.currentState.concentrationMetrics.topChainConcentration.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">HHI</div>
                    <div className="text-lg font-bold">
                      {report.currentState.concentrationMetrics.herfindahlIndex.toFixed(3)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Protocol Risk Exposures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {report.insights.riskAnalysis.protocolRisk.assessment}
                </p>

                {report.insights.riskAnalysis.protocolRisk.highRiskExposures.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-400">High-Risk Exposures</h4>
                    {report.insights.riskAnalysis.protocolRisk.highRiskExposures.map(
                      (exposure, idx) => (
                        <div key={idx} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{exposure.protocol}</span>
                            <div className="flex gap-2">
                              <Badge variant="outline">{exposure.exposure.toFixed(1)}% exposure</Badge>
                              <Badge variant="outline" className="text-red-400">
                                Risk: {exposure.riskScore.toFixed(1)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{exposure.reasoning}</p>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {report.insights.riskAnalysis.protocolRisk.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <ArrowRight className="text-accent flex-shrink-0 mt-0.5" size={14} />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yield Sustainability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Incentive Dependence</div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={report.insights.riskAnalysis.yieldSustainability.incentiveDependence}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold">
                        {report.insights.riskAnalysis.yieldSustainability.incentiveDependence.toFixed(
                          0
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Sustainability Score</div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={report.insights.riskAnalysis.yieldSustainability.sustainabilityScore}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold">
                        {report.insights.riskAnalysis.yieldSustainability.sustainabilityScore.toFixed(
                          0
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.insights.riskAnalysis.yieldSustainability.assessment}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Outlook</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.insights.riskAnalysis.yieldSustainability.outlook}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            {report.insights.optimizationRecommendations.rebalancing.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Target className="text-accent" size={28} weight="duotone" />
                    Rebalancing Recommendations
                  </CardTitle>
                  <CardDescription>Suggested adjustments to current positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.insights.optimizationRecommendations.rebalancing.map((rec, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold">{rec.currentVault}</div>
                          <Badge className={getActionColor(rec.action)}>
                            {rec.action.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Current: </span>
                            <span className="font-semibold">{rec.currentAllocation.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target: </span>
                            <span className="font-semibold">{rec.targetAllocation.toFixed(1)}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {report.insights.optimizationRecommendations.newOpportunities.length > 0 && (
              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendUp className="text-green-400" size={28} weight="duotone" />
                    New Opportunities
                  </CardTitle>
                  <CardDescription>Recommended vaults to add to your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.insights.optimizationRecommendations.newOpportunities.map(
                      (opp, idx) => (
                        <div key={idx} className="p-4 bg-card border border-green-500/20 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-bold text-lg">{opp.vaultName}</div>
                              <div className="text-sm text-muted-foreground">{opp.protocol}</div>
                            </div>
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                              Suggested: {opp.suggestedAllocation.toFixed(1)}%
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="text-muted-foreground">APY: </span>
                              <span className="font-semibold text-green-400">
                                {opp.apy.toFixed(2)}%
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Risk Score: </span>
                              <span className="font-semibold">{opp.riskScore.toFixed(1)}</span>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{opp.reasoning}</p>

                          <div>
                            <div className="text-xs font-semibold text-green-400 mb-1">
                              Key Benefits:
                            </div>
                            <ul className="space-y-1">
                              {opp.benefits.map((benefit, bidx) => (
                                <li key={bidx} className="text-xs text-muted-foreground flex gap-2">
                                  <CheckCircle
                                    className="text-green-400 flex-shrink-0 mt-0.5"
                                    size={12}
                                  />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {report.insights.optimizationRecommendations.exitRecommendations.length > 0 && (
              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <XCircle className="text-red-400" size={28} weight="duotone" />
                    Exit Recommendations
                  </CardTitle>
                  <CardDescription>Positions to consider reducing or exiting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.insights.optimizationRecommendations.exitRecommendations.map(
                      (exit, idx) => (
                        <div key={idx} className="p-4 bg-card border border-red-500/20 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-semibold">{exit.vaultName}</div>
                            <Badge className={getUrgencyColor(exit.urgency)}>
                              {exit.urgency.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm mb-2">
                            <span className="text-muted-foreground">Current Allocation: </span>
                            <span className="font-semibold">
                              {exit.currentAllocation.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{exit.reasoning}</p>
                          {exit.alternativeSuggestion && (
                            <div className="text-sm">
                              <span className="text-accent font-semibold">Alternative: </span>
                              <span>{exit.alternativeSuggestion}</span>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="diversification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ChartBar className="text-accent" size={28} weight="duotone" />
                  Diversification Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Current Score</div>
                    <div className="text-4xl font-bold">
                      {report.insights.diversificationStrategy.currentScore}
                    </div>
                    <Progress
                      value={report.insights.diversificationStrategy.currentScore}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Target Score</div>
                    <div className="text-4xl font-bold text-accent">
                      {report.insights.diversificationStrategy.targetScore}
                    </div>
                    <Progress
                      value={report.insights.diversificationStrategy.targetScore}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Diversification Gaps</h4>
                  <ul className="space-y-2">
                    {report.insights.diversificationStrategy.gaps.map((gap, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <Warning className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-muted-foreground">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Specific Actions by Category</h4>
                  <div className="space-y-4">
                    {report.insights.diversificationStrategy.specificActions.map((action, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{action.category.toUpperCase()}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Current: </span>
                            <span>{action.currentExposure}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target: </span>
                            <span className="text-accent">{action.targetExposure}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold mb-1">Actions:</div>
                          <ul className="space-y-1">
                            {action.actions.map((act, aidx) => (
                              <li key={aidx} className="text-xs text-muted-foreground flex gap-2">
                                <ArrowRight className="text-accent flex-shrink-0 mt-0.5" size={12} />
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yield Optimization Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Current Yield</div>
                    <div className="text-2xl font-bold">
                      {report.insights.yieldOptimization.currentYield.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Potential Yield</div>
                    <div className="text-2xl font-bold text-accent">
                      {report.insights.yieldOptimization.potentialYield.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {report.insights.yieldOptimization.optimizationPaths.map((path, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                      <div className="font-semibold mb-2 flex items-center justify-between">
                        <span>{path.description}</span>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          +{path.expectedYieldIncrease.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        <span className="font-semibold">Risk Tradeoff: </span>
                        {path.riskTradeoff}
                      </div>
                      <div>
                        <div className="text-xs font-semibold mb-1">Steps:</div>
                        <ol className="space-y-1">
                          {path.steps.map((step, sidx) => (
                            <li key={sidx} className="text-xs text-muted-foreground flex gap-2">
                              <span className="font-semibold">{sidx + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="action" className="space-y-6">
            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <List className="text-red-400" size={28} weight="duotone" />
                  Immediate Actions (Next 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.insights.actionPlan.immediate.map((action, idx) => (
                    <div key={idx} className="p-4 bg-card border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-0.5">
                          P{action.priority}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">{action.action}</div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-semibold">Expected Impact: </span>
                            {action.expectedImpact}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <List className="text-yellow-400" size={28} weight="duotone" />
                  Near-Term Actions (Next 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.insights.actionPlan.nearTerm.map((action, idx) => (
                    <div key={idx} className="p-4 bg-card border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-0.5">
                          P{action.priority}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">{action.action}</div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-semibold">Expected Impact: </span>
                            {action.expectedImpact}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <List className="text-accent" size={28} weight="duotone" />
                  Strategic Actions (Next 90 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.insights.actionPlan.strategic.map((action, idx) => (
                    <div key={idx} className="p-4 bg-card border border-accent/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-0.5">
                          P{action.priority}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">{action.action}</div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-semibold">Expected Impact: </span>
                            {action.expectedImpact}
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
  );
}
