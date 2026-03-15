export type StrategyType = 
  | 'lending'
  | 'lp'
  | 'leveraged_lending'
  | 'delta_neutral'
  | 'yield_tokenization'
  | 'options'
  | 'staking';

export type RiskBand = 'low' | 'medium' | 'high';

export type LiquidityDepth = 'low' | 'medium' | 'high';

export type Upgradeability = 
  | 'immutable'
  | 'timelock_upgradeable'
  | 'multisig_upgradeable'
  | 'admin_upgradeable';

export interface Vault {
  id: string;
  name: string;
  address: string;
  protocol: string;
  chain: string;
  asset: string;
  strategy_type: StrategyType;
  apy: number;
  tvl: number;
  risk_score: number;
  allocation_score: number;
  strategy?: string;
  dependencies?: string[];
  oracle_type?: string;
  upgradeability?: Upgradeability;
  liquidity_depth?: LiquidityDepth;
  yield_sources?: string[];
  source?: string;
  updated_at: string;
}

export interface VaultRiskFactors {
  contract_risk: number;
  dependency_risk: number;
  oracle_risk: number;
  liquidity_risk: number;
  strategy_complexity: number;
  tvl_volatility: number;
}

export interface VaultRiskReport {
  address: string;
  risk_score: number;
  band: RiskBand;
  factors: VaultRiskFactors;
  notes: string[];
}

export interface RankingEntry {
  rank: number;
  vault_address: string;
  name: string;
  protocol: string;
  chain: string;
  asset: string;
  apy: number;
  risk_score: number;
  allocation_score: number;
  liquidity_depth: LiquidityDepth;
}

export interface Position {
  id: string;
  protocol: string;
  chain: string;
  position_type: string;
  asset: string;
  value: number;
  cost_basis?: number;
  pnl?: number;
  vault_address?: string | null;
}

export interface AssetBreakdown {
  asset: string;
  value: number;
  weight: number;
}

export interface ProtocolExposure {
  protocol: string;
  value: number;
  weight: number;
}

export interface ChainExposure {
  chain: string;
  value: number;
  weight: number;
}

export interface Portfolio {
  wallet_address: string;
  total_value: number;
  positions: Position[];
  asset_breakdown: AssetBreakdown[];
  protocol_exposure: ProtocolExposure[];
  chain_exposure: ChainExposure[];
}

export interface ContractRisk {
  upgradeability: Upgradeability;
  timelock?: string;
  audits: string[];
}

export interface LiquidityProfile {
  depth: LiquidityDepth;
  withdrawal_risk: string;
}

export interface VaultReport {
  vault: Vault;
  strategy_summary: string;
  yield_sources: string[];
  dependencies: string[];
  contract_risk: ContractRisk;
  liquidity_profile: LiquidityProfile;
  overall_risk_score: number;
  red_flags: string[];
}

export interface PortfolioReport {
  wallet_address: string;
  summary: {
    total_value: number;
    position_count: number;
    estimated_risk_score: number;
  };
  asset_breakdown: AssetBreakdown[];
  protocol_exposure: ProtocolExposure[];
  chain_exposure: ChainExposure[];
  concentration_risks: string[];
}

export type RankingMode = 'risk_adjusted' | 'highest_yield' | 'institutional' | 'best_liquidity';

export interface VaultsQueryParams {
  asset?: string;
  chain?: string;
  protocol?: string;
  strategy_type?: StrategyType;
  min_apy?: number;
  max_risk?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface RankingsQueryParams {
  mode?: RankingMode;
  asset?: string;
  chain?: string;
  strategy_type?: StrategyType;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface RankingsResponse {
  mode: RankingMode;
  items: RankingEntry[];
}

export interface HealthResponse {
  status: 'ok' | 'error';
  service: string;
  version: string;
}
