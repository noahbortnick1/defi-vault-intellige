import type { Vault, VaultDDReport, AuditInfo, Dependency, RiskFactor } from './types';

export interface EnhancedVaultAnalysis {
  strategyAnalysis: {
    description: string;
    mechanism: string;
    complexity: 'low' | 'medium' | 'high';
    keyRisks: string[];
  };
  yieldAnalysis: {
    sustainability: string;
    composition: string;
    outlook: string;
  };
  dependencyAnalysis: {
    assessment: string;
    criticalPaths: string[];
    mitigations: string[];
  };
  liquidityAnalysis: {
    assessment: string;
    exitScenarios: string[];
    recommendations: string[];
  };
  contractRiskAnalysis: {
    assessment: string;
    keyFindings: string[];
    recommendations: string[];
  };
  recommendation: {
    action: 'strong-buy' | 'buy' | 'hold' | 'avoid';
    reasoning: string;
    keyTakeaways: string[];
    redFlags: string[];
  };
}

export async function generateEnhancedVaultReport(vault: Vault): Promise<EnhancedVaultAnalysis> {
  const vaultContext = JSON.stringify({
    name: vault.name,
    protocol: vault.protocolName,
    chain: vault.chain,
    strategyType: vault.strategyType,
    description: vault.description,
    apy: vault.apy,
    realYield: vault.realYield,
    incentiveYield: vault.incentiveYield,
    tvl: vault.tvl,
    riskScore: vault.riskScore,
    riskBand: vault.riskBand,
    liquidityAvailable: vault.liquidityAvailable,
    liquidityScore: vault.liquidityScore,
    audits: vault.audits?.length || 0,
    auditDetails: vault.audits?.map(a => ({ auditor: a.auditor, date: a.date, scope: a.scope })),
    dependencies: vault.dependencyIds,
    governance: vault.governance,
    institutionalGrade: vault.institutionalGrade,
  }, null, 2);

  const prompt = spark.llmPrompt`You are a professional DeFi risk analyst generating a comprehensive due diligence report for institutional investors.

Analyze the following vault and provide detailed, actionable insights:

${vaultContext}

Generate a thorough analysis covering:

1. **Strategy Analysis**: Explain the vault's strategy in clear terms, assess its complexity (low/medium/high), describe the exact mechanism of how it generates yield, and identify 3-5 key risks specific to this strategy.

2. **Yield Analysis**: Evaluate the sustainability of the yield (considering real vs incentive breakdown), explain the composition and sources, and provide a forward-looking outlook on yield stability.

3. **Dependency Analysis**: Assess the dependency chain and systemic risk exposure, identify critical failure points or single points of failure, and suggest potential mitigations.

4. **Liquidity Analysis**: Evaluate the liquidity profile and exit capacity for institutional-sized positions, describe realistic exit scenarios under normal and stress conditions, and provide recommendations for position sizing.

5. **Contract Risk Analysis**: Assess smart contract security based on audit coverage and governance structure, highlight key security findings (positive and negative), and provide recommendations for risk management.

6. **Final Recommendation**: Provide an overall investment recommendation (strong-buy, buy, hold, or avoid), explain the reasoning behind this recommendation, list 4-6 key takeaways for decision-makers, and identify any critical red flags.

Return the analysis as a JSON object matching this structure exactly:
{
  "strategyAnalysis": {
    "description": "string - detailed explanation",
    "mechanism": "string - specific yield generation mechanism",
    "complexity": "low|medium|high",
    "keyRisks": ["array of 3-5 specific risk strings"]
  },
  "yieldAnalysis": {
    "sustainability": "string - assessment of yield sustainability",
    "composition": "string - breakdown of yield sources",
    "outlook": "string - forward-looking analysis"
  },
  "dependencyAnalysis": {
    "assessment": "string - overall dependency risk assessment",
    "criticalPaths": ["array of critical dependency strings"],
    "mitigations": ["array of risk mitigation strings"]
  },
  "liquidityAnalysis": {
    "assessment": "string - overall liquidity assessment",
    "exitScenarios": ["array of exit scenario descriptions"],
    "recommendations": ["array of position sizing recommendations"]
  },
  "contractRiskAnalysis": {
    "assessment": "string - overall contract security assessment",
    "keyFindings": ["array of key security findings"],
    "recommendations": ["array of security recommendations"]
  },
  "recommendation": {
    "action": "strong-buy|buy|hold|avoid",
    "reasoning": "string - detailed reasoning for the recommendation",
    "keyTakeaways": ["array of 4-6 executive summary points"],
    "redFlags": ["array of critical warning strings, empty if none"]
  }
}`;

  try {
    const result = await spark.llm(prompt, 'gpt-4o', true);
    const analysis = JSON.parse(result) as EnhancedVaultAnalysis;
    return analysis;
  } catch (error) {
    console.error('Error generating enhanced vault report:', error);
    return generateFallbackAnalysis(vault);
  }
}

function generateFallbackAnalysis(vault: Vault): EnhancedVaultAnalysis {
  const realYieldPercent = (vault.realYield / vault.apy) * 100;
  const incentivePercent = (vault.incentiveYield / vault.apy) * 100;

  return {
    strategyAnalysis: {
      description: vault.description,
      mechanism: `${vault.strategyType} strategy generating yield through ${vault.protocolName} on ${vault.chain}`,
      complexity: vault.dependencyIds?.length > 3 ? 'high' : vault.dependencyIds?.length > 1 ? 'medium' : 'low',
      keyRisks: [
        'Smart contract vulnerability risk',
        'Protocol dependency risk',
        vault.incentiveYield > vault.realYield ? 'High incentive token dependency' : 'Market volatility risk',
        vault.liquidityScore < 5 ? 'Limited liquidity for large exits' : 'Systemic contagion risk',
      ],
    },
    yieldAnalysis: {
      sustainability: realYieldPercent > 60
        ? `Strong sustainability with ${realYieldPercent.toFixed(1)}% from real yield sources.`
        : `Moderate sustainability with ${incentivePercent.toFixed(1)}% from incentive rewards.`,
      composition: `${realYieldPercent.toFixed(1)}% real yield from protocol fees and operations, ${incentivePercent.toFixed(1)}% from token incentives.`,
      outlook: realYieldPercent > 60
        ? 'Favorable long-term outlook with sustainable revenue sources.'
        : 'Monitor token emission schedules; yield may decline as incentives reduce.',
    },
    dependencyAnalysis: {
      assessment: vault.dependencyIds?.length > 3
        ? 'Complex dependency chain with elevated systemic risk.'
        : 'Manageable dependency structure with limited failure points.',
      criticalPaths: vault.dependencyIds || [],
      mitigations: [
        'Monitor dependency protocol health and governance',
        'Set position size limits based on dependency risk',
        'Implement exit triggers for critical dependency failures',
      ],
    },
    liquidityAnalysis: {
      assessment: vault.tvl > 50000000
        ? 'Deep liquidity suitable for institutional allocations.'
        : 'Limited liquidity may constrain position sizing.',
      exitScenarios: [
        vault.liquidityAvailable > vault.tvl * 0.5
          ? 'Can exit 50%+ of TVL with minimal slippage under normal conditions'
          : 'Limited exit capacity under normal conditions',
        'Stress scenarios may significantly reduce exit capacity',
      ],
      recommendations: [
        vault.tvl > 50000000 ? 'Suitable for allocations up to 5% of vault TVL' : 'Limit allocation to 2-3% of vault TVL',
        'Implement gradual exit strategy for large positions',
        'Monitor liquidity metrics before increasing exposure',
      ],
    },
    contractRiskAnalysis: {
      assessment: vault.audits && vault.audits.length > 2
        ? 'Strong audit coverage from reputable firms provides confidence in code security.'
        : 'Limited audit coverage increases smart contract risk exposure.',
      keyFindings: [
        `${vault.audits?.length || 0} security audits completed`,
        vault.governance.isUpgradeable ? 'Upgradeable contracts with admin controls' : 'Immutable contracts reduce governance risk',
        vault.governance.hasTimelock ? `Timelock protection provides security buffer` : 'No timelock protection',
      ],
      recommendations: [
        vault.audits?.length < 2 ? 'Proceed with caution due to limited audit coverage' : 'Contract security adequately verified',
        vault.governance.isUpgradeable ? 'Monitor governance actions and admin key security' : 'No upgrade risk',
        'Maintain awareness of any critical vulnerabilities in dependencies',
      ],
    },
    recommendation: {
      action: vault.riskScore < 3 && vault.apy > 5
        ? 'strong-buy'
        : vault.riskScore < 5 && vault.apy > 3
        ? 'buy'
        : vault.riskScore < 7
        ? 'hold'
        : 'avoid',
      reasoning: vault.riskScore < 3
        ? 'Low risk profile with attractive yield makes this suitable for conservative institutional allocations.'
        : vault.riskScore < 5
        ? 'Moderate risk-adjusted returns justify allocation within a diversified portfolio.'
        : vault.riskScore < 7
        ? 'Acceptable for risk-tolerant allocations with appropriate position sizing.'
        : 'Risk profile exceeds institutional thresholds; avoid until risk factors improve.',
      keyTakeaways: [
        vault.institutionalGrade
          ? 'Meets institutional quality standards (TVL ≥$50M, risk ≤4.0)'
          : 'Does not meet institutional quality thresholds',
        `${vault.apy.toFixed(1)}% APY with ${realYieldPercent.toFixed(0)}% from sustainable sources`,
        `${vault.audits?.length || 0} security audits; ${vault.governance.isUpgradeable ? 'upgradeable' : 'immutable'} contracts`,
        vault.tvl > 50000000 ? 'Deep liquidity suitable for large allocations' : 'Limited liquidity constrains position sizing',
        vault.dependencyIds?.length > 3 ? 'Complex dependency chain increases systemic risk' : 'Simple architecture reduces failure points',
      ],
      redFlags: vault.redFlags || [],
    },
  };
}

export async function mergeEnhancedAnalysis(
  baseReport: VaultDDReport,
  enhanced: EnhancedVaultAnalysis
): Promise<VaultDDReport> {
  return {
    ...baseReport,
    summary: {
      recommendation: enhanced.recommendation.action,
      keyTakeaways: enhanced.recommendation.keyTakeaways,
      overallScore: baseReport.summary.overallScore,
    },
    strategy: {
      description: enhanced.strategyAnalysis.description,
      complexity: enhanced.strategyAnalysis.complexity,
      mechanism: enhanced.strategyAnalysis.mechanism,
    },
    yieldSources: {
      ...baseReport.yieldSources,
      analysis: enhanced.yieldAnalysis.sustainability + ' ' + enhanced.yieldAnalysis.outlook,
    },
    dependencies: {
      ...baseReport.dependencies,
      analysis: enhanced.dependencyAnalysis.assessment,
    },
    contractRisk: {
      ...baseReport.contractRisk,
      analysis: enhanced.contractRiskAnalysis.assessment,
    },
    redFlags: enhanced.recommendation.redFlags,
  };
}

export interface ReportGenerationStatus {
  status: 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
  report?: VaultDDReport;
  error?: string;
}

export async function generateVaultDDReportWithAI(vault: Vault): Promise<VaultDDReport> {
  const { generateVaultDDReport } = await import('./reports');
  
  const baseReport = generateVaultDDReport(vault);
  
  try {
    const enhanced = await generateEnhancedVaultReport(vault);
    return await mergeEnhancedAnalysis(baseReport, enhanced);
  } catch (error) {
    console.error('Failed to enhance report with AI, returning base report:', error);
    return baseReport;
  }
}
