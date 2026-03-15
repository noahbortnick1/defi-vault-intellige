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
import { SEED_VAULTS, SEED_VAULT_RISKS, buildPortfolio } from './seedData';

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

export class ApiService {
  private vaults: Vault[] = SEED_VAULTS;
  private vaultRisks: Record<string, VaultRiskReport> = SEED_VAULT_RISKS;

  async getHealth() {
    return {
      status: 'ok' as const,
      service: 'yield-terminal-api',
      version: '1.0.0',
    };
  }

  async getVaults(params: VaultsQueryParams = {}): Promise<PaginatedResponse<Vault>> {
    let filtered = [...this.vaults];

    if (params.asset) {
      filtered = filtered.filter((v) => v.asset.toLowerCase() === params.asset!.toLowerCase());
    }
    if (params.chain) {
      filtered = filtered.filter((v) => v.chain.toLowerCase() === params.chain!.toLowerCase());
    }
    if (params.protocol) {
      filtered = filtered.filter((v) => v.protocol.toLowerCase() === params.protocol!.toLowerCase());
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

    const sortField = params.sort || 'allocation_score';
    const order = params.order || 'desc';

    filtered.sort((a, b) => {
      const aVal = (a as any)[sortField] || 0;
      const bVal = (b as any)[sortField] || 0;
      return order === 'desc' ? bVal - aVal : aVal - bVal;
    });

    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      items: paginated,
      total: filtered.length,
      limit,
      offset,
    };
  }

  async getVaultByAddress(address: string): Promise<Vault | null> {
    const vault = this.vaults.find((v) => v.address.toLowerCase() === address.toLowerCase());
    return vault || null;
  }

  async getVaultRisk(address: string): Promise<VaultRiskReport | null> {
    const risk = this.vaultRisks[address.toLowerCase()];
    return risk || null;
  }

  async getRankings(params: RankingsQueryParams = {}): Promise<RankingsResponse> {
    const mode = params.mode || 'risk_adjusted';
    let filtered = [...this.vaults];

    if (params.asset) {
      filtered = filtered.filter((v) => v.asset.toLowerCase() === params.asset!.toLowerCase());
    }
    if (params.chain) {
      filtered = filtered.filter((v) => v.chain.toLowerCase() === params.chain!.toLowerCase());
    }
    if (params.strategy_type) {
      filtered = filtered.filter((v) => v.strategy_type === params.strategy_type);
    }

    const withScores = filtered.map((vault) => ({
      vault,
      score: calculateAllocationScore(vault, mode),
    }));

    withScores.sort((a, b) => b.score - a.score);

    const limit = params.limit || 25;
    const ranked = withScores.slice(0, limit);

    const items: RankingEntry[] = ranked.map((item, index) => ({
      rank: index + 1,
      vault_address: item.vault.address,
      name: item.vault.name,
      protocol: item.vault.protocol,
      chain: item.vault.chain,
      asset: item.vault.asset,
      apy: item.vault.apy,
      risk_score: item.vault.risk_score,
      allocation_score: Math.round(item.score),
      liquidity_depth: item.vault.liquidity_depth!,
    }));

    return {
      mode,
      items,
    };
  }

  async getPortfolio(walletAddress: string): Promise<Portfolio> {
    return buildPortfolio(walletAddress);
  }

  async getVaultReport(address: string): Promise<VaultReport | null> {
    const vault = await this.getVaultByAddress(address);
    if (!vault) return null;

    const risk = await this.getVaultRisk(address);
    if (!risk) return null;

    const redFlags: string[] = [];
    if (vault.upgradeability === 'admin_upgradeable') {
      redFlags.push('Admin-upgradeable without timelock');
    }
    if (vault.liquidity_depth === 'low') {
      redFlags.push('Limited exit liquidity');
    }
    if (vault.yield_sources?.includes('incentives')) {
      redFlags.push('Incentive component may be unstable');
    }
    if ((vault.dependencies?.length || 0) > 3) {
      redFlags.push('High dependency complexity');
    }
    if (risk.factors.oracle_risk >= 4) {
      redFlags.push('Depends on external oracle');
    }

    return {
      vault,
      strategy_summary: vault.strategy || 'No strategy description available',
      yield_sources: vault.yield_sources || [],
      dependencies: vault.dependencies || [],
      contract_risk: {
        upgradeability: vault.upgradeability || 'immutable',
        timelock: vault.upgradeability === 'timelock_upgradeable' ? '24h' : undefined,
        audits: vault.protocol === 'Yearn' ? ['Trail of Bits', 'OpenZeppelin'] :
                vault.protocol === 'Aave' ? ['Trail of Bits', 'OpenZeppelin', 'Consensys Diligence'] :
                vault.protocol === 'Compound' ? ['OpenZeppelin', 'Trail of Bits'] :
                ['Trail of Bits'],
      },
      liquidity_profile: {
        depth: vault.liquidity_depth || 'medium',
        withdrawal_risk: vault.liquidity_depth === 'high' ? 'low' :
                        vault.liquidity_depth === 'medium' ? 'moderate' : 'high',
      },
      overall_risk_score: vault.risk_score,
      red_flags: redFlags,
    };
  }
}

export const apiService = new ApiService();
