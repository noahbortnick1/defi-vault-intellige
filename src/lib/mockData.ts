import { Vault, YieldDataPoint } from './types';
import { calculateRiskScore, generateYieldHistory } from './risk';

const protocols: Vault['protocol'][] = ['aave', 'compound', 'yearn', 'curve', 'convex', 'lido', 'maker'];
const chains: Vault['chain'][] = ['ethereum', 'arbitrum', 'optimism', 'polygon', 'avalanche', 'bsc'];
const assets = ['USDC', 'USDT', 'DAI', 'ETH', 'WBTC', 'stETH', 'FRAX'];

const strategies = [
  'Lend asset on primary money market, stake receipt token for rewards',
  'Provide liquidity to stablecoin curve pool, stake LP tokens',
  'Recursive leverage strategy using borrow/lend cycles',
  'Delta-neutral yield farming with hedged perpetual positions',
  'Auto-compound rewards into base asset position',
  'Cross-protocol yield aggregation with automatic rebalancing',
  'Liquidity provision with automated range management',
];

const dependencies = [
  'Uniswap V3',
  'Chainlink Oracles',
  'Curve Finance',
  'Aave Protocol',
  'Compound V3',
  'Balancer',
  'Convex Finance',
];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockVaults(count: number = 50): Vault[] {
  const vaults: Vault[] = [];

  for (let i = 0; i < count; i++) {
    const protocol = randomFromArray(protocols);
    const chain = randomFromArray(chains);
    const asset = randomFromArray(assets);
    const apy = Math.random() * 50 + 1;
    const tvl = Math.random() * 500_000_000 + 100_000;
    const liquidityDepth = tvl * (Math.random() * 2 + 0.5);
    const numDeps = randomInt(0, 3);
    const deps: string[] = [];
    for (let j = 0; j < numDeps; j++) {
      const dep = randomFromArray(dependencies);
      if (!deps.includes(dep)) {
        deps.push(dep);
      }
    }

    const upgradeability: Vault['upgradeability'] = randomFromArray([
      'immutable',
      'timelock',
      'multisig',
      'eoa',
    ]);
    const oracleType: Vault['oracleType'] = randomFromArray([
      'chainlink',
      'uniswap',
      'internal',
      'none',
    ]);

    const vault: Vault = {
      id: `vault-${i + 1}`,
      address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`,
      protocol,
      chain,
      name: `${protocol.charAt(0).toUpperCase() + protocol.slice(1)} ${asset} Vault`,
      asset,
      apy,
      tvl,
      riskScore: 0,
      strategy: randomFromArray(strategies),
      dependencies: deps,
      upgradeability,
      oracleType,
      liquidityDepth,
    };

    const { score } = calculateRiskScore(vault);
    vault.riskScore = score;

    vaults.push(vault);
  }

  return vaults;
}

export function generateVaultHistory(vault: Vault): YieldDataPoint[] {
  return generateYieldHistory(vault.apy, 90);
}
