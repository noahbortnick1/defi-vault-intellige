import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Lightning,
  ChartPie,
  TrendUp,
  Drop,
  Warning,
  Buildings,
  ArrowRight,
  CheckCircle,
} from '@phosphor-icons/react';
import { VAULTS } from '@/lib/mockData';
import { formatCurrency, formatPercent, getRiskBgColor, getStrategyLabel } from '@/lib/format';
import type { Vault, StrategyType } from '@/lib/types';

/** Extended vault with mock data fields not yet in the Vault type */
interface MockApySource {
  type: string;
  apy: number;
  token: string;
  description: string;
  sustainable: boolean;
}

interface MockDependency {
  id: string;
  protocol: string;
  type: string;
  criticality?: string;
}

interface VaultWithMockFields extends Vault {
  apyBreakdown?: MockApySource[];
  dependencies?: MockDependency[];
}

const MOCK_VAULTS = VAULTS as VaultWithMockFields[];

/** Metadata about each strategy category */
interface StrategyMeta {
  label: string;
  description: string;
  mechanism: string;
  yieldDrivers: string[];
  complexityLabel: string;
  complexityColor: string;
  iconColor: string;
}

const STRATEGY_META: Record<StrategyType, StrategyMeta> = {
  lending: {
    label: 'Lending',
    description: 'Depositing assets into lending markets to earn interest from borrowers.',
    mechanism: 'Supply assets → earn variable interest rate based on utilization.',
    yieldDrivers: ['Borrow demand', 'Utilization rate', 'Token incentives'],
    complexityLabel: 'Low',
    complexityColor: 'text-green-400',
    iconColor: 'text-blue-400',
  },
  'delta-neutral': {
    label: 'Delta Neutral',
    description: 'Market-neutral strategies that capture funding rates without directional exposure.',
    mechanism: 'Long spot + short perp = net zero delta while capturing funding premium.',
    yieldDrivers: ['Perpetual funding rate', 'Basis spread', 'Liquidation fees'],
    complexityLabel: 'High',
    complexityColor: 'text-red-400',
    iconColor: 'text-purple-400',
  },
  'lp-farming': {
    label: 'LP Farming',
    description: 'Providing liquidity to AMM pools and earning trading fees and incentive rewards.',
    mechanism: 'Deposit into LP pool → earn fees proportional to share of pool volume.',
    yieldDrivers: ['Trading fees', 'CRV/CVX rewards', 'Token incentives'],
    complexityLabel: 'Medium',
    complexityColor: 'text-yellow-400',
    iconColor: 'text-green-400',
  },
  'basis-trade': {
    label: 'Basis Trade / Yield Tokenization',
    description: 'Splitting yield-bearing assets into principal and yield tokens for fixed or enhanced returns.',
    mechanism: 'Purchase PT at discount → receive face value at maturity = fixed yield.',
    yieldDrivers: ['PT discount to maturity', 'Underlying yield rate', 'Maturity date'],
    complexityLabel: 'High',
    complexityColor: 'text-red-400',
    iconColor: 'text-orange-400',
  },
  staking: {
    label: 'Staking',
    description: 'Validator staking or liquid restaking for protocol security rewards.',
    mechanism: 'Stake ETH/tokens with validators → earn consensus + execution rewards.',
    yieldDrivers: ['Validator rewards', 'MEV', 'Restaking points/yield'],
    complexityLabel: 'Low',
    complexityColor: 'text-green-400',
    iconColor: 'text-cyan-400',
  },
  'real-yield': {
    label: 'Real Yield',
    description: 'Protocol revenue-sharing strategies that distribute actual protocol fees.',
    mechanism: 'Hold protocol token → receive share of protocol revenue in stable assets.',
    yieldDrivers: ['Protocol fee revenue', 'Volume-driven fees', 'Treasury distributions'],
    complexityLabel: 'Low',
    complexityColor: 'text-green-400',
    iconColor: 'text-emerald-400',
  },
};

interface StrategyGroup {
  type: StrategyType;
  vaults: VaultWithMockFields[];
  avgApy: number;
  totalTvl: number;
  avgRisk: number;
  realYieldPct: number;
  incentiveYieldPct: number;
  feeYieldPct: number;
}

function groupByStrategy(vaults: VaultWithMockFields[]): StrategyGroup[] {
  const byType = new Map<StrategyType, VaultWithMockFields[]>();
  vaults.filter((v) => v.status === 'active').forEach((v) => {
    const arr = byType.get(v.strategyType) || [];
    arr.push(v);
    byType.set(v.strategyType, arr);
  });

  return Array.from(byType.entries()).map(([type, vaultList]) => {
    const count = vaultList.length;
    const avgApy = vaultList.reduce((s, v) => s + v.apy, 0) / count;
    const totalTvl = vaultList.reduce((s, v) => s + v.tvl, 0);
    const avgRisk = vaultList.reduce((s, v) => s + v.riskScore, 0) / count;

    // Simple average of yield component percentages across vaults
    const totalApy = vaultList.reduce((s, v) => s + v.apy, 0);
    const realYieldPct = totalApy > 0
      ? (vaultList.reduce((s, v) => s + v.realYield, 0) / totalApy) * 100
      : 0;
    const incentiveYieldPct = totalApy > 0
      ? (vaultList.reduce((s, v) => s + v.incentiveYield, 0) / totalApy) * 100
      : 0;
    const feeYieldPct = totalApy > 0
      ? (vaultList.reduce((s, v) => s + v.feeYield, 0) / totalApy) * 100
      : 0;

    return { type, vaults: vaultList, avgApy, totalTvl, avgRisk, realYieldPct, incentiveYieldPct, feeYieldPct };
  }).sort((a, b) => b.totalTvl - a.totalTvl);
}

interface StrategyIntelligenceProps {
  renderNav: () => React.ReactNode;
  onNavigateToVault?: (vaultId: string) => void;
}

export function StrategyIntelligence({ renderNav, onNavigateToVault }: StrategyIntelligenceProps) {
  const [selectedType, setSelectedType] = useState<StrategyType | null>(null);

  const groups = useMemo(() => groupByStrategy(MOCK_VAULTS), []);
  const totalTvl = useMemo(() => groups.reduce((s, g) => s + g.totalTvl, 0), [groups]);
  const selected = selectedType ? groups.find((g) => g.type === selectedType) : null;

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Lightning className="text-accent" size={28} weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Strategy Intelligence</h1>
              <p className="text-muted-foreground">
                Automatic classification of yield strategies with yield source decomposition and risk profiling
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {groups.map((group) => {
            const meta = STRATEGY_META[group.type];
            const tvlShare = (group.totalTvl / totalTvl) * 100;
            const isSelected = selectedType === group.type;
            return (
              <Card
                key={group.type}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary ring-1 ring-primary/30'
                    : 'hover:border-primary/40'
                }`}
                onClick={() => setSelectedType(isSelected ? null : group.type)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{meta.label}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {group.vaults.length} vault{group.vaults.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs line-clamp-2">{meta.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg APY</p>
                      <p className="font-bold text-sm text-accent">{formatPercent(group.avgApy)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Risk</p>
                      <p className="font-bold text-sm">{group.avgRisk.toFixed(1)}/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">TVL</p>
                      <p className="font-bold text-sm">{formatCurrency(group.totalTvl, 0)}</p>
                    </div>
                  </div>

                  {/* TVL Share */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">TVL Share</span>
                      <span>{tvlShare.toFixed(1)}%</span>
                    </div>
                    <Progress value={tvlShare} className="h-1.5" />
                  </div>

                  {/* Yield composition mini-bar */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Yield Sources</p>
                    <div className="flex rounded overflow-hidden h-2">
                      {group.realYieldPct > 0 && (
                        <div
                          className="bg-green-500 transition-all"
                          style={{ width: `${group.realYieldPct}%` }}
                          title={`Real yield ${group.realYieldPct.toFixed(0)}%`}
                        />
                      )}
                      {group.feeYieldPct > 0 && (
                        <div
                          className="bg-blue-500 transition-all"
                          style={{ width: `${group.feeYieldPct}%` }}
                          title={`Fees ${group.feeYieldPct.toFixed(0)}%`}
                        />
                      )}
                      {group.incentiveYieldPct > 0 && (
                        <div
                          className="bg-yellow-500 transition-all"
                          style={{ width: `${group.incentiveYieldPct}%` }}
                          title={`Incentives ${group.incentiveYieldPct.toFixed(0)}%`}
                        />
                      )}
                    </div>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {group.realYieldPct > 0 && (
                        <span className="text-xs flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                          Real {group.realYieldPct.toFixed(0)}%
                        </span>
                      )}
                      {group.feeYieldPct > 0 && (
                        <span className="text-xs flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                          Fees {group.feeYieldPct.toFixed(0)}%
                        </span>
                      )}
                      {group.incentiveYieldPct > 0 && (
                        <span className="text-xs flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                          Incentives {group.incentiveYieldPct.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${meta.complexityColor}`}>
                      Complexity: {meta.complexityLabel}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                      {isSelected ? 'Hide detail' : 'View detail'}
                      <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selected && (
          <StrategyDetailPanel
            group={selected}
            meta={STRATEGY_META[selected.type]}
            onNavigateToVault={onNavigateToVault}
          />
        )}

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Yield Source Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Real Yield</p>
                  <p className="text-xs text-muted-foreground">Protocol revenue from actual borrowing, trading, or staking activity. Sustainable without token inflation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Fee Yield</p>
                  <p className="text-xs text-muted-foreground">Trading fees earned from AMM LP positions. Correlates with market volume and is generally sustainable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Incentive Yield</p>
                  <p className="text-xs text-muted-foreground">Token emissions from protocol incentive programs. Subject to token price risk and program duration.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StrategyDetailPanel({
  group,
  meta,
  onNavigateToVault,
}: {
  group: StrategyGroup;
  meta: StrategyMeta;
  onNavigateToVault?: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Strategy Overview */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartPie size={20} className="text-primary" />
            {meta.label} — Strategy Profile
          </CardTitle>
          <CardDescription>{meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-2">Mechanism</h4>
            <p className="text-sm text-muted-foreground">{meta.mechanism}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Yield Drivers</h4>
            <ul className="space-y-1">
              {meta.yieldDrivers.map((d) => (
                <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={12} className="text-green-400 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Category Stats</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg APY</span>
                <span className="font-medium text-accent">{formatPercent(group.avgApy)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Risk</span>
                <span className="font-medium">{group.avgRisk.toFixed(1)} / 10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total TVL</span>
                <span className="font-medium">{formatCurrency(group.totalTvl, 1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Complexity</span>
                <span className={`font-medium ${meta.complexityColor}`}>{meta.complexityLabel}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vault Cards */}
      <h3 className="text-lg font-semibold">Vaults in this Strategy</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {group.vaults.map((vault) => (
          <VaultStrategyCard
            key={vault.id}
            vault={vault}
            onNavigate={onNavigateToVault}
          />
        ))}
      </div>
    </div>
  );
}

function VaultStrategyCard({
  vault,
  onNavigate,
}: {
  vault: VaultWithMockFields;
  onNavigate?: (id: string) => void;
}) {
  const totalYield = vault.apy;
  const realPct = totalYield > 0 ? (vault.realYield / totalYield) * 100 : 0;
  const feePct = totalYield > 0 ? (vault.feeYield / totalYield) * 100 : 0;
  const incentivePct = totalYield > 0 ? (vault.incentiveYield / totalYield) * 100 : 0;

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-sm truncate">{vault.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <Buildings size={10} className="text-muted-foreground" />
                <CardDescription className="text-xs">{vault.protocolName}</CardDescription>
              </div>
              <Badge className={`text-xs ${getRiskBgColor(vault.riskBand)}`}>
                Risk {vault.riskScore.toFixed(1)}
              </Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-accent">{formatPercent(vault.apy)}</p>
            <p className="text-xs text-muted-foreground">APY</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Yield Breakdown */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Yield Decomposition</p>
          {vault.realYield > 0 && (
            <YieldBar label="Real Yield" value={vault.realYield} pct={realPct} color="bg-green-500" />
          )}
          {vault.feeYield > 0 && (
            <YieldBar label="Fee Yield" value={vault.feeYield} pct={feePct} color="bg-blue-500" />
          )}
          {vault.incentiveYield > 0 && (
            <YieldBar label="Incentives" value={vault.incentiveYield} pct={incentivePct} color="bg-yellow-500" />
          )}
        </div>

        {/* APY Breakdown from sources */}
        {vault.apyBreakdown && vault.apyBreakdown.length > 1 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Source Breakdown</p>
            {vault.apyBreakdown.map((source, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  {source.sustainable ? (
                    <CheckCircle size={10} className="text-green-400" />
                  ) : (
                    <Warning size={10} className="text-yellow-400" />
                  )}
                  <span className="capitalize">{source.type.replace('-', ' ')}</span>
                  <span className="text-muted-foreground">({source.token})</span>
                </span>
                <span className="font-medium">{formatPercent(source.apy)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Dependencies count */}
        {vault.dependencies && vault.dependencies.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Warning size={12} className="text-yellow-400" />
            {vault.dependencies.length} external dependenc{vault.dependencies.length !== 1 ? 'ies' : 'y'}
          </div>
        )}

        {/* TVL + Liquidity */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Drop size={10} />
            TVL {formatCurrency(vault.tvl, 0)}
          </span>
          <span className="flex items-center gap-1">
            <TrendUp size={10} />
            Liquidity {vault.liquidityScore.toFixed(1)}/10
          </span>
        </div>

        {onNavigate && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onNavigate(vault.id)}
          >
            View Full Analysis
            <ArrowRight size={14} className="ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function YieldBar({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="mb-1.5">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-muted-foreground flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
          {label}
        </span>
        <span>
          {formatPercent(value)} <span className="text-muted-foreground">({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <Progress value={pct} className="h-1" />
    </div>
  );
}
