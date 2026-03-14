import type { 
  Vault, 
  Protocol, 
  RadarEvent, 
  Portfolio, 
  Position,
  Report,
  Alert,
  UserProfile,
  YieldObservation
} from './types';

export const PROTOCOLS: Protocol[] = [
  {
    id: 'aave',
    name: 'Aave',
    slug: 'aave',
    category: 'Lending',
    website: 'https://aave.com',
    description: 'Decentralized liquidity protocol for lending and borrowing',
    chains: ['ethereum', 'arbitrum', 'optimism', 'polygon', 'base'],
    tvl: 11200000000,
    maturityScore: 9.5,
    auditSummary: {
      firms: ['Trail of Bits', 'OpenZeppelin', 'Certora'],
      count: 12,
      lastAuditDate: '2024-01-15'
    }
  },
  {
    id: 'morpho',
    name: 'Morpho',
    slug: 'morpho',
    category: 'Lending Optimizer',
    website: 'https://morpho.xyz',
    description: 'Lending optimizer improving rates for suppliers and borrowers',
    chains: ['ethereum', 'base'],
    tvl: 2800000000,
    maturityScore: 8.5,
    auditSummary: {
      firms: ['Spearbit', 'Certora', 'Cantina'],
      count: 8,
      lastAuditDate: '2024-02-20'
    }
  },
  {
    id: 'yearn',
    name: 'Yearn Finance',
    slug: 'yearn',
    category: 'Yield Aggregator',
    website: 'https://yearn.finance',
    description: 'Automated yield farming aggregator with vault strategies',
    chains: ['ethereum', 'arbitrum', 'optimism'],
    tvl: 450000000,
    maturityScore: 9.0,
    auditSummary: {
      firms: ['MixBytes', 'ChainSecurity'],
      count: 15,
      lastAuditDate: '2023-11-30'
    }
  },
  {
    id: 'pendle',
    name: 'Pendle',
    slug: 'pendle',
    category: 'Yield Trading',
    website: 'https://pendle.finance',
    description: 'Protocol for tokenizing and trading future yield',
    chains: ['ethereum', 'arbitrum'],
    tvl: 4500000000,
    maturityScore: 8.0,
    auditSummary: {
      firms: ['Ackee', 'SlowMist'],
      count: 6,
      lastAuditDate: '2024-01-10'
    }
  },
  {
    id: 'spark',
    name: 'Spark Protocol',
    slug: 'spark',
    category: 'Lending',
    website: 'https://sparkprotocol.io',
    description: 'DAI-focused lending protocol by MakerDAO',
    chains: ['ethereum'],
    tvl: 1900000000,
    maturityScore: 8.5,
    auditSummary: {
      firms: ['ChainSecurity', 'Certora'],
      count: 5,
      lastAuditDate: '2024-01-05'
    }
  },
  {
    id: 'curve',
    name: 'Curve Finance',
    slug: 'curve',
    category: 'DEX',
    website: 'https://curve.fi',
    description: 'Stablecoin and asset exchange with low slippage',
    chains: ['ethereum', 'arbitrum', 'optimism', 'polygon', 'base'],
    tvl: 3200000000,
    maturityScore: 9.5,
    auditSummary: {
      firms: ['Trail of Bits', 'MixBytes'],
      count: 18,
      lastAuditDate: '2023-12-15'
    }
  },
  {
    id: 'beefy',
    name: 'Beefy Finance',
    slug: 'beefy',
    category: 'Yield Optimizer',
    website: 'https://beefy.finance',
    description: 'Multi-chain yield optimizer automating vault strategies',
    chains: ['arbitrum', 'optimism', 'polygon', 'bsc'],
    tvl: 850000000,
    maturityScore: 7.5,
    auditSummary: {
      firms: ['Certik', 'PeckShield'],
      count: 7,
      lastAuditDate: '2023-10-20'
    }
  },
  {
    id: 'convex',
    name: 'Convex Finance',
    slug: 'convex',
    category: 'Yield Aggregator',
    website: 'https://convexfinance.com',
    description: 'Boost Curve LP yields through CRV staking',
    chains: ['ethereum'],
    tvl: 2100000000,
    maturityScore: 8.5,
    auditSummary: {
      firms: ['MixBytes'],
      count: 4,
      lastAuditDate: '2023-09-15'
    }
  },
  {
    id: 'lido',
    name: 'Lido',
    slug: 'lido',
    category: 'Liquid Staking',
    website: 'https://lido.fi',
    description: 'Liquid staking solution for Ethereum and other PoS chains',
    chains: ['ethereum'],
    tvl: 32000000000,
    maturityScore: 9.5,
    auditSummary: {
      firms: ['Sigma Prime', 'MixBytes', 'Quantstamp'],
      count: 11,
      lastAuditDate: '2024-01-25'
    }
  },
  {
    id: 'enzyme',
    name: 'Enzyme Finance',
    slug: 'enzyme',
    category: 'Asset Management',
    website: 'https://enzyme.finance',
    description: 'On-chain asset management protocol for DeFi funds',
    chains: ['ethereum', 'polygon'],
    tvl: 180000000,
    maturityScore: 8.0,
    auditSummary: {
      firms: ['ChainSecurity', 'G0 Group'],
      count: 9,
      lastAuditDate: '2023-11-10'
    }
  }
];

const PROTOCOL_MAP = Object.fromEntries(PROTOCOLS.map(p => [p.id, p]));

export const VAULTS: Vault[] = [
  {
    id: 'vault-1',
    slug: 'aave-v3-usdc-ethereum',
    name: 'Aave V3 USDC',
    protocolId: 'aave',
    protocolName: 'Aave',
    chain: 'ethereum',
    asset: 'USDC',
    category: 'Lending',
    strategyType: 'lending',
    description: 'Supply USDC to Aave V3 on Ethereum',
    strategyDescription: 'Passive lending strategy supplying USDC to Aave V3 money market. Earns variable interest from borrower demand. Low complexity, high liquidity, institutional-grade infrastructure.',
    apy: 4.2,
    realYield: 4.2,
    incentiveYield: 0,
    feeYield: 0,
    apyBreakdown: [
      { type: 'base', apy: 4.2, token: 'USDC', description: 'Lending interest from borrowers', sustainable: true }
    ],
    tvl: 890000000,
    liquidityAvailable: 890000000,
    riskScore: 2.5,
    riskLevel: 'low',
    riskBand: 'conservative',
    liquidityScore: 9.8,
    status: 'active',
    verified: true,
    institutionalGrade: true,
    inception: '2023-03-01',
    sourceWindow: '7d',
    updatedAt: '2024-03-15T10:30:00Z',
    vaultAddress: '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c',
    dependencies: [],
    riskFactors: [
      {
        id: 'rf-1',
        vaultId: 'vault-1',
        category: 'smart-contract',
        label: 'Smart Contract Security',
        score: 2.0,
        weight: 0.3,
        scoreContribution: 0.6,
        explanation: 'Aave V3 is battle-tested with extensive audits and a 3+ year track record. Multiple security firms have reviewed the codebase.',
        mitigations: ['12+ security audits', 'Bug bounty program', 'Formal verification', 'Timelock governance']
      },
      {
        id: 'rf-2',
        vaultId: 'vault-1',
        category: 'liquidity',
        label: 'Liquidity Risk',
        score: 1.5,
        weight: 0.25,
        scoreContribution: 0.38,
        explanation: 'Extremely deep liquidity with $890M TVL. Full withdrawal capacity with no lock-up period.',
        mitigations: ['Deep liquidity pool', 'Instant withdrawals', 'High utilization monitoring']
      },
      {
        id: 'rf-3',
        vaultId: 'vault-1',
        category: 'market',
        label: 'Market Risk',
        score: 3.0,
        weight: 0.2,
        scoreContribution: 0.6,
        explanation: 'USDC is subject to centralization risk and depeg scenarios. Circle holds reserves.',
        mitigations: ['USDC reserves audited monthly', 'Diversify across stablecoins', 'Monitor depeg risk']
      },
      {
        id: 'rf-4',
        vaultId: 'vault-1',
        category: 'protocol',
        label: 'Protocol Stability',
        score: 2.0,
        weight: 0.15,
        scoreContribution: 0.3,
        explanation: 'Aave is the largest lending protocol with proven resilience through multiple market cycles.',
        mitigations: ['$11B+ TVL', '3+ years operational', 'DAO governance', 'Safety module insurance']
      },
      {
        id: 'rf-5',
        vaultId: 'vault-1',
        category: 'governance',
        label: 'Governance & Admin',
        score: 2.5,
        weight: 0.1,
        scoreContribution: 0.25,
        explanation: 'Governed by Aave DAO with timelock delays. Admin keys managed by multisig.',
        mitigations: ['DAO governance', '24h timelock', 'Multisig controls', 'Transparent proposals']
      }
    ],
    governance: {
      type: 'dao',
      details: 'Governed by AAVE token holders through Aave DAO. All protocol changes require governance vote with 24h timelock.',
      timelock: '24 hours',
      adminControl: false,
      upgradeability: true
    },
    audits: [
      {
        firm: 'Trail of Bits',
        date: '2024-01-15',
        reportUrl: 'https://example.com/audit',
        scope: ['Lending Pool', 'Risk Parameters', 'Liquidation'],
        issues: { critical: 0, high: 0, medium: 2, low: 5 }
      },
      {
        firm: 'OpenZeppelin',
        date: '2023-11-20',
        reportUrl: 'https://example.com/audit',
        scope: ['Core Protocol', 'Token Logic'],
        issues: { critical: 0, high: 0, medium: 1, low: 3 }
      }
    ],
    redFlags: [],
    tags: ['institutional', 'lending', 'stable'],
    protocol: PROTOCOL_MAP['aave']
  },
  {
    id: 'vault-2',
    slug: 'morpho-aave-v3-weth-ethereum',
    name: 'Morpho Aave V3 WETH',
    protocolId: 'morpho',
    protocolName: 'Morpho',
    chain: 'ethereum',
    asset: 'WETH',
    category: 'Lending Optimizer',
    strategyType: 'lending',
    description: 'Optimized WETH lending through Morpho on top of Aave V3',
    strategyDescription: 'Morpho optimizes Aave V3 lending rates by matching lenders and borrowers peer-to-peer, falling back to Aave pool when no match exists. Improves rates while maintaining Aave liquidity guarantees.',
    apy: 2.8,
    realYield: 2.8,
    incentiveYield: 0,
    feeYield: 0,
    apyBreakdown: [
      { type: 'base', apy: 2.8, token: 'WETH', description: 'Optimized lending yields via P2P matching', sustainable: true }
    ],
    tvl: 340000000,
    liquidityAvailable: 340000000,
    riskScore: 3.2,
    riskLevel: 'low',
    riskBand: 'conservative',
    liquidityScore: 9.5,
    status: 'active',
    verified: true,
    institutionalGrade: true,
    inception: '2023-06-15',
    sourceWindow: '7d',
    updatedAt: '2024-03-15T10:30:00Z',
    vaultAddress: '0x39Dd7790e75C6F663731f7E1FdC0f35007D3879b',
    dependencies: [
      {
        id: 'dep-1',
        vaultId: 'vault-2',
        protocol: 'Aave V3',
        type: 'protocol',
        criticality: 'high',
        description: 'Falls back to Aave V3 pool when P2P matching unavailable',
        riskImpact: 'high'
      }
    ],
    riskFactors: [
      {
        id: 'rf-6',
        vaultId: 'vault-2',
        category: 'smart-contract',
        label: 'Smart Contract Security',
        score: 3.0,
        weight: 0.3,
        scoreContribution: 0.9,
        explanation: 'Morpho adds complexity layer on Aave. Well-audited but newer protocol with less battle-testing.',
        mitigations: ['8 security audits', 'Formal verification', 'Bug bounty', 'Gradual rollout']
      },
      {
        id: 'rf-7',
        vaultId: 'vault-2',
        category: 'dependency',
        label: 'Dependency Risk',
        score: 3.5,
        weight: 0.25,
        scoreContribution: 0.88,
        explanation: 'Inherits all Aave risks plus adds Morpho layer. Double dependency on both protocols.',
        mitigations: ['Aave fallback', 'Independent audits', 'Emergency pause']
      },
      {
        id: 'rf-8',
        vaultId: 'vault-2',
        category: 'liquidity',
        label: 'Liquidity Risk',
        score: 2.5,
        weight: 0.2,
        scoreContribution: 0.5,
        explanation: 'Good liquidity backed by Aave pool. P2P matching can create temporary delays.',
        mitigations: ['Aave liquidity backstop', 'Instant exit to Aave', 'Deep underlying pools']
      }
    ],
    governance: {
      type: 'dao',
      details: 'Morpho DAO governance with timelock. Risk parameters managed by elected risk committee.',
      timelock: '24 hours',
      adminControl: false,
      upgradeability: true
    },
    audits: [
      {
        firm: 'Spearbit',
        date: '2024-02-20',
        reportUrl: 'https://example.com/audit',
        scope: ['P2P Matching', 'Position Management', 'Liquidations'],
        issues: { critical: 0, high: 0, medium: 3, low: 8 }
      }
    ],
    redFlags: [],
    tags: ['institutional', 'lending', 'optimized'],
    protocol: PROTOCOL_MAP['morpho']
  },
  {
    id: 'vault-3',
    slug: 'pendle-pt-sdai-arbitrum',
    name: 'Pendle PT-sDAI',
    protocolId: 'pendle',
    protocolName: 'Pendle',
    chain: 'arbitrum',
    asset: 'PT-sDAI',
    category: 'Yield Trading',
    strategyType: 'basis-trade',
    description: 'Fixed yield on sDAI through Pendle principal tokens',
    strategyDescription: 'Purchase principal tokens (PT) of sDAI at discount to lock in fixed yield until maturity. Provides certainty on returns versus variable sDAI rate. Advanced strategy requiring expiry management.',
    apy: 8.5,
    realYield: 8.5,
    incentiveYield: 0,
    feeYield: 0,
    apyBreakdown: [
      { type: 'base', apy: 8.5, token: 'DAI', description: 'Fixed yield from PT discount to maturity', sustainable: true }
    ],
    tvl: 48000000,
    liquidityAvailable: 12000000,
    riskScore: 4.8,
    riskLevel: 'medium',
    riskBand: 'moderate',
    liquidityScore: 7.2,
    status: 'active',
    verified: true,
    institutionalGrade: false,
    inception: '2023-09-10',
    sourceWindow: '7d',
    updatedAt: '2024-03-15T10:30:00Z',
    vaultAddress: '0x9D39A5DE30e57443BfF2A8307A4256c8797A3497',
    dependencies: [
      {
        id: 'dep-2',
        vaultId: 'vault-3',
        protocol: 'MakerDAO sDAI',
        type: 'token',
        criticality: 'critical',
        description: 'Underlying asset is sDAI (savings DAI from MakerDAO)',
        riskImpact: 'critical'
      },
      {
        id: 'dep-3',
        vaultId: 'vault-3',
        protocol: 'Arbitrum Bridge',
        type: 'bridge',
        criticality: 'high',
        description: 'Assets bridged to Arbitrum via native bridge',
        riskImpact: 'high'
      }
    ],
    riskFactors: [
      {
        id: 'rf-9',
        vaultId: 'vault-3',
        category: 'smart-contract',
        label: 'Smart Contract Security',
        score: 4.5,
        weight: 0.3,
        scoreContribution: 1.35,
        explanation: 'Pendle is complex with novel mechanisms. Solid audits but less battle-tested than lending protocols.',
        mitigations: ['6 security audits', 'Gradual scaling', 'Bug bounty', 'Security council']
      },
      {
        id: 'rf-10',
        vaultId: 'vault-3',
        category: 'liquidity',
        label: 'Liquidity Risk',
        score: 6.0,
        weight: 0.25,
        scoreContribution: 1.5,
        explanation: 'PT tokens have limited secondary liquidity. Early exit requires selling at market price with potential slippage.',
        mitigations: ['LP incentives', 'Market making', 'Hold to maturity option']
      },
      {
        id: 'rf-11',
        vaultId: 'vault-3',
        category: 'market',
        label: 'Market Risk',
        score: 5.5,
        weight: 0.2,
        scoreContribution: 1.1,
        explanation: 'Yield dependent on MakerDAO DSR rate. Rate cuts would reduce PT value. Arbitrum bridge risk.',
        mitigations: ['Diversify yield sources', 'Monitor DSR', 'Bridge security audits']
      },
      {
        id: 'rf-12',
        vaultId: 'vault-3',
        category: 'dependency',
        label: 'Dependency Risk',
        score: 5.0,
        weight: 0.15,
        scoreContribution: 0.75,
        explanation: 'Triple dependency: Pendle mechanics, MakerDAO DSR, and Arbitrum bridge security.',
        mitigations: ['Diversified dependencies', 'Independent monitoring', 'Exit strategies']
      }
    ],
    governance: {
      type: 'multisig',
      details: 'Governed by Pendle team multisig with plan to transition to DAO. Emergency pause available.',
      timelock: '48 hours',
      adminControl: true,
      upgradeability: true
    },
    audits: [
      {
        firm: 'Ackee',
        date: '2024-01-10',
        reportUrl: 'https://example.com/audit',
        scope: ['AMM', 'PT/YT Mechanics', 'Router'],
        issues: { critical: 0, high: 1, medium: 5, low: 12 }
      }
    ],
    redFlags: [
      {
        severity: 'medium',
        category: 'Liquidity',
        description: 'Limited liquidity depth for early exit could cause slippage >2%',
        detectedAt: '2024-03-10'
      }
    ],
    tags: ['fixed-yield', 'advanced', 'basis-trade'],
    protocol: PROTOCOL_MAP['pendle']
  },
  {
    id: 'vault-4',
    slug: 'yearn-curve-3crv-ethereum',
    name: 'Yearn Curve 3CRV',
    protocolId: 'yearn',
    protocolName: 'Yearn Finance',
    chain: 'ethereum',
    asset: 'DAI',
    category: 'LP Farming',
    strategyType: 'lp-farming',
    description: 'Auto-compounding Curve 3pool LP strategy',
    strategyDescription: 'Deposits into Curve 3pool (DAI/USDC/USDT), stakes LP tokens in Convex for CRV rewards, automatically harvests and compounds. Multi-protocol strategy with auto-rebalancing.',
    apy: 6.8,
    realYield: 2.3,
    incentiveYield: 3.2,
    feeYield: 1.3,
    apyBreakdown: [
      { type: 'trading-fees', apy: 1.3, token: 'USD', description: 'Curve 3pool trading fees', sustainable: true },
      { type: 'base', apy: 2.3, token: 'CRV', description: 'Base CRV emissions', sustainable: false },
      { type: 'incentives', apy: 3.2, token: 'CVX', description: 'Convex boost and incentives', sustainable: false }
    ],
    tvl: 125000000,
    liquidityAvailable: 115000000,
    riskScore: 5.5,
    riskLevel: 'medium',
    riskBand: 'moderate',
    liquidityScore: 8.8,
    status: 'active',
    verified: true,
    institutionalGrade: false,
    inception: '2020-11-20',
    sourceWindow: '7d',
    updatedAt: '2024-03-15T10:30:00Z',
    vaultAddress: '0x84E13785B5a27879921D6F685f041421C7F482dA',
    dependencies: [
      {
        id: 'dep-4',
        vaultId: 'vault-4',
        protocol: 'Curve Finance',
        type: 'protocol',
        criticality: 'critical',
        description: 'Base liquidity pool and LP token',
        riskImpact: 'critical'
      },
      {
        id: 'dep-5',
        vaultId: 'vault-4',
        protocol: 'Convex Finance',
        type: 'protocol',
        criticality: 'high',
        description: 'Staking platform for boosted rewards',
        riskImpact: 'high'
      }
    ],
    riskFactors: [
      {
        id: 'rf-13',
        vaultId: 'vault-4',
        category: 'smart-contract',
        label: 'Smart Contract Security',
        score: 5.0,
        weight: 0.3,
        scoreContribution: 1.5,
        explanation: 'Multiple interacting protocols (Yearn + Curve + Convex). Each adds complexity and attack surface.',
        mitigations: ['All protocols audited', 'Yearn 3+ year track record', 'Emergency withdrawal']
      },
      {
        id: 'rf-14',
        vaultId: 'vault-4',
        category: 'market',
        label: 'Market Risk',
        score: 4.5,
        weight: 0.25,
        scoreContribution: 1.13,
        explanation: 'Exposure to CRV and CVX token price. Reward APY depends on token values.',
        mitigations: ['Auto-sell rewards', 'Diversified yield sources', 'Trading fee base']
      },
      {
        id: 'rf-15',
        vaultId: 'vault-4',
        category: 'dependency',
        label: 'Dependency Risk',
        score: 6.5,
        weight: 0.25,
        scoreContribution: 1.63,
        explanation: 'Triple dependency on Yearn, Curve, and Convex. Any failure impacts returns.',
        mitigations: ['Emergency exit', 'Protocol insurance', 'Monitored continuously']
      }
    ],
    governance: {
      type: 'dao',
      details: 'Yearn governance for vault strategies. Curve and Convex have separate governance.',
      timelock: '48 hours',
      adminControl: false,
      upgradeability: true
    },
    audits: [
      {
        firm: 'MixBytes',
        date: '2023-11-30',
        reportUrl: 'https://example.com/audit',
        scope: ['Vault Strategy', 'Harvest Logic'],
        issues: { critical: 0, high: 0, medium: 4, low: 8 }
      }
    ],
    redFlags: [
      {
        severity: 'low',
        category: 'Incentives',
        description: 'High dependency on CRV/CVX incentives which are declining',
        detectedAt: '2024-02-15'
      }
    ],
    tags: ['lp', 'auto-compound', 'multi-protocol'],
    protocol: PROTOCOL_MAP['yearn']
  },
  {
    id: 'vault-5',
    slug: 'spark-sdai-ethereum',
    name: 'Spark sDAI',
    protocolId: 'spark',
    protocolName: 'Spark Protocol',
    chain: 'ethereum',
    asset: 'DAI',
    category: 'Savings',
    strategyType: 'lending',
    description: 'Savings DAI earning MakerDAO DSR',
    strategyDescription: 'Deposit DAI to receive sDAI, which automatically earns the DAI Savings Rate set by MakerDAO governance. Rebasing token representing DAI + accrued interest. Direct exposure to protocol revenue.',
    apy: 5.0,
    realYield: 5.0,
    incentiveYield: 0,
    feeYield: 0,
    apyBreakdown: [
      { type: 'base', apy: 5.0, token: 'DAI', description: 'MakerDAO DSR from protocol revenue', sustainable: true }
    ],
    tvl: 1250000000,
    liquidityAvailable: 1250000000,
    riskScore: 3.0,
    riskLevel: 'low',
    riskBand: 'conservative',
    liquidityScore: 9.8,
    status: 'active',
    verified: true,
    institutionalGrade: true,
    inception: '2023-05-15',
    sourceWindow: '7d',
    updatedAt: '2024-03-15T10:30:00Z',
    vaultAddress: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
    dependencies: [
      {
        id: 'dep-6',
        vaultId: 'vault-5',
        protocol: 'MakerDAO',
        type: 'protocol',
        criticality: 'critical',
        description: 'DSR rate and DAI stability managed by MakerDAO',
        riskImpact: 'critical'
      }
    ],
    riskFactors: [
      {
        id: 'rf-16',
        vaultId: 'vault-5',
        category: 'smart-contract',
        label: 'Smart Contract Security',
        score: 2.5,
        weight: 0.3,
        scoreContribution: 0.75,
        explanation: 'Simple wrapper around MakerDAO DSR. Inherits MakerDAO security which is extensively audited.',
        mitigations: ['MakerDAO 8+ year track record', 'Multiple audits', 'Formal verification']
      },
      {
        id: 'rf-17',
        vaultId: 'vault-5',
        category: 'market',
        label: 'Market Risk',
        score: 3.5,
        weight: 0.3,
        scoreContribution: 1.05,
        explanation: 'DAI depeg risk and DSR rate volatility. Rate set by governance vote.',
        mitigations: ['DAI over-collateralized', 'PSM stability', 'Large surplus buffer']
      },
      {
        id: 'rf-18',
        vaultId: 'vault-5',
        category: 'governance',
        label: 'Governance & Admin',
        score: 3.0,
        weight: 0.2,
        scoreContribution: 0.6,
        explanation: 'DSR rate can change via governance. Historical volatility in rate settings.',
        mitigations: ['Transparent governance', 'Rate change discussions', 'Historical stability']
      }
    ],
    governance: {
      type: 'dao',
      details: 'MakerDAO governance controls DSR rate and DAI parameters through MKR voting.',
      timelock: '48 hours',
      adminControl: false,
      upgradeability: false
    },
    audits: [
      {
        firm: 'ChainSecurity',
        date: '2024-01-05',
        reportUrl: 'https://example.com/audit',
        scope: ['sDAI Token', 'DSR Integration'],
        issues: { critical: 0, high: 0, medium: 1, low: 2 }
      }
    ],
    redFlags: [],
    tags: ['institutional', 'savings', 'makerdao'],
    protocol: PROTOCOL_MAP['spark']
  },
  {
    id: 'vault-6',
    slug: 'beefy-stargate-usdc-arbitrum',
    name: 'Beefy Stargate USDC',
    protocolId: 'beefy',
    protocolName: 'Beefy Finance',
    chain: 'arbitrum',
    asset: 'USDC',
    category: 'Bridge Liquidity',
    strategyType: 'lp-farming',
    description: 'Auto-compounding Stargate USDC pool',
    strategyDescription: 'Provide USDC liquidity to Stargate cross-chain bridge, earn trading fees and STG rewards. Beefy auto-compounds rewards. Moderate complexity with bridge and protocol risk.',
    apy: 7.2,
    realYield: 2.8,
    incentiveYield: 4.4,
    feeYield: 0,
    apyBreakdown: [
      { type: 'trading-fees', apy: 2.8, token: 'USDC', description: 'Bridge transfer fees', sustainable: true },
      { type: 'incentives', apy: 4.4, token: 'STG', description: 'Stargate token rewards', sustainable: false }
    ],
    tvl: 68000000,
    liquidityAvailable: 55000000,
    riskScore: 6.5,
    riskLevel: 'medium',
    riskBand: 'moderate',
    liquidityScore: 7.8,
    status: 'active',
    verified: true,
    institutionalGrade: false,
    inception: '2023-04-20',
    sourceWindow: '7d',
    updatedAt: '2024-03-15T10:30:00Z',
    vaultAddress: '0xB38e8c17e38363aF6EbdCb3dAE12e0243582891D',
    dependencies: [
      {
        id: 'dep-7',
        vaultId: 'vault-6',
        protocol: 'Stargate',
        type: 'protocol',
        criticality: 'critical',
        description: 'Underlying bridge protocol',
        riskImpact: 'critical'
      },
      {
        id: 'dep-8',
        vaultId: 'vault-6',
        protocol: 'LayerZero',
        type: 'protocol',
        criticality: 'high',
        description: 'Cross-chain messaging layer',
        riskImpact: 'high'
      }
    ],
    riskFactors: [
      {
        id: 'rf-19',
        vaultId: 'vault-6',
        category: 'smart-contract',
        label: 'Smart Contract Security',
        score: 6.0,
        weight: 0.3,
        scoreContribution: 1.8,
        explanation: 'Bridge protocols have higher complexity and attack surface. Multiple protocol interactions.',
        mitigations: ['Audited by Certik', 'Bug bounty', 'Gradual TVL growth']
      },
      {
        id: 'rf-20',
        vaultId: 'vault-6',
        category: 'liquidity',
        label: 'Liquidity Risk',
        score: 5.5,
        weight: 0.25,
        scoreContribution: 1.38,
        explanation: 'Liquidity can be locked in cross-chain transfers. Utilization can spike during high volume.',
        mitigations: ['Reserve buffers', 'Dynamic fees', 'Utilization limits']
      },
      {
        id: 'rf-21',
        vaultId: 'vault-6',
        category: 'dependency',
        label: 'Dependency Risk',
        score: 7.5,
        weight: 0.25,
        scoreContribution: 1.88,
        explanation: 'Bridge risk is elevated. Dependency on LayerZero messaging and Stargate pools.',
        mitigations: ['Insurance fund', 'Protocol audits', 'Monitoring systems']
      }
    ],
    governance: {
      type: 'multisig',
      details: 'Beefy multisig manages vault strategies. Stargate has separate DAO governance.',
      timelock: '24 hours',
      adminControl: true,
      upgradeability: true
    },
    audits: [
      {
        firm: 'Certik',
        date: '2023-10-20',
        reportUrl: 'https://example.com/audit',
        scope: ['Vault Strategy', 'Compound Logic'],
        issues: { critical: 0, high: 1, medium: 6, low: 10 }
      }
    ],
    redFlags: [
      {
        severity: 'medium',
        category: 'Bridge Risk',
        description: 'Bridge protocols carry elevated smart contract and fund custody risks',
        detectedAt: '2024-01-05'
      },
      {
        severity: 'low',
        category: 'Incentives',
        description: 'STG emissions declining over time',
        detectedAt: '2024-02-20'
      }
    ],
    tags: ['bridge', 'cross-chain', 'auto-compound'],
    protocol: PROTOCOL_MAP['beefy']
  }
];

export const RADAR_EVENTS: RadarEvent[] = [
  {
    id: 'event-1',
    type: 'apy-spike',
    severity: 'high',
    title: 'Aave USDC APY increased 45%',
    description: 'Lending rate jumped from 4.2% to 6.1% due to increased borrow demand',
    vaultId: 'vault-1',
    vaultName: 'Aave V3 USDC',
    protocolName: 'Aave',
    chain: 'ethereum',
    timestamp: '2024-03-15T09:15:00Z',
    metadata: {
      oldValue: 4.2,
      newValue: 6.1,
      change: 1.9,
      changePercent: 45.2
    },
    whyItMatters: 'Significant rate increase suggests strong borrowing demand. Opportunity for lenders but may indicate market stress if sustained.'
  },
  {
    id: 'event-2',
    type: 'tvl-inflow',
    severity: 'medium',
    title: 'Spark sDAI sees $120M inflow',
    description: 'Large capital inflow following DSR rate increase',
    vaultId: 'vault-5',
    vaultName: 'Spark sDAI',
    protocolName: 'Spark Protocol',
    chain: 'ethereum',
    timestamp: '2024-03-15T08:45:00Z',
    metadata: {
      oldValue: 1130000000,
      newValue: 1250000000,
      change: 120000000,
      changePercent: 10.6
    },
    whyItMatters: 'Capital flowing to sDAI after MakerDAO increased DSR. Validates yield sustainability and protocol confidence.'
  },
  {
    id: 'event-3',
    type: 'liquidity-warning',
    severity: 'high',
    title: 'Pendle PT-sDAI liquidity thinning',
    description: 'Available exit liquidity dropped to $12M from $18M',
    vaultId: 'vault-3',
    vaultName: 'Pendle PT-sDAI',
    protocolName: 'Pendle',
    chain: 'arbitrum',
    timestamp: '2024-03-15T07:30:00Z',
    metadata: {
      oldValue: 18000000,
      newValue: 12000000,
      change: -6000000,
      changePercent: -33.3
    },
    whyItMatters: 'Reduced liquidity increases exit costs. Large positions may face slippage. Monitor before adding capital.'
  },
  {
    id: 'event-4',
    type: 'new-vault',
    severity: 'medium',
    title: 'New Morpho vault on Base',
    description: 'Morpho launched optimized USDC lending on Base',
    vaultId: 'vault-new-1',
    vaultName: 'Morpho USDC Base',
    protocolName: 'Morpho',
    chain: 'base',
    timestamp: '2024-03-15T06:00:00Z',
    metadata: {
      newValue: 5200000
    },
    whyItMatters: 'New deployment on Base L2 offers similar yields with lower gas costs. Consider for smaller positions.'
  },
  {
    id: 'event-5',
    type: 'tvl-outflow',
    severity: 'medium',
    title: 'Yearn Curve 3CRV outflow',
    description: '$15M withdrawn following reward reduction',
    vaultId: 'vault-4',
    vaultName: 'Yearn Curve 3CRV',
    protocolName: 'Yearn Finance',
    chain: 'ethereum',
    timestamp: '2024-03-15T05:15:00Z',
    metadata: {
      oldValue: 140000000,
      newValue: 125000000,
      change: -15000000,
      changePercent: -10.7
    },
    whyItMatters: 'Capital leaving as CRV incentives decline. Real yield (fees) remains stable but total APY compressed.'
  },
  {
    id: 'event-6',
    type: 'risk-change',
    severity: 'low',
    title: 'Morpho risk score improved',
    description: 'Risk score reduced from 3.5 to 3.2 after additional audit',
    vaultId: 'vault-2',
    vaultName: 'Morpho Aave V3 WETH',
    protocolName: 'Morpho',
    chain: 'ethereum',
    timestamp: '2024-03-14T18:30:00Z',
    metadata: {
      oldValue: 3.5,
      newValue: 3.2,
      change: -0.3,
      changePercent: -8.6
    },
    whyItMatters: 'Additional security audit by Cantina found no critical issues. Increased confidence for institutional allocators.'
  },
  {
    id: 'event-7',
    type: 'incentive-change',
    severity: 'high',
    title: 'Beefy Stargate rewards boosted',
    description: 'STG incentives increased 60% for Q2',
    vaultId: 'vault-6',
    vaultName: 'Beefy Stargate USDC',
    protocolName: 'Beefy Finance',
    chain: 'arbitrum',
    timestamp: '2024-03-14T16:00:00Z',
    metadata: {
      oldValue: 2.75,
      newValue: 4.4,
      change: 1.65,
      changePercent: 60.0
    },
    whyItMatters: 'Temporary incentive boost to attract liquidity. Assess sustainability before large allocations.'
  },
  {
    id: 'event-8',
    type: 'governance-change',
    severity: 'medium',
    title: 'Aave risk parameters updated',
    description: 'DAO voted to increase USDC borrow cap by 50M',
    vaultId: 'vault-1',
    vaultName: 'Aave V3 USDC',
    protocolName: 'Aave',
    chain: 'ethereum',
    timestamp: '2024-03-14T14:20:00Z',
    metadata: {},
    whyItMatters: 'Higher borrow cap enables more lending. Could support sustained elevated rates if demand continues.'
  }
];

export const DEMO_PORTFOLIOS: Portfolio[] = [
  {
    id: 'portfolio-dao',
    name: 'Protocol DAO Treasury',
    ownerType: 'dao-treasury',
    walletAddress: '0x1234567890123456789012345678901234567890',
    netWorth: 85000000,
    dailyChange: 120000,
    dailyChangePercent: 0.14,
    totalYield: 3400000,
    totalYieldPercent: 4.2,
    riskScore: 3.2,
    positions: [
      {
        id: 'pos-1',
        portfolioId: 'portfolio-dao',
        vaultId: 'vault-1',
        vaultName: 'Aave V3 USDC',
        protocol: 'Aave',
        asset: 'USDC',
        chain: 'ethereum',
        strategyType: 'lending',
        value: 35000000,
        apy: 4.2,
        yieldEarned: 485000,
        pnl: 485000,
        pnlPercent: 1.4,
        shareOfPortfolio: 41.2,
        riskScore: 2.5,
        enteredAt: '2023-08-15'
      },
      {
        id: 'pos-2',
        portfolioId: 'portfolio-dao',
        vaultId: 'vault-5',
        vaultName: 'Spark sDAI',
        protocol: 'Spark Protocol',
        asset: 'DAI',
        chain: 'ethereum',
        strategyType: 'lending',
        value: 28000000,
        apy: 5.0,
        yieldEarned: 580000,
        pnl: 580000,
        pnlPercent: 2.1,
        shareOfPortfolio: 32.9,
        riskScore: 3.0,
        enteredAt: '2023-09-01'
      },
      {
        id: 'pos-3',
        portfolioId: 'portfolio-dao',
        vaultId: 'vault-2',
        vaultName: 'Morpho Aave V3 WETH',
        protocol: 'Morpho',
        asset: 'WETH',
        chain: 'ethereum',
        strategyType: 'lending',
        value: 22000000,
        apy: 2.8,
        yieldEarned: 203000,
        pnl: 203000,
        pnlPercent: 0.9,
        shareOfPortfolio: 25.9,
        riskScore: 3.2,
        enteredAt: '2023-10-10'
      }
    ],
    assetExposure: [
      { asset: 'USDC', value: 35000000, percentage: 41.2 },
      { asset: 'DAI', value: 28000000, percentage: 32.9 },
      { asset: 'WETH', value: 22000000, percentage: 25.9 }
    ],
    protocolExposure: [
      { protocol: 'Aave', value: 35000000, percentage: 41.2 },
      { protocol: 'Spark Protocol', value: 28000000, percentage: 32.9 },
      { protocol: 'Morpho', value: 22000000, percentage: 25.9 }
    ],
    strategyExposure: [
      { strategy: 'lending', value: 85000000, percentage: 100.0 }
    ],
    chainExposure: [
      { chain: 'ethereum', value: 85000000, percentage: 100.0 }
    ],
    createdAt: '2023-08-15',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 'portfolio-fund',
    name: 'DeFi Hedge Fund Alpha',
    ownerType: 'hedge-fund',
    walletAddress: '0x2345678901234567890123456789012345678901',
    netWorth: 42500000,
    dailyChange: -85000,
    dailyChangePercent: -0.2,
    totalYield: 2650000,
    totalYieldPercent: 6.6,
    riskScore: 5.8,
    positions: [
      {
        id: 'pos-4',
        portfolioId: 'portfolio-fund',
        vaultId: 'vault-3',
        vaultName: 'Pendle PT-sDAI',
        protocol: 'Pendle',
        asset: 'PT-sDAI',
        chain: 'arbitrum',
        strategyType: 'basis-trade',
        value: 18000000,
        apy: 8.5,
        yieldEarned: 1190000,
        pnl: 1190000,
        pnlPercent: 7.1,
        shareOfPortfolio: 42.4,
        riskScore: 4.8,
        enteredAt: '2023-09-15'
      },
      {
        id: 'pos-5',
        portfolioId: 'portfolio-fund',
        vaultId: 'vault-4',
        vaultName: 'Yearn Curve 3CRV',
        protocol: 'Yearn Finance',
        asset: 'DAI',
        chain: 'ethereum',
        strategyType: 'lp-farming',
        value: 14500000,
        apy: 6.8,
        yieldEarned: 770000,
        pnl: 770000,
        pnlPercent: 5.6,
        shareOfPortfolio: 34.1,
        riskScore: 5.5,
        enteredAt: '2023-10-01'
      },
      {
        id: 'pos-6',
        portfolioId: 'portfolio-fund',
        vaultId: 'vault-6',
        vaultName: 'Beefy Stargate USDC',
        protocol: 'Beefy Finance',
        asset: 'USDC',
        chain: 'arbitrum',
        strategyType: 'lp-farming',
        value: 10000000,
        apy: 7.2,
        yieldEarned: 690000,
        pnl: 690000,
        pnlPercent: 7.4,
        shareOfPortfolio: 23.5,
        riskScore: 6.5,
        enteredAt: '2023-11-05'
      }
    ],
    assetExposure: [
      { asset: 'PT-sDAI', value: 18000000, percentage: 42.4 },
      { asset: 'DAI', value: 14500000, percentage: 34.1 },
      { asset: 'USDC', value: 10000000, percentage: 23.5 }
    ],
    protocolExposure: [
      { protocol: 'Pendle', value: 18000000, percentage: 42.4 },
      { protocol: 'Yearn Finance', value: 14500000, percentage: 34.1 },
      { protocol: 'Beefy Finance', value: 10000000, percentage: 23.5 }
    ],
    strategyExposure: [
      { strategy: 'basis-trade', value: 18000000, percentage: 42.4 },
      { strategy: 'lp-farming', value: 24500000, percentage: 57.6 }
    ],
    chainExposure: [
      { chain: 'arbitrum', value: 28000000, percentage: 65.9 },
      { chain: 'ethereum', value: 14500000, percentage: 34.1 }
    ],
    createdAt: '2023-09-15',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 'portfolio-family',
    name: 'Family Office Conservative',
    ownerType: 'family-office',
    walletAddress: '0x3456789012345678901234567890123456789012',
    netWorth: 15800000,
    dailyChange: 22000,
    dailyChangePercent: 0.14,
    totalYield: 650000,
    totalYieldPercent: 4.3,
    riskScore: 2.8,
    positions: [
      {
        id: 'pos-7',
        portfolioId: 'portfolio-family',
        vaultId: 'vault-1',
        vaultName: 'Aave V3 USDC',
        protocol: 'Aave',
        asset: 'USDC',
        chain: 'ethereum',
        strategyType: 'lending',
        value: 9500000,
        apy: 4.2,
        yieldEarned: 330000,
        pnl: 330000,
        pnlPercent: 3.6,
        shareOfPortfolio: 60.1,
        riskScore: 2.5,
        enteredAt: '2023-07-01'
      },
      {
        id: 'pos-8',
        portfolioId: 'portfolio-family',
        vaultId: 'vault-5',
        vaultName: 'Spark sDAI',
        protocol: 'Spark Protocol',
        asset: 'DAI',
        chain: 'ethereum',
        strategyType: 'lending',
        value: 6300000,
        apy: 5.0,
        yieldEarned: 320000,
        pnl: 320000,
        pnlPercent: 5.3,
        shareOfPortfolio: 39.9,
        riskScore: 3.0,
        enteredAt: '2023-07-15'
      }
    ],
    assetExposure: [
      { asset: 'USDC', value: 9500000, percentage: 60.1 },
      { asset: 'DAI', value: 6300000, percentage: 39.9 }
    ],
    protocolExposure: [
      { protocol: 'Aave', value: 9500000, percentage: 60.1 },
      { protocol: 'Spark Protocol', value: 6300000, percentage: 39.9 }
    ],
    strategyExposure: [
      { strategy: 'lending', value: 15800000, percentage: 100.0 }
    ],
    chainExposure: [
      { chain: 'ethereum', value: 15800000, percentage: 100.0 }
    ],
    createdAt: '2023-07-01',
    updatedAt: '2024-03-15T10:30:00Z'
  }
];

export const SAMPLE_REPORTS: Report[] = [
  {
    id: 'report-1',
    type: 'vault-dd',
    title: 'Due Diligence: Aave V3 USDC',
    subjectId: 'vault-1',
    subjectType: 'vault',
    subjectName: 'Aave V3 USDC',
    generatedAt: '2024-03-15T10:00:00Z',
    author: 'Risk Analysis Team',
    summary: 'Comprehensive due diligence assessment of Aave V3 USDC lending vault on Ethereum mainnet.',
    recommendation: 'APPROVED for institutional allocation up to $100M with ongoing monitoring.',
    riskAssessment: 'Low risk (2.5/10). Battle-tested protocol with deep liquidity and strong governance.',
    sections: [
      {
        title: 'Executive Summary',
        content: 'Aave V3 USDC represents a low-risk institutional-grade lending opportunity with 4.2% APY from organic borrower demand. The vault exhibits strong fundamentals across all risk dimensions.'
      },
      {
        title: 'Strategy Overview',
        content: 'Passive USDC lending to Aave V3 money market. Earns variable interest from borrower payments. Simple strategy with instant liquidity and no lock-up period.'
      },
      {
        title: 'Risk Analysis',
        content: 'Risk score of 2.5/10 places this vault in conservative category. Key strengths: extensive audits, $11B+ protocol TVL, 3+ year operational history, DAO governance with timelock. Primary risk is USDC centralization.'
      }
    ]
  },
  {
    id: 'report-2',
    type: 'portfolio',
    title: 'Portfolio Analysis: Protocol DAO Treasury',
    subjectId: 'portfolio-dao',
    subjectType: 'portfolio',
    subjectName: 'Protocol DAO Treasury',
    generatedAt: '2024-03-15T10:00:00Z',
    author: 'Portfolio Management Team',
    summary: 'Quarterly review of $85M DAO treasury allocation across DeFi yield strategies.',
    recommendation: 'Portfolio demonstrates appropriate risk-adjusted returns. Recommend maintaining current allocation with minor rebalancing to increase protocol diversification.',
    riskAssessment: 'Conservative portfolio risk (3.2/10). Concentrated in institutional-grade lending with high liquidity.',
    sections: [
      {
        title: 'Portfolio Overview',
        content: '$85M allocated across 3 positions, all in lending strategies on Ethereum. Current yield: 4.2% blended APY. 24h change: +$120k (+0.14%).'
      },
      {
        title: 'Asset & Protocol Exposure',
        content: 'Diversified across USDC (41%), DAI (33%), and WETH (26%). Protocol exposure: Aave (41%), Spark (33%), Morpho (26%). All lending protocols.'
      },
      {
        title: 'Risk Assessment',
        content: 'Portfolio risk score 3.2/10 - conservative. All positions in institutional-grade vaults. Primary risk: Ethereum L1 concentration (100%). Consider L2 diversification.'
      }
    ]
  }
];

export const SAMPLE_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    name: 'Aave USDC APY Drop Alert',
    type: 'apy-drop',
    targetId: 'vault-1',
    targetType: 'vault',
    targetName: 'Aave V3 USDC',
    condition: 'APY drops below threshold',
    threshold: 3.5,
    channels: ['email', 'dashboard'],
    enabled: true,
    createdAt: '2024-02-01T10:00:00Z',
    lastTriggered: undefined
  },
  {
    id: 'alert-2',
    name: 'Portfolio Risk Increase',
    type: 'risk-change',
    targetId: 'portfolio-dao',
    targetType: 'portfolio',
    targetName: 'Protocol DAO Treasury',
    condition: 'Portfolio risk score increases above threshold',
    threshold: 4.0,
    channels: ['email', 'webhook'],
    enabled: true,
    createdAt: '2024-02-01T10:00:00Z',
    lastTriggered: undefined
  },
  {
    id: 'alert-3',
    name: 'Pendle Liquidity Warning',
    type: 'liquidity-warning',
    targetId: 'vault-3',
    targetType: 'vault',
    targetName: 'Pendle PT-sDAI',
    condition: 'Available liquidity drops below threshold',
    threshold: 15000000,
    channels: ['email', 'dashboard'],
    enabled: true,
    createdAt: '2024-02-15T10:00:00Z',
    lastTriggered: '2024-03-15T07:30:00Z'
  }
];

export function generateMockVaults(count: number): Vault[] {
  return VAULTS.slice(0, Math.min(count, VAULTS.length));
}

export function getVaultById(id: string): Vault | undefined {
  return VAULTS.find(v => v.id === id || v.slug === id);
}

export function getProtocolById(id: string): Protocol | undefined {
  return PROTOCOLS.find(p => p.id === id || p.slug === id);
}

export function getPortfolioById(id: string): Portfolio | undefined {
  return DEMO_PORTFOLIOS.find(p => p.id === id);
}

export function getReportById(id: string): Report | undefined {
  return SAMPLE_REPORTS.find(r => r.id === id);
}
