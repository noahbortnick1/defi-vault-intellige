import type { AggregatorVault, DiscoveryResult } from './types';

export class AggregatorLayer {
  private baseUrl = 'https://yields.llama.fi';

  async fetchVaults(): Promise<AggregatorVault[]> {
    try {
      const pools = await this.simulateLlamaFetch();
      return pools;
    } catch (error) {
      console.error('Aggregator fetch failed:', error);
      return [];
    }
  }

  private async simulateLlamaFetch(): Promise<AggregatorVault[]> {
    return [
      {
        pool: '0x1234...abcd',
        chain: 'Ethereum',
        project: 'Yearn Finance',
        symbol: 'yvUSDC',
        tvlUsd: 145000000,
        apy: 12.5,
        apyBase: 8.2,
        apyReward: 4.3,
        rewardTokens: ['YFI'],
        underlyingTokens: ['USDC'],
        poolMeta: 'USDC Vault v3',
        apyPct1D: 0.5,
        apyPct7D: -1.2,
        apyPct30D: 2.8,
      },
      {
        pool: '0x5678...efgh',
        chain: 'Arbitrum',
        project: 'GMX',
        symbol: 'GLP',
        tvlUsd: 320000000,
        apy: 18.7,
        apyBase: 15.2,
        apyReward: 3.5,
        rewardTokens: ['GMX', 'ETH'],
        underlyingTokens: ['ETH', 'BTC', 'LINK', 'UNI'],
        poolMeta: 'GMX Liquidity Pool',
        apyPct1D: 1.2,
        apyPct7D: 3.4,
        apyPct30D: -2.1,
      },
      {
        pool: '0x9abc...ijkl',
        chain: 'Base',
        project: 'Aerodrome',
        symbol: 'vAMM-USDC/USDbC',
        tvlUsd: 45000000,
        apy: 24.3,
        apyBase: 18.1,
        apyReward: 6.2,
        rewardTokens: ['AERO'],
        underlyingTokens: ['USDC', 'USDbC'],
        poolMeta: 'Stable LP Pool',
        apyPct1D: 0.8,
        apyPct7D: 2.1,
        apyPct30D: 5.4,
      },
      {
        pool: '0xdef0...mnop',
        chain: 'Optimism',
        project: 'Velodrome',
        symbol: 'vAMM-OP/USDC',
        tvlUsd: 28000000,
        apy: 31.5,
        apyBase: 12.3,
        apyReward: 19.2,
        rewardTokens: ['VELO'],
        underlyingTokens: ['OP', 'USDC'],
        poolMeta: 'Volatile LP Pool',
        apyPct1D: 2.1,
        apyPct7D: 8.3,
        apyPct30D: 12.7,
      },
      {
        pool: '0x2468...qrst',
        chain: 'Polygon',
        project: 'Beefy',
        symbol: 'mooAaveUSDC',
        tvlUsd: 67000000,
        apy: 9.8,
        apyBase: 9.8,
        apyReward: 0,
        rewardTokens: [],
        underlyingTokens: ['USDC'],
        poolMeta: 'Aave USDC Autocompound',
        apyPct1D: 0.1,
        apyPct7D: -0.3,
        apyPct30D: 1.2,
      },
      {
        pool: '0x1357...uvwx',
        chain: 'Ethereum',
        project: 'Morpho',
        symbol: 'WETH-USDC',
        tvlUsd: 89000000,
        apy: 15.4,
        apyBase: 15.4,
        apyReward: 0,
        rewardTokens: [],
        underlyingTokens: ['WETH', 'USDC'],
        poolMeta: 'P2P Optimized Lending',
        apyPct1D: 0.6,
        apyPct7D: 1.8,
        apyPct30D: 3.2,
      },
      {
        pool: '0x8642...yzab',
        chain: 'Arbitrum',
        project: 'Pendle',
        symbol: 'PT-GLP-28DEC2023',
        tvlUsd: 12000000,
        apy: 22.1,
        apyBase: 22.1,
        apyReward: 0,
        rewardTokens: [],
        underlyingTokens: ['GLP'],
        poolMeta: 'Principal Token',
        apyPct1D: 0.3,
        apyPct7D: -1.1,
        apyPct30D: 4.7,
      },
      {
        pool: '0x9753...cdef',
        chain: 'Ethereum',
        project: 'Convex',
        symbol: 'cvxCRV',
        tvlUsd: 156000000,
        apy: 13.2,
        apyBase: 7.8,
        apyReward: 5.4,
        rewardTokens: ['CVX', 'CRV'],
        underlyingTokens: ['CRV'],
        poolMeta: 'Curve Vote-Locked',
        apyPct1D: 0.4,
        apyPct7D: 1.2,
        apyPct30D: -0.8,
      },
      {
        pool: '0x3698...ghij',
        chain: 'Base',
        project: 'Compound',
        symbol: 'cUSDC',
        tvlUsd: 34000000,
        apy: 7.3,
        apyBase: 7.3,
        apyReward: 0,
        rewardTokens: [],
        underlyingTokens: ['USDC'],
        poolMeta: 'Compound V3 USDC',
        apyPct1D: 0.2,
        apyPct7D: -0.5,
        apyPct30D: 0.9,
      },
      {
        pool: '0x7412...klmn',
        chain: 'Optimism',
        project: 'Aave',
        symbol: 'aOptUSDC',
        tvlUsd: 98000000,
        apy: 8.9,
        apyBase: 8.4,
        apyReward: 0.5,
        rewardTokens: ['OP'],
        underlyingTokens: ['USDC'],
        poolMeta: 'Aave V3 USDC',
        apyPct1D: 0.1,
        apyPct7D: 0.4,
        apyPct30D: 1.6,
      },
    ];
  }

  normalizeToDiscovery(vault: AggregatorVault): DiscoveryResult {
    return {
      vaultAddress: vault.pool,
      chain: vault.chain.toLowerCase(),
      protocol: vault.project,
      source: 'aggregator',
      confidence: 0.85,
      discoveredAt: Date.now(),
      metadata: {
        symbol: vault.symbol,
        tvl: vault.tvlUsd,
        apy: vault.apy,
        apyBase: vault.apyBase,
        apyReward: vault.apyReward,
        rewardTokens: vault.rewardTokens,
        underlyingTokens: vault.underlyingTokens,
      },
    };
  }

  async discoverVaults(): Promise<DiscoveryResult[]> {
    const vaults = await this.fetchVaults();
    return vaults.map((v) => this.normalizeToDiscovery(v));
  }
}
