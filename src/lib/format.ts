import type { Vault } from './types';

export function formatCurrency(value: number, decimals: number = 0): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(date);
}

export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function getRiskColor(riskLevel: Vault['riskLevel']): string {
  switch (riskLevel) {
    case 'low':
      return 'text-green-600';
    case 'medium':
      return 'text-amber-600';
    case 'high':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
}

export function getRiskBgColor(riskLevel: Vault['riskLevel']): string {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-100';
    case 'medium':
      return 'bg-amber-100';
    case 'high':
      return 'bg-red-100';
    default:
      return 'bg-muted';
  }
}

export function getChainName(chain: string): string {
  const names: Record<string, string> = {
    ethereum: 'Ethereum',
    arbitrum: 'Arbitrum',
    optimism: 'Optimism',
    polygon: 'Polygon',
    base: 'Base',
    bsc: 'BNB Chain',
    avalanche: 'Avalanche',
  };
  return names[chain] || chain;
}

export function getChainColor(chain: string): string {
  const colors: Record<string, string> = {
    ethereum: 'text-blue-600',
    arbitrum: 'text-sky-600',
    optimism: 'text-red-600',
    polygon: 'text-purple-600',
    base: 'text-blue-500',
    bsc: 'text-yellow-600',
    avalanche: 'text-red-500',
  };
  return colors[chain] || 'text-muted-foreground';
}
