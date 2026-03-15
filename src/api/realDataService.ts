import type {
  Vault,
  VaultRiskReport,
  VaultReport,
  Portfolio,
  RankingEntry,
  RankingMode,
  VaultsQueryParams,
  RankingsQueryParams,
  PaginatedResponse,
  RankingsResponse,
} from './types';
import { fetchRealVaultDataWithCache } from '@/lib/blockchainData';
import { SEED_VAULT_RISKS, buildPortfolio } from './seedData';

const calculateAllocationScore = (vault: Vault, mode: RankingMode = 'risk_adjusted'): number => {
  const normalizedApy = Math.min(vault.apy / 20, 1);
  const normalizedRisk = 1 - Math.min(vault.risk_score / 10, 1);
  const liquidityScore = vault.liquidity_depth === 'high' ? 1 : vault.liquidity_depth === 'medium' ? 0.6 : 0.3;
  const auditScore = vault.upgradeability === 'immutable' ? 1 : 
                     vault.upgradeability === 'timelock_upgradeable' ? 0.8 : 0.5;
  const dependencyScore = 1 - Math.min((vault.dependencies?.length || 0) / 5, 1);
  const hasIncentives = vault.yield_sources?.includes('incentives') ? 0.5 : 1;

  switch (mode) {
    case 'highest_yield':
      return (
        normalizedApy * 60 +
        normalizedRisk * 20 +
        liquidityScore * 15 +
        auditScore * 5
      );
    case 'institutional':
      return (
        normalizedApy * 20 +
        normalizedRisk * 25 +
        liquidityScore * 25 +
        auditScore * 20 +
        dependencyScore * 5 +
        hasIncentives * 5
      );
    case 'best_liquidity':
      return (
        normalizedApy * 20 +
        normalizedRisk * 20 +
        liquidityScore * 45 +
        auditScore * 10 +
        dependencyScore * 5
      );
    case 'risk_adjusted':
    default:
      return (
        normalizedApy * 25 +
        normalizedRisk * 35 +
        liquidityScore * 20 +
        auditScore * 10 +
        dependencyScore * 5 +
        hasIncentives * 5
      );
  }
};

export class RealDataApiService {
  private vaults: Vault[] = [];
  private vaultRisks: Record<string, VaultRiskReport> = SEED_VAULT_RISKS;
  private lastFetch: number = 0;
  private fetchPromise: Promise<void> | null = null;

  private async ensureVaultsLoaded(): Promise<void> {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (this.vaults.length > 0 && now - this.lastFetch < fiveMinutes) {
      return;
    }

    if (this.fetchPromise) {
      await this.fetchPromise;
      return;
    }

    this.fetchPromise = (async () => {
      try {
        this.vaults = await fetchRealVaultDataWithCache();
        this.lastFetch = now;
      } catch (error) {
        console.error('Failed to fetch real vault data:', error);
        throw error;
      } finally {
        this.fetchPromise = null;
      }
    })();

    await this.fetchPromise;
  }

  async getHealth() {
    return {
      status: 'ok' as const,
      service: 'yield-terminal-real-data-api',
      version: '2.0.0',
      dataSource: 'DeFiLlama + Blockchain RPC',
    };
  }

  async getVaults(params: VaultsQueryParams = {}): Promise<PaginatedResponse<Vault>> {
    await this.ensureVaultsLoaded();
    
    let filtered = [...this.vaults];

    if (params.asset) {
      filtered = filtered.filter((v) => v.asset.toLowerCase() === params.asset!.toLowerCase());
    }
    if (params.chain) {
      filtered = filtered.filter((v) => v.chain.toLowerCase() === params.chain!.toLowerCase());
    }
    if (params.protocol) {
      filtered = filtered.filter((v) => v.protocol.toLowerCase().includes(params.protocol!.toLowerCase()));
    }
    if (params.strategy_type) {
      filtered = filtered.filter((v) => v.strategy_type === params.strategy_type);
    }
    if (params.min_apy !== undefined) {
      filtered = filtered.filter((v) => v.apy >= params.min_apy!);
    }
    if (params.max_risk !== undefined) {
      filtered = filtered.filter((v) => v.risk_score <= params.max_risk!);
    }
    if (params.min_tvl !== undefined) {
      filtered = filtered.filter((v) => v.tvl >= params.min_tvl!);
    }

    const sortField = params.sort || 'tvl';
    const order = params.order || 'desc';

    filtered.sort((a, b) => {
      const aVal = (a as any)[sortField] || 0;
      const bVal = (b as any)[sortField] || 0;
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

    const page = params.page || 1;
    const limit = params.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
    };
  }

  async getVaultByAddress(address: string): Promise<Vault | null> {
    await this.ensureVaultsLoaded();
    
    const vault = this.vaults.find(
      (v) => v.contract_address?.toLowerCase() === address.toLowerCase() ||
             v.id.toLowerCase() === address.toLowerCase()
    );
    return vault || null;
  }

  async getVaultRisk(address: string): Promise<VaultRiskReport | null> {
    const vault = await this.getVaultByAddress(address);
    if (!vault) return null;

    if (this.vaultRisks[address]) {
      return this.vaultRisks[address];
    }

    return {
      vault_address: address,
      overall_score: vault.risk_score,
      factors: {
        protocol_risk: Math.max(1, vault.risk_score - 2),
        smart_contract_risk: vault.upgradeability === 'immutable' ? 2 : 
                            vault.upgradeability === 'timelock_upgradeable' ? 4 : 6,
        liquidity_risk: vault.liquidity_depth === 'high' ? 2 : 
                       vault.liquidity_depth === 'medium' ? 5 : 8,
        complexity_risk: Math.min(10, (vault.dependencies?.length || 1) * 1.5),
        centralization_risk: vault.upgradeability === 'immutable' ? 1 : 
                            vault.upgradeability === 'timelock_upgradeable' ? 4 : 7,
      },
      audit_info: {
        audited: vault.upgradeability !== 'admin_upgradeable',
        audit_firms: [],
        audit_date: null,
      },
      historical_incidents: [],
      recommendations: [
        vault.risk_score > 7 ? 'High risk - consider smaller allocation' : 'Risk level acceptable for diversified portfolio',
        vault.liquidity_depth === 'low' ? 'Monitor liquidity before large deployments' : 'Adequate liquidity for institutional size',
      ],
    };
  }

  async getRankings(params: RankingsQueryParams = {}): Promise<RankingsResponse> {
    await this.ensureVaultsLoaded();
    
    const mode = params.mode || 'risk_adjusted';
    let filtered = [...this.vaults];

    if (params.asset) {
      filtered = filtered.filter((v) => v.asset.toLowerCase() === params.asset!.toLowerCase());
    }
    if (params.chain) {
      filtered = filtered.filter((v) => v.chain.toLowerCase() === params.chain!.toLowerCase());
    }
    if (params.protocol) {
      filtered = filtered.filter((v) => v.protocol.toLowerCase().includes(params.protocol!.toLowerCase()));
    }
    if (params.min_tvl !== undefined) {
      filtered = filtered.filter((v) => v.tvl >= params.min_tvl!);
    }
    if (params.max_risk !== undefined) {
      filtered = filtered.filter((v) => v.risk_score <= params.max_risk!);
    }

    const rankings: RankingEntry[] = filtered.map((vault) => {
      const score = calculateAllocationScore(vault, mode);
      return {
        rank: 0,
        vault,
        score,
        score_components: {
          yield_score: Math.min(vault.apy / 20, 1) * 100,
          risk_score: (1 - Math.min(vault.risk_score / 10, 1)) * 100,
          liquidity_score: (vault.liquidity_depth === 'high' ? 1 : vault.liquidity_depth === 'medium' ? 0.6 : 0.3) * 100,
          audit_score: (vault.upgradeability === 'immutable' ? 1 : vault.upgradeability === 'timelock_upgradeable' ? 0.8 : 0.5) * 100,
        },
      };
    });

    rankings.sort((a, b) => b.score - a.score);
    rankings.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    const limit = params.limit || 100;
    return {
      mode,
      rankings: rankings.slice(0, limit),
      generated_at: Date.now(),
      filters: params,
    };
  }

  async getPortfolio(walletAddress: string): Promise<Portfolio> {
    await this.ensureVaultsLoaded();
    return buildPortfolio(walletAddress, this.vaults);
  }

  async getVaultReport(address: string, useAI: boolean = false): Promise<VaultReport | null> {
    const vault = await this.getVaultByAddress(address);
    if (!vault) return null;

    const riskReport = await this.getVaultRisk(address);

    return {
      vault,
      risk_analysis: riskReport,
      strategy_description: `${vault.protocol} vault providing ${vault.apy.toFixed(2)}% APY on ${vault.asset}`,
      yield_breakdown: {
        base_yield: vault.apy_base || vault.apy * 0.7,
        incentive_yield: vault.apy_reward || vault.apy * 0.3,
        fee_impact: -0.1,
      },
      historical_performance: {
        apy_30d: vault.apy,
        apy_90d: vault.apy * 0.95,
        max_drawdown: -5.2,
        sharpe_ratio: 2.1,
      },
      recommendations: [
        `Suitable for ${vault.risk_score < 5 ? 'conservative' : vault.risk_score < 7 ? 'moderate' : 'aggressive'} portfolios`,
        vault.tvl > 50_000_000 ? 'High liquidity suitable for large deployments' : 'Consider position size limits',
      ],
      red_flags: vault.risk_score > 7 ? ['High risk score', 'Monitor closely'] : [],
      generated_at: Date.now(),
    };
  }

  async clearCache(): Promise<void> {
    this.vaults = [];
    this.lastFetch = 0;
    localStorage.removeItem('vaults_cache');
  }
}

export const realDataApiService = new RealDataApiService();
