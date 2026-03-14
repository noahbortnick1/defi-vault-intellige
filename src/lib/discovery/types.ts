export type DiscoverySource = 'aggregator' | 'registry' | 'onchain';

export interface AggregatorVault {
  chain: string;
  symbol: string;
  apy: number;
  apyReward?: number;
  tvl: number;
  url?: string;
  apyPct7D?: number;
}

export interface DiscoveryResult {
  id: string;
  name: string;
  chain: string;
  address: string;
  source: DiscoverySource;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface VaultContract {
  chain: string;
  address: string;
  methods: string[];
  isERC4626: boolean;
}

export interface YieldSource {
  type: string;
  description: string;
  apy: number;
  percentage: number;
}

export interface DiscoveryMetrics {
  totalVaults: number;
  bySource: Record<DiscoverySource, number>;
  lastRun: number;
  lastSeen: number;
}

export interface RiskBreakdown {
  contractSecurity: number;
  liquidity: number;
  protocolStability: number;
  dependencyRisk: number;
  governanceRisk: number;
}

export interface RiskFactor {
  category: string;
  score: number;
  description: string;
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

export interface DiscoveryJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: number;
  completedAt?: number;
  vaultsDiscovered: number;
  errors?: string[];
}
