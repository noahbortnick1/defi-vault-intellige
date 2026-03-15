import type {
  VaultFinancialSnapshot,
  VaultIncomeSnapshot,
  VaultFlowSnapshot,
  VaultFinancials,
  PortfolioFinancials
} from './types';

const today = new Date().toISOString().split('T')[0];
const monthStart = new Date(new Date().setDate(1)).toISOString().split('T')[0];
const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];

export const VAULT_FINANCIAL_SNAPSHOTS: Record<string, VaultFinancialSnapshot> = {
  'morpho-usdc-prime': {
    id: 'fin-snap-morpho-1',
    vaultId: 'morpho-usdc-prime',
    asOfDate: today,
    grossAssets: 12800000,
    liabilities: 4135000,
    netAssets: 8665000,
    sharesOutstanding: 8000000,
    navPerShare: 1.0831,
    accruedFees: 35000,
    accruedRewards: 220000,
    createdAt: new Date().toISOString()
  },
  'aave-usdc-optimizer': {
    id: 'fin-snap-aave-1',
    vaultId: 'aave-usdc-optimizer',
    asOfDate: today,
    grossAssets: 8420000,
    liabilities: 0,
    netAssets: 8420000,
    sharesOutstanding: 8200000,
    navPerShare: 1.0268,
    accruedFees: 18000,
    accruedRewards: 95000,
    createdAt: new Date().toISOString()
  },
  'yearn-usdc-vault': {
    id: 'fin-snap-yearn-1',
    vaultId: 'yearn-usdc-vault',
    asOfDate: today,
    grossAssets: 5620000,
    liabilities: 450000,
    netAssets: 5170000,
    sharesOutstanding: 5100000,
    navPerShare: 1.0137,
    accruedFees: 12000,
    accruedRewards: 48000,
    createdAt: new Date().toISOString()
  },
  'pendle-pt-usdc': {
    id: 'fin-snap-pendle-1',
    vaultId: 'pendle-pt-usdc',
    asOfDate: today,
    grossAssets: 15200000,
    liabilities: 0,
    netAssets: 15200000,
    sharesOutstanding: 14800000,
    navPerShare: 1.0270,
    accruedFees: 42000,
    accruedRewards: 185000,
    createdAt: new Date().toISOString()
  }
};

export const VAULT_INCOME_SNAPSHOTS: Record<string, VaultIncomeSnapshot> = {
  'morpho-usdc-prime': {
    id: 'inc-snap-morpho-1',
    vaultId: 'morpho-usdc-prime',
    periodStart: monthStart,
    periodEnd: today,
    lendingIncome: 142000,
    incentiveIncome: 48000,
    tradingFeeIncome: 0,
    stakingIncome: 0,
    borrowCost: 51000,
    gasCost: 6000,
    managementFees: 12000,
    performanceFees: 7000,
    netIncome: 114000,
    createdAt: new Date().toISOString()
  },
  'aave-usdc-optimizer': {
    id: 'inc-snap-aave-1',
    vaultId: 'aave-usdc-optimizer',
    periodStart: monthStart,
    periodEnd: today,
    lendingIncome: 68000,
    incentiveIncome: 22000,
    tradingFeeIncome: 0,
    stakingIncome: 0,
    borrowCost: 0,
    gasCost: 3500,
    managementFees: 8500,
    performanceFees: 4200,
    netIncome: 73800,
    createdAt: new Date().toISOString()
  },
  'yearn-usdc-vault': {
    id: 'inc-snap-yearn-1',
    vaultId: 'yearn-usdc-vault',
    periodStart: monthStart,
    periodEnd: today,
    lendingIncome: 38000,
    incentiveIncome: 15000,
    tradingFeeIncome: 8000,
    stakingIncome: 0,
    borrowCost: 12000,
    gasCost: 4200,
    managementFees: 5800,
    performanceFees: 2900,
    netIncome: 36100,
    createdAt: new Date().toISOString()
  },
  'pendle-pt-usdc': {
    id: 'inc-snap-pendle-1',
    vaultId: 'pendle-pt-usdc',
    periodStart: monthStart,
    periodEnd: today,
    lendingIncome: 0,
    incentiveIncome: 92000,
    tradingFeeIncome: 45000,
    stakingIncome: 0,
    borrowCost: 0,
    gasCost: 8500,
    managementFees: 15000,
    performanceFees: 8200,
    netIncome: 105300,
    createdAt: new Date().toISOString()
  }
};

export const VAULT_FLOW_SNAPSHOTS: Record<string, VaultFlowSnapshot> = {
  'morpho-usdc-prime': {
    id: 'flow-snap-morpho-1',
    vaultId: 'morpho-usdc-prime',
    periodStart: monthStart,
    periodEnd: today,
    deposits: 2400000,
    withdrawals: 1100000,
    rewardsClaimed: 52000,
    rebalanceVolume: 900000,
    netFlow: 1300000,
    createdAt: new Date().toISOString()
  },
  'aave-usdc-optimizer': {
    id: 'flow-snap-aave-1',
    vaultId: 'aave-usdc-optimizer',
    periodStart: monthStart,
    periodEnd: today,
    deposits: 1850000,
    withdrawals: 620000,
    rewardsClaimed: 28000,
    rebalanceVolume: 450000,
    netFlow: 1230000,
    createdAt: new Date().toISOString()
  },
  'yearn-usdc-vault': {
    id: 'flow-snap-yearn-1',
    vaultId: 'yearn-usdc-vault',
    periodStart: monthStart,
    periodEnd: today,
    deposits: 980000,
    withdrawals: 1200000,
    rewardsClaimed: 18000,
    rebalanceVolume: 320000,
    netFlow: -220000,
    createdAt: new Date().toISOString()
  },
  'pendle-pt-usdc': {
    id: 'flow-snap-pendle-1',
    vaultId: 'pendle-pt-usdc',
    periodStart: monthStart,
    periodEnd: today,
    deposits: 5200000,
    withdrawals: 2800000,
    rewardsClaimed: 95000,
    rebalanceVolume: 1800000,
    netFlow: 2400000,
    createdAt: new Date().toISOString()
  }
};

export function getVaultFinancials(vaultId: string): VaultFinancials | null {
  const balanceSheet = VAULT_FINANCIAL_SNAPSHOTS[vaultId];
  const incomeStatement = VAULT_INCOME_SNAPSHOTS[vaultId];
  const flowOfFunds = VAULT_FLOW_SNAPSHOTS[vaultId];

  if (!balanceSheet || !incomeStatement || !flowOfFunds) {
    return null;
  }

  return {
    balanceSheet,
    incomeStatement,
    flowOfFunds,
    navHistory: generateNavHistory(vaultId, balanceSheet.navPerShare),
    positionNotes: generatePositionNotes(vaultId)
  };
}

function generateNavHistory(vaultId: string, currentNav: number): Array<{date: string; navPerShare: number; netAssets: number}> {
  const history = [];
  const balanceSheet = VAULT_FINANCIAL_SNAPSHOTS[vaultId];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const drift = 0.998 + (Math.random() * 0.004);
    const nav = currentNav * Math.pow(drift, i);
    const netAssets = balanceSheet.netAssets * Math.pow(drift, i);
    
    history.push({
      date: dateStr,
      navPerShare: Number(nav.toFixed(6)),
      netAssets: Number(netAssets.toFixed(2))
    });
  }
  
  return history;
}

function generatePositionNotes(vaultId: string): VaultFinancials['positionNotes'] {
  const notes: Record<string, VaultFinancials['positionNotes']> = {
    'morpho-usdc-prime': {
      protocolDependencies: ['Morpho Blue', 'Aave V3', 'Chainlink Price Feeds'],
      oracleDependencies: ['Chainlink USDC/USD', 'Chainlink ETH/USD'],
      upgradeability: 'Vault is upgradeable via 3/5 multisig with 48h timelock',
      liquidityAssumptions: 'Exit capacity constrained by Morpho liquidity depth (~$8M same-block, $15M+ within 1 hour)',
      tokenConcentration: 'Single asset (USDC) with diversified lending deployments across 3 markets',
      leverage: 'Effective leverage of 1.49x through recursive USDC lending (supplied $12.4M, borrowed $4.1M)'
    },
    'aave-usdc-optimizer': {
      protocolDependencies: ['Aave V3', 'Chainlink Price Feeds'],
      oracleDependencies: ['Chainlink USDC/USD'],
      upgradeability: 'Non-upgradeable vault, immutable strategy logic',
      liquidityAssumptions: 'High exit capacity via Aave V3 liquidity (>$100M available)',
      tokenConcentration: 'Single asset (USDC) supplied to Aave V3 Ethereum',
      leverage: 'No leverage employed, direct supply position'
    },
    'yearn-usdc-vault': {
      protocolDependencies: ['Aave V3', 'Curve Finance', 'Convex Finance'],
      oracleDependencies: ['Chainlink USDC/USD', 'Curve Pool Oracle'],
      upgradeability: 'Strategy upgradeable by Yearn governance (timelock: 6 days)',
      liquidityAssumptions: 'Exit capacity varies by active strategy allocation (~$3M immediate, $8M within 24h)',
      tokenConcentration: 'USDC allocated across 3 strategies: 60% Aave, 30% Curve, 10% idle',
      leverage: 'Minimal leverage (1.08x) through Curve LP positions'
    },
    'pendle-pt-usdc': {
      protocolDependencies: ['Pendle Finance', 'Aave V3', 'Uniswap V3'],
      oracleDependencies: ['Chainlink USDC/USD', 'Pendle PT Oracle', 'Uniswap TWAP'],
      upgradeability: 'Vault upgradeable via Pendle governance (48h timelock)',
      liquidityAssumptions: 'Exit capacity depends on PT maturity; current depth $12M for near-term exit, improves as maturity approaches',
      tokenConcentration: 'Concentrated in Pendle PT-USDC positions (3 different maturities)',
      leverage: 'No leverage, principal token positions only'
    }
  };

  return notes[vaultId] || {
    protocolDependencies: [],
    oracleDependencies: [],
    upgradeability: 'Unknown',
    liquidityAssumptions: 'Not specified',
    tokenConcentration: 'Not specified',
    leverage: 'Not specified'
  };
}

export function getPortfolioFinancials(portfolioId: string): PortfolioFinancials {
  return {
    summary: {
      totalAssets: 18500000,
      totalLiabilities: 2100000,
      netAssets: 16400000,
      realizedGains: 420000,
      unrealizedGains: 680000,
      asOfDate: today
    },
    incomeBySource: {
      'Lending Income': 248000,
      'Incentive Income': 177000,
      'Trading Fees': 53000,
      'Staking Rewards': 0
    },
    exposure: {
      byAsset: {
        'USDC': 14200000,
        'USDT': 2800000,
        'DAI': 1500000
      },
      byStrategy: {
        'Lending': 9800000,
        'Yield Trading': 4200000,
        'LP Farming': 2400000
      },
      byChain: {
        'Ethereum': 11200000,
        'Arbitrum': 4800000,
        'Base': 2400000
      },
      byProtocol: {
        'Morpho': 5800000,
        'Aave': 4200000,
        'Pendle': 4100000,
        'Yearn': 2300000
      }
    },
    positions: [
      {
        vault: 'Morpho USDC Prime',
        cost: 5500000,
        marketValue: 5800000,
        unrealizedGain: 300000,
        yieldToDate: 142000
      },
      {
        vault: 'Pendle PT-USDC',
        cost: 4000000,
        marketValue: 4100000,
        unrealizedGain: 100000,
        yieldToDate: 105000
      },
      {
        vault: 'Aave USDC Optimizer',
        cost: 4100000,
        marketValue: 4200000,
        unrealizedGain: 100000,
        yieldToDate: 74000
      },
      {
        vault: 'Yearn USDC Vault',
        cost: 2300000,
        marketValue: 2300000,
        unrealizedGain: 0,
        yieldToDate: 36000
      }
    ]
  };
}
