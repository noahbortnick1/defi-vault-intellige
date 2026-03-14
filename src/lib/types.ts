export type Chain = 'ethereum' | 'arbitrum' | 'optimism' | 'polygon' | 'avalanche' | 'bsc';

export type Protocol = 'aave' | 'compound' | 'yearn' | 'curve' | 'convex' | 'lido' | 'maker';

export interface Vault {
  id: string;
  address: string;
  protocol: Protocol;
  chain: Chain;
  name: string;
  asset: string;
  apy: number;
  tvl: number;
  riskScore: number;
  strategy: string;
  dependencies: string[];
  upgradeability: 'immutable' | 'timelock' | 'multisig' | 'eoa';
  oracleType: 'chainlink' | 'uniswap' | 'internal' | 'none';
  liquidityDepth: number;
}

export interface RiskFactors {
  protocolDependency: number;
  oracleRisk: number;
  upgradeabilityRisk: number;
  liquidityRisk: number;
}

export interface YieldDataPoint {
  timestamp: number;
  apy: number;
  tvl: number;
}

export interface PortfolioPosition {
  vaultId: string;
  amount: number;
  valueUSD: number;
}

export interface Portfolio {
  walletAddress: string;
  totalValue: number;
  positions: PortfolioPosition[];
  assetBreakdown: Record<string, number>;
  protocolExposure: Record<Protocol, number>;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
  example: string;
}
