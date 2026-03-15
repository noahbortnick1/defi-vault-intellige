export type Chain = 'ethereum' | 'arbitrum' | 'base' | 'optimism' | 'polygon' | 'bsc';

export type StrategyType = 'lending' | 'delta-neutral' | 'lp-farming' | 'basis-trade' | 'staking' | 'real-yield';

export type RiskBand = 'low' | 'medium' | 'high';

export type VaultStatus = 'active' | 'paused' | 'deprecated';

export type EventType = 'apy-spike' | 'tvl-inflow' | 'tvl-outflow' | 'new-vault' | 'risk-change' | 'governance-change' | 'incentive-change' | 'liquidity-deterioration';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportType = 'vault' | 'comparison' | 'portfolio';

export type UserRole = 'analyst' | 'portfolio-manager' | 'protocol-team' | 'developer';

export type DiscoveryLayer = 'aggregator' | 'registry' | 'onchain';

export interface Vault {
  id: string;
  slug: string;
  name: string;
  protocolId: string;
  protocolName: string;
  chain: Chain;
  asset: string;
  category: string;
  strategyType: StrategyType;
  description: string;
  apy: number;
  realYield: number;
  incentiveYield: number;
  feeYield: number;
  tvl: number;
  liquidityAvailable: number;
  riskScore: number;
  riskBand: RiskBand;
  liquidityScore: number;
  status: VaultStatus;
  sourceWindow: string;
  updatedAt: string;
  dependencyIds: string[];
  governance: GovernanceInfo;
  audits: AuditInfo[];
  redFlags: string[];
  tags: string[];
  institutionalGrade: boolean;
  vaultAddress: string;
}

export interface GovernanceInfo {
  hasTimelock: boolean;
  timelockDuration?: string;
  adminControls: string[];
  isUpgradeable: boolean;
  multisigThreshold?: string;
}

export interface AuditInfo {
  auditor: string;
  date: string;
  reportUrl: string;
  scope: string;
}

export interface Protocol {
  id: string;
  name: string;
  category: string;
  website: string;
  description: string;
  chainSupport: Chain[];
  tvl: number;
  maturityScore: number;
  auditSummary: string;
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

export interface RiskFactor {
  id: string;
  vaultId: string;
  key: string;
  label: string;
  value: number;
  weight: number;
  scoreContribution: number;
  explanation: string;
}

export interface Dependency {
  id: string;
  vaultId: string;
  name: string;
  type: 'protocol' | 'oracle' | 'bridge' | 'governance';
  criticality: 'low' | 'medium' | 'high';
  notes: string;
}

export interface Alert {
  id: string;
  name: string;
  type: EventType;
  targetId: string;
  targetType: 'vault' | 'protocol' | 'portfolio';
  condition: string;
  threshold: number;
  channels: string[];
  enabled: boolean;
}

export interface Portfolio {
  id: string;
  name: string;
  ownerType: 'dao' | 'hedge-fund' | 'family-office';
  walletAddress: string;
  netWorth: number;
  dailyChange: number;
  totalYield: number;
  riskScore: number;
  positions: Position[];
}

export interface Position {
  id: string;
  portfolioId: string;
  vaultId: string;
  protocol: string;
  asset: string;
  value: number;
  pnl: number;
  share: number;
  chain: Chain;
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  subjectId: string;
  subjectType: 'vault' | 'comparison' | 'portfolio';
  generatedAt: string;
  author: string;
  summary: string;
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  content: string;
  data?: any;
}

export interface RadarEvent {
  id: string;
  type: EventType;
  severity: EventSeverity;
  vaultId: string;
  vaultName: string;
  protocol: string;
  chain: Chain;
  title: string;
  description: string;
  whyItMatters: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface FilterState {
  chains: Chain[];
  assets: string[];
  protocols: string[];
  strategies: StrategyType[];
  riskBands: RiskBand[];
  tvlRange: [number, number];
  apyRange: [number, number];
  institutionalOnly: boolean;
  search: string;
}

export interface DiscoveryStats {
  totalVaults: number;
  byLayer: {
    aggregator: number;
    registry: number;
    onchain: number;
  };
  byChain: Record<Chain, number>;
  byProtocol: Record<string, number>;
  lastUpdate: string;
  coverage: number;
}

export interface DiscoveredVault {
  id: string;
  name: string;
  protocol: string;
  chain: Chain;
  discoveryLayer: DiscoveryLayer;
  confidence: number;
  discoveredAt: string;
  address: string;
  tvl: number;
  apy: number;
  status: 'pending' | 'verified' | 'rejected';
}

export type RankingMode = 'risk-adjusted' | 'highest-yield' | 'institutional-fit' | 'best-liquidity';

export interface RankingScore {
  vaultId: string;
  overallScore: number;
  netApyScore: number;
  riskScore: number;
  liquidityScore: number;
  auditScore: number;
  dependencyScore: number;
  incentiveScore: number;
  rank: number;
  reasoning: string;
}

export interface RankedVault extends Vault {
  ranking: RankingScore;
}

export interface VaultDDReport {
  id: string;
  vaultId: string;
  vault: Vault;
  generatedAt: string;
  summary: {
    recommendation: 'strong-buy' | 'buy' | 'hold' | 'avoid';
    keyTakeaways: string[];
    overallScore: number;
  };
  strategy: {
    description: string;
    complexity: 'low' | 'medium' | 'high';
    mechanism: string;
  };
  yieldSources: {
    sources: Array<{
      name: string;
      percentage: number;
      sustainability: 'high' | 'medium' | 'low';
      description: string;
    }>;
    analysis: string;
  };
  dependencies: {
    list: Dependency[];
    complexity: number;
    criticalDependencies: string[];
    analysis: string;
  };
  contractRisk: {
    isUpgradeable: boolean;
    adminControls: string[];
    timelockDuration?: string;
    audits: AuditInfo[];
    score: number;
    analysis: string;
  };
  liquidityProfile: {
    liquidityDepth: string;
    exitCapacity: string;
    concentrationRisk: string;
    score: number;
  };
  redFlags: string[];
  overallRisk: {
    score: number;
    band: RiskBand;
    breakdown: RiskFactor[];
  };
}

export interface PortfolioDDReport {
  id: string;
  portfolioId: string;
  portfolio: Portfolio;
  generatedAt: string;
  summary: {
    totalValue: number;
    positionCount: number;
    overallRisk: number;
    diversificationScore: number;
    keyFindings: string[];
  };
  positions: {
    list: Position[];
    largest: Position[];
  };
  exposure: {
    byAsset: Record<string, { value: number; percentage: number; count: number }>;
    byProtocol: Record<string, { value: number; percentage: number; count: number }>;
    byChain: Record<string, { value: number; percentage: number; count: number }>;
    byStrategy: Record<string, { value: number; percentage: number; count: number }>;
  };
  concentrationRisk: {
    herfindahlIndex: number;
    topThreeConcentration: number;
    analysis: string;
    recommendations: string[];
  };
  yieldAnalysis: {
    totalYield: number;
    avgYield: number;
    yieldBySource: Record<string, number>;
  };
}

export interface AllocationReport {
  id: string;
  generatedAt: string;
  targetAsset: string;
  targetRiskBand: RiskBand;
  totalAmount: number;
  recommendations: Array<{
    vault: Vault;
    allocation: number;
    percentage: number;
    rationale: string;
  }>;
  rationale: {
    methodology: string;
    constraints: string[];
    considerations: string[];
  };
  downsideConsiderations: string[];
  liquidityLimits: {
    maxSingleVaultSize: number;
    maxProtocolExposure: number;
    reasoning: string;
  };
}
