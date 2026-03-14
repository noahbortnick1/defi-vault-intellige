export type Chain = 'ethereum' | 'arbitrum' | 'optimism' | 'base' | 'polygon' | 'bsc';

export type AssetType = 'ETH' | 'WETH' | 'USDC' | 'USDT' | 'DAI' | 'WBTC' | 'stETH' | 'rETH' | 'GHO' | 'sDAI' | 'PT-sDAI' | 'UNI' | 'AAVE';

export type StrategyType = 'lending' | 'lp-farming' | 'delta-neutral' | 'basis-trade' | 'staking' | 'liquid-staking' | 'real-yield' | 'points-farming';

export type RiskLevel = 'low' | 'medium' | 'high';

export type RiskBand = 'conservative' | 'moderate' | 'aggressive';

export type VaultStatus = 'active' | 'new' | 'deprecated' | 'experimental';

export type EventType = 
  | 'apy-spike' 
  | 'apy-drop' 
  | 'tvl-inflow' 
  | 'tvl-outflow' 
  | 'new-vault' 
  | 'risk-change' 
  | 'governance-change' 
  | 'incentive-change' 
  | 'liquidity-warning'
  | 'audit-published';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export type DependencyType = 'oracle' | 'protocol' | 'bridge' | 'token' | 'governance';

export type DependencyCriticality = 'low' | 'medium' | 'high' | 'critical';

export type GovernanceType = 'immutable' | 'multisig' | 'dao' | 'admin-controlled' | 'timelock';

export type ReportType = 'vault-dd' | 'comparison' | 'portfolio' | 'market-overview';

export type AlertChannelType = 'email' | 'webhook' | 'dashboard';

export type UserRole = 'analyst' | 'portfolio-manager' | 'protocol-team' | 'developer';

export type PortfolioOwnerType = 'dao-treasury' | 'hedge-fund' | 'family-office' | 'protocol-treasury';

export interface Protocol {
  id: string;
  name: string;
  slug: string;
  category: string;
  website: string;
  description: string;
  chains: Chain[];
  tvl: number;
  maturityScore: number;
  auditSummary: {
    firms: string[];
    count: number;
    lastAuditDate: string;
  };
}

export interface YieldSource {
  type: 'base' | 'trading-fees' | 'incentives' | 'rebase' | 'points';
  apy: number;
  token: string;
  description: string;
  sustainable: boolean;
}

export interface RiskFactor {
  id: string;
  vaultId: string;
  category: 'smart-contract' | 'liquidity' | 'market' | 'protocol' | 'governance' | 'dependency';
  label: string;
  score: number;
  weight: number;
  scoreContribution: number;
  explanation: string;
  mitigations: string[];
}

export interface Dependency {
  id: string;
  vaultId: string;
  protocol: string;
  type: DependencyType;
  criticality: DependencyCriticality;
  description: string;
  riskImpact: string;
}

export interface Governance {
  type: GovernanceType;
  details: string;
  timelock?: string;
  adminControl: boolean;
  upgradeability: boolean;
}

export interface Audit {
  firm: string;
  date: string;
  reportUrl: string;
  scope: string[];
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface RedFlag {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  detectedAt: string;
}

export interface Vault {
  id: string;
  slug: string;
  name: string;
  protocolId: string;
  protocolName: string;
  chain: Chain;
  asset: AssetType;
  category: string;
  strategyType: StrategyType;
  description: string;
  strategyDescription: string;
  
  apy: number;
  realYield: number;
  incentiveYield: number;
  feeYield: number;
  apyBreakdown: YieldSource[];
  
  tvl: number;
  liquidityAvailable: number;
  
  riskScore: number;
  riskLevel: RiskLevel;
  riskBand: RiskBand;
  liquidityScore: number;
  
  status: VaultStatus;
  verified: boolean;
  institutionalGrade: boolean;
  
  inception: string;
  sourceWindow: string;
  updatedAt: string;
  
  vaultAddress: string;
  dependencies: Dependency[];
  riskFactors: RiskFactor[];
  governance: Governance;
  audits: Audit[];
  redFlags: RedFlag[];
  
  tags: string[];
  
  protocol: Protocol;
}

export interface YieldObservation {
  id: string;
  vaultId: string;
  timestamp: string;
  apy: number;
  realYield: number;
  incentiveYield: number;
  tvl: number;
}

export interface RadarEvent {
  id: string;
  type: EventType;
  severity: EventSeverity;
  title: string;
  description: string;
  vaultId: string;
  vaultName: string;
  protocolName: string;
  chain: Chain;
  timestamp: string;
  metadata: {
    oldValue?: number;
    newValue?: number;
    change?: number;
    changePercent?: number;
  };
  whyItMatters: string;
}

export interface Alert {
  id: string;
  name: string;
  type: EventType;
  targetId: string;
  targetType: 'vault' | 'protocol' | 'portfolio';
  targetName: string;
  condition: string;
  threshold: number;
  channels: AlertChannelType[];
  enabled: boolean;
  createdAt: string;
  lastTriggered?: string;
}

export interface Position {
  id: string;
  portfolioId: string;
  vaultId: string;
  vaultName: string;
  protocol: string;
  asset: AssetType;
  chain: Chain;
  strategyType: StrategyType;
  value: number;
  apy: number;
  yieldEarned: number;
  pnl: number;
  pnlPercent: number;
  shareOfPortfolio: number;
  riskScore: number;
  enteredAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  ownerType: PortfolioOwnerType;
  walletAddress: string;
  netWorth: number;
  dailyChange: number;
  dailyChangePercent: number;
  totalYield: number;
  totalYieldPercent: number;
  riskScore: number;
  positions: Position[];
  assetExposure: { asset: AssetType; value: number; percentage: number }[];
  protocolExposure: { protocol: string; value: number; percentage: number }[];
  strategyExposure: { strategy: StrategyType; value: number; percentage: number }[];
  chainExposure: { chain: Chain; value: number; percentage: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportSection {
  title: string;
  content: string;
  data?: any;
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  subjectId: string;
  subjectType: 'vault' | 'portfolio' | 'comparison';
  subjectName: string;
  generatedAt: string;
  author: string;
  summary: string;
  sections: ReportSection[];
  recommendation?: string;
  riskAssessment?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organization?: string;
  watchlist: string[];
  savedViews: any[];
  preferences: {
    defaultChain?: Chain;
    defaultRiskLevel?: RiskLevel;
    tableView: 'comfortable' | 'compact' | 'dense';
    chartPreferences: any;
  };
}

export interface ComparisonData {
  vaults: Vault[];
  selectedMetrics: string[];
  highlights: {
    best: { [key: string]: string };
    worst: { [key: string]: string };
  };
}

export interface FilterState {
  search: string;
  chains: Chain[];
  assets: AssetType[];
  protocols: string[];
  strategies: StrategyType[];
  riskBands: RiskBand[];
  tvlRange: [number, number];
  apyRange: [number, number];
  institutionalOnly: boolean;
}

export interface SortConfig {
  key: keyof Vault;
  direction: 'asc' | 'desc';
}
