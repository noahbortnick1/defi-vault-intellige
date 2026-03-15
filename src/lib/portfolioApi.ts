import type {
  Portfolio,
  Position,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PortfolioApiResponse {
  wallet_address: string;
  name?: string;
  owner_type: 'dao' | 'hedge-fund' | 'family-office' | 'individual';
  total_value: number;
  daily_change: number;
  daily_change_percent: number;
  total_yield_earned: number;
  position_count: number;
  risk_score: number;
  updated_at: string;
}

export interface PositionApiResponse {
  id: string;
  portfolio_id: string;
  vault_id: string;
  vault_name: string;
  protocol: string;
  asset: string;
  value: number;
  shares: number;
  pnl: number;
  pnl_percent: number;
  apy: number;
  share_of_portfolio: number;
  chain: string;
  entry_price?: number;
  current_price?: number;
  updated_at: string;
}

export interface PositionsApiResponse {
  wallet_address: string;
  positions: PositionApiResponse[];
  total_positions: number;
  total_value: number;
}

export interface AssetBreakdownItem {
  asset: string;
  value: number;
  percentage: number;
  chains: Record<string, number>;
}

export interface ProtocolExposureItem {
  protocol: string;
  value: number;
  percentage: number;
  vaults: number;
  avg_risk: number;
}

export interface ChainExposureItem {
  chain: string;
  value: number;
  percentage: number;
  positions: number;
}

export interface StrategyExposureItem {
  strategy: string;
  value: number;
  percentage: number;
  positions: number;
}

export interface ExposureApiResponse {
  wallet_address: string;
  asset_breakdown: AssetBreakdownItem[];
  protocol_exposure: ProtocolExposureItem[];
  chain_exposure: ChainExposureItem[];
  strategy_exposure: StrategyExposureItem[];
  top_assets: string[];
  top_protocols: string[];
}

export interface RiskMetrics {
  overall_risk: number;
  risk_adjusted_return: number;
  concentration_risk: number;
  liquidity_risk: number;
  protocol_risk: number;
}

export interface PortfolioSummaryData {
  wallet_address: string;
  total_value: number;
  daily_change: number;
  daily_change_percent: number;
  total_yield_earned: number;
  yield_rate_30d: number;
  position_count: number;
  protocol_count: number;
  chain_count: number;
  avg_risk_score: number;
  last_rebalance?: string;
  updated_at: string;
}

export interface SummaryApiResponse {
  wallet_address: string;
  summary: PortfolioSummaryData;
  risk_metrics: RiskMetrics;
  performance_7d: number;
  performance_30d: number;
  performance_90d: number;
}

function mapPortfolioFromApi(data: PortfolioApiResponse): Portfolio {
  return {
    id: data.wallet_address,
    name: data.name || 'Portfolio',
    ownerType: data.owner_type,
    walletAddress: data.wallet_address,
    netWorth: data.total_value,
    dailyChange: data.daily_change,
    totalYield: data.total_yield_earned,
    riskScore: data.risk_score,
    positions: [],
  };
}

function mapPositionFromApi(data: PositionApiResponse): Position {
  return {
    id: data.id,
    portfolioId: data.portfolio_id,
    vaultId: data.vault_id,
    protocol: data.protocol,
    asset: data.asset,
    value: data.value,
    pnl: data.pnl,
    share: data.share_of_portfolio,
    chain: data.chain as any,
  };
}

export const portfolioApi = {
  async getPortfolio(walletAddress: string): Promise<Portfolio> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${walletAddress}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
      }
      const data: PortfolioApiResponse = await response.json();
      return mapPortfolioFromApi(data);
    } catch (error) {
      console.warn('API unavailable, using mock data');
      const mockData = await getMockPortfolioData(walletAddress);
      if (mockData.summary) {
        return {
          id: walletAddress,
          name: 'Portfolio',
          ownerType: 'dao',
          walletAddress,
          netWorth: mockData.summary.summary.total_value,
          dailyChange: mockData.summary.summary.daily_change,
          totalYield: mockData.summary.summary.total_yield_earned,
          riskScore: mockData.summary.summary.avg_risk_score,
          positions: [],
        };
      }
      throw error;
    }
  },

  async getPositions(walletAddress: string): Promise<PositionsApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${walletAddress}/positions`);
      if (!response.ok) {
        throw new Error(`Failed to fetch positions: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.warn('API unavailable, using mock data');
      const mockData = await getMockPortfolioData(walletAddress);
      if (mockData.positions) {
        return mockData.positions;
      }
      throw error;
    }
  },

  async getExposure(walletAddress: string): Promise<ExposureApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${walletAddress}/exposure`);
      if (!response.ok) {
        throw new Error(`Failed to fetch exposure: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.warn('API unavailable, using mock data');
      const mockData = await getMockPortfolioData(walletAddress);
      if (mockData.exposure) {
        return mockData.exposure;
      }
      throw error;
    }
  },

  async getSummary(walletAddress: string): Promise<SummaryApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${walletAddress}/summary`);
      if (!response.ok) {
        throw new Error(`Failed to fetch summary: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.warn('API unavailable, using mock data');
      const mockData = await getMockPortfolioData(walletAddress);
      if (mockData.summary) {
        return mockData.summary;
      }
      throw error;
    }
  },
};

async function getMockPortfolioData(walletAddress: string) {
  try {
    const [positions, exposure, summary] = await Promise.all([
      spark.kv.get<PositionsApiResponse>('demo-portfolio-positions'),
      spark.kv.get<ExposureApiResponse>('demo-portfolio-exposure'),
      spark.kv.get<SummaryApiResponse>('demo-portfolio-summary'),
    ]);
    return { positions, exposure, summary };
  } catch (error) {
    console.error('Failed to load mock data:', error);
    return { positions: null, exposure: null, summary: null };
  }
}

export const DEMO_WALLETS = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Axiom DAO Treasury',
    type: 'DAO',
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'Titan Capital Fund',
    type: 'Hedge Fund',
  },
  {
    address: '0xfedcba0987654321fedcba0987654321fedcba09',
    name: 'Sterling Family Office',
    type: 'Family Office',
  },
];
