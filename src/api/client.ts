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
import { apiService } from './service';

const API_BASE_PATH = '/api/v1';

export class ApiClient {
  async health(): Promise<HealthResponse> {
    return apiService.getHealth();
  }

  async getVaults(params?: VaultsQueryParams): Promise<PaginatedResponse<Vault>> {
    return apiService.getVaults(params);
  }

  async getVault(address: string): Promise<Vault | null> {
    return apiService.getVaultByAddress(address);
  }

  async getVaultRisk(address: string): Promise<VaultRiskReport | null> {
    return apiService.getVaultRisk(address);
  }

  async getRankings(params?: RankingsQueryParams): Promise<RankingsResponse> {
    return apiService.getRankings(params);
  }

  async getPortfolio(walletAddress: string): Promise<Portfolio> {
    return apiService.getPortfolio(walletAddress);
  }

  async getVaultReport(address: string, useAI: boolean = true): Promise<VaultReport | null> {
    return apiService.getVaultReport(address, useAI);
  }
}

export const apiClient = new ApiClient();
