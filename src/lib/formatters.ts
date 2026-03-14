import type { RiskBand } from './types';

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

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getRiskColor(riskScore: number): string {
  if (riskScore <= 3) return 'text-emerald-400';
  if (riskScore <= 6) return 'text-yellow-400';
  return 'text-red-400';
}

export function getRiskBgColor(riskBand: RiskBand): string {
  switch (riskBand) {
    case 'low':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'high':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
  }
}

export function getChainName(chain: string): string {
  const names: Record<string, string> = {
    ethereum: 'Ethereum',
    arbitrum: 'Arbitrum',
    base: 'Base',
    optimism: 'Optimism',
    polygon: 'Polygon',
    bsc: 'BSC',
  };
  return names[chain] || chain;
}

export function getStrategyLabel(strategy: string): string {
  const labels: Record<string, string> = {
    'lending': 'Lending',
    'delta-neutral': 'Delta Neutral',
    'lp-farming': 'LP Farming',
    'basis-trade': 'Basis Trade',
    'staking': 'Staking',
    'real-yield': 'Real Yield',
  };
  return labels[strategy] || strategy;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getEventSeverityColor(severity: string): string {
  switch (severity) {
    case 'low':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'high':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'critical':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}
