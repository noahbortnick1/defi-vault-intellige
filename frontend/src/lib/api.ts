import { Vault, VaultListResponse, RiskAnalysis, Portfolio, HealthResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.fetch<HealthResponse>('/api/v1/health');
  }

  async getVaults(params?: {
    chain?: string;
    protocol?: string;
    minApy?: number;
  }): Promise<VaultListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.chain) searchParams.set('chain', params.chain);
    if (params?.protocol) searchParams.set('protocol', params.protocol);
    if (params?.minApy !== undefined) searchParams.set('min_apy', params.minApy.toString());

    const query = searchParams.toString();
    const endpoint = `/api/v1/vaults${query ? `?${query}` : ''}`;

    return this.fetch<VaultListResponse>(endpoint);
  }

  async getVaultByAddress(address: string): Promise<Vault> {
    return this.fetch<Vault>(`/api/v1/vaults/${address}`);
  }

  async getVaultRisk(address: string): Promise<RiskAnalysis> {
    return this.fetch<RiskAnalysis>(`/api/v1/vaults/${address}/risk`);
  }

  async getPortfolio(walletAddress: string): Promise<Portfolio> {
    return this.fetch<Portfolio>(`/api/v1/portfolio/${walletAddress}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
