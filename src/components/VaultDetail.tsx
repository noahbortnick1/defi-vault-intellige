import { Vault } from '@/lib/types';
import { calculateRiskScore, formatCurrency, formatPercent, formatAddress } from '@/lib/risk';
import { RiskBadge } from './RiskBadge';
import { YieldChart } from './YieldChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ArrowLeft, Copy, ShieldWarning, ChartLine, Link } from '@phosphor-icons/react';
import { generateVaultHistory } from '@/lib/mockData';
import { toast } from 'sonner';

interface VaultDetailProps {
  vault: Vault;
  onBack: () => void;
}

export function VaultDetail({ vault, onBack }: VaultDetailProps) {
  const { factors } = calculateRiskScore(vault);
  const history = generateVaultHistory(vault);

  const copyAddress = () => {
    navigator.clipboard.writeText(vault.address);
    toast.success('Address copied to clipboard');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vault.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {vault.protocol.charAt(0).toUpperCase() + vault.protocol.slice(1)} • {vault.chain.charAt(0).toUpperCase() + vault.chain.slice(1)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Current APY
            </p>
            <p className="text-3xl font-bold text-[oklch(0.75_0.15_195)]">
              {formatPercent(vault.apy)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Total Value Locked
            </p>
            <p className="text-3xl font-bold">{formatCurrency(vault.tvl)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Risk Score
            </p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold">{vault.riskScore.toFixed(1)}</p>
              <RiskBadge score={vault.riskScore} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldWarning className="text-muted-foreground" />
              Risk Analysis
            </CardTitle>
            <CardDescription>Breakdown of risk factors contributing to the score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Protocol Dependency</span>
                <span className="text-sm font-mono">{factors.protocolDependency.toFixed(1)}/10</span>
              </div>
              <Progress value={factors.protocolDependency * 10} />
              <p className="text-xs text-muted-foreground mt-1">
                {vault.dependencies.length} external protocol dependencies
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Oracle Risk</span>
                <span className="text-sm font-mono">{factors.oracleRisk.toFixed(1)}/10</span>
              </div>
              <Progress value={factors.oracleRisk * 10} />
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {vault.oracleType} oracle system
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Upgradeability Risk</span>
                <span className="text-sm font-mono">{factors.upgradeabilityRisk.toFixed(1)}/10</span>
              </div>
              <Progress value={factors.upgradeabilityRisk * 10} />
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {vault.upgradeability} contract
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Liquidity Risk</span>
                <span className="text-sm font-mono">{factors.liquidityRisk.toFixed(1)}/10</span>
              </div>
              <Progress value={factors.liquidityRisk * 10} />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(vault.liquidityDepth)} liquidity depth
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartLine className="text-muted-foreground" />
              APY History
            </CardTitle>
            <CardDescription>90-day yield performance</CardDescription>
          </CardHeader>
          <CardContent>
            <YieldChart data={history} width={500} height={250} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Details</CardTitle>
          <CardDescription>How this vault generates yield</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Strategy Description</h4>
            <p className="text-sm text-muted-foreground">{vault.strategy}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Protocol Dependencies</h4>
            <div className="flex flex-wrap gap-2">
              {vault.dependencies.length > 0 ? (
                vault.dependencies.map((dep) => (
                  <Badge key={dep} variant="secondary" className="flex items-center gap-1">
                    <Link size={14} />
                    {dep}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No external dependencies</span>
              )}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Contract Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Contract Address</span>
                <Button variant="ghost" size="sm" onClick={copyAddress} className="font-mono text-xs">
                  {formatAddress(vault.address)}
                  <Copy className="ml-2" size={14} />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Asset</span>
                <span className="font-mono font-medium">{vault.asset}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Chain</span>
                <Badge variant="outline" className="capitalize">{vault.chain}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
