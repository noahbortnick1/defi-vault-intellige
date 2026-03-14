import type { Chain, RiskLevel, RiskBand } from './types';

    return `$${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  i
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  }

  return `${value.toFixed(decimals)}%`;

  const date = new Date(dateString);
 

}
export function formatDateTime(dateStri
 

    hour: '2-digit',
  });

  const date = new D
  const diffMs = now
  const diffHours = 

 

}
export function formatAddress(addres
  return `${address.slice(0, startChars

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
    'moderate': 'te
  };
}
expo
    'lending': 'Lending',
 

    'real-yield': 'Real Yield',
  };
}
export function calculateChange(
  const changePercent = ol
}
export function sortByKey<T>(array: T[], key: keyof T,
 

      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    
      return direction === 'desc' 
        : aVal.localeCompare(bVal);
    
  })

 

  
    if (timeout) clearTimeout(timeout);
  };

  return classes.filter(Boolean)

  return riskScore <= 4.0 && tvl >= 50000000 && verif


  
  return weightedSum / totalValue;

  const totalValue = positions.
  
  return weightedSum / totalValue
























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
