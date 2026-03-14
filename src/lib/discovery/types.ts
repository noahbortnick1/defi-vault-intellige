export type DiscoverySource = 'aggregator' | 'registry' | 'onchain';

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

export interface DiscoveryResult {
  id: string;
  name: string;
  protocol: string;
  chain: string;
  source: DiscoverySource;
  confidence: number;
  tvl: number;
  apy: number;
  discoveredAt: number;
  metadata?: Record<string, any>;
}

export interface RegistryContract {
  chain: string;
  vaultListMethod: string;
  address: string;
  name: string;
  methods: string[];
}

export interface DiscoveryTask {
  type: 'vault_discovery' | 'metadata_update' | 'risk_assessment';
  status: 'pending' | 'running' | 'completed' | 'failed';
  completedAt?: number;
  error?: string;
}

export interface YieldSource {
  type: 'base' | 'trading_fees' | 'incentives' | 'rebases';
  description: string;
  sustainable: boolean;
  apy: number;
}

export interface Protocol {
  primary: string;
  dependencies: string[];
}

export interface DiscoveryMethod {
  method: string;
  lastSeen: number;
  frequency: number;
}

export interface RiskBreakdown {
  smartContract: number;
  liquidity: number;
  dependency: number;
  market: number;
  centralization: number;
}

export interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  description: string;
  mitigations: string[];
}

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
  breakdown: RiskBreakdown;
}

export interface YieldDecomposition {
  totalApy: number;
  components: {
    baseYield: number;
    tradingFees: number;
    incentives: number;
    rebases: number;
  };
  realYieldPercentage: number;
  sustainability: 'high' | 'medium' | 'low';
}

export interface VaultMetrics {
  tvl: number;
  apy: number;
  utilization: number;
  volume24h: number;
  uniqueDepositors: number;
  averageDepositSize: number;
}

export interface UpdateFrequency {
  tvl: number;
  apy: number;
  risk: number;
  strategy: number;
}

export interface IndexerJob {
  id: string;
  type: 'vault_discovery' | 'metadata_update' | 'risk_assessment';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: number;
  completedAt?: number;
  error?: string;
  result?: any;
}

export interface VaultPattern {
  name: string;
  methods: string[];
  eventSignatures: string[];
}

export interface ProtocolRegistry {
  name: string;
  address: string;
  chain: string;
  vaultListMethod: string;
  methods: string[];
}

export interface StrategyClassification {
  type: string;
  confidence: number;
  indicators: string[];
}

export interface ContractInteraction {
  target: string;
  method: string;
  frequency: number;
}
