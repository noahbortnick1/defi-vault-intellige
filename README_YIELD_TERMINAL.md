# Yield Terminal

**Institutional DeFi Yield Intelligence Platform**

Yield Terminal is a production-quality institutional SaaS platform for DeFi yield intelligence, due diligence, and portfolio analytics. Built for DAOs, hedge funds, family offices, and protocol treasuries managing capital in DeFi.

## Overview

Yield Terminal provides:
- **Vault Explorer**: Browse and filter 100+ DeFi yield opportunities with advanced filtering
- **Explainable Risk Scoring**: Transparent risk assessments with factor-level breakdowns
- **Yield Decomposition**: Understand real yield vs incentives, sustainability analysis
- **Portfolio Analytics**: Monitor treasury exposure across assets, protocols, strategies, and chains
- **Yield Radar**: Real-time feed of meaningful vault state changes
- **DD Reports**: Generate institutional-grade due diligence reports

## Tech Stack

- **React 19** with TypeScript
- **Spark Runtime SDK** for state management and persistence
- **Tailwind CSS** for styling with custom institutional dark theme
- **shadcn/ui** components (v4)
- **Phosphor Icons** for consistent iconography
- **Vite** for build tooling

## Project Structure

```
src/
├── App.tsx                    # Main application with routing
├── index.css                  # Theme and global styles
├── components/
│   ├── VaultExplorer.tsx      # Vault browsing and filtering
│   ├── VaultDetail.tsx        # Single vault DD view
│   ├── YieldRadar.tsx         # Event feed
│   ├── PortfolioView.tsx      # Portfolio analytics
│   └── ui/                    # shadcn components
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── mockData.ts            # Realistic demo data
│   └── format.ts              # Formatting utilities
└── hooks/
    └── use-mobile.ts          # Responsive utilities
```

## Features

### Vault Intelligence
- **Comprehensive vault data** across Ethereum, Arbitrum, Base, Optimism, Polygon
- **Advanced filtering** by chain, asset, protocol, strategy, risk level
- **Institutional grade badging** for vaults meeting stringent criteria
- **Real-time APY decomposition** showing sustainable vs incentive yield
- **Liquidity scoring** for exit capacity assessment

### Risk Framework
Transparent risk scoring (0-10 scale) aggregating:
- **Smart Contract Security (30%)**: Audits, code complexity, track record
- **Liquidity Risk (25%)**: TVL depth, withdrawal capacity, utilization
- **Market Risk (20%)**: Asset volatility, depeg risk, incentive sustainability  
- **Protocol Stability (15%)**: Maturity, TVL history, governance
- **Governance & Admin (10%)**: Admin controls, timelocks, upgradeability

Each factor includes:
- Score with weighted contribution
- Plain-English explanation
- Specific mitigations
- Supporting evidence

### Portfolio Analytics
- **Multi-dimensional exposure analysis**: assets, protocols, strategies, chains
- **Concentration risk detection** with actionable recommendations
- **Blended portfolio metrics**: weighted APY, risk score, yield earned
- **Position-level details** with P&L tracking
- **Export-ready reports** for stakeholder communication

### Yield Radar
Real-time event feed tracking:
- APY spikes and drops
- TVL inflows and outflows  
- New vault launches
- Risk score changes
- Governance updates
- Liquidity warnings
- Incentive program changes

Each event includes:
- Severity classification (critical/high/medium/low)
- Before/after values with % change
- "Why it matters" explanation for institutional context
- Direct link to affected vault

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

## Architecture Notes

### State Management
- **useKV hook** from Spark SDK for persistent state (watchlist, preferences)
- **Local React state** for ephemeral UI state (filters, selections)
- All data persists between sessions automatically

### Data Layer
Currently uses comprehensive mock data in `src/lib/mockData.ts` with:
- 6+ fully-detailed vaults across protocols
- 3 demo portfolios (DAO, Hedge Fund, Family Office)
- 8+ realistic radar events
- 10+ protocols with metadata

**Production-ready adapter pattern**: All data access goes through getter functions (`getVaultById`, `getPortfolioById`, etc.) that can be swapped to API calls without changing component code.

### Routing
Client-side routing via page state in App.tsx. Clean, fast transitions without page reloads. Easily upgradeable to React Router when needed.

### Theme
Dark-first institutional theme with:
- **Deep blue backgrounds** (oklch color space for consistency)
- **Cyan accents** for actions and APY highlights  
- **Risk-appropriate colors**: green/yellow/red for risk bands
- **IBM Plex Sans** for UI, **JetBrains Mono** for addresses/code
- Optimized for dense data display and extended analysis sessions

## Demo Data

### Vaults
- **Aave V3 USDC**: Low-risk institutional lending (4.2% APY)
- **Morpho Aave V3 WETH**: Optimized lending with P2P matching (2.8% APY)
- **Pendle PT-sDAI**: Fixed-yield basis trade (8.5% APY, moderate risk)
- **Yearn Curve 3CRV**: LP farming with auto-compounding (6.8% APY)
- **Spark sDAI**: MakerDAO savings rate (5.0% APY, institutional grade)
- **Beefy Stargate USDC**: Bridge liquidity provision (7.2% APY, higher risk)

### Portfolios
- **Protocol DAO Treasury**: $85M conservative allocation (100% lending)
- **DeFi Hedge Fund Alpha**: $42.5M moderate risk across strategies  
- **Family Office Conservative**: $15.8M low-risk stablecoin focus

### Radar Events
- APY spike: Aave USDC rate increased 45% 
- TVL inflow: Spark sDAI receives $120M
- Liquidity warning: Pendle PT-sDAI depth reduced
- Risk change: Morpho score improved after audit
- And more...

## Design Philosophy

### Institutional Credibility
- Bloomberg-style information density
- Professional color palette and typography  
- No playful elements or meme aesthetics
- Serious, analytical tone throughout

### Explainability First
- Every score shows its derivation
- Risk factors include plain-English explanations
- "Why it matters" context on radar events
- No black-box algorithms

### Actionable Intelligence
- Data structured for decision-making
- Concentration risks highlighted prominently
- Sustainability assessments on yield sources
- Export and reporting capabilities

## Future Enhancements

When connecting to real data sources:

1. **Replace mock data** with API service layer
2. **Add historical charts** for APY and TVL trends
3. **Implement vault comparison** side-by-side
4. **Add alert configuration** with email/webhook delivery
5. **Build report generation** with PDF export
6. **Add wallet connection** for live portfolio tracking
7. **Implement search** with command palette
8. **Add user authentication** and multi-workspace support

## Browser Support

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires modern browser with ES2020+ support.

## License

Proprietary - Yield Terminal Platform

---

**Built for institutions. Powered by transparency.**
