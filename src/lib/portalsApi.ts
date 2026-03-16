const PORTALS_API_KEY = 'f012052c-d584-4bc7-a3a9-0405c7185c8f';
const PORTALS_BASE_URL = 'https://api.portals.fi/v2';

export interface PortalsNetwork {
  name: string;
  chainId: number;
  icon: string;
}

export interface PortalsToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  chainId: number;
  price: number;
  image: string;
}

export interface PortalsPlatform {
  name: string;
  address: string;
  chainId: number;
  icon: string;
  category: string;
}

export interface PortalsBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  amount: string;
  price: number;
  value: number;
  chainId: number;
  network: string;
  image: string;
}

export interface PortalsQuote {
  context: {
    inputToken: string;
    outputToken: string;
    inputAmount: string;
    outputAmount: string;
    minOutputAmount: string;
    slippageTolerancePercentage: number;
    sender: string;
    target: string;
  };
  tx: {
    to: string;
    data: string;
    value: string;
    gasLimit: string;
  };
  estimate: {
    inputAmountUsd: number;
    outputAmountUsd: number;
    gasCostUsd: number;
    netBalanceChangeUsd: number;
  };
}

export class PortalsApi {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = PORTALS_API_KEY;
    this.baseUrl = PORTALS_BASE_URL;
  }

  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Portals API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getNetworks(): Promise<PortalsNetwork[]> {
    return this.request<PortalsNetwork[]>('/networks');
  }

  async getTokens(chainId?: number): Promise<PortalsToken[]> {
    const params = chainId ? { chainId: chainId.toString() } : {};
    return this.request<PortalsToken[]>('/tokens', params);
  }

  async getPlatforms(chainId?: number): Promise<PortalsPlatform[]> {
    const params = chainId ? { chainId: chainId.toString() } : {};
    return this.request<PortalsPlatform[]>('/platforms', params);
  }

  async getBalances(address: string, chainId?: number): Promise<PortalsBalance[]> {
    const params: Record<string, string> = { address };
    if (chainId) {
      params.chainId = chainId.toString();
    }
    return this.request<PortalsBalance[]>('/account', params);
  }

  async getQuote(params: {
    inputToken: string;
    outputToken: string;
    inputAmount: string;
    sender: string;
    slippageTolerancePercentage?: number;
    partner?: string;
  }): Promise<PortalsQuote> {
    const queryParams: Record<string, string> = {
      inputToken: params.inputToken,
      outputToken: params.outputToken,
      inputAmount: params.inputAmount,
      sender: params.sender,
    };

    if (params.slippageTolerancePercentage !== undefined) {
      queryParams.slippageTolerancePercentage = params.slippageTolerancePercentage.toString();
    }

    if (params.partner) {
      queryParams.partner = params.partner;
    }

    return this.request<PortalsQuote>('/portal', queryParams);
  }
}

export const portalsApi = new PortalsApi();
