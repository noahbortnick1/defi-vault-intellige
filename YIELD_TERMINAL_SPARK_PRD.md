# Yield Terminal - Institutional DeFi Intelligence Platform

A Bloomberg-grade due diligence and treasury analytics platform for institutional DeFi vault allocation.

**Experience Qualities**:
1. **Institutional** - Professional data density with premium typography and restrained color palette that conveys authority and precision without retail crypto aesthetics
2. **Explainable** - Every risk score, yield metric, and recommendation transparently shows its methodology and component factors with drill-down capability
3. **Efficient** - Information-dense analyst workstation with powerful filtering, comparison tools, and keyboard-first workflows for professional treasury managers

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)

This is a sophisticated multi-page institutional analytics platform requiring extensive data visualization, advanced filtering and comparison, portfolio analytics, automated risk scoring, report generation, and API-ready architecture. Built for funds, DAOs, and treasury managers allocating millions in DeFi capital.

## Essential Features

### Landing Page
- **Functionality**: Marketing homepage with hero, value proposition, feature showcase, platform statistics, pricing preview, institutional trust signals, and conversion CTAs
- **Purpose**: Establish credibility with institutional audience and convert treasury managers, fund analysts, and developers
- **Trigger**: User visits root URL
- **Progression**: Hero with "Know where DeFi yield comes from before you allocate" → Feature cards (risk scoring, yield decomposition, portfolio analytics) → Platform coverage stats → Target audience badges → CTA to explore vaults or view demo
- **Success criteria**: Professional appearance that builds trust, clear navigation to application, institutional positioning evident immediately

### Vault Explorer
- **Functionality**: High-density filterable table with 24+ vaults across chains, protocols, and strategies. Multi-dimensional filters (chain, asset, protocol, strategy, risk band, TVL range, APY range, institutional-grade only), sortable columns, saved views, watchlist toggles, compare checkboxes
- **Purpose**: Enable rapid screening and discovery of institutional-grade yield opportunities
- **Trigger**: User clicks "Explore Vaults" or navigates to /vaults
- **Progression**: Load table → Apply filters → Sort by metric → Toggle watchlist → Select compare → Navigate to detail
- **Success criteria**: Instant filtering, persistent watchlist via useKV, smooth navigation, clear risk/yield visibility

### Vault Detail Page
- **Functionality**: Comprehensive single-vault DD workstation with overview cards, strategy description, yield decomposition chart (base/fees/incentives), risk score with factor breakdown (smart contract, liquidity, protocol, dependency, governance), dependency graph, historical APY/TVL charts, audit coverage, governance controls, red flags panel, event feed
- **Purpose**: Provide complete due diligence data for confident allocation decisions
- **Trigger**: User clicks vault from explorer
- **Progression**: Load overview → Review strategy → Analyze yield sources → Examine risk factors → Check dependencies → View history → Assess red flags → Compare or generate report
- **Success criteria**: Every score shows explanation, yields show decomposition, clear path to comparison or report generation

### Vault Comparison
- **Functionality**: Side-by-side matrix comparing 2-4 vaults across all key metrics (APY, real yield, TVL, risk factors, liquidity, dependencies, audits, governance)
- **Purpose**: Enable direct comparison for allocation decisions
- **Trigger**: User selects vaults from explorer and clicks compare
- **Progression**: Select vaults → View comparison matrix → Highlight best/worst → Generate comparison report
- **Success criteria**: Clear visual hierarchy, best values highlighted, exportable comparison

### Portfolio / Treasury Analytics
- **Functionality**: Treasury exposure analysis with wallet input or demo portfolios (DAO Treasury, Hedge Fund, Family Office). Summary metrics (net worth, 24h change, yield earned), exposure breakdowns (asset, protocol, strategy, chain), risk summary, daily NAV chart, top positions table
- **Purpose**: Monitor and analyze existing DeFi treasury allocations
- **Trigger**: User navigates to Portfolio page
- **Progression**: Select demo portfolio → View summary → Analyze exposures → Review positions → Export report
- **Success criteria**: Accurate exposure calculations, clear concentration risk visibility, exportable snapshots

### Yield Radar
- **Functionality**: Real-time feed of meaningful vault events (APY spikes, TVL flows, risk changes, governance updates, liquidity deterioration). Filterable by event type, chain, protocol, severity
- **Purpose**: Surface important changes for monitoring and opportunity discovery
- **Trigger**: User navigates to Radar page
- **Progression**: View event feed → Filter by criteria → Click event → Navigate to affected vault
- **Success criteria**: Clear "why it matters" explanations, severity badges, smooth navigation

### Due Diligence Reports
- **Functionality**: Professional printable reports for vaults, comparisons, or portfolios. Sections: executive summary, strategy overview, yield sources, risk breakdown, dependencies, liquidity analysis, governance, audits, historical observations, red flags, recommendations
- **Purpose**: Export-ready DD documentation for investment committees
- **Trigger**: User clicks "Generate Report" from vault detail or comparison
- **Progression**: Generate report → Review sections → Export PDF or print
- **Success criteria**: Clean professional layout, comprehensive coverage, print-optimized

### Discovery Engine Panel
- **Functionality**: Visualize the automatic vault discovery system showing three layers (aggregators, protocol registries, onchain detection), discovery statistics, coverage metrics, recently discovered vaults
- **Purpose**: Demonstrate the technical moat and data freshness
- **Trigger**: User navigates to Discovery page or from navigation
- **Progression**: View architecture diagram → Review layer statistics → See recent discoveries → Explore discovered vaults
- **Success criteria**: Clear visualization of technical advantage, real coverage metrics

## Edge Case Handling

- **No vaults in filtered view**: Show empty state with filter reset button and suggestion to broaden criteria
- **Vault data unavailable**: Display partial data with "updating" badges and retry mechanism
- **Portfolio wallet not found**: Graceful error with demo portfolio suggestions
- **Comparison with single vault**: Prompt to add more vaults with suggestions
- **Report generation failure**: Retry mechanism with fallback to data export
- **Watchlist limit on free tier**: Upgrade prompt with tier comparison
- **Historical data gaps**: Show available data with gaps marked clearly

## Design Direction

The design should evoke **institutional trust, analytical precision, and professional sophistication**. Target feeling: Bloomberg Terminal meets modern SaaS, not retail crypto dashboard. Dark-first with restrained accent usage, dense information layouts with excellent hierarchy, premium typography, and zero playful elements.

## Color Selection

**Deep professional dark theme** with cyan accent for emphasis and data visualization colors optimized for financial charts.

- **Primary Color**: `oklch(0.35 0.06 240)` - Deep slate blue for structural elements and primary actions, communicates stability and institutional trust
- **Secondary Colors**: 
  - `oklch(0.25 0.02 240)` - Deeper slate for secondary actions
  - `oklch(0.22 0.015 240)` - Muted slate for de-emphasized areas
- **Accent Color**: `oklch(0.68 0.15 200)` - Bright cyan for CTAs, highlights, and key metrics, creates urgency without aggression
- **Foreground/Background Pairings**:
  - Background `oklch(0.12 0.01 240)`: Foreground `oklch(0.95 0.01 240)` - Ratio 14.5:1 ✓
  - Card `oklch(0.18 0.015 240)`: Card Foreground `oklch(0.95 0.01 240)` - Ratio 12.8:1 ✓
  - Accent `oklch(0.68 0.15 200)`: Accent Foreground `oklch(0.12 0.01 240)` - Ratio 9.2:1 ✓
  - Primary `oklch(0.35 0.06 240)`: Primary Foreground `oklch(0.95 0.01 240)` - Ratio 7.8:1 ✓

## Font Selection

**IBM Plex Sans** for UI and data (technical precision with excellent readability at small sizes) and **JetBrains Mono** for monospaced data (addresses, numbers, code). These fonts convey analytical sophistication without generic modern SaaS aesthetics.

- **Typographic Hierarchy**:
  - H1 (Page Title): IBM Plex Sans Bold / 36px / tight letter spacing (-0.02em)
  - H2 (Section Title): IBM Plex Sans SemiBold / 24px / normal spacing
  - H3 (Card Title): IBM Plex Sans SemiBold / 18px / normal spacing
  - Body: IBM Plex Sans Regular / 15px / 1.6 line height
  - Caption: IBM Plex Sans Medium / 12px / uppercase / 0.05em letter spacing
  - Metric: IBM Plex Sans SemiBold / 20px / tight line height
  - Monospace: JetBrains Mono Regular / 13px / 1.4 line height

## Animations

Animations should be **subtle and functional**, never decorative. Use for state transitions, loading feedback, and drawing attention to data updates. Maximum 300ms duration for most transitions. Focus on smooth filtering, data loading skeletons, and chart transitions.

## Component Selection

- **Components**: 
  - Tables: TanStack Table with shadcn Table styling for vault explorer and position lists
  - Cards: shadcn Card for metric summaries, vault overviews, feature highlights
  - Dialogs: shadcn Dialog for filters, comparisons, settings
  - Forms: React Hook Form + Zod + shadcn Form components for wallet input, alerts
  - Charts: Recharts for APY history, yield decomposition, portfolio allocation
  - Badges: shadcn Badge for risk scores, status indicators, chain labels
  - Buttons: shadcn Button with clear hierarchy (primary for main actions, secondary for supporting, ghost for nav)
  - Tabs: shadcn Tabs for switching between portfolio views, report sections
  - Tooltips: shadcn Tooltip for metric explanations, risk factor details
  
- **Customizations**:
  - Risk badge component with color-coded severity (low/medium/high)
  - Yield decomposition stacked bar with hover breakdown
  - Dependency graph visualization (custom D3 or simple node display)
  - Metric card with trend indicators and comparison values
  - Event feed item with severity styling and action links
  - Score explanation popover with factor breakdown
  
- **States**: 
  - Buttons: distinct hover (slight brightness increase), active (pressed inset shadow), disabled (reduced opacity), focus (cyan ring)
  - Inputs: subtle border on default, cyan border on focus, red border on error with message below
  - Table rows: hover background change, selected background distinct, clickable cursor
  - Cards: subtle hover elevation on interactive cards, static on informational
  
- **Icon Selection**: 
  - Phosphor icons exclusively for consistency
  - ChartBar for platform branding
  - Vault for vaults section
  - Lightning for radar/alerts
  - Briefcase for portfolio
  - TrendUp/TrendDown for performance
  - Warning for risk factors
  - ShieldCheck for audits/security
  - CurrencyDollar for financial metrics
  - Funnel for filters
  
- **Spacing**: 
  - Page padding: px-6 py-12 on desktop, px-4 py-6 on mobile
  - Card padding: p-6 for content cards, p-4 for compact cards
  - Grid gaps: gap-6 for major grids, gap-4 for tighter layouts, gap-2 for inline elements
  - Consistent use of space-y-4 for vertical stacks, space-x-4 for horizontal groups
  
- **Mobile**: 
  - Tables switch to card-based layout below 768px
  - Navigation collapses to hamburger menu
  - Filters move to bottom sheet
  - Charts adapt to full width with scrollable legends
  - Compare view shows one vault at a time with tabs
  - Reduce padding and font sizes proportionally
  - Sticky headers for key navigation elements
