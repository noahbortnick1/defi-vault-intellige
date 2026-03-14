import type { Chain, RiskLevel, RiskBand } from './types';

export function formatCurrency(value: number, decimals: number = 0): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function getChainName(chain: Chain): string {
  const names: Record<Chain, string> = {
    'ethereum': 'Ethereum',
    'arbitrum': 'Arbitrum',
    'optimism': 'Optimism',
    'base': 'Base',
    'polygon': 'Polygon',
    'bsc': 'BSC'
  };
  return names[chain] || chain;
}

export function getRiskColor(riskLevel: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    'low': 'text-green-400',
    'medium': 'text-yellow-400',
    'high': 'text-red-400'
  };
  return colors[riskLevel] || 'text-muted-foreground';
}

export function getRiskBgColor(riskLevel: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    'low': 'bg-green-500/10 text-green-400',
    'medium': 'bg-yellow-500/10 text-yellow-400',
    'high': 'bg-red-500/10 text-red-400'
  };
  return colors[riskLevel] || 'bg-muted text-muted-foreground';
}

export function getRiskBandColor(riskBand: RiskBand): string {
  const colors: Record<RiskBand, string> = {
    'conservative': 'text-green-400',
    'moderate': 'text-yellow-400',
    'aggressive': 'text-red-400'
  };
  return colors[riskBand] || 'text-muted-foreground';
}

export function getStrategyLabel(strategyType: string): string {
  const labels: Record<string, string> = {
    'lending': 'Lending',
    'lp-farming': 'LP Farming',
    'delta-neutral': 'Delta Neutral',
    'basis-trade': 'Basis Trade',
    'staking': 'Staking',
    'liquid-staking': 'Liquid Staking',
    'real-yield': 'Real Yield',
    'points-farming': 'Points Farming'
  };
  return labels[strategyType] || strategyType;
}

export function calculateChange(oldValue: number, newValue: number): { change: number; changePercent: number } {
  const change = newValue - oldValue;
  const changePercent = oldValue !== 0 ? (change / oldValue) * 100 : 0;
  return { change, changePercent };
}

export function sortByKey<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'desc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'desc' 
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }
    
    return 0;
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function isInstitutionalGrade(riskScore: number, tvl: number, verified: boolean): boolean {
  return riskScore <= 4.0 && tvl >= 50000000 && verified;
}

export function calculateBlendedApy(positions: Array<{ value: number; apy: number }>): number {
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
  if (totalValue === 0) return 0;
  
  const weightedSum = positions.reduce((sum, p) => sum + (p.value * p.apy), 0);
  return weightedSum / totalValue;
}

export function calculatePortfolioRisk(positions: Array<{ value: number; riskScore: number }>): number {
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
  if (totalValue === 0) return 0;
  
  const weightedSum = positions.reduce((sum, p) => sum + (p.value * p.riskScore), 0);
  return weightedSum / totalValue;
}
