import type { RiskLevel, Chain } from './types';

    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) {
  }
   
  return `$${value.toFixed(

  r

  return new Intl.NumberFormat('en-US', {
   
}
e

    day: 'numeric',
  return `${value.toFixed(decimals)}%`;
e

  const diffMins = Math.floor(diffMs / 60000);
  const diffDays = Math.floor(diffMs / 86
  if (diffMins < 1) {
  }
    return `${diffM
 

export function formatDate(date: string): string {
export function formatAddress(address: stri
    year: 'numeric',

  switch (riskLevel
      return 'text-green-600
 

export function formatRelativeTime(date: string): string {
}
  const then = new Date(date).getTime();
    case 'low':
    case 'medium':
    case 'high':
    default:
  

  const names: Record<
  }
    polygon: 'Polygon'
    bsc: 'BSC',
  }
}
export function getChainColor(c
   
  return `${diffDays}d ago`;
 

export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'low':
      return 'text-green-600';

      return 'text-yellow-600';

      return 'text-red-600';

      return 'text-muted-foreground';
  }
}

export function getRiskBgColor(riskLevel: RiskLevel): string {

    case 'low':
      return 'bg-green-100';
    case 'medium':
      return 'bg-yellow-100';
    case 'high':

    default:
      return 'bg-muted';
  }


export function getChainName(chain: Chain): string {
  const names: Record<Chain, string> = {

    arbitrum: 'Arbitrum',
    optimism: 'Optimism',
    polygon: 'Polygon',

    bsc: 'BSC',
    avalanche: 'Avalanche',

  return names[chain] || chain;


export function getChainColor(chain: Chain): string {
  const colors: Record<Chain, string> = {
    ethereum: 'text-blue-600',
    arbitrum: 'text-sky-600',
    optimism: 'text-red-500',







