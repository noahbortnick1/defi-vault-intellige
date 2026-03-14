import { RiskFactors, Vault } from './types';

export function calculateRiskScore(vault: Vault): { score: number; factors: RiskFactors } {
  const protocolDependency = calculateProtocolDependencyRisk(vault.dependencies);
  const oracleRisk = calculateOracleRisk(vault.oracleType);
  const upgradeabilityRisk = calculateUpgradeabilityRisk(vault.upgradeability);
  const liquidityRisk = calculateLiquidityRisk(vault.liquidityDepth, vault.tvl);

  const weights = {
    protocolDependency: 0.30,
    oracleRisk: 0.25,
    upgradeabilityRisk: 0.25,
    liquidityRisk: 0.20,
  };

  const score =
    protocolDependency * weights.protocolDependency +
    oracleRisk * weights.oracleRisk +
    upgradeabilityRisk * weights.upgradeabilityRisk +
    liquidityRisk * weights.liquidityRisk;

  return {
    score: Math.round(score * 10) / 10,
    factors: {
      protocolDependency,
      oracleRisk,
      upgradeabilityRisk,
      liquidityRisk,
    },
  };
}

function calculateProtocolDependencyRisk(dependencies: string[]): number {
  if (dependencies.length === 0) return 2;
  if (dependencies.length === 1) return 3;
  if (dependencies.length === 2) return 5;
  if (dependencies.length === 3) return 7;
  return 9;
}

function calculateOracleRisk(oracleType: Vault['oracleType']): number {
  switch (oracleType) {
    case 'chainlink':
      return 2;
    case 'uniswap':
      return 5;
    case 'internal':
      return 8;
    case 'none':
      return 1;
  }
}

function calculateUpgradeabilityRisk(upgradeability: Vault['upgradeability']): number {
  switch (upgradeability) {
    case 'immutable':
      return 1;
    case 'timelock':
      return 3;
    case 'multisig':
      return 6;
    case 'eoa':
      return 10;
  }
}

function calculateLiquidityRisk(liquidityDepth: number, tvl: number): number {
  const ratio = liquidityDepth / tvl;
  if (ratio >= 3) return 2;
  if (ratio >= 2) return 3;
  if (ratio >= 1.5) return 5;
  if (ratio >= 1) return 7;
  return 9;
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score <= 3) return 'low';
  if (score <= 6) return 'medium';
  return 'high';
}

export function getRiskColor(score: number): string {
  const level = getRiskLevel(score);
  switch (level) {
    case 'low':
      return 'oklch(0.70 0.20 145)';
    case 'medium':
      return 'oklch(0.75 0.18 85)';
    case 'high':
      return 'oklch(0.65 0.24 25)';
  }
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generateYieldHistory(baseAPY: number, days: number = 90): Array<{ timestamp: number; apy: number; tvl: number }> {
  const data = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  for (let i = days; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * baseAPY * 0.2;
    const apy = Math.max(0, baseAPY + variance);
    const tvlVariance = (Math.random() - 0.5) * 0.3;
    const tvl = Math.max(0, 1 + tvlVariance);
    
    data.push({
      timestamp: now - i * dayMs,
      apy,
      tvl,
    });
  }
  
  return data;
}
