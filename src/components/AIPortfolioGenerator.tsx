import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkle,
  ChartBar,
  Warning,
  TrendUp,
  ShieldCheck,
  ArrowRight,
  FileText,
  Lightning,
  Target,
  Brain,
  Download,
  FilePdf,
} from '@phosphor-icons/react';
import { formatCurrency, formatPercent } from '@/lib/format';
import { generateAIEnhancedPortfolioReport, type AIEnhancedPortfolioReport } from '@/lib/aiPortfolioReport';
import { portfolioApi } from '@/lib/portfolioApi';
import { exportToPDF, generatePDFFilename } from '@/lib/pdfExport';
import { toast } from 'sonner';

type PortfolioSize = 'small' | 'medium' | 'large' | 'institutional';
type RiskProfile = 'conservative' | 'moderate' | 'balanced' | 'aggressive';

interface PortfolioConfig {
  size: PortfolioSize;
  riskProfile: RiskProfile;
  label: string;
  valueRange: string;
  description: string;
  typicalUse: string;
}

const PORTFOLIO_CONFIGS: Record<PortfolioSize, {
  label: string;
  valueRange: string;
  description: string;
  walletAddress: string;
}> = {
  small: {
    label: 'Small Portfolio',
    valueRange: '$50K - $500K',
    description: 'Individual investors and small funds',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  },
  medium: {
    label: 'Medium Portfolio',
    valueRange: '$500K - $5M',
    description: 'Growing DAOs and family offices',
    walletAddress: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
  },
  large: {
    label: 'Large Portfolio',
    valueRange: '$5M - $50M',
    description: 'Established funds and protocol treasuries',
    walletAddress: '0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f',
  },
  institutional: {
    label: 'Institutional',
    valueRange: '$50M+',
    description: 'Major institutions and hedge funds',
    walletAddress: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
  },
};

const RISK_PROFILES: Record<RiskProfile, {
  label: string;
  description: string;
  targetReturn: string;
  maxDrawdown: string;
  color: string;
}> = {
  conservative: {
    label: 'Conservative',
    description: 'Capital preservation focused with stable yields',
    targetReturn: '4-7% APY',
    maxDrawdown: '< 5%',
    color: 'text-green-400',
  },
  moderate: {
    label: 'Moderate',
    description: 'Balanced approach with calculated risks',
    targetReturn: '7-12% APY',
    maxDrawdown: '< 10%',
    color: 'text-blue-400',
  },
  balanced: {
    label: 'Balanced',
    description: 'Growth-oriented with diversified risk',
    targetReturn: '12-18% APY',
    maxDrawdown: '< 15%',
    color: 'text-yellow-400',
  },
  aggressive: {
    label: 'Aggressive',
    description: 'High-growth seeking with higher volatility',
    targetReturn: '18-30% APY',
    maxDrawdown: '< 25%',
    color: 'text-orange-400',
  },
};

export function AIPortfolioGenerator() {
  const [selectedSize, setSelectedSize] = useState<PortfolioSize>('medium');
  const [selectedRisk, setSelectedRisk] = useState<RiskProfile>('moderate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [report, setReport] = useState<AIEnhancedPortfolioReport | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setReport(null);

    try {
      setGenerationProgress(20);
      const walletAddress = PORTFOLIO_CONFIGS[selectedSize].walletAddress;

      setGenerationProgress(40);
      const [positions, exposure, summary] = await Promise.all([
        portfolioApi.getPositions(walletAddress),
        portfolioApi.getExposure(walletAddress),
        portfolioApi.getSummary(walletAddress),
      ]);

      setGenerationProgress(60);
      const aiReport = await generateAIEnhancedPortfolioReport(positions, exposure, summary);

      setGenerationProgress(100);
      setReport(aiReport);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const sizeConfig = PORTFOLIO_CONFIGS[selectedSize];
  const riskConfig = RISK_PROFILES[selectedRisk];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Sparkle className="text-accent" size={24} weight="fill" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Portfolio Report Generator</CardTitle>
              <CardDescription>
                Generate comprehensive AI-powered portfolio analysis for different sizes and risk profiles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Portfolio Size</label>
              <Select value={selectedSize} onValueChange={(v) => setSelectedSize(v as PortfolioSize)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PORTFOLIO_CONFIGS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col items-start">
                        <div className="font-semibold">{config.label}</div>
                        <div className="text-xs text-muted-foreground">{config.valueRange}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Card className="bg-muted/30 border-0">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Value Range:</span>
                    <span className="text-sm font-semibold">{sizeConfig.valueRange}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{sizeConfig.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Risk Profile</label>
              <Select value={selectedRisk} onValueChange={(v) => setSelectedRisk(v as RiskProfile)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RISK_PROFILES).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col items-start">
                        <div className="font-semibold">{config.label}</div>
                        <div className="text-xs text-muted-foreground">{config.targetReturn}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Card className="bg-muted/30 border-0">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Target Return:</span>
                    <span className="text-sm font-semibold">{riskConfig.targetReturn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Max Drawdown:</span>
                    <span className="text-sm font-semibold">{riskConfig.maxDrawdown}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{riskConfig.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Brain className="text-accent" size={24} />
              <div>
                <p className="text-sm font-semibold">AI-Powered Analysis</p>
                <p className="text-xs text-muted-foreground">
                  GPT-4 will analyze portfolio composition, risk exposures, and generate optimization recommendations
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isGenerating ? (
                <>
                  <Lightning className="mr-2 animate-pulse" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkle className="mr-2" size={20} weight="fill" />
                  Generate Report
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Analyzing portfolio with AI...</span>
                <span className="font-semibold">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {report && <AIReportDisplay report={report} sizeLabel={sizeConfig.label} riskLabel={riskConfig.label} />}
    </div>
  );
}

function AIReportDisplay({ 
  report, 
  sizeLabel, 
  riskLabel 
}: { 
  report: AIEnhancedPortfolioReport; 
  sizeLabel: string; 
  riskLabel: string;
}) {
  const { currentState, insights } = report;
  const healthColors = {
    excellent: 'text-green-400 bg-green-400/10 border-green-400/30',
    good: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    fair: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    concerning: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  };

  const handleExportPDF = () => {
    try {
      const filename = generatePDFFilename('ai_portfolio_report', sizeLabel);
      exportToPDF('ai-report-content', filename);
      toast.success('Report exported successfully', {
        description: 'Opening print dialog...',
      });
    } catch (error) {
      toast.error('Failed to export report', {
        description: 'Please try again or contact support.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">AI-Enhanced Portfolio Report</CardTitle>
              <CardDescription>
                Generated for {sizeLabel} · {riskLabel} Risk Profile · {new Date(report.generatedAt).toLocaleString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={healthColors[insights.executiveSummary.portfolioHealth]}>
                {insights.executiveSummary.portfolioHealth.toUpperCase()}
              </Badge>
              <Button onClick={handleExportPDF} className="no-print">
                <FilePdf className="mr-2" size={18} weight="fill" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6" id="ai-report-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Value</p>
              <p className="text-xl font-bold">{formatCurrency(currentState.totalValue)}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Positions</p>
              <p className="text-xl font-bold">{currentState.positionCount}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Avg APY</p>
              <p className="text-xl font-bold text-accent">{formatPercent(currentState.averageAPY)}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
              <p className="text-xl font-bold">{currentState.overallRisk.toFixed(1)}/10</p>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-accent/5 to-background border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={20} />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{insights.executiveSummary.overallAssessment}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Key Strengths
                  </h4>
                  <ul className="space-y-1">
                    {insights.executiveSummary.keyStrengths.map((strength, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                    <Warning size={16} />
                    Key Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {insights.executiveSummary.keyWeaknesses.map((weakness, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                  <Target size={16} />
                  Immediate Actions Required
                </h4>
                <ul className="space-y-2">
                  {insights.executiveSummary.immediateActions.map((action, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <ArrowRight className="text-accent mt-1 flex-shrink-0" size={16} />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="risk" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="diversification">Diversification</TabsTrigger>
              <TabsTrigger value="actions">Action Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="risk" className="space-y-4 mt-4">
              <RiskAnalysisTab insights={insights} />
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4 mt-4">
              <OptimizationTab insights={insights} />
            </TabsContent>

            <TabsContent value="diversification" className="space-y-4 mt-4">
              <DiversificationTab insights={insights} />
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-4">
              <ActionPlanTab insights={insights} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function RiskAnalysisTab({ insights }: { insights: any }) {
  const concentrationColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Warning size={18} />
            Concentration Risk
            <Badge className={concentrationColors[insights.riskAnalysis.concentrationRisk.level]}>
              {insights.riskAnalysis.concentrationRisk.level.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{insights.riskAnalysis.concentrationRisk.assessment}</p>
          
          <div className="space-y-2">
            <h5 className="text-sm font-semibold">Concerns:</h5>
            <ul className="space-y-1">
              {insights.riskAnalysis.concentrationRisk.concerns.map((concern: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-orange-400">•</span>
                  {concern}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-semibold">Recommendations:</h5>
            <ul className="space-y-1">
              {insights.riskAnalysis.concentrationRisk.recommendations.map((rec: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <ArrowRight className="text-accent flex-shrink-0 mt-1" size={14} />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Protocol Risk Exposures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{insights.riskAnalysis.protocolRisk.assessment}</p>
          
          {insights.riskAnalysis.protocolRisk.highRiskExposures.length > 0 && (
            <div className="space-y-2">
              {insights.riskAnalysis.protocolRisk.highRiskExposures.map((exposure: any, i: number) => (
                <div key={i} className="p-3 bg-orange-400/10 border border-orange-400/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{exposure.protocol}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formatPercent(exposure.exposure)} exposure</Badge>
                      <Badge variant="outline">Risk: {exposure.riskScore.toFixed(1)}/10</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{exposure.reasoning}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yield Sustainability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Incentive Dependence</p>
              <p className="text-lg font-bold">{formatPercent(insights.riskAnalysis.yieldSustainability.incentiveDependence)}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Sustainability Score</p>
              <p className="text-lg font-bold text-accent">{insights.riskAnalysis.yieldSustainability.sustainabilityScore}/100</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{insights.riskAnalysis.yieldSustainability.assessment}</p>
          <p className="text-sm text-muted-foreground italic">{insights.riskAnalysis.yieldSustainability.outlook}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function OptimizationTab({ insights }: { insights: any }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendUp size={18} />
            Rebalancing Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.optimizationRecommendations.rebalancing.map((rec: any, i: number) => {
            const actionColors = {
              reduce: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
              maintain: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
              increase: 'text-green-400 bg-green-400/10 border-green-400/30',
            };

            return (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{rec.currentVault}</span>
                  <Badge className={actionColors[rec.action]}>{rec.action.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center gap-4 mb-2 text-sm">
                  <span className="text-muted-foreground">
                    Current: <span className="font-semibold">{formatPercent(rec.currentAllocation)}</span>
                  </span>
                  <ArrowRight size={14} />
                  <span className="text-muted-foreground">
                    Target: <span className="font-semibold">{formatPercent(rec.targetAllocation)}</span>
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-background">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkle size={18} weight="fill" className="text-accent" />
            New Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.optimizationRecommendations.newOpportunities.map((opp: any, i: number) => (
            <div key={i} className="p-4 border border-accent/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold">{opp.vaultName}</span>
                  <p className="text-xs text-muted-foreground">{opp.protocol}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">{formatPercent(opp.apy)} APY</p>
                  <p className="text-xs text-muted-foreground">Risk: {opp.riskScore.toFixed(1)}/10</p>
                </div>
              </div>
              <div className="mb-2">
                <Badge className="bg-accent/10 text-accent">
                  Suggested: {formatPercent(opp.suggestedAllocation)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{opp.reasoning}</p>
              <div className="flex flex-wrap gap-1">
                {opp.benefits.map((benefit: string, j: number) => (
                  <Badge key={j} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {insights.optimizationRecommendations.exitRecommendations.length > 0 && (
        <Card className="border-2 border-orange-400/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-orange-400">
              <Warning size={18} />
              Exit Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.optimizationRecommendations.exitRecommendations.map((exit: any, i: number) => (
              <div key={i} className="p-4 bg-orange-400/10 border border-orange-400/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{exit.vaultName}</span>
                  <Badge className="bg-orange-400/20 text-orange-400">
                    {exit.urgency.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm mb-2">
                  Current Allocation: <span className="font-semibold">{formatPercent(exit.currentAllocation)}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-2">{exit.reasoning}</p>
                {exit.alternativeSuggestion && (
                  <p className="text-sm text-accent">
                    → Consider: {exit.alternativeSuggestion}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DiversificationTab({ insights }: { insights: any }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Diversification Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current Score</p>
              <p className="text-2xl font-bold">{insights.diversificationStrategy.currentScore}/100</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-xs text-muted-foreground mb-1">Target Score</p>
              <p className="text-2xl font-bold text-accent">{insights.diversificationStrategy.targetScore}/100</p>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold mb-2">Diversification Gaps:</h5>
            <ul className="space-y-1">
              {insights.diversificationStrategy.gaps.map((gap: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <Warning className="text-orange-400 flex-shrink-0 mt-1" size={14} />
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {insights.diversificationStrategy.specificActions.map((action: any, i: number) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-base capitalize">{action.category} Diversification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current</p>
                <p className="text-sm font-semibold">{action.currentExposure}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target</p>
                <p className="text-sm font-semibold text-accent">{action.targetExposure}</p>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-semibold mb-2">Actions:</h5>
              <ul className="space-y-1">
                {action.actions.map((actionItem: string, j: number) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <ArrowRight className="text-accent flex-shrink-0 mt-1" size={14} />
                    {actionItem}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActionPlanTab({ insights }: { insights: any }) {
  const timeframes = [
    { key: 'immediate', label: 'Immediate Actions', sublabel: 'Next 7 days', color: 'text-orange-400' },
    { key: 'nearTerm', label: 'Near-Term Actions', sublabel: 'Next 30 days', color: 'text-blue-400' },
    { key: 'strategic', label: 'Strategic Actions', sublabel: 'Next 90 days', color: 'text-green-400' },
  ];

  return (
    <div className="space-y-4">
      {timeframes.map(({ key, label, sublabel, color }) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className={`text-base ${color}`}>{label}</CardTitle>
            <CardDescription>{sublabel}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.actionPlan[key].map((action: any, i: number) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">{action.priority}</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1">{action.action}</p>
                    <p className="text-sm text-muted-foreground">
                      Expected Impact: {action.expectedImpact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
