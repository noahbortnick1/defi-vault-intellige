import type {
  Portfolio,
  Position,
  Vault,
} from './types';
import { VAULTS } from './mockData';
import type {
  PositionsApiResponse,
  ExposureApiResponse,
  SummaryApiResponse,
} from './portfolioApi';

export interface AIPortfolioInsights {
  executiveSummary: {
    overallAssessment: string;
    portfolioHealth: 'excellent' | 'good' | 'fair' | 'concerning';
    keyStrengths: string[];
    keyWeaknesses: string[];
    immediateActions: string[];
  };
  riskAnalysis: {
    concentrationRisk: {
      level: 'low' | 'medium' | 'high' | 'critical';
      assessment: string;
      concerns: string[];
      recommendations: string[];
    };
    protocolRisk: {
      assessment: string;
      highRiskExposures: Array<{
        protocol: string;
        exposure: number;
        riskScore: number;
        reasoning: string;
      }>;
      recommendations: string[];
    };
    yieldSustainability: {
      assessment: string;
      incentiveDependence: number;
      sustainabilityScore: number;
      outlook: string;
    };
  };
  optimizationRecommendations: {
    rebalancing: Array<{
      action: 'reduce' | 'maintain' | 'increase';
      currentVault: string;
      currentAllocation: number;
      targetAllocation: number;
      reasoning: string;
    }>;
    newOpportunities: Array<{
      vaultId: string;
      vaultName: string;
      protocol: string;
      apy: number;
      riskScore: number;
      suggestedAllocation: number;
      reasoning: string;
      benefits: string[];
    }>;
    exitRecommendations: Array<{
      vaultId: string;
      vaultName: string;
      currentAllocation: number;
      urgency: 'immediate' | 'near-term' | 'monitor';
      reasoning: string;
      alternativeSuggestion?: string;
    }>;
  };
  diversificationStrategy: {
    currentScore: number;
    targetScore: number;
    gaps: string[];
    specificActions: Array<{
      category: 'asset' | 'protocol' | 'chain' | 'strategy';
      currentExposure: string;
      targetExposure: string;
      actions: string[];
    }>;
  };
  yieldOptimization: {
    currentYield: number;
    potentialYield: number;
    optimizationPaths: Array<{
      description: string;
      expectedYieldIncrease: number;
      riskTradeoff: string;
      steps: string[];
    }>;
  };
  actionPlan: {
    immediate: Array<{ priority: number; action: string; expectedImpact: string }>;
    nearTerm: Array<{ priority: number; action: string; expectedImpact: string }>;
    strategic: Array<{ priority: number; action: string; expectedImpact: string }>;
  };
}

export interface AIEnhancedPortfolioReport {
  portfolioId: string;
  walletAddress: string;
  generatedAt: string;
  currentState: {
    totalValue: number;
    positionCount: number;
    overallRisk: number;
    averageAPY: number;
    concentrationMetrics: {
      topAssetConcentration: number;
      topProtocolConcentration: number;
      topChainConcentration: number;
      herfindahlIndex: number;
    };
  };
  insights: AIPortfolioInsights;
}

async function generateAIInsights(
  positions: PositionsApiResponse,
  exposure: ExposureApiResponse,
  summary: SummaryApiResponse
): Promise<AIPortfolioInsights> {
  const portfolioContext = JSON.stringify({
    totalValue: positions.total_value,
    positionCount: positions.total_positions,
    avgRiskScore: summary.risk_metrics.overall_risk,
    concentrationRisk: summary.risk_metrics.concentration_risk,
    positions: positions.positions.map(p => ({
      vaultName: p.vault_name,
      protocol: p.protocol,
      asset: p.asset,
      value: p.value,
      shareOfPortfolio: p.share_of_portfolio,
      apy: p.apy,
      pnl: p.pnl,
      chain: p.chain,
    })),
    assetBreakdown: exposure.asset_breakdown,
    protocolExposure: exposure.protocol_exposure,
    chainExposure: exposure.chain_exposure,
    strategyExposure: exposure.strategy_exposure,
    performance: {
      '7d': summary.performance_7d,
      '30d': summary.performance_30d,
      '90d': summary.performance_90d,
    },
  }, null, 2);

  const availableVaults = VAULTS.filter(v => v.institutionalGrade && v.riskScore <= 6).slice(0, 20);
  const vaultsContext = JSON.stringify(availableVaults.map(v => ({
    id: v.id,
    name: v.name,
    protocol: v.protocolName,
    asset: v.asset,
    apy: v.apy,
    realYield: v.realYield,
    incentiveYield: v.incentiveYield,
    riskScore: v.riskScore,
    tvl: v.tvl,
    chain: v.chain,
    strategyType: v.strategyType,
  })), null, 2);

  const prompt = spark.llmPrompt`You are an expert DeFi portfolio manager and risk analyst providing comprehensive portfolio analysis and optimization recommendations for institutional investors.

Analyze the following portfolio and provide detailed, actionable insights:

CURRENT PORTFOLIO:
${portfolioContext}

AVAILABLE VAULTS FOR RECOMMENDATIONS:
${vaultsContext}

Generate a comprehensive AI-enhanced portfolio analysis covering:

1. **Executive Summary**: 
   - Overall portfolio health assessment (excellent/good/fair/concerning)
   - 3-5 key strengths (specific to this portfolio's positions)
   - 3-5 key weaknesses or concerns (specific vulnerabilities)
   - 3-5 immediate actions the investor should take

2. **Risk Analysis**:
   - **Concentration Risk**: Assess level (low/medium/high/critical), explain concerns about over-concentration in specific assets/protocols/chains, provide specific recommendations
   - **Protocol Risk**: Identify high-risk protocol exposures with specific reasoning, suggest risk mitigation strategies
   - **Yield Sustainability**: Evaluate what percentage of yield comes from sustainable sources vs incentives, assess outlook

3. **Optimization Recommendations**:
   - **Rebalancing**: For 3-5 current positions, suggest whether to reduce/maintain/increase with specific target allocations and clear reasoning
   - **New Opportunities**: Recommend 3-5 specific vaults from the available list that would improve the portfolio, with suggested allocation percentages (must total less than 100% of portfolio) and detailed benefits
   - **Exit Recommendations**: Identify any positions that should be exited (immediate/near-term/monitor) with reasoning and alternative suggestions

4. **Diversification Strategy**:
   - Assign a diversification score (0-100) and target score
   - Identify gaps in diversification (assets, protocols, chains, strategies)
   - Provide specific actions to improve diversification in each category

5. **Yield Optimization**:
   - Calculate current portfolio yield and potential optimized yield
   - Suggest 2-3 optimization paths with expected yield increase, risk tradeoffs, and specific steps

6. **Action Plan**:
   - **Immediate** (next 7 days): 2-3 prioritized actions with expected impact
   - **Near-term** (next 30 days): 2-3 prioritized actions with expected impact  
   - **Strategic** (next 90 days): 2-3 prioritized actions with expected impact

CRITICAL REQUIREMENTS:
- All vault recommendations MUST reference specific vault IDs and names from the available vaults list
- All allocation percentages must be realistic (typically 5-20% per position)
- All reasoning must be specific to this portfolio's actual positions and exposures
- Focus on actionable, implementable recommendations
- Consider risk-adjusted returns, not just raw APY

Return the analysis as a JSON object matching this exact structure:

{
  "executiveSummary": {
    "overallAssessment": "detailed paragraph assessment",
    "portfolioHealth": "excellent|good|fair|concerning",
    "keyStrengths": ["strength 1", "strength 2", ...],
    "keyWeaknesses": ["weakness 1", "weakness 2", ...],
    "immediateActions": ["action 1", "action 2", ...]
  },
  "riskAnalysis": {
    "concentrationRisk": {
      "level": "low|medium|high|critical",
      "assessment": "detailed assessment",
      "concerns": ["concern 1", "concern 2"],
      "recommendations": ["rec 1", "rec 2"]
    },
    "protocolRisk": {
      "assessment": "detailed assessment",
      "highRiskExposures": [
        {
          "protocol": "protocol name",
          "exposure": percentage as number,
          "riskScore": score as number,
          "reasoning": "why this is concerning"
        }
      ],
      "recommendations": ["rec 1", "rec 2"]
    },
    "yieldSustainability": {
      "assessment": "detailed assessment",
      "incentiveDependence": percentage as number 0-100,
      "sustainabilityScore": score as number 0-100,
      "outlook": "forward looking analysis"
    }
  },
  "optimizationRecommendations": {
    "rebalancing": [
      {
        "action": "reduce|maintain|increase",
        "currentVault": "exact vault name from portfolio",
        "currentAllocation": percentage as number,
        "targetAllocation": percentage as number,
        "reasoning": "specific reasoning"
      }
    ],
    "newOpportunities": [
      {
        "vaultId": "exact vault id from available vaults",
        "vaultName": "exact vault name from available vaults",
        "protocol": "protocol name",
        "apy": number,
        "riskScore": number,
        "suggestedAllocation": percentage as number (5-20),
        "reasoning": "why this vault fits the portfolio",
        "benefits": ["benefit 1", "benefit 2"]
      }
    ],
    "exitRecommendations": [
      {
        "vaultId": "vault id if known",
        "vaultName": "exact vault name from portfolio",
        "currentAllocation": percentage as number,
        "urgency": "immediate|near-term|monitor",
        "reasoning": "why exit is recommended",
        "alternativeSuggestion": "optional alternative vault name"
      }
    ]
  },
  "diversificationStrategy": {
    "currentScore": number 0-100,
    "targetScore": number 0-100,
    "gaps": ["gap 1", "gap 2"],
    "specificActions": [
      {
        "category": "asset|protocol|chain|strategy",
        "currentExposure": "description of current",
        "targetExposure": "description of target",
        "actions": ["action 1", "action 2"]
      }
    ]
  },
  "yieldOptimization": {
    "currentYield": weighted average portfolio yield as number,
    "potentialYield": optimized yield as number,
    "optimizationPaths": [
      {
        "description": "path description",
        "expectedYieldIncrease": percentage points as number,
        "riskTradeoff": "risk assessment",
        "steps": ["step 1", "step 2"]
      }
    ]
  },
  "actionPlan": {
    "immediate": [
      { "priority": 1, "action": "action description", "expectedImpact": "impact description" }
    ],
    "nearTerm": [
      { "priority": 1, "action": "action description", "expectedImpact": "impact description" }
    ],
    "strategic": [
      { "priority": 1, "action": "action description", "expectedImpact": "impact description" }
    ]
  }
}`;

  try {
    const response = await spark.llm(prompt, 'gpt-4o', true);
    const insights = JSON.parse(response);
    return insights;
  } catch (error) {
    console.error('Failed to generate AI insights:', error);
    throw new Error('Failed to generate portfolio insights');
  }
}

export async function generateAIEnhancedPortfolioReport(
  positions: PositionsApiResponse,
  exposure: ExposureApiResponse,
  summary: SummaryApiResponse
): Promise<AIEnhancedPortfolioReport> {
  const topAssetConcentration = exposure.asset_breakdown[0]?.percentage || 0;
  const topProtocolConcentration = exposure.protocol_exposure[0]?.percentage || 0;
  const topChainConcentration = exposure.chain_exposure[0]?.percentage || 0;

  const herfindahlIndex = exposure.protocol_exposure.reduce(
    (sum, p) => sum + Math.pow(p.percentage / 100, 2),
    0
  );

  const weightedAPY = positions.positions.reduce(
    (sum, p) => sum + (p.apy * p.share_of_portfolio / 100),
    0
  );

  const insights = await generateAIInsights(positions, exposure, summary);

  return {
    portfolioId: positions.wallet_address,
    walletAddress: positions.wallet_address,
    generatedAt: new Date().toISOString(),
    currentState: {
      totalValue: positions.total_value,
      positionCount: positions.total_positions,
      overallRisk: summary.risk_metrics.overall_risk,
      averageAPY: weightedAPY,
      concentrationMetrics: {
        topAssetConcentration,
        topProtocolConcentration,
        topChainConcentration,
        herfindahlIndex,
      },
    },
    insights,
  };
}
