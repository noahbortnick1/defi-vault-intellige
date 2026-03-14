export interface Vault {
  id: string;
  address: string;
  name: string;
  protocol: string;
  chain: string;
  asset: string;
  apy: number;
  tvl: number;
  riskScore: number;
  strategy: string;
  dependencies: string[];
  upgradeability: 'immutable' | 'timelock' | 'multisig' | 'eoa';
  oracleType: 'chainlink' | 'uniswap' | 'internal' | 'none';
  liquidityDepth: number;
  source: string;
  updatedAt?: string;
}

export interface RiskFactors {
  protocolDependency: number;
  oracleRisk: number;
  upgradeabilityRisk: number;
  liquidityRisk: number;
}

export interface RiskAnalysis {
  vaultId: string;
  overallScore: number;
  level: 'low' | 'medium' | 'high';
  factors: RiskFactors;
}

export interface PortfolioPosition {
  vaultId: string;
  vaultName: string;
  amount: number;
  valueUsd: number;
}

export interface Portfolio {
  walletAddress: string;
  totalValue: number;
  positions: PortfolioPosition[];
  assetBreakdown: Record<string, number>;
  protocolExposure: Record<string, number>;
}

export interface VaultListResponse {
  vaults: Vault[];
  count: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}
