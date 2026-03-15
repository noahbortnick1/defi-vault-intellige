# Yield Terminal: Rankings & Reports Architecture

## Product Overview

Yield Terminal is now structured as a complete institutional decision-support platform with five first-class modules:

### Core Modules

1. **Vault Rankings** (Decision Layer)
   - Multi-dimensional scoring across 6 factors
   - 4 ranking modes for different allocation strategies
   - Filters by asset, chain, protocol, risk band
   - One-click report generation

2. **DD Reports** (Diligence Layer)
   - Vault DD Reports: Strategy, yield sources, dependencies, contract risk, liquidity
   - Portfolio Reports: Exposure analysis, concentration risk, diversification
   - Allocation Reports: Optimized recommendations with position sizing

3. **Vault Explorer** (Discovery Layer)
   - Browse and filter 100+ vaults
   - Multi-dimensional filtering
   - Watchlist and saved views
   - Navigate to rankings or reports

4. **Portfolio / Treasury** (Monitoring Layer)
   - Position tracking across protocols
   - Exposure analysis (asset, protocol, chain)
   - Generate portfolio reports

5. **Developer API** (Integration Layer)
   - RESTful endpoints for all features
   - Rankings, vaults, reports, portfolio data
   - Tiered rate limits

## Ranking System

### Ranking Modes

Each mode uses different weightings optimized for specific strategies:

**Risk-Adjusted (Default)**
- APY: 25%, Risk: 35%, Liquidity: 20%, Audit: 10%, Dependencies: 5%, Incentives: 5%
- Best for: Conservative allocations with balanced returns

**Highest Yield**
- APY: 60%, Risk: 15%, Liquidity: 10%, Audit: 5%, Dependencies: 5%, Incentives: 5%
- Best for: Maximum yield optimization

**Institutional Fit**
- APY: 15%, Risk: 30%, Liquidity: 25%, Audit: 20%, Dependencies: 5%, Incentives: 5%
- Best for: Institutional quality standards

**Best Liquidity**
- APY: 20%, Risk: 20%, Liquidity: 45%, Audit: 5%, Dependencies: 5%, Incentives: 5%
- Best for: Large position sizing with exit optionality

### Scoring Components

1. **APY Score**: Normalized to 0-100 (capped at 50% APY)
2. **Risk Score**: Inverted vault risk score (10 - riskScore) * 10
3. **Liquidity Score**: Vault liquidity score * 10
4. **Audit Score**: Based on audit count and top-tier auditors (max 100)
5. **Dependency Score**: Decreases with complexity (1 dep = 90, 2 = 75, 3 = 60, etc.)
6. **Incentive Score**: Real yield ratio * 100 (sustainability)

### Example Output

```
Rank 1: Morpho USDC Optimizer
Score: 84.2
APY: 8.9%
Risk: Medium (3.4/10)
Liquidity: 8.5/10

Rationale: Risk-adjusted score prioritizes safety (medium risk), strong yield, excellent liquidity, well-audited
```

## Report Types

### 1. Vault DD Report

**Summary Section**
- Recommendation (strong-buy, buy, hold, avoid)
- Key takeaways (3-5 bullet points)
- Overall score (0-100)

**Strategy Analysis**
- Description and mechanism
- Complexity assessment (low, medium, high)

**Yield Sources**
- Breakdown: Real yield vs. Incentive yield
- Sustainability assessment
- Source descriptions

**Dependencies**
- List with criticality ratings
- Dependency complexity score
- Critical dependency callouts

**Contract Risk**
- Upgradeability status
- Admin controls and timelock
- Audit history with firms and dates
- Security score (0-10)

**Liquidity Profile**
- Liquidity depth (Deep, Medium, Shallow)
- Exit capacity (High, Medium, Limited)
- Concentration risk assessment

**Red Flags**
- List of concerns requiring attention

**Overall Risk**
- Score (0-10) and band (low, medium, high)
- Factor breakdown with explanations

### 2. Portfolio DD Report

**Summary**
- Total value, position count
- Overall risk and diversification score
- Key findings

**Largest Positions**
- Top 5 positions by value
- Percentage of portfolio

**Exposure Analysis**
- By Asset: Value, percentage, count
- By Protocol: Value, percentage, count
- By Chain: Value, percentage, count
- By Strategy: Value, percentage, count

**Concentration Risk**
- Herfindahl Index (0-1 scale)
- Top 3 concentration percentage
- Analysis and recommendations

**Yield Analysis**
- Total yield and average per position
- Yield by source breakdown

### 3. Allocation Report

**Recommendations**
- Top 5 vaults with allocation amounts
- Percentage splits
- Rationale for each

**Methodology**
- Constraints and considerations
- Risk optimization approach

**Downside Considerations**
- Smart contract risk
- APY volatility
- Liquidity deterioration scenarios

**Liquidity Limits**
- Max single vault size (30% default)
- Max protocol exposure (40% default)
- Position sizing reasoning

## User Flows

### Ranking → Report → Allocation

1. User navigates to Rankings
2. Selects ranking mode (e.g., "Institutional Fit")
3. Applies filters (e.g., asset=USDC, riskBand=low)
4. Reviews ranked results
5. Clicks "DD Report" on top-ranked vault
6. Reviews comprehensive analysis
7. Makes allocation decision

### Portfolio → Report → Optimization

1. User navigates to Portfolio
2. Enters wallet address or loads saved portfolio
3. Reviews positions and exposure
4. Clicks "Generate Report"
5. Reviews concentration risk and recommendations
6. Generates allocation report for rebalancing

## API Endpoints

### Rankings
```
GET /api/v1/rankings
GET /api/v1/rankings?mode=risk_adjusted
GET /api/v1/rankings?asset=USDC&chain=ethereum&riskBand=low
```

### Reports
```
GET /api/v1/reports/vault/:address
GET /api/v1/reports/portfolio/:wallet
GET /api/v1/reports/allocation/:wallet?asset=USDC&risk=low&amount=1000000
```

### Vaults
```
GET /api/v1/vaults
GET /api/v1/vaults/:id
GET /api/v1/vaults/:id/risk
```

### Portfolio
```
GET /api/v1/portfolios/:address
GET /api/v1/radar/events
```

## Technical Implementation

### Ranking Algorithm (`src/lib/ranking.ts`)
- `rankVaults()`: Main ranking function
- `filterAndRankVaults()`: Combined filter + rank
- Normalization functions for each score component
- Reasoning generation for transparency

### Report Generation (`src/lib/reports.ts`)
- `generateVaultDDReport()`: Full vault analysis
- `generatePortfolioDDReport()`: Portfolio analytics
- `generateAllocationReport()`: Optimized recommendations

### Components
- `RankingsPage.tsx`: Rankings interface with mode selection
- `VaultReportView.tsx`: Vault DD report viewer
- `PortfolioReportView.tsx`: Portfolio report viewer

### Data Flow
1. User selects mode/filters → Rankings algorithm runs
2. Vaults scored and ranked → Results displayed with rationale
3. User requests report → Report generator creates structured analysis
4. Report displayed with all sections → User makes decision

## Business Value

### For Funds/DAOs
- **Rankings**: Answer "show me best USDC deployments under 4.0 risk" in seconds
- **Reports**: Board-ready DD documentation with clear recommendations
- **Portfolio**: Concentration risk monitoring and rebalancing triggers

### For Protocol Teams
- **Rankings**: Understand competitive positioning across dimensions
- **Reports**: Identify improvement areas (audits, liquidity, etc.)
- **API**: Integrate intelligence into governance dashboards

### For Developers
- **API**: Build allocation tools on top of Yield Terminal data
- **Reports**: Automate due diligence workflows
- **Rankings**: Create custom strategies and backtests

## Next Steps

1. **Saved Views**: Persist ranking filters and custom modes
2. **PDF Export**: Professional formatting for reports
3. **Portfolio Optimizer**: Automated allocation recommendations
4. **Alert System**: Notify on ranking changes or risk threshold breaches
5. **Historical Rankings**: Track ranking movements over time
6. **Custom Weights**: Let users define their own ranking criteria
