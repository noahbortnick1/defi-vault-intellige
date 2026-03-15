import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  ArrowRight,
  Lightning,
  ShieldCheck,
  Drop,
  ChartPie,
  CurrencyDollar,
  TrendUp,
  Warning,
  CheckCircle,
  Buildings,
  SlidersHorizontal,
} from '@phosphor-icons/react';
import { VAULTS } from '@/lib/mockData';
import { formatCurrency, formatPercent, getRiskBgColor, getStrategyLabel } from '@/lib/format';
import type { Vault } from '@/lib/types';

interface AllocationInput {
  asset: string;
  capital: string;
  maxRisk: string;
  liquidity: 'high' | 'medium' | 'any';
}

interface AllocationRecommendation {
  vault: Vault;
  amount: number;
  percentage: number;
  rationale: string;
}

interface AllocationResult {
  totalCapital: number;
  recommendations: AllocationRecommendation[];
  methodology: string;
  constraints: string[];
  warnings: string[];
}

const ASSETS = ['USDC', 'DAI', 'WETH', 'WBTC', 'All'];
const LIQUIDITY_LABELS: Record<string, string> = {
  high: 'High (≥ 8.0)',
  medium: 'Medium (≥ 5.0)',
  any: 'Any',
};

function computeAllocation(input: AllocationInput): AllocationResult | null {
  const capital = parseFloat(input.capital.replace(/[,$]/g, ''));
  const maxRisk = parseFloat(input.maxRisk);

  if (isNaN(capital) || capital <= 0) return null;
  if (isNaN(maxRisk) || maxRisk < 0 || maxRisk > 10) return null;

  const minLiquidity = input.liquidity === 'high' ? 8.0 : input.liquidity === 'medium' ? 5.0 : 0;

  const eligible = VAULTS.filter((v) => {
    if (v.status !== 'active') return false;
    if (input.asset !== 'All' && v.asset !== input.asset) return false;
    if (v.riskScore > maxRisk) return false;
    if (v.liquidityScore < minLiquidity) return false;
    return true;
  });

  if (eligible.length === 0) return null;

// Scoring formula: (10 - riskScore) / 10 normalizes risk to a 0–1 benefit scale
// (lower risk → higher benefit score). Multiplied by APY for yield-weighted output,
// then by liquidityScore / 10 to downweight illiquid vaults. All factors are on the
// same [0, 1] scale so no additional normalization is needed.
  const scored = eligible.map((v) => ({
    vault: v,
    score: ((10 - v.riskScore) / 10) * v.apy * (v.liquidityScore / 10),
  }));

  // Sort by score descending, take top 5
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(5, scored.length));

  const totalScore = top.reduce((s, t) => s + t.score, 0);

  const maxSingleVaultPct = 0.40;
  // Warn when top allocation approaches the cap (38% triggers warning before hitting 40% hard cap)
  const MAX_CONCENTRATION_WARNING_THRESHOLD = 38;
  const recommendations: AllocationRecommendation[] = top.map(({ vault, score }) => {
    let pct = score / totalScore;
    pct = Math.min(pct, maxSingleVaultPct);
    const amount = Math.round(capital * pct);
    return {
      vault,
      amount,
      percentage: Math.round(pct * 1000) / 10,
      rationale: `Risk ${vault.riskScore.toFixed(1)}/10 · APY ${vault.apy.toFixed(1)}% · Liquidity ${vault.liquidityScore.toFixed(1)}/10`,
    };
  });

  // Normalize so percentages sum to 100%
  const totalPct = recommendations.reduce((s, r) => s + r.percentage, 0);
  const scaleFactor = 100 / totalPct;
  let allocatedTotal = 0;
  recommendations.forEach((r, i) => {
    if (i < recommendations.length - 1) {
      r.percentage = Math.round(r.percentage * scaleFactor * 10) / 10;
      r.amount = Math.round((r.percentage / 100) * capital);
      allocatedTotal += r.amount;
    } else {
      r.amount = capital - allocatedTotal;
      r.percentage = Math.round((r.amount / capital) * 1000) / 10;
    }
  });

  const warnings: string[] = [];
  if (recommendations.length < 3) {
    warnings.push('Limited vault options match your criteria — consider relaxing risk or liquidity constraints.');
  }
  if (maxRisk <= 3) {
    warnings.push('Conservative risk threshold may limit yield opportunities.');
  }
  const topAlloc = recommendations[0]?.percentage || 0;
  if (topAlloc >= MAX_CONCENTRATION_WARNING_THRESHOLD) {
    warnings.push('Top allocation is concentrated — consider diversifying further across protocols.');
  }

  return {
    totalCapital: capital,
    recommendations,
    methodology: 'Risk-adjusted yield optimization weighted by protocol liquidity score. Allocations capped at 40% per vault.',
    constraints: [
      `Asset: ${input.asset}`,
      `Max risk score: ${maxRisk}/10`,
      `Min liquidity: ${LIQUIDITY_LABELS[input.liquidity]}`,
      'Max 40% per single vault',
    ],
    warnings,
  };
}

interface AllocationEngineProps {
  renderNav: () => React.ReactNode;
}

export function AllocationEngine({ renderNav }: AllocationEngineProps) {
  const [form, setForm] = useState<AllocationInput>({
    asset: 'USDC',
    capital: '10000000',
    maxRisk: '4',
    liquidity: 'high',
  });
  const [result, setResult] = useState<AllocationResult | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const handleRun = () => {
    const r = computeAllocation(form);
    setResult(r);
    setHasRun(true);
  };

  const formatInputCapital = (raw: string) => {
    const num = parseFloat(raw.replace(/[,$]/g, ''));
    if (isNaN(num)) return raw;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  const capitalDisplay = formatInputCapital(form.capital);

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Target className="text-accent" size={28} weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Allocation Engine</h1>
              <p className="text-muted-foreground">
                Simulate capital allocation across DeFi yield strategies based on asset, risk tolerance, and liquidity requirements
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal size={20} />
                  Allocation Parameters
                </CardTitle>
                <CardDescription>Configure your capital deployment constraints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Asset */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Target Asset</label>
                  <div className="flex flex-wrap gap-2">
                    {ASSETS.map((a) => (
                      <Button
                        key={a}
                        variant={form.asset === a ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setForm({ ...form, asset: a })}
                      >
                        {a}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Capital */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Capital Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="10000000"
                    value={form.capital}
                    onChange={(e) => setForm({ ...form, capital: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{capitalDisplay}</p>
                </div>

                {/* Max Risk */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center justify-between">
                    Max Risk Score
                    <Badge
                      className={`text-xs ${
                        parseFloat(form.maxRisk) <= 3
                          ? 'bg-green-500/10 text-green-400'
                          : parseFloat(form.maxRisk) <= 6
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {form.maxRisk} / 10
                    </Badge>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={form.maxRisk}
                    onChange={(e) => setForm({ ...form, maxRisk: e.target.value })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative (0–3)</span>
                    <span>Moderate (3–6)</span>
                    <span>Aggressive (6–10)</span>
                  </div>
                </div>

                {/* Liquidity */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Liquidity Requirement</label>
                  <div className="flex flex-col gap-2">
                    {(['high', 'medium', 'any'] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => setForm({ ...form, liquidity: l })}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-left transition-colors ${
                          form.liquidity === l
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Drop size={14} />
                        {LIQUIDITY_LABELS[l]}
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full gap-2" onClick={handleRun} size="lg">
                  <Lightning size={18} weight="fill" />
                  Simulate Allocation
                  <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>

            {/* Risk Score Reference */}
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Risk Score Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { range: '0–2', label: 'Very Low', color: 'text-green-400', desc: 'Battle-tested, high TVL' },
                  { range: '2–4', label: 'Low', color: 'text-emerald-400', desc: 'Established protocols' },
                  { range: '4–6', label: 'Medium', color: 'text-yellow-400', desc: 'Moderate complexity' },
                  { range: '6–8', label: 'High', color: 'text-orange-400', desc: 'Complex strategies' },
                  { range: '8–10', label: 'Extreme', color: 'text-red-400', desc: 'High operational risk' },
                ].map((r) => (
                  <div key={r.range} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{r.range}</span>
                    <span className={`font-medium ${r.color}`}>{r.label}</span>
                    <span className="text-muted-foreground">{r.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!hasRun ? (
              <Card className="h-full flex items-center justify-center border-dashed">
                <CardContent className="text-center py-16">
                  <Target size={48} className="text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Ready to allocate</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Configure your parameters on the left and click <strong>Simulate Allocation</strong> to generate a recommended capital deployment plan.
                  </p>
                </CardContent>
              </Card>
            ) : result === null ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <Warning size={48} className="text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No matching vaults found</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    No active vaults match all your constraints. Try relaxing the risk limit, liquidity requirement, or selecting a different asset.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Summary Banner */}
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="py-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Capital</p>
                        <p className="text-xl font-bold">{formatCurrency(result.totalCapital, 1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vaults Selected</p>
                        <p className="text-xl font-bold">{result.recommendations.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Blended APY</p>
                        <p className="text-xl font-bold text-accent">
                          {formatPercent(
                            result.recommendations.reduce(
                              (s, r) => s + r.vault.apy * (r.percentage / 100),
                              0
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <Card className="border-yellow-500/30 bg-yellow-500/5">
                    <CardContent className="py-3">
                      {result.warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                          <Warning size={14} className="mt-0.5 shrink-0" />
                          {w}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Allocation Plan */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <ChartPie size={20} />
                      Allocation Plan
                    </CardTitle>
                    <CardDescription>{result.methodology}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.recommendations.map((rec, idx) => (
                      <div key={rec.vault.id} className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm truncate">{rec.vault.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {getStrategyLabel(rec.vault.strategyType)}
                                </Badge>
                                <Badge className={`text-xs ${getRiskBgColor(rec.vault.riskBand)}`}>
                                  Risk {rec.vault.riskScore.toFixed(1)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Buildings size={10} />
                                  {rec.vault.protocolName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendUp size={10} />
                                  {formatPercent(rec.vault.apy)} APY
                                </span>
                                <span className="flex items-center gap-1">
                                  <Drop size={10} />
                                  Liquidity {rec.vault.liquidityScore.toFixed(1)}/10
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-sm">{formatCurrency(rec.amount, 1)}</p>
                            <p className="text-xs text-muted-foreground">{rec.percentage}%</p>
                          </div>
                        </div>
                        <Progress value={rec.percentage} className="h-1.5" />
                        <p className="text-xs text-muted-foreground pl-8">{rec.rationale}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Constraints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ShieldCheck size={16} />
                        Applied Constraints
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {result.constraints.map((c, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle size={12} className="text-green-400 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Warning size={16} />
                        Downside Considerations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {[
                          'Smart contract risk remains even with audits',
                          'APY rates may decline with TVL growth',
                          'Incentive tokens subject to price volatility',
                          'Liquidity can deteriorate in market stress',
                        ].map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Warning size={12} className="text-yellow-400 shrink-0 mt-0.5" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Strategy Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CurrencyDollar size={16} />
                      Strategy Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        result.recommendations.reduce((map, rec) => {
                          const key = getStrategyLabel(rec.vault.strategyType);
                          map.set(key, (map.get(key) || 0) + rec.percentage);
                          return map;
                        }, new Map<string, number>())
                      ).map(([strategy, pct]) => (
                        <Badge key={strategy} variant="secondary" className="text-xs gap-1">
                          {strategy}
                          <span className="font-bold">{pct.toFixed(1)}%</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
