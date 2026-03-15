import type { Vault, Chain, Protocol } from './types';

const DEFILLAMA_API = 'https://yields.llama.fi';
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface DeFiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase?: number;
  apyReward?: number;
  apy: number;
  rewardTokens?: string[];
  pool: string;
  apyPct1D?: number;
  apyPct7D?: number;
  apyPct30D?: number;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  predictions?: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  };
  poolMeta?: string;
  mu?: number;
  sigma?: number;
  count?: number;
  outlier?: boolean;
  underlyingTokens?: string[];
  url?: string;
}

interface CoingeckoPrice {
  usd: number;
  usd_24h_change?: number;
}

const CHAIN_MAPPING: Record<string, Chain> = {
  'Ethereum': 'ethereum',
  'Arbitrum': 'arbitrum',
  'Optimism': 'optimism',
  'Polygon': 'polygon',
  'Base': 'base',
  'BSC': 'bsc',
};

const PROTOCOL_CATEGORIES: Record<string, string> = {
  'aave': 'Lending',
  'aave-v3': 'Lending',
  'compound': 'Lending',
  'compound-v3': 'Lending',
  'morpho': 'Lending Optimizer',
  'morpho-blue': 'Lending Optimizer',
  'yearn-finance': 'Yield Aggregator',
  'beefy': 'Yield Aggregator',
  'curve': 'DEX',
  'convex-finance': 'Yield Aggregator',
  'pendle': 'Yield Trading',
  'spark': 'Lending',
  'frax': 'Stablecoin',
  'gmx': 'Perps DEX',
  'gearbox': 'Leverage',
  'euler': 'Lending',
  'notional': 'Fixed Rate',
  'idle': 'Yield Aggregator',
  'harvest': 'Yield Aggregator',
  'across': 'Bridge',
  'stargate': 'Bridge',
  'mux': 'Perps DEX',
};

function mapChain(llamaChain: string): Chain {
  return CHAIN_MAPPING[llamaChain] || 'ethereum';
}

function calculateRiskScore(pool: DeFiLlamaPool): number {
  let risk = 5.0;

  if (pool.tvlUsd < 1_000_000) risk += 2.0;
  else if (pool.tvlUsd < 10_000_000) risk += 1.0;
  else if (pool.tvlUsd > 100_000_000) risk -= 1.0;

  if (pool.apy > 50) risk += 2.0;
  else if (pool.apy > 30) risk += 1.0;
  else if (pool.apy > 20) risk += 0.5;

  if (pool.ilRisk === 'yes') risk += 1.5;

  if (pool.rewardTokens && pool.rewardTokens.length > 0) {
    risk += 0.5;
  }

  const majorProtocols = ['aave', 'compound', 'curve', 'uniswap', 'maker'];
  const projectLower = pool.project.toLowerCase();
  if (majorProtocols.some(p => projectLower.includes(p))) {
    risk -= 1.5;
  }

  if (pool.stablecoin) {
    risk -= 0.5;
  }

  if (pool.outlier) {
    risk += 1.5;
  }

  return Math.max(0, Math.min(10, risk));
}

function getLiquidityDepth(tvl: number): 'high' | 'medium' | 'low' {
  if (tvl >= 100_000_000) return 'high';
  if (tvl >= 10_000_000) return 'medium';
  return 'low';
}

function getUpgradeability(project: string): 'immutable' | 'timelock_upgradeable' | 'admin_upgradeable' {
  const immutableProtocols = ['uniswap-v2', 'sushiswap', 'curve'];
  const timelockProtocols = ['aave', 'compound', 'maker'];
  
  const projectLower = project.toLowerCase();
  
  if (immutableProtocols.some(p => projectLower.includes(p))) {
    return 'immutable';
  }
  if (timelockProtocols.some(p => projectLower.includes(p))) {
    return 'timelock_upgradeable';
  }
  return 'admin_upgradeable';
}

function getStrategyType(pool: DeFiLlamaPool): string {
  const symbol = pool.symbol.toLowerCase();
  const project = pool.project.toLowerCase();
  const exposure = pool.exposure?.toLowerCase() || '';

  if (project.includes('aave') || project.includes('compound')) {
    return 'lending';
  }
  if (project.includes('curve') || symbol.includes('crv')) {
    return 'stableswap';
  }
  if (project.includes('uniswap') || project.includes('sushiswap')) {
    return 'amm';
  }
  if (project.includes('yearn') || project.includes('beefy')) {
    return 'vault';
  }
  if (project.includes('pendle')) {
    return 'yield_trading';
  }
  if (exposure.includes('single')) {
    return 'single_asset';
  }
  
  return 'multi';
}

function getDependencies(pool: DeFiLlamaPool): string[] {
  const deps: string[] = [];
  
  deps.push(pool.project);
  
  if (pool.rewardTokens && pool.rewardTokens.length > 0) {
    deps.push('Incentive Program');
  }
  
  const symbol = pool.symbol.toLowerCase();
  if (symbol.includes('crv')) deps.push('Curve');
  if (symbol.includes('cvx')) deps.push('Convex');
  if (symbol.includes('aura')) deps.push('Aura');
  
  return [...new Set(deps)];
}

function getYieldSources(pool: DeFiLlamaPool): string[] {
  const sources: string[] = [];
  
  if (pool.apyBase && pool.apyBase > 0.1) {
    sources.push('base');
  }
  
  if (pool.apyReward && pool.apyReward > 0.1) {
    sources.push('incentives');
  }
  
  if (pool.ilRisk === 'no' || pool.stablecoin) {
    sources.push('organic');
  }
  
  return sources.length > 0 ? sources : ['base'];
}

export async function fetchDeFiLlamaPools(): Promise<DeFiLlamaPool[]> {
  try {
    const response = await fetch(`${DEFILLAMA_API}/pools`);
    
    if (!response.ok) {
      throw new Error(`DeFiLlama API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching DeFiLlama pools:', error);
    throw error;
  }
}

export async function fetchTokenPrices(tokenIds: string[]): Promise<Record<string, CoingeckoPrice>> {
  try {
    const ids = tokenIds.join(',');
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      console.warn('CoinGecko API error, returning empty prices');
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Error fetching token prices:', error);
    return {};
  }
}

export function convertDeFiLlamaPoolToVault(pool: DeFiLlamaPool, index: number): Vault {
  const chain = mapChain(pool.chain);
  const riskScore = calculateRiskScore(pool);
  const liquidityDepth = getLiquidityDepth(pool.tvlUsd);
  const upgradeability = getUpgradeability(pool.project);
  const strategyType = getStrategyType(pool);
  const dependencies = getDependencies(pool);
  const yieldSources = getYieldSources(pool);
  
  const asset = pool.symbol.split('-')[0]?.toUpperCase() || 'UNKNOWN';
  
  const apyBase = pool.apyBase || 0;
  const apyReward = pool.apyReward || 0;
  const totalApy = pool.apy || (apyBase + apyReward);
  
  return {
    id: pool.pool || `pool-${index}`,
    name: pool.poolMeta || `${pool.project} ${pool.symbol}`,
    protocol: pool.project,
    chain,
    asset,
    tvl: pool.tvlUsd,
    apy: totalApy,
    apy_base: apyBase,
    apy_reward: apyReward,
    strategy_type: strategyType,
    risk_score: riskScore,
    liquidity_depth: liquidityDepth,
    upgradeability,
    dependencies,
    yield_sources: yieldSources,
    contract_address: pool.pool.split(':')[1] || pool.pool,
    allocation_score: 0,
    underlying_tokens: pool.underlyingTokens || [asset],
    exposure: pool.exposure || 'single',
    il_risk: pool.ilRisk === 'yes',
    stablecoin: pool.stablecoin,
    url: pool.url,
    last_updated: Date.now(),
  };
}

export async function fetchRealVaultData(): Promise<Vault[]> {
  try {
    const pools = await fetchDeFiLlamaPools();
    
    const supportedChains = Object.keys(CHAIN_MAPPING);
    const filteredPools = pools.filter(pool => 
      supportedChains.includes(pool.chain) &&
      pool.tvlUsd >= 100_000 &&
      pool.apy > 0 &&
      pool.apy < 1000
    );
    
    const vaults = filteredPools
      .slice(0, 500)
      .map((pool, index) => convertDeFiLlamaPoolToVault(pool, index));
    
    return vaults;
  } catch (error) {
    console.error('Error fetching real vault data:', error);
    throw error;
  }
}

export async function fetchVaultsByChain(chain: Chain): Promise<Vault[]> {
  const allVaults = await fetchRealVaultData();
  return allVaults.filter(v => v.chain === chain);
}

export async function fetchVaultsByProtocol(protocol: string): Promise<Vault[]> {
  const allVaults = await fetchRealVaultData();
  return allVaults.filter(v => 
    v.protocol.toLowerCase().includes(protocol.toLowerCase())
  );
}

export async function fetchVaultsByAsset(asset: string): Promise<Vault[]> {
  const allVaults = await fetchRealVaultData();
  return allVaults.filter(v => 
    v.asset.toLowerCase() === asset.toLowerCase()
  );
}

export async function searchVaults(query: string): Promise<Vault[]> {
  const allVaults = await fetchRealVaultData();
  const lowerQuery = query.toLowerCase();
  
  return allVaults.filter(v =>
    v.name.toLowerCase().includes(lowerQuery) ||
    v.protocol.toLowerCase().includes(lowerQuery) ||
    v.asset.toLowerCase().includes(lowerQuery)
  );
}

export function getCachedVaults(): Vault[] | null {
  try {
    const cached = localStorage.getItem('vaults_cache');
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    if (age > 5 * 60 * 1000) {
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

export function setCachedVaults(vaults: Vault[]): void {
  try {
    localStorage.setItem('vaults_cache', JSON.stringify({
      data: vaults,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.warn('Failed to cache vaults:', error);
  }
}

export async function fetchRealVaultDataWithCache(): Promise<Vault[]> {
  const cached = getCachedVaults();
  if (cached) {
    return cached;
  }
  
  const vaults = await fetchRealVaultData();
  setCachedVaults(vaults);
  return vaults;
}

export interface VaultStats {
  totalVaults: number;
  totalTVL: number;
  avgAPY: number;
  chains: Record<Chain, number>;
  protocols: Record<string, number>;
  assets: Record<string, number>;
}

export function calculateVaultStats(vaults: Vault[]): VaultStats {
  const stats: VaultStats = {
    totalVaults: vaults.length,
    totalTVL: 0,
    avgAPY: 0,
    chains: {} as Record<Chain, number>,
    protocols: {},
    assets: {},
  };
  
  let totalAPY = 0;
  
  for (const vault of vaults) {
    stats.totalTVL += vault.tvl;
    totalAPY += vault.apy;
    
    stats.chains[vault.chain] = (stats.chains[vault.chain] || 0) + 1;
    stats.protocols[vault.protocol] = (stats.protocols[vault.protocol] || 0) + 1;
    stats.assets[vault.asset] = (stats.assets[vault.asset] || 0) + 1;
  }
  
  stats.avgAPY = vaults.length > 0 ? totalAPY / vaults.length : 0;
  
  return stats;
}
