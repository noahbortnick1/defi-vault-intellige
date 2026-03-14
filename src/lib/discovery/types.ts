export type DiscoverySource = 'aggregator' | 'registry' | 'onchain';

  chain: string;
  source: DiscoverySour
  chain: string;
  protocol: string;
  source: DiscoverySource;
  confidence: number;
export interface Aggreg
  chain: string;
 

  apyReward?: number;
  underlyingTok
  url?: string;
  apyPct7D?: numbe
}
export interface 
  chain: strin
  vaultListMethod: 

  name: string;
  methods: string[];
}
export interfac
  type: 'vault_disco
  status: 'pending' 
  completedAt?: numbe
 

  type: 'base' | 'trading_fees' | '
  description: 
  sustainable: b

  primary: string;
 

}
export interfac
  method: string;
  lastSeen: number;

 

    smartContract: number;
    dependenc
    centralization: number;
}
export interface RiskFactor {
  score: number;
  description: string;
}
export interface 
 

    rebases: number;
  realYieldPercentage: number;
}
export interface Vault
  apy: number;
  volume24h: number;
 

  tvl: number;
  risk: number;
}








  method: string;
  frequency: number;
  lastSeen: number;
}

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
  breakdown: {
    smartContract: number;
    liquidity: number;
    dependency: number;
    market: number;
    centralization: number;
  };
}

export interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  description: string;
  mitigations: string[];
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
