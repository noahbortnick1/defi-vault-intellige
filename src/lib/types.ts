export type Chain = 
  | 'ethereum'
  | 'arbitrum'
  | 'optimism'
  | 'polygon'
  | 'base'
  | 'bsc'
  | 'avalanche';

export type AssetType = 
  | 'ETH'
  | 'WETH'
  | 'USDC'
  | 'USDT'
  | 'DAI'
  | 'WBTC'
  | 'stETH'
  | 'rETH'
  | 'FRAX'
  | 'ARB'
  | 'OP';

export type StrategyType =
  | 'lending'
  | 'liquidity-provision'
  | 'staking'
  | 'yield-aggregator'
  | 'leveraged-staking'
  | 'delta-neutral'
  | 'options-selling'
  | 'real-world-assets';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Protocol {
  id: string;
  name: string;
  category: string;
  chains: Chain[];
  tvl: number;
  audits: Audit[];
  website: string;
  twitter?: string;
  github?: string;
}

export interface Audit {
  auditor: string;
  date: string;
  reportUrl: string;
  scope: string;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface YieldSource {
  type: 'base' | 'incentive' | 'trading-fees' | 'borrow-interest';
  token: string;
  apy: number;
  description: string;
}

export interface RiskFactor {
  category: 'smart-contract' | 'liquidity' | 'market' | 'centralization' | 'complexity';
  score: number;
  weight: number;
  description: string;
  mitigations: string[];
}

export interface Dependency {
  protocol: string;
  type: 'oracle' | 'dex' | 'lending' | 'bridge' | 'infrastructure';
  description: string;
  riskImpact: 'critical' | 'high' | 'medium' | 'low';
}

export interface GovernanceInfo {
  type: 'multisig' | 'dao' | 'immutable' | 'admin-controlled';
  details: string;
  adminAddress?: string;
  timelock?: string;
  governanceToken?: string;
}

export interface HistoricalDataPoint {
  timestamp: string;
  apy: number;
  tvl: number;
  baseApy?: number;
  incentiveApy?: number;
}

export interface Vault {
  id: string;
  name: string;
  protocol: Protocol;
  chain: Chain;
  asset: AssetType;
  strategyType: StrategyType;
  
  apy: number;
  apyBreakdown: YieldSource[];
  tvl: number;
  
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  
  strategyDescription: string;
  dependencies: Dependency[];
  governance: GovernanceInfo;
  
  liquidityDepth: number;
  withdrawalLimit?: string;
  lockPeriod?: string;
  
  inception: string;
  lastUpdate: string;
  
  historical: HistoricalDataPoint[];
  changeLog: ChangeLogEntry[];
  
  verified: boolean;
  featured: boolean;
}

export interface ChangeLogEntry {
  date: string;
  type: 'apy-change' | 'strategy-update' | 'risk-change' | 'governance-change' | 'audit';
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface Position {
  vault: Vault;
  amount: number;
  valueUSD: number;
  entryDate: string;
  currentAPY: number;
  unrealizedYield: number;
}

export interface Portfolio {
  id: string;
  name: string;
  walletAddress?: string;
  positions: Position[];
  totalValueUSD: number;
  lastUpdated: string;
}

export interface ExposureSummary {
  byAsset: Record<AssetType, number>;
  byProtocol: Record<string, number>;
  byChain: Record<Chain, number>;
  byStrategy: Record<StrategyType, number>;
  byRiskLevel: Record<RiskLevel, number>;
}

export interface Alert {
  id: string;
  type: 'apy-drop' | 'risk-increase' | 'tvl-drop' | 'audit-issue' | 'governance-change';
  vaultId: string;
  vaultName: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
}

export interface DDReport {
  vaultId: string;
  vault: Vault;
  generatedAt: string;
  executiveSummary: string;
  riskAssessment: {
    overallScore: number;
    factorAnalysis: RiskFactor[];
    keyRisks: string[];
    redFlags: string[];
  };
  yieldAnalysis: {
    sources: YieldSource[];
    sustainability: string;
    historicalStability: string;
  };
  technicalDueDiligence: {
    audits: Audit[];
    dependencies: Dependency[];
    governanceReview: string;
  };
  recommendations: string[];
}

export interface VaultFilters {
  chains: Chain[];
  assets: AssetType[];
  protocols: string[];
  strategyTypes: StrategyType[];
  riskLevels: RiskLevel[];
  minTVL: number;
  maxTVL: number;
  minAPY: number;
  maxAPY: number;
}

export interface SavedView {
  id: string;
  name: string;
  filters: VaultFilters;
  sortBy: 'apy' | 'tvl' | 'riskScore';
  sortOrder: 'asc' | 'desc';
  createdAt: string;
}

export interface Watchlist {
  id: string;
  name: string;
  vaultIds: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  organization?: string;
  apiKeys: ApiKey[];
  preferences: UserPreferences;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
}

export interface UserPreferences {
  defaultChain?: Chain;
  alertsEnabled: boolean;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}
