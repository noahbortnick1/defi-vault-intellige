# Yield Terminal - Architecture Summary

## System Overview

Yield Terminal is an institutional DeFi intelligence platform with a clean separation between presentation, business logic, and data layers.

## Component Architecture

### Core Application (`App.tsx`)
- **Routing**: Simple page-state routing for fast navigation
- **Nav Bar**: Persistent navigation with role-appropriate links
- **Landing Page**: Marketing-focused with value props and CTAs
- **Pricing Page**: Four-tier pricing (Free/Pro/Team/Institutional)
- **Docs Page**: Methodology and API documentation

### Feature Components

#### `VaultExplorer.tsx`
Dense table view for browsing 100+ vaults with:
- Multi-dimensional filtering (chain, asset, protocol, strategy, risk, institutional-only)
- Real-time search across name, protocol, asset
- Sortable columns (TVL, APY, risk score)
- Active filter count with clear-all
- Watchlist quick-add from table
- Click-through to detail view

**Key UX**: Information-dense cards with hover states, institutional badges, verified shields, and at-a-glance metrics.

#### `VaultDetail.tsx`
Comprehensive single-vault due diligence with tabbed interface:
- **Overview**: Strategy description, vault details, protocol info
- **Yield Analysis**: APY decomposition with sustainability indicators, visual breakdown
- **Risk Assessment**: Factor-by-factor scoring with explanations and mitigations
- **Dependencies**: External protocol dependencies with criticality levels
- **Security**: Audit history with issue counts and report links

**Key UX**: Red flag warnings at top, generate report CTA, watchlist toggle, back navigation.

#### `YieldRadar.tsx`
Real-time event feed showing:
- Event cards with severity badges (critical/high/medium/low)
- Icon-coded event types (spike/drop/warning/new)
- Before/after values with % change
- "Why it matters" institutional context
- Filter by event type, severity, chain
- Click-through to affected vault

**Key UX**: Chronological feed, color-coded severity, contextual explanations, actionable intelligence.

#### `PortfolioView.tsx`
Multi-portfolio analytics dashboard:
- Portfolio selector dropdown (DAO/Fund/Family Office demos)
- High-level metrics: net worth, 24h change, total yield, risk score
- Position-level breakdown with yield tracking
- Four-dimensional exposure analysis:
  - Asset allocation
  - Protocol concentration
  - Strategy diversification
  - Chain distribution
- Risk assessment cards with recommendations

**Key UX**: Progress bars for exposures, concentration risk warnings, export functionality.

## Data Layer

### Type System (`lib/types.ts`)
Comprehensive TypeScript interfaces for:
- **Vault**: 30+ fields including risk factors, dependencies, audits, governance
- **Portfolio**: Positions, exposures, metrics
- **RadarEvent**: Type, severity, metadata, context
- **Protocol**: Metadata, TVL, maturity, audit summary
- Plus enums for chains, assets, strategies, risk levels, event types

### Mock Data (`lib/mockData.ts`)
Production-quality demo data:
- **6 detailed vaults** across major protocols (Aave, Morpho, Pendle, Yearn, Spark, Beefy)
- **10 protocols** with full metadata
- **8 radar events** with realistic scenarios
- **3 portfolios** representing different institutional profiles
- **Getter functions** (`getVaultById`, `getPortfolioById`) for easy API migration

### Utilities (`lib/format.ts`)
Formatting and helper functions:
- Currency formatting with K/M/B suffixes
- Percentage formatting
- Date/time formatting with relative ("2h ago")
- Address truncation
- Risk color/badge helpers
- Chain name mapping
- Portfolio metrics calculation

## State Management

### Persistent State (useKV)
- **Watchlist**: User's saved vaults (array of vault IDs)
- Future: user preferences, saved filters, custom alerts

### Local State (useState)
- Current page/route
- Selected vault/portfolio IDs
- Filter states (search, chain, risk, etc.)
- UI state (expanded sections, etc.)

**Pattern**: Persistent data uses `useKV` with functional updates, ephemeral UI state uses regular `useState`.

## Styling System

### Theme (`index.css`)
- **Dark-first**: Deep blue backgrounds (oklch(0.12 0.01 240))
- **Accents**: Cyan for actions (oklch(0.68 0.15 200))
- **Risk colors**: Green/yellow/red semantic palette
- **Typography**: IBM Plex Sans (UI), JetBrains Mono (code)
- **Sizing**: Text metrics class (20px/600), captions (12px/uppercase)

### Component Patterns
- **Cards**: Border-2 on hover, accent borders for emphasis
- **Badges**: Outline for metadata, filled for status/risk
- **Buttons**: Ghost for nav, outline for secondary, accent for primary
- **Progress bars**: Thin (h-2) with accent fill for exposure visualizations

## Risk Scoring Algorithm

Weighted factor model (0-10 scale):

```
Total Risk Score = Σ (Factor Score × Weight)

Factors:
- Smart Contract Security (30%): Audits, complexity, history
- Liquidity Risk (25%): TVL, withdrawal capacity, utilization  
- Market Risk (20%): Volatility, depeg, sustainability
- Protocol Stability (15%): Maturity, TVL trend, governance
- Governance & Admin (10%): Controls, timelocks, upgradeability
```

Each factor includes:
- 0-10 numeric score
- Weight percentage
- Contribution to total
- Explanation text
- Mitigation list

**Institutional Grade Criteria**:
- Risk score ≤ 4.0
- TVL ≥ $50M
- Verified status

## Yield Decomposition

APY broken down by source type:
- **Real Yield**: Sustainable protocol revenue (fees, interest)
- **Incentive Yield**: Token rewards (may decline)
- **Fee Yield**: Trading fees, borrow interest
- **Base Yield**: Core emissions

Each source tagged with:
- Sustainability flag (boolean)
- Token denomination
- Description
- APY contribution

## API-Ready Patterns

All data access abstracted through getters:

```typescript
// Current (mock):
const vault = getVaultById(id);

// Future (API):
const vault = await api.getVault(id);
```

Components consume data via props or context, never directly import VAULTS/PORTFOLIOS arrays. Ready for:
- REST API integration
- GraphQL queries  
- WebSocket live updates
- Service layer with caching

## Performance Considerations

- **Memoization**: `useMemo` on expensive filters/sorts
- **Lazy loading**: Components only rendered when needed
- **Debounced search**: (Not yet implemented, but pattern exists in format.ts)
- **Virtual scrolling**: Future enhancement for 1000+ vault tables

## Extensibility Points

### Easy Additions
1. **Comparison view**: Select 2-4 vaults, show side-by-side matrix
2. **Historical charts**: Add recharts with time-series data
3. **Report generation**: Render vault/portfolio data to printable format
4. **Alert configuration**: UI for setting thresholds, channels
5. **Wallet connection**: Live portfolio from wallet address
6. **Search palette**: CMD+K command interface

### Requires Backend
1. **Real-time data**: WebSocket for live APY/TVL updates
2. **User accounts**: Auth, workspaces, role management
3. **Custom reports**: PDF generation service
4. **Alert delivery**: Email/webhook infrastructure
5. **API access**: Rate limiting, key management
6. **Vault discovery**: Actual on-chain indexing pipeline

## Security Considerations

- No API keys or secrets in frontend code
- Wallet connections use standard libraries (future)
- All user data stored in Spark KV (encrypted at rest)
- No PII collected in demo mode
- HTTPS required for production

## Deployment Notes

### Build
```bash
npm run build
```
Outputs to `dist/` ready for static hosting.

### Environment
- No environment variables required for demo mode
- Future: `VITE_API_URL` for backend endpoint
- Future: `VITE_WALLET_CONNECT_ID` for web3 features

### Hosting
Works on any static host:
- Vercel
- Netlify  
- Cloudflare Pages
- AWS S3 + CloudFront
- GitHub Pages

## Analytics & Monitoring

Recommended instrumentation points:
- Page views (landing, vaults, detail, portfolio, radar)
- Vault detail views (which vaults get most attention)
- Watchlist adds (user interest signals)
- Filter usage (understand user search patterns)
- Portfolio selector (which demo portfolio gets used)
- Export/report actions (conversion events)

## Accessibility

Current status:
- Semantic HTML structure
- Color contrast meets WCAG AA (checked in PRD)
- Keyboard navigation via Tab
- Screen reader compatible (aria labels on icons)

Future improvements:
- Skip links
- Focus management on route changes
- Reduced motion support
- High contrast mode

## Browser Compatibility

Targets:
- Chrome/Edge 100+
- Firefox 100+
- Safari 15+

Uses modern features:
- CSS Grid/Flexbox
- oklch() colors
- :has() selector (progressive enhancement)

## Development Workflow

```bash
# Install
npm install

# Dev with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

## Testing Strategy (Future)

Recommended coverage:
- **Unit tests**: Utility functions (format.ts), risk calculations
- **Integration tests**: Component filtering, sorting, navigation
- **E2E tests**: Critical paths (vault detail, portfolio view)
- **Visual regression**: Screenshot diffing on UI changes

## Documentation

- `YIELD_TERMINAL_PRD.md`: Product requirements and design decisions
- `README_YIELD_TERMINAL.md`: User-facing setup and features guide
- This file: Architecture and developer guide
- Inline code comments: Minimal, code is self-documenting

---

## Summary

Yield Terminal is architected as a production-ready institutional SaaS platform with:
- **Clean separation of concerns** (components, data, utilities)
- **Type-safe codebase** (TypeScript throughout)
- **API-ready patterns** (easy backend integration)
- **Institutional UX** (dense, analytical, explainable)
- **Extensible foundation** (clear patterns for new features)

The mock data layer provides realistic demo experience while the component architecture makes swapping to real APIs straightforward. The risk scoring methodology and yield decomposition represent genuine institutional DD requirements, not simplified retail UX.
