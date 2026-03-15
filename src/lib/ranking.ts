import type { Vault, RankingScore, RankedVault, RankingMode } from './types';

interface RankingWeights {
  apy: number;
  risk: number;
  liquidity: number;
  audit: number;
  dependency: number;
  incentive: number;
}

const RANKING_WEIGHTS: Record<RankingMode, RankingWeights> = {
  'risk-adjusted': {
    apy: 0.25,
    risk: 0.35,
    liquidity: 0.20,
    audit: 0.10,
    dependency: 0.05,
    incentive: 0.05,
  },
  'highest-yield': {
    apy: 0.60,
    risk: 0.15,
    liquidity: 0.10,
    audit: 0.05,
    dependency: 0.05,
    incentive: 0.05,
  },
  'institutional-fit': {
    apy: 0.15,
    risk: 0.30,
    liquidity: 0.25,
    audit: 0.20,
    dependency: 0.05,
    incentive: 0.05,
  },
  'best-liquidity': {
    apy: 0.20,
    risk: 0.20,
    liquidity: 0.45,
    audit: 0.05,
    dependency: 0.05,
    incentive: 0.05,
  },
};

function normalizeAPY(apy: number): number {
  const maxAPY = 50;
  return Math.min(apy / maxAPY, 1) * 100;
}

function normalizeRisk(riskScore: number): number {
  return (1 - riskScore / 10) * 100;
}

function normalizeLiquidity(liquidityScore: number): number {
  return liquidityScore * 10;
}

function calculateAuditScore(vault: Vault): number {
  const auditCount = vault.audits?.length || 0;
  const hasTopAuditor = vault.audits?.some(a => 
    ['Trail of Bits', 'OpenZeppelin', 'Certora', 'ChainSecurity', 'Spearbit'].includes(a.auditor)
  ) || false;
  
  let score = Math.min(auditCount * 20, 80);
  if (hasTopAuditor) score += 20;
  
  return Math.min(score, 100);
}

function calculateDependencyScore(vault: Vault): number {
  const depCount = vault.dependencyIds?.length || 0;
  
  if (depCount === 0) return 100;
  if (depCount === 1) return 90;
  if (depCount === 2) return 75;
  if (depCount === 3) return 60;
  if (depCount === 4) return 45;
  return Math.max(30, 100 - depCount * 15);
}

function calculateIncentiveScore(vault: Vault): number {
  const totalAPY = vault.apy;
  const realYield = vault.realYield || 0;
  const incentiveYield = vault.incentiveYield || 0;
  
  if (totalAPY === 0) return 0;
  
  const realYieldRatio = realYield / totalAPY;
  return realYieldRatio * 100;
}

function generateReasoning(mode: RankingMode, scores: any, vault: Vault): string {
  const reasons: string[] = [];
  
  if (mode === 'risk-adjusted') {
    reasons.push(`Risk-adjusted score prioritizes safety (${vault.riskBand} risk)`);
    if (scores.netApyScore > 70) reasons.push('strong yield');
    if (scores.liquidityScore > 80) reasons.push('excellent liquidity');
    if (scores.auditScore > 80) reasons.push('well-audited');
  } else if (mode === 'highest-yield') {
    reasons.push(`Optimized for maximum APY (${vault.apy.toFixed(1)}%)`);
    if (vault.realYield > vault.apy * 0.5) reasons.push('strong real yield component');
  } else if (mode === 'institutional-fit') {
    reasons.push('Institutional criteria: audits, liquidity, risk profile');
    if (vault.institutionalGrade) reasons.push('institutional grade');
    if (scores.auditScore > 90) reasons.push('exceptional audit coverage');
  } else if (mode === 'best-liquidity') {
    reasons.push(`Liquidity-optimized (${vault.tvl > 100000000 ? 'high' : vault.tvl > 10000000 ? 'medium' : 'low'} TVL)`);
    if (scores.liquidityScore > 85) reasons.push('deep exit liquidity');
  }
  
  return reasons.join(', ');
}

export function rankVaults(vaults: Vault[], mode: RankingMode = 'risk-adjusted'): RankedVault[] {
  const weights = RANKING_WEIGHTS[mode];
  
  const scoredVaults = vaults.map(vault => {
    const netApyScore = normalizeAPY(vault.apy);
    const riskScore = normalizeRisk(vault.riskScore);
    const liquidityScore = normalizeLiquidity(vault.liquidityScore);
    const auditScore = calculateAuditScore(vault);
    const dependencyScore = calculateDependencyScore(vault);
    const incentiveScore = calculateIncentiveScore(vault);
    
    const overallScore = 
      netApyScore * weights.apy +
      riskScore * weights.risk +
      liquidityScore * weights.liquidity +
      auditScore * weights.audit +
      dependencyScore * weights.dependency +
      incentiveScore * weights.incentive;
    
    const ranking: RankingScore = {
      vaultId: vault.id,
      overallScore: Math.round(overallScore * 10) / 10,
      netApyScore: Math.round(netApyScore * 10) / 10,
      riskScore: Math.round(riskScore * 10) / 10,
      liquidityScore: Math.round(liquidityScore * 10) / 10,
      auditScore: Math.round(auditScore * 10) / 10,
      dependencyScore: Math.round(dependencyScore * 10) / 10,
      incentiveScore: Math.round(incentiveScore * 10) / 10,
      rank: 0,
      reasoning: generateReasoning(mode, {
        netApyScore,
        riskScore,
        liquidityScore,
        auditScore,
        dependencyScore,
        incentiveScore
      }, vault),
    };
    
    return {
      ...vault,
      ranking,
    };
  });
  
  scoredVaults.sort((a, b) => b.ranking.overallScore - a.ranking.overallScore);
  
  scoredVaults.forEach((vault, index) => {
    vault.ranking.rank = index + 1;
  });
  
  return scoredVaults;
}

export function filterAndRankVaults(
  vaults: Vault[],
  mode: RankingMode,
  filters: {
    asset?: string;
    chain?: string;
    protocol?: string;
    riskBand?: string;
  }
): RankedVault[] {
  let filtered = vaults;
  
  if (filters.asset) {
    filtered = filtered.filter(v => v.asset.toLowerCase() === filters.asset!.toLowerCase());
  }
  
  if (filters.chain) {
    filtered = filtered.filter(v => v.chain === filters.chain);
  }
  
  if (filters.protocol) {
    filtered = filtered.filter(v => v.protocolId.toLowerCase() === filters.protocol!.toLowerCase());
  }
  
  if (filters.riskBand) {
    filtered = filtered.filter(v => v.riskBand === filters.riskBand);
  }
  
  return rankVaults(filtered, mode);
}
