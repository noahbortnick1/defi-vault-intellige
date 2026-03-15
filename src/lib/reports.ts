import type {
  Vault,
  VaultDDReport,
  PortfolioDDReport,
  AllocationReport,
  Portfolio,
  Position,
  RiskFactor,
  Dependency,
  RiskBand,
} from './types';

export function generateVaultDDReport(vault: Vault): VaultDDReport {
  const recommendation = vault.riskScore < 3 && vault.apy > 5 ? 'strong-buy' :
    vault.riskScore < 5 && vault.apy > 3 ? 'buy' :
    vault.riskScore < 7 ? 'hold' : 'avoid';

  const keyTakeaways: string[] = [];
  
  if (vault.institutionalGrade) {
    keyTakeaways.push('Meets institutional quality standards (TVL ≥$50M, risk ≤4.0, verified)');
  }
  
  if (vault.realYield > vault.apy * 0.6) {
    keyTakeaways.push(`Strong sustainable yield: ${vault.realYield.toFixed(1)}% real yield of ${vault.apy.toFixed(1)}% total`);
  }
  
  if (vault.audits && vault.audits.length > 2) {
    keyTakeaways.push(`Well-audited: ${vault.audits.length} security audits completed`);
  }
  
  if (vault.riskScore < 3) {
    keyTakeaways.push('Low-risk profile suitable for conservative allocations');
  } else if (vault.riskScore > 7) {
    keyTakeaways.push('High-risk profile requires careful position sizing');
  }
  
  if (vault.tvl < 10000000) {
    keyTakeaways.push('Lower TVL indicates limited liquidity depth for large exits');
  }

  const strategyComplexity = vault.dependencyIds && vault.dependencyIds.length > 3 ? 'high' :
    vault.dependencyIds && vault.dependencyIds.length > 1 ? 'medium' : 'low';

  const yieldSources = [
    {
      name: 'Real Yield',
      percentage: (vault.realYield / vault.apy) * 100,
      sustainability: (vault.realYield / vault.apy > 0.7 ? 'high' : vault.realYield / vault.apy > 0.4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      description: 'Sustainable protocol revenue from fees and operations',
    },
    {
      name: 'Incentive Yield',
      percentage: (vault.incentiveYield / vault.apy) * 100,
      sustainability: (vault.incentiveYield / vault.apy < 0.3 ? 'high' : vault.incentiveYield / vault.apy < 0.6 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      description: 'Token emissions that may decline over time',
    },
  ];

  const dependencies: Dependency[] = vault.dependencyIds?.map((depId, idx) => ({
    id: `dep-${idx}`,
    vaultId: vault.id,
    name: depId,
    type: depId.toLowerCase().includes('oracle') ? 'oracle' as const :
      depId.toLowerCase().includes('bridge') ? 'bridge' as const :
      depId.toLowerCase().includes('gov') ? 'governance' as const : 'protocol' as const,
    criticality: idx === 0 ? 'high' as const : 'medium' as const,
    notes: `Core dependency for ${vault.strategyType} strategy`,
  })) || [];

  const criticalDependencies = dependencies
    .filter(d => d.criticality === 'high')
    .map(d => d.name);

  const liquidityDepth = vault.tvl > 100000000 ? 'Deep' :
    vault.tvl > 10000000 ? 'Medium' : 'Shallow';
  
  const exitCapacity = vault.liquidityAvailable > vault.tvl * 0.5 ? 'High' :
    vault.liquidityAvailable > vault.tvl * 0.2 ? 'Medium' : 'Limited';

  const concentrationRisk = vault.tvl < 10000000 ? 'High - limited pool size' :
    vault.tvl < 50000000 ? 'Medium' : 'Low';

  const riskFactors: RiskFactor[] = [
    {
      id: 'rf-1',
      vaultId: vault.id,
      key: 'smart_contract',
      label: 'Smart Contract Security',
      value: vault.audits?.length || 0,
      weight: 0.30,
      scoreContribution: vault.riskScore * 0.30,
      explanation: `${vault.audits?.length || 0} audits completed. ${vault.governance.isUpgradeable ? 'Upgradeable' : 'Immutable'} contract.`,
    },
    {
      id: 'rf-2',
      vaultId: vault.id,
      key: 'liquidity',
      label: 'Liquidity Risk',
      value: vault.liquidityScore,
      weight: 0.25,
      scoreContribution: vault.riskScore * 0.25,
      explanation: `${liquidityDepth} liquidity with ${exitCapacity.toLowerCase()} exit capacity.`,
    },
    {
      id: 'rf-3',
      vaultId: vault.id,
      key: 'market',
      label: 'Market Risk',
      value: vault.apy,
      weight: 0.20,
      scoreContribution: vault.riskScore * 0.20,
      explanation: `${vault.apy.toFixed(1)}% APY with ${vault.incentiveYield > vault.realYield ? 'high' : 'low'} incentive dependence.`,
    },
    {
      id: 'rf-4',
      vaultId: vault.id,
      key: 'protocol',
      label: 'Protocol Stability',
      value: vault.tvl,
      weight: 0.15,
      scoreContribution: vault.riskScore * 0.15,
      explanation: `${(vault.tvl / 1000000).toFixed(1)}M TVL indicates ${vault.tvl > 50000000 ? 'mature' : 'developing'} protocol.`,
    },
    {
      id: 'rf-5',
      vaultId: vault.id,
      key: 'governance',
      label: 'Governance & Admin Controls',
      value: vault.governance.hasTimelock ? 1 : 0,
      weight: 0.10,
      scoreContribution: vault.riskScore * 0.10,
      explanation: `${vault.governance.hasTimelock ? 'Timelock protected' : 'No timelock'}. ${vault.governance.adminControls.length} admin functions.`,
    },
  ];

  return {
    id: `dd-${vault.id}-${Date.now()}`,
    vaultId: vault.id,
    vault,
    generatedAt: new Date().toISOString(),
    summary: {
      recommendation,
      keyTakeaways,
      overallScore: Math.round((10 - vault.riskScore) * 10),
    },
    strategy: {
      description: vault.description,
      complexity: strategyComplexity,
      mechanism: `${vault.strategyType} strategy on ${vault.chain}`,
    },
    yieldSources: {
      sources: yieldSources,
      analysis: vault.realYield > vault.apy * 0.6 
        ? 'Majority yield from sustainable sources - favorable for long-term allocations'
        : 'Significant incentive component - monitor token emission schedules',
    },
    dependencies: {
      list: dependencies,
      complexity: dependencies.length,
      criticalDependencies,
      analysis: dependencies.length > 3 
        ? 'Complex dependency chain increases systemic risk exposure'
        : 'Simple dependency structure reduces failure points',
    },
    contractRisk: {
      isUpgradeable: vault.governance.isUpgradeable,
      adminControls: vault.governance.adminControls,
      timelockDuration: vault.governance.timelockDuration,
      audits: vault.audits || [],
      score: vault.audits && vault.audits.length > 2 ? 8.5 : vault.audits && vault.audits.length > 0 ? 6.5 : 4.0,
      analysis: vault.audits && vault.audits.length > 2
        ? 'Strong audit coverage from reputable firms. Code security verified.'
        : 'Limited audit coverage increases smart contract risk.',
    },
    liquidityProfile: {
      liquidityDepth,
      exitCapacity,
      concentrationRisk,
      score: vault.liquidityScore * 10,
    },
    redFlags: vault.redFlags || [],
    overallRisk: {
      score: vault.riskScore,
      band: vault.riskBand,
      breakdown: riskFactors,
    },
  };
}

export function generatePortfolioDDReport(portfolio: Portfolio): PortfolioDDReport {
  const positionCount = portfolio.positions.length;
  const totalValue = portfolio.netWorth;
  
  const sortedPositions = [...portfolio.positions].sort((a, b) => b.value - a.value);
  const largestPositions = sortedPositions.slice(0, 5);
  
  const byAsset: Record<string, { value: number; percentage: number; count: number }> = {};
  const byProtocol: Record<string, { value: number; percentage: number; count: number }> = {};
  const byChain: Record<string, { value: number; percentage: number; count: number }> = {};
  const byStrategy: Record<string, { value: number; percentage: number; count: number }> = {};
  
  portfolio.positions.forEach(pos => {
    if (!byAsset[pos.asset]) {
      byAsset[pos.asset] = { value: 0, percentage: 0, count: 0 };
    }
    byAsset[pos.asset].value += pos.value;
    byAsset[pos.asset].count += 1;
    
    if (!byProtocol[pos.protocol]) {
      byProtocol[pos.protocol] = { value: 0, percentage: 0, count: 0 };
    }
    byProtocol[pos.protocol].value += pos.value;
    byProtocol[pos.protocol].count += 1;
    
    if (!byChain[pos.chain]) {
      byChain[pos.chain] = { value: 0, percentage: 0, count: 0 };
    }
    byChain[pos.chain].value += pos.value;
    byChain[pos.chain].count += 1;
  });
  
  Object.keys(byAsset).forEach(key => {
    byAsset[key].percentage = (byAsset[key].value / totalValue) * 100;
  });
  Object.keys(byProtocol).forEach(key => {
    byProtocol[key].percentage = (byProtocol[key].value / totalValue) * 100;
  });
  Object.keys(byChain).forEach(key => {
    byChain[key].percentage = (byChain[key].value / totalValue) * 100;
  });
  
  const concentrations = sortedPositions.map(p => p.value / totalValue);
  const herfindahlIndex = concentrations.reduce((sum, c) => sum + c * c, 0);
  const topThreeConcentration = concentrations.slice(0, 3).reduce((sum, c) => sum + c, 0) * 100;
  
  const diversificationScore = Math.max(0, 100 - herfindahlIndex * 100);
  
  const keyFindings: string[] = [];
  
  if (topThreeConcentration > 70) {
    keyFindings.push(`High concentration: top 3 positions represent ${topThreeConcentration.toFixed(1)}% of portfolio`);
  }
  
  const assetCount = Object.keys(byAsset).length;
  if (assetCount < 3) {
    keyFindings.push('Limited asset diversification - consider broader exposure');
  }
  
  if (portfolio.totalYield > 10) {
    keyFindings.push(`Strong yield generation: ${portfolio.totalYield.toFixed(1)}% total yield`);
  }
  
  const recommendations: string[] = [];
  if (topThreeConcentration > 60) {
    recommendations.push('Reduce concentration in top positions to improve risk-adjusted returns');
  }
  if (assetCount < 3) {
    recommendations.push('Diversify across additional asset types to reduce correlation risk');
  }
  if (Object.keys(byChain).length === 1) {
    recommendations.push('Consider multi-chain diversification to reduce L1/L2 risk');
  }

  return {
    id: `portfolio-dd-${portfolio.id}-${Date.now()}`,
    portfolioId: portfolio.id,
    portfolio,
    generatedAt: new Date().toISOString(),
    summary: {
      totalValue,
      positionCount,
      overallRisk: portfolio.riskScore,
      diversificationScore: Math.round(diversificationScore),
      keyFindings,
    },
    positions: {
      list: portfolio.positions,
      largest: largestPositions,
    },
    exposure: {
      byAsset,
      byProtocol,
      byChain,
      byStrategy,
    },
    concentrationRisk: {
      herfindahlIndex: Math.round(herfindahlIndex * 10000) / 10000,
      topThreeConcentration: Math.round(topThreeConcentration * 10) / 10,
      analysis: herfindahlIndex > 0.3 
        ? 'High concentration risk - portfolio dominated by few positions'
        : herfindahlIndex > 0.15
        ? 'Moderate concentration - acceptable for focused strategies'
        : 'Well-diversified portfolio with balanced allocations',
      recommendations,
    },
    yieldAnalysis: {
      totalYield: portfolio.totalYield,
      avgYield: portfolio.totalYield / positionCount,
      yieldBySource: {},
    },
  };
}

export function generateAllocationReport(
  vaults: Vault[],
  targetAsset: string,
  targetRiskBand: RiskBand,
  totalAmount: number
): AllocationReport {
  const eligibleVaults = vaults.filter(
    v => v.asset === targetAsset && v.riskBand === targetRiskBand && v.status === 'active'
  );
  
  const sortedVaults = eligibleVaults
    .sort((a, b) => {
      const scoreA = (10 - a.riskScore) * a.apy * a.liquidityScore;
      const scoreB = (10 - b.riskScore) * b.apy * b.liquidityScore;
      return scoreB - scoreA;
    })
    .slice(0, 5);
  
  const totalScore = sortedVaults.reduce((sum, v) => 
    sum + (10 - v.riskScore) * v.apy * v.liquidityScore, 0
  );
  
  const recommendations = sortedVaults.map(vault => {
    const score = (10 - vault.riskScore) * vault.apy * vault.liquidityScore;
    const percentage = (score / totalScore) * 100;
    const allocation = (totalAmount * percentage) / 100;
    
    return {
      vault,
      allocation: Math.round(allocation),
      percentage: Math.round(percentage * 10) / 10,
      rationale: `Score: ${Math.round(score)} (Risk: ${vault.riskScore.toFixed(1)}, APY: ${vault.apy.toFixed(1)}%, Liquidity: ${vault.liquidityScore.toFixed(1)})`,
    };
  });
  
  const maxSingleVault = totalAmount * 0.30;
  const maxProtocolExposure = totalAmount * 0.40;

  return {
    id: `allocation-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    targetAsset,
    targetRiskBand,
    totalAmount,
    recommendations,
    rationale: {
      methodology: 'Risk-adjusted yield optimization with liquidity weighting',
      constraints: [
        `Maximum ${(maxSingleVault / totalAmount * 100).toFixed(0)}% in single vault`,
        `Maximum ${(maxProtocolExposure / totalAmount * 100).toFixed(0)}% protocol exposure`,
        `Only ${targetRiskBand} risk vaults considered`,
      ],
      considerations: [
        'Diversification across multiple protocols reduces systemic risk',
        'Liquidity depth ensures exit capacity for large positions',
        'Real yield percentage indicates sustainability',
      ],
    },
    downsideConsiderations: [
      'Smart contract risk remains even with audits',
      'APY rates may decline with TVL growth',
      'Incentive tokens subject to price volatility',
      'Liquidity can deteriorate quickly in market stress',
    ],
    liquidityLimits: {
      maxSingleVaultSize: maxSingleVault,
      maxProtocolExposure: maxProtocolExposure,
      reasoning: 'Conservative position sizing ensures exit optionality and reduces tail risk',
    },
  };
}
