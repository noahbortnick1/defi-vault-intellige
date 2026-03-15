# Yield Terminal - Institutional DeFi Intelligence Platform

> Rankings, due diligence reports, and portfolio analytics for confident capital allocation

## Overview

Yield Terminal is an institutional-grade platform for DeFi vault analysis and allocation decisions. The platform transforms vault discovery into actionable intelligence through intelligent rankings and comprehensive due diligence reports.

## Core Product Modules

### 🏆 Vault Rankings (Decision Layer)

The ranking system answers the critical question: **"Show me the best USDC deployments under my risk constraints"**

**Features:**
- Multi-dimensional scoring across 6 factors (APY, risk, liquidity, audit quality, dependency complexity, incentive dependence)
- 4 ranking modes optimized for different strategies:
  - **Risk-Adjusted**: Balanced for conservative allocations
  - **Highest Yield**: Maximum APY optimization
  - **Institutional Fit**: Audit quality and liquidity focus
  - **Best Liquidity**: Deep TVL for large positions
- Real-time filtering by asset, chain, protocol, and risk band
- Score transparency with reasoning for every ranking

**Use Case:**
```
A DAO treasury manager needs to deploy $2M USDC at low risk
→ Select "Institutional Fit" mode
→ Filter: asset=USDC, riskBand=low
→ Top 5 ranked vaults displayed with scores
→ Generate DD report on top choice
→ Confident allocation decision in minutes
```

### 📋 DD Reports (Diligence Layer)

Comprehensive reports that justify allocation decisions from screening to recommendation.

**Report Types:**

1. **Vault DD Report**
   - Strategy analysis (description, complexity, mechanism)
   - Yield decomposition (real vs. incentive sustainability)
   - Dependency mapping (complexity, critical dependencies)
   - Contract risk (audits, upgradeability, admin controls)
   - Liquidity profile (depth, exit capacity, concentration)
   - Overall risk breakdown with factor explanations
   - Red flags and recommendations

2. **Portfolio Report**
   - Position summary and largest holdings
   - Exposure analysis (asset, protocol, chain, strategy)
   - Concentration risk (Herfindahl Index, top-3 concentration)
   - Diversification score and recommendations
   - Yield attribution

3. **Allocation Report**
   - Optimized vault selections for target asset/risk
   - Position sizing with rationale
   - Liquidity constraints (max single vault, max protocol exposure)
   - Downside considerations

**Use Case:**
```
Institutional LP needs board approval for Morpho USDC allocation
→ Generate Vault DD Report
→ Export professional report with all risk factors
→ Present clear recommendation with transparent methodology
→ Board approves based on comprehensive analysis
```

### 🔍 Vault Explorer (Discovery Layer)

Browse and filter 100+ DeFi yield opportunities across protocols and chains.

- Multi-dimensional filtering (chain, asset, protocol, strategy, risk, TVL, APY)
- Watchlist with persistence
- Navigate to rankings or detailed analysis
- Saved views for repeated workflows

### 💼 Portfolio / Treasury (Monitoring Layer)

Track positions with exposure analysis and concentration risk assessment.

- Multi-wallet portfolio tracking
- Asset, protocol, and chain exposure breakdowns
- Concentration risk monitoring
- Generate portfolio reports
- Rebalancing triggers

### 🔌 Developer API (Integration Layer)

RESTful API for all platform features.

**Endpoints:**
```
GET /api/v1/rankings
GET /api/v1/rankings?mode=risk_adjusted&asset=USDC&chain=ethereum
GET /api/v1/reports/vault/:address
GET /api/v1/reports/portfolio/:wallet
GET /api/v1/reports/allocation/:wallet
GET /api/v1/vaults
GET /api/v1/portfolios/:address
```

**Rate Limits:**
- Free: 100 requests/day
- Pro: 1,000 requests/day
- Team: 10,000 requests/day
- Institutional: Unlimited

## Product Workflow

### Discovery → Ranking → Report → Allocation

```
1. Browse vaults in Explorer or use Rankings directly
2. Select ranking mode based on strategy (risk-adjusted, highest yield, etc.)
3. Apply filters (asset, chain, risk band)
4. Review top-ranked vaults with scoring rationale
5. Generate DD report on selected vault
6. Review comprehensive analysis (strategy, risk, liquidity)
7. Make allocation decision with confidence
8. Monitor position in Portfolio tracker
```

## Ranking Algorithm

### Composite Scoring

Each vault receives a 0-100 score based on weighted factors:

**Risk-Adjusted Mode (Default):**
- APY: 25% weight
- Risk Score: 35% weight (inverted: 10 - vaultRisk)
- Liquidity: 20% weight
- Audit Quality: 10% weight
- Dependency Complexity: 5% weight
- Incentive Dependence: 5% weight

**Score Components:**
1. **APY Score**: Normalized to 100 (capped at 50% max APY)
2. **Risk Score**: Inverted and scaled (lower vault risk = higher score)
3. **Liquidity Score**: Based on TVL depth and exit capacity
4. **Audit Score**: Number of audits × 20, bonus for top-tier firms
5. **Dependency Score**: Decreases with complexity (90 for 1 dep, 75 for 2, etc.)
6. **Incentive Score**: Real yield percentage × 100

### Example Output

```
Rank 1: Morpho USDC Optimizer
Overall Score: 84.2
APY: 8.9%
Risk: Medium (3.4/10)
Liquidity: 8.5/10
Audits: 3 (including Trail of Bits)

Rationale: Risk-adjusted score prioritizes safety (medium risk), 
strong yield, excellent liquidity, well-audited
```

## Technical Architecture

### Core Libraries

**Ranking System** (`src/lib/ranking.ts`)
- `rankVaults()`: Main ranking algorithm
- `filterAndRankVaults()`: Combined filtering and ranking
- Normalization functions for each score component
- Transparent reasoning generation

**Report Generation** (`src/lib/reports.ts`)
- `generateVaultDDReport()`: Comprehensive vault analysis
- `generatePortfolioDDReport()`: Portfolio exposure and risk
- `generateAllocationReport()`: Optimized recommendations

**Data Types** (`src/lib/types.ts`)
- RankingMode, RankingScore, RankedVault
- VaultDDReport, PortfolioDDReport, AllocationReport
- Comprehensive type safety for all features

### Components

**Rankings** (`src/components/RankingsPage.tsx`)
- Mode selection with descriptions
- Real-time filtering
- Ranked vault display with scores
- One-click report generation

**Reports** 
- `VaultReportView.tsx`: Vault DD report viewer
- `PortfolioReportView.tsx`: Portfolio analysis viewer

## Business Model

### Target Users

**DAO Treasuries**
- Need: Confident allocation decisions with board-ready documentation
- Value: Rankings + DD reports reduce due diligence from weeks to hours

**Hedge Funds**
- Need: Rapid opportunity identification and risk assessment
- Value: Multi-mode rankings optimize for different mandate types

**Family Offices**
- Need: Conservative allocations with institutional quality standards
- Value: "Institutional Fit" mode + concentration risk monitoring

**Protocol Teams**
- Need: Competitive positioning and improvement roadmap
- Value: API access for governance dashboards and analytics

### Monetization

**Free Tier**
- Rankings (limited filters)
- Basic vault data
- Public API (100 req/day)

**Pro Tier** ($299/mo)
- Full rankings with all modes
- DD report generation (10/month)
- Enhanced API (1k req/day)

**Team Tier** ($899/mo)
- Unlimited reports
- Portfolio analytics
- API (10k req/day)
- Priority support

**Institutional** (Custom)
- Custom ranking weights
- White-label reports
- Unlimited API
- Dedicated support
- Custom integrations

## Competitive Advantages

### 1. Intelligent Rankings (Not Just Lists)
- Multi-dimensional scoring answers "best for X" queries
- Mode switching optimizes for different strategies
- Transparent reasoning builds trust

### 2. Automated DD Reports (Not Manual Research)
- Comprehensive analysis in seconds
- Board-ready formatting
- Consistent methodology

### 3. Discovery Engine Moat
- 90-95% vault coverage across all chains
- Three-layer discovery (aggregators + registries + onchain)
- No manual curation required

### 4. End-to-End Workflow
- Discovery → Ranking → Report → Allocation
- Single platform replaces multiple tools
- API enables custom integrations

## Development

### Getting Started

```bash
npm install
npm run dev
```

### Project Structure

```
src/
├── lib/
│   ├── ranking.ts       # Ranking algorithms
│   ├── reports.ts       # Report generation
│   ├── types.ts         # Type definitions
│   └── mockData.ts      # Seed data
├── components/
│   ├── RankingsPage.tsx         # Rankings interface
│   ├── VaultReportView.tsx      # Vault DD viewer
│   ├── PortfolioReportView.tsx  # Portfolio viewer
│   ├── VaultExplorer.tsx        # Discovery interface
│   └── PortfolioApiView.tsx     # Portfolio tracker
└── App.tsx              # Main application
```

### Key Features

- **Type Safety**: Full TypeScript coverage
- **State Management**: React hooks with useKV persistence
- **Styling**: Tailwind + shadcn components
- **Performance**: Memoized rankings, sub-second filtering

## Roadmap

### Phase 1: Core Features ✅
- [x] Multi-mode rankings
- [x] Vault DD reports
- [x] Portfolio reports
- [x] API structure

### Phase 2: Enhancement (Q2 2024)
- [ ] Saved ranking views with persistence
- [ ] PDF export for reports
- [ ] Historical ranking tracking
- [ ] Alert system for rank changes

### Phase 3: Advanced (Q3 2024)
- [ ] Custom ranking weights
- [ ] Portfolio optimizer
- [ ] Allocation backtesting
- [ ] Risk scenario modeling

### Phase 4: Scale (Q4 2024)
- [ ] Multi-user workspaces
- [ ] White-label reports
- [ ] Custom integrations
- [ ] Enterprise SSO

## Documentation

- [Rankings & Reports Architecture](./RANKINGS_AND_REPORTS.md)
- [Product Requirements](./PRD.md)
- [API Documentation](./docs/api.md)
- [Discovery Engine](./DISCOVERY_ENGINE.md)

## Support

- Documentation: `/docs` in-app
- API Docs: View in platform at `/docs`
- Issues: GitHub Issues
- Enterprise: Contact sales

## License

Proprietary - All rights reserved

---

**Yield Terminal**: From vault discovery to confident allocation decisions
