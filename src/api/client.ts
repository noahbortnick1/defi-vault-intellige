import type {
  HealthResponse,
  Vault,
  VaultRiskReport,
  VaultReport,
  Portfolio,
  RankingsResponse,
  VaultsQueryParams,
  RankingsQueryParams,
  PaginatedResponse,
} from './types';
import { realDataApiService } from './realDataService';

const API_BASE_PATH = '/api/v1';

export class ApiClient {
  async health(): Promise<HealthResponse> {
    return realDataApiService.getHealth();
  }

  async getVaults(params?: VaultsQueryParams): Promise<PaginatedResponse<Vault>> {
    return realDataApiService.getVaults(params);
  }

  async getVault(address: string): Promise<Vault | null> {
    return realDataApiService.getVaultByAddress(address);
  }

  async getVaultRisk(address: string): Promise<VaultRiskReport | null> {
    return realDataApiService.getVaultRisk(address);
  }

  async getRankings(params?: RankingsQueryParams): Promise<RankingsResponse> {
    return realDataApiService.getRankings(params);
  }

  async getPortfolio(walletAddress: string): Promise<Portfolio> {
    return realDataApiService.getPortfolio(walletAddress);
  }

  async getVaultReport(address: string, useAI: boolean = true): Promise<VaultReport | null> {
    return realDataApiService.getVaultReport(address, useAI);
  }

  async clearCache(): Promise<void> {
    return realDataApiService.clearCache();
  }
}

export const apiClient = new ApiClient();
