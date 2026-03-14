export type DiscoverySource = 'aggregator' | 'registry' | 'onchain';

  chain: string;
  source: DiscoverySour
  chain: string;
  protocol: string;
  source: DiscoverySource;
  confidence: number;
  discoveredAt: number;
  metadata?: Record<string, any>;
}

export interface AggregatorVault {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  rewardTokens?: string[];
  underlyingTokens?: string[];
  poolMeta?: string;
  url?: string;
  apyPct1D?: number;
  apyPct7D?: number;
  apyPct30D?: number;
}

export interface ProtocolRegistry {
  name: string;
  chain: string;
  registryAddress: string;
  vaultListMethod: string;
}

}
export interfac
  type: 'vault_discover
  status: 'pending' 
  completedAt?: numbe
 

  type: 'base' | 'trading_fee
  token?: str
  sustainable: boolean;

  primary: string;
  dependencies: strin
  yieldSources: YieldSo
}
export interface 
 




















  method: string;
  frequency: number;
  lastSeen: number;
}
