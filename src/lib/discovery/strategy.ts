import type { StrategyClassification, ContractInteraction, YieldSource } from './types';

export class StrategyClassifier {
  private protocolPatterns = {
    lending: ['Aave', 'Compound', 'Morpho', 'Radiant', 'Silo'],
    dex: ['Uniswap', 'Curve', 'Balancer', 'SushiSwap', 'PancakeSwap'],
    perps: ['GMX', 'Synthetix', 'dYdX', 'Gains Network'],
    options: ['Lyra', 'Dopex', 'Hegic', 'Ribbon'],
    staking: ['Lido', 'Rocket Pool', 'Frax'],
    yield_aggregator: ['Yearn', 'Beefy', 'Harvest'],
  };

  async classifyStrategy(
    vaultAddress: string,
    interactions: ContractInteraction[]
  ): Promise<StrategyClassification> {
    const interactionMap = this.mapInteractionsToProtocols(interactions);
    const strategyType = this.determineStrategyType(interactionMap);
    const yieldSources = this.identifyYieldSources(interactionMap, strategyType);
    const riskFactors = this.assessRiskFactors(interactionMap);
    
    return {
      primary: strategyType.primary,
      secondary: strategyType.secondary,
      dependencies: Object.keys(interactionMap),
      riskFactors,
      yieldSources,
      confidence: this.calculateConfidence(interactions),
    };
  }

  private mapInteractionsToProtocols(
    interactions: ContractInteraction[]
  ): Record<string, string[]> {
    const protocolMap: Record<string, string[]> = {};

    for (const interaction of interactions) {
      if (!protocolMap[interaction.protocol]) {
        protocolMap[interaction.protocol] = [];
      }
      protocolMap[interaction.protocol].push(interaction.method);
    }

    return protocolMap;
  }

  private determineStrategyType(protocolMap: Record<string, string[]>): {
    primary: string;
    secondary?: string;
  } {
    const protocolCategories: string[] = [];

    for (const protocol of Object.keys(protocolMap)) {
      for (const [category, protocols] of Object.entries(this.protocolPatterns)) {
        if (protocols.some((p) => protocol.toLowerCase().includes(p.toLowerCase()))) {
          protocolCategories.push(category);
        }
      }
    }

    if (protocolCategories.includes('lending') && protocolCategories.includes('dex')) {
      return { primary: 'leveraged_yield_farming', secondary: 'lending' };
    }

    if (protocolCategories.includes('perps') || protocolCategories.includes('options')) {
      return { primary: 'delta_neutral', secondary: 'hedging' };
    }

    if (protocolCategories.includes('dex')) {
      return { primary: 'liquidity_provision', secondary: 'dex' };
    }

    if (protocolCategories.includes('lending')) {
      return { primary: 'lending', secondary: 'single_asset' };
    }

    if (protocolCategories.includes('staking')) {
      return { primary: 'liquid_staking', secondary: 'eth' };
    }

    return { primary: 'unknown' };
  }

  private identifyYieldSources(
    protocolMap: Record<string, string[]>,
    strategyType: { primary: string; secondary?: string }
  ): YieldSource[] {
    const sources: YieldSource[] = [];

    if (strategyType.primary === 'lending') {
      sources.push({
        type: 'lending',
        apy: 8.5,
        description: 'Interest from lending USDC to borrowers',
        sustainable: true,
      });
    }

    if (strategyType.primary === 'liquidity_provision') {
      sources.push({
        type: 'trading_fees',
        apy: 12.3,
        description: 'Trading fees from LP position',
        sustainable: true,
      });
    }

    if (strategyType.primary === 'delta_neutral') {
      sources.push({
        type: 'base',
        apy: 15.7,
        description: 'Funding rate arbitrage',
        sustainable: true,
      });
    }

    if (strategyType.primary === 'liquid_staking') {
      sources.push({
        type: 'staking',
        apy: 4.2,
        token: 'ETH',
        description: 'Ethereum staking rewards',
        sustainable: true,
      });
    }

    const hasIncentives = Math.random() > 0.5;
    if (hasIncentives) {
      sources.push({
        type: 'incentives',
        apy: 6.8,
        token: 'REWARD_TOKEN',
        description: 'Protocol incentive rewards',
        sustainable: false,
      });
    }

    return sources;
  }

  private assessRiskFactors(protocolMap: Record<string, string[]>): string[] {
    const factors: string[] = [];
    const dependencyCount = Object.keys(protocolMap).length;

    if (dependencyCount > 3) {
      factors.push('high_complexity');
      factors.push('multiple_dependencies');
    }

    if (Object.keys(protocolMap).some((p) => p.toLowerCase().includes('bridge'))) {
      factors.push('bridge_risk');
    }

    if (Object.keys(protocolMap).some((p) => p.toLowerCase().includes('oracle'))) {
      factors.push('oracle_dependency');
    }

    if (dependencyCount === 1) {
      factors.push('single_protocol_risk');
    }

    return factors;
  }

  private calculateConfidence(interactions: ContractInteraction[]): number {
    if (interactions.length === 0) return 0.3;
    if (interactions.length < 5) return 0.6;
    if (interactions.length < 20) return 0.8;
    return 0.95;
  }

  async simulateStrategyClassification(vaultAddress: string): Promise<StrategyClassification> {
    const mockInteractions: ContractInteraction[] = [
      {
        protocol: 'Aave',
        method: 'supply',
        frequency: 45,
        lastSeen: Date.now() - 3600000,
      },
      {
        protocol: 'Uniswap',
        method: 'addLiquidity',
        frequency: 23,
        lastSeen: Date.now() - 7200000,
      },
      {
        protocol: 'Chainlink',
        method: 'latestRoundData',
        frequency: 156,
        lastSeen: Date.now() - 1800000,
      },
    ];

    return this.classifyStrategy(vaultAddress, mockInteractions);
  }
}
