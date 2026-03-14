import type { Vault } from './types';

    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) {
  }
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
  if (address.length <= startChars + endChars) 
}
e

    case 'medium':
    case 'high':
    default:
 

  switch (riskLevel) {
      return 'bg-green
      return 'b
      return 'bg-red-100';
      return 'bg-m
}
export function 
    ethereum: 'Ethereum',
    optimism
    base: 'Base',
   
 

  const colors: Record<string, string> = {
    arbitrum: 'text-sk
    polygon: 't
    bsc: 'text-yellow-600',
  };
}

























    polygon: 'text-purple-600',
    base: 'text-blue-500',
    bsc: 'text-yellow-600',
    avalanche: 'text-red-500',
  };
  return colors[chain] || 'text-muted-foreground';
}
