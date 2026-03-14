export type DiscoverySource = 'aggregator' | 'registry' | 'onchain';

export interface AggregatorVault {
  chain: string;
  symbol: string;
  apy: number;
  apyReward?: number;
  underlyingTo
  url?: string
  apyPct7D?: number
}
export interface DiscoveryResu
  name: string;
  chain: string;
 

  metadata?: Record<string, any>;

  chain: string;
  address: string;
  methods: stri

 

}
export interface YieldSource {
  description: string;
  apy: number;

 

export interface DiscoveryMeth
  lastSeen: number;
}
export interface RiskBr
  liquidity: n
 

export interface RiskFactor
  score: number;
  description: string;
}

  level: 'low' | 'medium' | 'high'
  breakdown: Risk

  totalApy: number;
 

  };
  sustainability: 'high'

  tvl: number;
  utilization: nu
  uniqueDepositors: numbe
}

  apy: number;
  strategy: number;

  id: string;
  status: 'pending' | 
  completedAt?: number;
 

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
