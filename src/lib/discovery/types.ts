export type DiscoverySource = 'aggregator' | 'registry' | 'onchain';

export interface DiscoveryResult {
  vaultAddress: string;
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

export interface VaultPattern {
  name: string;
  interfaces: string[];
  methods: string[];
  confidence: number;
}

export interface IndexerJob {
  id: string;
  type: 'vault_discovery' | 'yield_update' | 'risk_update' | 'strategy_classification';
  chain: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: number;
  completedAt?: number;
  vaultsProcessed?: number;
  error?: string;
}

export interface YieldSource {
  type: 'base' | 'trading_fees' | 'incentives' | 'lending' | 'staking' | 'rebase';
  apy: number;
  token?: string;
  description: string;
  sustainable: boolean;
}

export interface StrategyClassification {
  primary: string;
  secondary?: string;
  dependencies: string[];
  riskFactors: string[];
  yieldSources: YieldSource[];
  confidence: number;
}

export interface ContractInteraction {
  protocol: string;
  method: string;
  frequency: number;
  lastSeen: number;
}
