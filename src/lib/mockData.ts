import type {
  Vault,
  Protocol,
  Audit,
  YieldSource,
  RiskFactor,
  Dependency,
  GovernanceInfo,
  HistoricalDataPoint,
  ChangeLogEntry,
  Chain,
  AssetType,
  StrategyType,
  RiskLevel,
  Portfolio,
  Position,
  Alert,
} from './types';

const PROTOCOLS: Protocol[] = [
  {
    id: 'aave-v3',
    name: 'Aave V3',
    category: 'Lending',
    chains: ['ethereum', 'arbitrum', 'optimism', 'polygon', 'base'],
    tvl: 6_500_000_000,
    audits: [
      {
        auditor: 'OpenZeppelin',
        date: '2023-01-15',
        reportUrl: 'https://example.com/audit',
        scope: 'Core protocol contracts',
        findings: { critical: 0, high: 1, medium: 3, low: 8 },
      },
      {
        auditor: 'Trail of Bits',
        date: '2023-02-20',
        reportUrl: 'https://example.com/audit',
        scope: 'V3 upgrade contracts',
        findings: { critical: 0, high: 0, medium: 2, low: 5 },
      },
    ],
    website: 'https://aave.com',
    twitter: '@AaveAave',
    github: 'aave/aave-v3-core',
  },
  {
    id: 'compound-v3',
    name: 'Compound V3',
    category: 'Lending',
    chains: ['ethereum', 'arbitrum', 'polygon', 'base'],
    tvl: 3_200_000_000,
    audits: [
      {
        auditor: 'OpenZeppelin',
        date: '2023-06-10',
        reportUrl: 'https://example.com/audit',
        scope: 'Comet protocol',
        findings: { critical: 0, high: 0, medium: 4, low: 12 },
      },
    ],
    website: 'https://compound.finance',
    twitter: '@compoundfinance',
    github: 'compound-finance/comet',
  },
  {
    id: 'yearn-v3',
    name: 'Yearn V3',
    category: 'Yield Aggregator',
    chains: ['ethereum', 'arbitrum', 'optimism', 'polygon'],
    tvl: 450_000_000,
    audits: [
      {
        auditor: 'Mixbytes',
        date: '2023-09-05',
        reportUrl: 'https://example.com/audit',
        scope: 'V3 vault system',
        findings: { critical: 0, high: 1, medium: 5, low: 15 },
      },
    ],
    website: 'https://yearn.finance',
    twitter: '@yearnfi',
    github: 'yearn/yearn-vaults-v3',
  },
  {
    id: 'curve',
    name: 'Curve Finance',
    category: 'DEX',
    chains: ['ethereum', 'arbitrum', 'optimism', 'polygon', 'avalanche'],
    tvl: 2_800_000_000,
    audits: [
      {
        auditor: 'Trail of Bits',
        date: '2022-11-30',
        reportUrl: 'https://example.com/audit',
        scope: 'Stableswap & Cryptoswap',
        findings: { critical: 0, high: 0, medium: 3, low: 7 },
      },
    ],
    website: 'https://curve.fi',
    twitter: '@CurveFinance',
    github: 'curvefi/curve-contract',
  },
  {
    id: 'lido',
    name: 'Lido',
    category: 'Liquid Staking',
    chains: ['ethereum'],
    tvl: 22_000_000_000,
    audits: [
      {
        auditor: 'Sigma Prime',
        date: '2023-03-12',
        reportUrl: 'https://example.com/audit',
        scope: 'Staking router & CSM',
        findings: { critical: 0, high: 0, medium: 2, low: 6 },
      },
    ],
    website: 'https://lido.fi',
    twitter: '@LidoFinance',
    github: 'lidofinance/core',
  },
  {
    id: 'morpho',
    name: 'Morpho',
    category: 'Lending Optimizer',
    chains: ['ethereum', 'base'],
    tvl: 1_200_000_000,
    audits: [
      {
        auditor: 'Spearbit',
        date: '2023-10-20',
        reportUrl: 'https://example.com/audit',
        scope: 'Morpho Blue',
        findings: { critical: 0, high: 0, medium: 1, low: 4 },
      },
    ],
    website: 'https://morpho.org',
    twitter: '@MorphoLabs',
    github: 'morpho-org/morpho-blue',
  },
  {
    id: 'pendle',
    name: 'Pendle',
    category: 'Yield Trading',
    chains: ['ethereum', 'arbitrum'],
    tvl: 850_000_000,
    audits: [
      {
        auditor: 'Peckshield',
        date: '2023-07-15',
        reportUrl: 'https://example.com/audit',
        scope: 'V2 protocol',
        findings: { critical: 0, high: 1, medium: 3, low: 9 },
      },
    ],
    website: 'https://pendle.finance',
    twitter: '@pendle_fi',
    github: 'pendle-finance/pendle-core-v2-public',
  },
  {
    id: 'gmx',
    name: 'GMX',
    category: 'Perpetuals DEX',
    chains: ['arbitrum', 'avalanche'],
    tvl: 620_000_000,
    audits: [
      {
        auditor: 'ABDK',
        date: '2023-04-08',
        reportUrl: 'https://example.com/audit',
        scope: 'GMX V2',
        findings: { critical: 0, high: 0, medium: 2, low: 5 },
      },
    ],
    website: 'https://gmx.io',
    twitter: '@GMX_IO',
    github: 'gmx-io/gmx-contracts',
  },
];

const CHAINS: Chain[] = ['ethereum', 'arbitrum', 'optimism', 'polygon', 'base', 'bsc', 'avalanche'];
const ASSETS: AssetType[] = ['ETH', 'WETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'stETH', 'rETH', 'FRAX'];
const STRATEGIES: StrategyType[] = [
  'lending',
  'liquidity-provision',
  'staking',
  'yield-aggregator',
  'leveraged-staking',
  'delta-neutral',
  'options-selling',
  'real-world-assets',
];

function generateHistoricalData(baseAPY: number, days: number = 90): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now - i * dayMs).toISOString();
    const variation = (Math.random() - 0.5) * baseAPY * 0.3;
    const apy = Math.max(0, baseAPY + variation);
    const baseYield = apy * (0.6 + Math.random() * 0.2);
    const incentiveYield = apy - baseYield;

    data.push({
      timestamp,
      apy: parseFloat(apy.toFixed(2)),
      tvl: 1000000 + Math.random() * 50000000,
      baseApy: parseFloat(baseYield.toFixed(2)),
      incentiveApy: parseFloat(incentiveYield.toFixed(2)),
    });
  }

  return data;
}

function calculateRiskScore(factors: RiskFactor[]): number {
  return factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0);
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 3.5) return 'low';
  if (score < 6.5) return 'medium';
  return 'high';
}

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockVaults(count: number = 50): Vault[] {
  const vaults: Vault[] = [];

  for (let i = 0; i < count; i++) {
    const protocol = random(PROTOCOLS);
    const chain = random(protocol.chains);
    const asset = random(ASSETS);
    const strategyType = random(STRATEGIES);
    const baseAPY = Math.random() * 25 + 2;
    const incentiveAPY = Math.random() * 15;
    const totalAPY = baseAPY + incentiveAPY;
    const tvl = Math.random() * 100_000_000 + 500_000;

    const riskFactors: RiskFactor[] = [
      {
        category: 'smart-contract',
        score: Math.random() * 4 + 1,
        weight: 0.35,
        description: 'Smart contract risk based on audit coverage, code complexity, and battle-testing',
        mitigations: [
          'Multiple independent audits completed',
          'Bug bounty program active',
          'Time-weighted security assessment',
        ],
      },
      {
        category: 'liquidity',
        score: Math.random() * 3 + 2,
        weight: 0.2,
        description: 'Exit liquidity and slippage risk for large positions',
        mitigations: ['Deep liquidity pools', 'Multiple exit routes available'],
      },
      {
        category: 'market',
        score: Math.random() * 5 + 2,
        weight: 0.15,
        description: 'Exposure to volatile asset prices and market conditions',
        mitigations: ['Diversified collateral', 'Conservative LTV ratios'],
      },
      {
        category: 'centralization',
        score: Math.random() * 4 + 1,
        weight: 0.2,
        description: 'Governance and admin control risk',
        mitigations: ['Multi-sig governance', 'Timelock on critical functions'],
      },
      {
        category: 'complexity',
        score: Math.random() * 4 + 2,
        weight: 0.1,
        description: 'Strategy complexity and number of protocol dependencies',
        mitigations: ['Well-documented strategy', 'Modular architecture'],
      },
    ];

    const riskScore = calculateRiskScore(riskFactors);
    const riskLevel = getRiskLevel(riskScore);

    const dependencies: Dependency[] = [];
    if (strategyType === 'liquidity-provision' || strategyType === 'delta-neutral') {
      dependencies.push({
        protocol: 'Chainlink',
        type: 'oracle',
        description: 'Price feeds for asset valuation',
        riskImpact: 'high',
      });
      dependencies.push({
        protocol: random(['Uniswap V3', 'Curve', 'Balancer']),
        type: 'dex',
        description: 'Primary liquidity venue',
        riskImpact: 'critical',
      });
    }
    if (strategyType === 'lending' || strategyType === 'yield-aggregator') {
      dependencies.push({
        protocol: random(['Aave', 'Compound', 'Morpho']),
        type: 'lending',
        description: 'Underlying lending protocol',
        riskImpact: 'critical',
      });
    }

    const governanceTypes: GovernanceInfo['type'][] = ['multisig', 'dao', 'immutable', 'admin-controlled'];
    const governanceType = random(governanceTypes);
    const governance: GovernanceInfo = {
      type: governanceType,
      details: 'Protocol governed by multi-sig with 5/9 threshold and 48h timelock',
      adminAddress: governanceType !== 'immutable' ? '0x' + Math.random().toString(16).substring(2, 42) : undefined,
      timelock: governanceType === 'dao' || governanceType === 'multisig' ? '48 hours' : undefined,
    };

    const yieldSources: YieldSource[] = [
      {
        type: 'base',
        token: asset,
        apy: baseAPY,
        description: strategyType === 'lending' ? 'Lending interest' : 'Trading fees and yields',
      },
    ];

    if (incentiveAPY > 1) {
      yieldSources.push({
        type: 'incentive',
        token: random(['ARB', 'OP', protocol.name.split(' ')[0]]),
        apy: incentiveAPY,
        description: 'Token incentives from protocol',
      });
    }

    const changeLogs: ChangeLogEntry[] = [
      {
        date: new Date(Date.now() - randomInt(1, 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'apy-change',
        description: `APY ${Math.random() > 0.5 ? 'increased' : 'decreased'} by ${randomInt(5, 25)}% due to ${
          Math.random() > 0.5 ? 'increased demand' : 'market conditions'
        }`,
        impact: Math.random() > 0.5 ? 'positive' : 'negative',
      },
    ];

    if (Math.random() > 0.7) {
      changeLogs.push({
        date: new Date(Date.now() - randomInt(20, 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'audit',
        description: `New security audit completed by ${random(['OpenZeppelin', 'Trail of Bits', 'Spearbit'])}`,
        impact: 'positive',
      });
    }

    vaults.push({
      id: `vault-${i + 1}`,
      name: `${protocol.name} ${asset} ${strategyType.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      protocol,
      chain,
      asset,
      strategyType,
      apy: parseFloat(totalAPY.toFixed(2)),
      apyBreakdown: yieldSources,
      tvl: parseFloat(tvl.toFixed(0)),
      riskScore: parseFloat(riskScore.toFixed(1)),
      riskLevel,
      riskFactors,
      strategyDescription: generateStrategyDescription(strategyType, protocol.name, asset),
      dependencies,
      governance,
      liquidityDepth: tvl * (0.1 + Math.random() * 0.3),
      withdrawalLimit: Math.random() > 0.8 ? '24 hours' : undefined,
      lockPeriod: Math.random() > 0.9 ? `${randomInt(7, 30)} days` : undefined,
      inception: new Date(Date.now() - randomInt(180, 730) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastUpdate: new Date(Date.now() - randomInt(0, 24) * 60 * 60 * 1000).toISOString(),
      historical: generateHistoricalData(totalAPY, 90),
      changeLog: changeLogs,
      verified: Math.random() > 0.2,
      featured: Math.random() > 0.8,
    });
  }

  return vaults.sort((a, b) => b.tvl - a.tvl);
}

function generateStrategyDescription(strategy: StrategyType, protocol: string, asset: string): string {
  const descriptions: Record<StrategyType, string> = {
    lending: `Deposits ${asset} into ${protocol} lending pools to earn interest from borrowers. Principal is at risk if the protocol experiences a shortfall event. Yields fluctuate based on utilization rates.`,
    'liquidity-provision': `Provides ${asset} liquidity to ${protocol} trading pools, earning fees from swaps. Subject to impermanent loss and smart contract risk. Returns depend on trading volume and volatility.`,
    staking: `Stakes ${asset} in ${protocol} to secure the network and earn staking rewards. Subject to slashing risk and validator performance. Rewards are protocol-native tokens.`,
    'yield-aggregator': `Automatically compounds ${asset} yields across multiple ${protocol} strategies. Optimizes for highest risk-adjusted returns while managing gas costs. Strategy may shift based on market conditions.`,
    'leveraged-staking': `Recursively stakes ${asset} using borrowed capital to amplify yields. Higher returns come with liquidation risk if collateral value drops. Monitors health factor continuously.`,
    'delta-neutral': `Market-neutral strategy hedging ${asset} spot exposure with derivatives. Captures funding rates and basis while minimizing directional risk. Requires active rebalancing.`,
    'options-selling': `Generates income by selling covered calls/puts on ${asset}. Returns are capped but provide downside cushion. Subject to assignment risk if options expire in-the-money.`,
    'real-world-assets': `Invests ${asset} in tokenized real-world assets via ${protocol}. Provides exposure to off-chain yields. Carries additional legal and custody risks beyond typical DeFi.`,
  };

  return descriptions[strategy];
}

export function generateMockPortfolio(): Portfolio {
  const vaults = generateMockVaults(50);
  const selectedVaults = vaults.slice(0, randomInt(3, 8));

  const positions: Position[] = selectedVaults.map((vault) => {
    const { asset } = vault;
    const amount = Math.random() * 1000 + 100;
    const valueUSD = amount * (asset === 'USDC' || asset === 'USDT' || asset === 'DAI' ? 1 : Math.random() * 3000);
    const daysHeld = randomInt(10, 180);

    return {
      vault,
      amount: parseFloat(amount.toFixed(4)),
      valueUSD: parseFloat(valueUSD.toFixed(2)),
      entryDate: new Date(Date.now() - daysHeld * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentAPY: vault.apy,
      unrealizedYield: parseFloat((valueUSD * (vault.apy / 100) * (daysHeld / 365)).toFixed(2)),
    };
  });

  const totalValueUSD = positions.reduce((sum, p) => sum + p.valueUSD, 0);

  return {
    id: 'portfolio-1',
    name: 'Treasury Portfolio',
    walletAddress: '0x' + Math.random().toString(16).substring(2, 42),
    positions,
    totalValueUSD: parseFloat(totalValueUSD.toFixed(2)),
    lastUpdated: new Date().toISOString(),
  };
}

export function generateMockAlerts(): Alert[] {
  const vaults = generateMockVaults(10);
  const alertTypes: Alert['type'][] = ['apy-drop', 'risk-increase', 'tvl-drop', 'audit-issue', 'governance-change'];
  const severities: Alert['severity'][] = ['high', 'medium', 'low'];

  return Array.from({ length: 8 }, (_, i) => {
    const vault = random(vaults);
    const type = random(alertTypes);
    const severity = random(severities);

    const messages: Record<Alert['type'], string> = {
      'apy-drop': `APY dropped by ${randomInt(15, 40)}% in the last 24 hours`,
      'risk-increase': `Risk score increased from ${(vault.riskScore - 1.5).toFixed(1)} to ${vault.riskScore}`,
      'tvl-drop': `TVL decreased by ${randomInt(20, 50)}% - potential liquidity concerns`,
      'audit-issue': `New audit findings reported - ${randomInt(1, 3)} medium severity issues`,
      'governance-change': `Governance proposal executed - strategy parameters modified`,
    };

    return {
      id: `alert-${i + 1}`,
      type,
      vaultId: vault.id,
      vaultName: vault.name,
      message: messages[type],
      severity,
      timestamp: new Date(Date.now() - randomInt(1, 72) * 60 * 60 * 1000).toISOString(),
      read: Math.random() > 0.4,
    };
  });
}

export { PROTOCOLS };
