import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Sparkle,
  ShieldCheck,
  Warning,
  CheckCircle,
  TrendUp,
  Lock,
  Drop,
  Network,
  Info,
  ArrowRight,
} from '@phosphor-icons/react';
import type { VaultReport } from '@/api/types';
import { apiClient } from '@/api';

interface ApiReportViewerProps {
  vaultAddress: string;
  onClose?: () => void;
}

export function ApiReportViewer({ vaultAddress, onClose }: ApiReportViewerProps) {
  const [report, setReport] = useState<VaultReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (withAI: boolean) => {
    setIsLoading(true);
    setError(null);
    setUseAI(withAI);
    
    try {
      const generatedReport = await apiClient.getVaultReport(vaultAddress, withAI);
      if (generatedReport) {
        setReport(generatedReport);
      } else {
        setError('Vault not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <Sparkle size={48} className="text-accent animate-pulse" weight="duotone" />
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {useAI ? 'Generating AI-Enhanced Report' : 'Generating Report'}
              </h3>
              <p className="text-muted-foreground">
                {useAI ? 'Analyzing vault with AI insights...' : 'Compiling vault data...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-12 text-center">
          <Warning size={48} className="text-destructive mx-auto mb-4" weight="duotone" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => generateReport(true)}>Try Again with AI</Button>
            <Button variant="outline" onClick={() => generateReport(false)}>
              Try Standard Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={24} className="text-accent" weight="duotone" />
            Generate Vault Report
          </CardTitle>
          <CardDescription>
            Create a comprehensive due diligence report for {vaultAddress}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => generateReport(true)}
              className="flex-1"
            >
              <Sparkle className="mr-2" size={18} weight="fill" />
              Generate with AI
            </Button>
            <Button 
              variant="outline"
              onClick={() => generateReport(false)}
              className="flex-1"
            >
              Generate Standard Report
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            AI-enhanced reports provide deeper insights and recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  const vault = report.vault;
  const riskColor = vault.risk_score < 4 ? 'text-green-400' : 
                    vault.risk_score < 7 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FileText size={32} className="text-accent" weight="duotone" />
              <div>
                <CardTitle className="text-2xl">{vault.name}</CardTitle>
                <CardDescription>Due Diligence Report</CardDescription>
              </div>
            </div>
            {report.ai_insights && (
              <Badge className="bg-accent/10 text-accent border-accent/20">
                <Sparkle size={14} className="mr-1" weight="fill" />
                AI-Enhanced
              </Badge>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline">{vault.protocol}</Badge>
            <Badge variant="outline">{vault.chain}</Badge>
            <Badge variant="outline">{vault.asset}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">APY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{vault.apy.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">TVL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(vault.tvl / 1_000_000).toFixed(1)}M</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${riskColor}`}>
              {vault.risk_score.toFixed(1)}/10
            </div>
          </CardContent>
        </Card>
      </div>

      {report.ai_insights && (
        <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkle size={24} className="text-accent" weight="fill" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={20} className="text-accent" weight="fill" />
                Key Insights
              </h4>
              <ul className="space-y-2">
                {report.ai_insights.key_insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight size={18} className="text-accent mt-0.5 flex-shrink-0" weight="bold" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ShieldCheck size={20} className="text-accent" weight="fill" />
                Risk Assessment
              </h4>
              <p className="text-sm text-muted-foreground">{report.ai_insights.risk_assessment}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendUp size={20} className="text-accent" weight="fill" />
                Recommendations
              </h4>
              <p className="text-sm text-muted-foreground">{report.ai_insights.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="strategy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{report.strategy_summary}</p>
            </CardContent>
          </Card>

          {report.yield_sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendUp size={20} />
                  Yield Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {report.yield_sources.map((source, idx) => (
                    <Badge key={idx} variant="secondary">{source}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`text-5xl font-bold ${riskColor}`}>
                  {report.overall_risk_score.toFixed(1)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Risk Band</div>
                  <Badge className={
                    vault.risk_score < 4 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    vault.risk_score < 7 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-red-500/20 text-red-300 border-red-500/30'
                  }>
                    {vault.risk_score < 4 ? 'LOW' : vault.risk_score < 7 ? 'MEDIUM' : 'HIGH'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {report.red_flags.length > 0 && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <Warning className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Red Flags</div>
                <ul className="space-y-1">
                  {report.red_flags.map((flag, idx) => (
                    <li key={idx} className="text-sm">• {flag}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {report.dependencies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network size={20} />
                  Dependencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {report.dependencies.map((dep, idx) => (
                    <Badge key={idx} variant="outline">{dep}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Drop size={20} />
                Liquidity Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Depth</div>
                  <Badge variant={
                    report.liquidity_profile.depth === 'high' ? 'default' :
                    report.liquidity_profile.depth === 'medium' ? 'secondary' : 'outline'
                  }>
                    {report.liquidity_profile.depth.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Withdrawal Risk</div>
                  <Badge variant="outline">
                    {report.liquidity_profile.withdrawal_risk}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={20} />
                Contract Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Upgradeability</div>
                <Badge variant={
                  report.contract_risk.upgradeability === 'immutable' ? 'default' :
                  report.contract_risk.upgradeability === 'timelock_upgradeable' ? 'secondary' :
                  'destructive'
                }>
                  {report.contract_risk.upgradeability.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {report.contract_risk.timelock && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Timelock Duration</div>
                  <div className="font-medium">{report.contract_risk.timelock}</div>
                </div>
              )}

              {report.contract_risk.audits.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Security Audits</div>
                  <div className="flex flex-wrap gap-2">
                    {report.contract_risk.audits.map((auditor, idx) => (
                      <Badge key={idx} variant="outline" className="gap-1">
                        <ShieldCheck size={14} />
                        {auditor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => generateReport(!report.ai_insights)}
          className="flex-1"
        >
          {report.ai_insights ? 'Generate Standard Report' : 'Regenerate with AI'}
        </Button>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
