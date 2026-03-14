# DeFi Vault Intelligence Platform

A sophisticated institutional-grade analytics dashboard for DeFi yield vaults providing comprehensive risk analysis, portfolio tracking, and vault intelligence across multiple protocols and chains.

**Experience Qualities**:
1. **Professional** - Enterprise-grade interface with data density and clarity suitable for institutional investors and analysts
2. **Analytical** - Charts, metrics, and visualizations that surface actionable insights from complex DeFi data
3. **Trustworthy** - Clear risk indicators, transparent methodology, and reliable data presentation that builds confidence

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-view data analytics platform with sophisticated state management, real-time calculations, filtering systems, charting capabilities, and simulated API integrations. It manages vault data, portfolio positions, risk calculations, and historical metrics across multiple interconnected views.

## Essential Features

### Vault Explorer
- **Functionality**: Browse and analyze yield vaults across protocols with comprehensive filtering and sorting
- **Purpose**: Help users discover optimal yield opportunities while understanding associated risks
- **Trigger**: Landing on main dashboard or clicking "Vaults" navigation
- **Progression**: View vault table → Apply filters (chain/protocol/APY/risk) → Sort by columns → Click vault row → Navigate to detail page
- **Success criteria**: Users can quickly filter 50+ vaults down to their preferred criteria and identify top opportunities within 30 seconds

### Vault Detail View
- **Functionality**: Deep dive into individual vault metrics, strategy breakdown, risk analysis, and yield history
- **Purpose**: Provide comprehensive due diligence data for investment decisions
- **Trigger**: Clicking vault row in explorer table
- **Progression**: Click vault → View strategy description → Analyze risk breakdown → Review yield chart → Check dependencies → Return to explorer or view portfolio
- **Success criteria**: All critical vault data (strategy, risk factors, history, dependencies) visible without scrolling on desktop; mobile users can access all data via organized sections

### Risk Scoring Engine
- **Functionality**: Calculate composite risk score (0-10) based on protocol dependencies, oracle risk, upgradeability, and liquidity
- **Purpose**: Quantify vault safety to enable risk-adjusted decision making
- **Trigger**: Automatic calculation when viewing vault details or in vault explorer table
- **Progression**: User views vault → System evaluates 4 risk factors → Calculates weighted score → Displays score with color coding → Shows factor breakdown on hover/click
- **Success criteria**: Risk score accurately reflects security posture; scores are consistent and explainable via transparent factor breakdown

### Treasury Portfolio Analytics
- **Functionality**: Track and analyze wallet holdings across DeFi positions with vault allocations and protocol exposure
- **Purpose**: Monitor portfolio performance, diversification, and risk concentration
- **Trigger**: Clicking "Portfolio" navigation or entering wallet address
- **Progression**: Enter wallet address → View total value → See asset breakdown → Analyze vault positions → Review protocol exposure chart → Identify concentration risks
- **Success criteria**: Complete portfolio overview with accurate position values, clear exposure visualization, and actionable rebalancing insights

### Developer API Documentation
- **Functionality**: Interactive documentation for programmatic access to vault data, risk scores, and portfolio information
- **Purpose**: Enable developers to integrate vault intelligence into their applications
- **Trigger**: Clicking "API" navigation item
- **Progression**: View API overview → Browse endpoints → See request/response examples → Test with sample data → Copy integration code
- **Success criteria**: Developers understand all endpoints within 5 minutes; can copy working code examples

### Historical Data & Charts
- **Functionality**: Interactive time-series charts showing APY trends, TVL changes, and risk evolution
- **Purpose**: Identify yield stability and vault maturity through historical patterns
- **Trigger**: Viewing vault detail page or portfolio performance
- **Progression**: User views chart → Selects timeframe (7D/30D/90D/1Y) → Hovers for specific data points → Identifies trends → Makes informed decisions
- **Success criteria**: Charts load instantly, respond smoothly to interaction, and clearly communicate trends

## Edge Case Handling

- **No Vaults Found** - Display empty state with suggestion to clear filters or browse all vaults
- **Invalid Wallet Address** - Show validation error with format example and suggestion to try demo wallet
- **Missing Vault Data** - Display partial data with indicators for unavailable fields; show last updated timestamp
- **Extreme APY Values** - Flag suspicious yields (>1000% APY) with warning indicator and risk annotation
- **Loading States** - Show skeleton loaders for tables and charts; maintain layout stability during data fetching
- **Network Errors** - Display error message with retry button; fall back to cached data if available
- **Zero TVL Vaults** - Flag as inactive/deprecated with visual warning; exclude from default view but show in "All" filter
- **Mobile Navigation** - Collapse data tables to card views; use tabs for vault detail sections; sticky headers for filtering

## Design Direction

The design should evoke confidence, precision, and institutional sophistication. It should feel like a Bloomberg terminal meets modern fintech - data-dense yet readable, powerful yet intuitive. The interface needs to project authority and trustworthiness while remaining approachable for developers and analysts. Think dark trading terminals with strategic pops of color to highlight critical data, combined with the clean geometric precision of modern SaaS dashboards.

## Color Selection

The platform uses a sophisticated dark theme with high-contrast accents that emphasize data hierarchy and risk levels.

- **Primary Color**: Deep blue-violet `oklch(0.45 0.15 270)` - Conveys technology, trust, and depth; used for interactive elements and primary CTAs
- **Secondary Colors**: 
  - Dark slate background `oklch(0.12 0.01 240)` for main surfaces
  - Elevated card background `oklch(0.16 0.01 240)` for data containers
  - Border gray `oklch(0.25 0.01 240)` for subtle separations
- **Accent Color**: Vibrant cyan `oklch(0.75 0.15 195)` - High-tech highlighting for critical metrics, active states, and data visualization emphasis
- **Risk Gradient Colors**:
  - Low risk (0-3): Green `oklch(0.70 0.20 145)` 
  - Medium risk (4-6): Amber `oklch(0.75 0.18 85)`
  - High risk (7-10): Red `oklch(0.65 0.24 25)`
- **Foreground/Background Pairings**: 
  - Primary Blue-Violet `oklch(0.45 0.15 270)`: White text `oklch(0.98 0 0)` - Ratio 7.2:1 ✓
  - Dark Slate `oklch(0.12 0.01 240)`: Light gray text `oklch(0.85 0.01 240)` - Ratio 10.5:1 ✓
  - Accent Cyan `oklch(0.75 0.15 195)`: Dark slate text `oklch(0.12 0.01 240)` - Ratio 8.9:1 ✓
  - Card Background `oklch(0.16 0.01 240)`: Light gray text `oklch(0.85 0.01 240)` - Ratio 8.2:1 ✓

## Font Selection

Typography should project technical precision and professional authority while maintaining excellent readability across dense data tables and detailed analytics.

- **Primary Font**: **Space Grotesk** - A modern geometric sans-serif with technical character, perfect for UI elements, headings, and metrics. Its slightly quirky letterforms add personality without sacrificing professionalism.
- **Monospace Font**: **JetBrains Mono** - For addresses, contract data, numerical values, and code snippets. Its excellent digit differentiation is crucial for financial data.

**Typographic Hierarchy**:
- H1 (Page Title): Space Grotesk Bold/32px/tight (-0.02em) letter spacing
- H2 (Section Headers): Space Grotesk Semibold/24px/tight letter spacing  
- H3 (Card Headers): Space Grotesk Medium/18px/normal letter spacing
- Body (Descriptions): Space Grotesk Regular/15px/relaxed (1.6) line height
- Data Labels: Space Grotesk Medium/13px/uppercase/wide (0.05em) tracking
- Numerical Data: JetBrains Mono Medium/14px/tabular numbers
- Addresses/Hashes: JetBrains Mono Regular/13px/normal
- Small UI Text: Space Grotesk Regular/12px/normal

## Animations

Animations should feel precise and data-driven - quick, purposeful transitions that guide attention without adding frivolous delay. The platform should feel responsive and professional, using motion to indicate state changes, data updates, and hierarchical relationships. Subtle hover states on interactive elements reinforce clickability. Chart animations should draw in smoothly to suggest data loading. Risk score changes should pulse briefly to draw attention. Page transitions should be near-instantaneous with subtle fade-ins for new content.

## Component Selection

**Components**:
- **Table** - Core component for vault explorer with sortable columns, custom cell renderers for risk scores and APY badges
- **Card** - Elevated data containers for vault details, portfolio metrics, and risk breakdowns
- **Tabs** - Organize vault detail sections (Overview, Risk, History, Strategy) and portfolio views
- **Badge** - Color-coded risk levels, chain indicators, protocol tags with custom color mapping
- **Button** - Primary (cyan accent), secondary (transparent with border), icon-only for actions
- **Input** - Search and filter fields with icons, wallet address entry with validation
- **Select** - Dropdown filters for chain, protocol, risk range with multi-select support
- **Dialog** - Wallet connection modal, risk methodology explainer, settings
- **Tooltip** - Contextual help for risk factors, metric definitions, abbreviated values
- **Separator** - Subtle dividers between metric groups and card sections
- **Scroll Area** - Handle long lists of dependencies and protocol interactions
- **Progress** - Risk factor contribution bars, portfolio allocation visualizations
- **Skeleton** - Loading states for tables, charts, and cards maintaining layout stability

**Customizations**:
- Custom **LineChart** component using D3 for yield history with interactive tooltips and zoom
- Custom **RiskGauge** component showing 0-10 score with color gradient arc visualization  
- Custom **DonutChart** for portfolio allocation using D3 with animated segments
- Custom **MetricCard** for highlighting key numbers (TVL, APY, risk) with trend indicators
- Custom **VaultCard** mobile-optimized card view for vault explorer on small screens

**States**:
- Buttons: Default (solid cyan bg), hover (slightly lighter + lift), active (pressed down), disabled (50% opacity)
- Table rows: Default (transparent), hover (elevated card bg + subtle border), selected (primary color border + bg tint)
- Inputs: Default (border input color), focus (cyan ring + brighter border), error (red border + error text), success (green border)
- Risk badges: Color changes based on score range with corresponding background tint and border

**Icon Selection**:
- Vault: `Vault` from Phosphor (bold weight)
- Risk: `ShieldWarning` for risk indicators, `ShieldCheck` for low risk
- Portfolio: `Wallet` for wallet/portfolio sections
- Charts: `ChartLine` for analytics, `TrendUp`/`TrendDown` for performance
- Filters: `Funnel` for filter controls, `SortAscending`/`SortDescending` for sorting
- Chains: `Link` for blockchain indicators, `Network` for protocol connections  
- Info: `Info` for tooltips and methodology explainers
- External: `ArrowSquareOut` for external links to protocol sites
- Search: `MagnifyingGlass` for search inputs
- Copy: `Copy` for copying addresses/data

**Spacing**:
- Card padding: `p-6` (24px) for desktop, `p-4` (16px) for mobile
- Section gaps: `gap-8` (32px) between major sections
- Card gaps: `gap-4` (16px) between cards in grid
- Inline gaps: `gap-2` (8px) for badges, icons, small UI elements  
- Table cell padding: `px-4 py-3` for comfortable data density

**Mobile**:
- Vault table converts to stacked cards showing key metrics (protocol, APY, TVL, risk)
- Filters collapse into drawer/sheet component accessed via icon button
- Vault detail tabs become vertical accordion sections
- Charts scale to full width with adjusted height ratios
- Portfolio metrics stack vertically with full-width allocation chart
- Navigation becomes hamburger menu with slide-out drawer
- Sticky search/filter bar at top with key controls
- Reduced padding throughout (`p-4` → `p-3`, `gap-8` → `gap-4`)
