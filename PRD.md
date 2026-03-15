# DeFi Vault Intelligence Platform

An institutional-grade due diligence and treasury analytics platform for DeFi yield vaults, built for funds, treasuries, and developers who need intelligent rankings, comprehensive DD reports, and data-driven allocation insights.

**Experience Qualities**:
1. **Professional** - Bloomberg-level data density and clarity with institutional typography and color choices that convey authority and precision
2. **Decisive** - Rankings and reports that support fast, confident allocation decisions with transparent methodology and clear recommendations
3. **Comprehensive** - Full due diligence from discovery to allocation with multi-dimensional scoring, dependency analysis, and risk decomposition

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-page institutional analytics platform with intelligent ranking algorithms, automated report generation, portfolio tracking, risk decomposition, and API integration. It requires sophisticated state management, routing, data modeling, and scoring systems comparable to professional financial software.

## Core Product Modules

The platform is organized around five first-class modules that form a complete workflow from discovery to allocation:

1. **Vault Rankings** - Decision layer for rapid vault selection using multi-dimensional scoring
2. **DD Reports** - Comprehensive due diligence reports with strategy, risk, and dependency analysis
3. **Vault Explorer** - Discovery and filtering of yield opportunities across protocols and chains
4. **Portfolio / Treasury** - Position tracking with exposure analysis and concentration risk assessment
5. **Developer API** - RESTful API for rankings, vault data, and report generation

## Essential Features

### Vault Rankings (Decision Layer)
- **Functionality**: Multi-dimensional vault ranking system with composite scoring based on APY, risk, liquidity, audit quality, dependency complexity, and incentive dependence
- **Purpose**: Enable rapid discovery and selection of optimal vault allocations under specific constraints - the "show me best USDC deployments under my risk constraints" use case
- **Trigger**: User navigates to Rankings from main nav or landing page
- **Progression**: Select ranking mode (risk-adjusted, highest yield, institutional fit, best liquidity) → Apply filters (asset, chain, protocol, risk band) → Review ranked results with scoring rationale → Navigate to vault detail or generate DD report
- **Success criteria**: Sub-second ranking recalculation, clear score explanations, filtering that preserves ranking order, one-click report generation

### DD Reports (Diligence Layer)
- **Functionality**: Automated generation of comprehensive due diligence reports including vault DD (strategy, yield sources, dependencies, contract risk, liquidity profile), portfolio reports (exposure analysis, concentration risk), and allocation reports (optimized recommendations)
- **Purpose**: Provide all analysis needed for allocation decisions in a structured, exportable format - from initial screening to final recommendation
- **Trigger**: User clicks "Generate Report" from rankings, vault detail, or portfolio pages
- **Progression**: Select report type → View generated report with all sections → Export as PDF or share link → Navigate to related vaults or portfolios
- **Success criteria**: Reports generated in <2 seconds, all key risk factors included with explanations, professional formatting suitable for board presentations, clear recommendations

### Vault Explorer
- **Functionality**: Filterable, sortable table of DeFi vaults with multi-dimensional filtering (chain, asset, protocol, strategy type, risk band, TVL, APY ranges)
- **Purpose**: Enable rapid discovery and initial screening of yield opportunities across the DeFi ecosystem
- **Trigger**: User navigates to Vaults page from main nav
- **Progression**: Load vault table → Apply filters (chain, protocol, risk, TVL, APY) → Sort by metric → Save view/add to watchlist → Click vault for details or rankings
- **Success criteria**: Sub-second filtering, ability to save custom views, watchlist persistence, smooth navigation to rankings and detail pages

### Vault Discovery Engine
- **Functionality**: Automatic vault discovery system with three layers (aggregators, protocol registries, onchain detection), strategy classification, and yield decomposition
- **Purpose**: Automatically find 90-95% of vaults across chains without manual curation - this is the technical moat
- **Trigger**: User navigates to Discovery page or system runs scheduled jobs
- **Progression**: Initialize engine → Run Layer 1 (aggregator seed) → Run Layer 2 (registry scan) → Run Layer 3 (onchain detection) → Deduplicate → Classify strategies → Display results with stats
- **Success criteria**: Discovery of vaults from all three sources, proper deduplication based on confidence scores, strategy classification with yield decomposition, real-time job status tracking

### Vault Detail Page
- **Functionality**: Comprehensive single-vault analysis with strategy breakdown, yield decomposition (base vs incentives), risk factor breakdown, dependency graph, historical charts, governance assessment, liquidity analysis
- **Purpose**: Provide all data needed for thorough due diligence on a specific vault
- **Trigger**: User clicks vault from explorer or watchlist
- **Progression**: Load vault summary → Review yield sources → Analyze risk factors → Check dependencies → View historical performance → Compare with similar vaults → Add to portfolio or generate report
- **Success criteria**: All key metrics visible without scrolling on desktop, expandable sections for deep dives, clear risk explanations, actionable compare/export options

### Portfolio / Treasury Page
- **Functionality**: Multi-vault portfolio tracking with wallet address input, aggregate exposure analysis (by asset, protocol, strategy), allocation visualization, daily NAV tracking, AI-enhanced optimization recommendations
- **Purpose**: Monitor and analyze existing DeFi treasury positions with concentration risk visibility and actionable rebalancing insights
- **Trigger**: User navigates to Portfolio page and inputs wallet address or loads saved portfolio
- **Progression**: Enter wallet address → Load positions → View aggregate exposure → Drill into asset/protocol/strategy breakdowns → Generate AI-enhanced report with optimization recommendations → Review allocations → Export snapshot
- **Success criteria**: Support for multiple wallet addresses, accurate exposure calculations, AI-generated insights in <5 seconds, actionable recommendations with specific vault suggestions, exportable reports (PDF/CSV)

### Due Diligence Report Page
- **Functionality**: Formatted, printable single-vault report with executive summary, risk assessment, dependency analysis, audit status, yield source breakdown, red flags
- **Purpose**: Generate shareable, professional documentation for investment committees and treasury operations
- **Trigger**: User clicks "Generate Report" from vault detail page
- **Progression**: Select vault → Generate report → Review sections → Export to PDF or print → Share with stakeholders
- **Success criteria**: Print-optimized layout, professional formatting, comprehensive risk disclosures, exportable format

### Documentation Hub
- **Functionality**: Multi-page docs covering risk methodology, data sources, API reference, coverage policy, calculation formulas
- **Purpose**: Build trust through transparency and enable API integration for technical users
- **Trigger**: User navigates to Docs from main nav or footer
- **Progression**: Browse doc sections → Read methodology → Review API endpoints → Copy integration examples
- **Success criteria**: Clear explanations, code examples, searchable content

### Onchain Wallet Tracker
- **Functionality**: Real-time onchain wallet tracking with Web3 RPC integration, scans wallet addresses for token balances and vault positions across multiple chains
- **Purpose**: Enable direct onchain position monitoring without relying on external APIs, providing trustless verification of wallet holdings
- **Trigger**: User navigates to Wallet Tracker from main nav and inputs wallet address
- **Progression**: Enter wallet address → Select chain → Scan via RPC → Display native balance, token holdings, and vault positions → Refresh data → Track multiple wallets
- **Success criteria**: Sub-10 second wallet scans, accurate balance retrieval via RPC, support for Ethereum/Arbitrum/Base/Optimism/Polygon/BSC, persistent wallet tracking list

### AI-Enhanced Portfolio Reports
- **Functionality**: Generate comprehensive AI-powered portfolio analysis reports with LLM-generated insights on risk concentration, diversification opportunities, specific vault recommendations for rebalancing, yield optimization strategies, and actionable next steps
- **Purpose**: Transform raw portfolio data into strategic intelligence that guides allocation decisions with specific, contextual recommendations based on current positions and market opportunities
- **Trigger**: User clicks "Generate AI Report" from portfolio view or selects enhanced report option
- **Progression**: Load portfolio data → Generate AI analysis via LLM → Display comprehensive report with executive summary, risk analysis, optimization recommendations, specific vault suggestions → Export or share report
- **Success criteria**: Report generation in <5 seconds, actionable recommendations with specific vault names and allocation percentages, risk-adjusted optimization suggestions, clear explanation of reasoning, professional formatting suitable for treasury committees

### Settings & Profile
- **Functionality**: User preferences, alert configuration, API key management, workspace settings
- **Purpose**: Customize user experience and manage integrations
- **Trigger**: User clicks Settings in nav or profile menu
- **Progression**: Navigate to Settings → Configure alerts → Generate API keys → Update profile
- **Success criteria**: Persistent settings, secure API key generation, email/webhook alert configuration

## Edge Case Handling
- **Empty States**: Show helpful onboarding prompts when watchlists, portfolios, or saved views are empty with clear CTAs to add items
- **Loading States**: Display skeleton loaders for tables and charts to maintain layout stability during data fetches
- **Invalid Wallet**: Show clear error message with format example when wallet address validation fails
- **No Vault Data**: Display "Data unavailable" message with last update timestamp when vault has missing metrics
- **Export Failures**: Provide retry mechanism and fallback formats (JSON if PDF fails) for report generation
- **Filter Conflicts**: Auto-adjust conflicting filters (e.g., BTC asset filter on Ethereum-only protocol) with user notification

## Design Direction
The design should evoke the precision and authority of institutional financial platforms like Bloomberg Terminal or Renaissance Macro, combined with the data clarity of modern analytics tools. The interface should feel like a professional workspace - serious, information-dense, with restrained use of color to highlight critical data points (risk levels, yield changes). Typography and spacing should prioritize readability during extended analysis sessions.

## Color Selection
Professional, low-saturation palette that prioritizes data legibility and conveys institutional credibility while maintaining visual hierarchy for risk indicators.

- **Primary Color**: `oklch(0.32 0.08 250)` - Deep midnight blue that anchors the interface with authority and professionalism, used for key actions and primary navigation
- **Secondary Colors**: 
  - Background: `oklch(0.98 0.005 250)` - Near-white with subtle cool tone for main canvas
  - Card: `oklch(1 0 0)` - Pure white for elevated content cards
  - Muted: `oklch(0.46 0.01 250)` - Mid-tone slate for secondary text and disabled states
- **Accent Color**: `oklch(0.55 0.18 220)` - Vibrant cyan-blue for CTAs and interactive highlights
- **Risk Indicators**:
  - Low: `oklch(0.65 0.15 145)` - Muted green for low-risk vaults
  - Medium: `oklch(0.70 0.16 75)` - Amber for moderate risk
  - High: `oklch(0.60 0.22 25)` - Controlled red for high-risk indicators

**Foreground/Background Pairings**:
- Primary (Deep Blue `oklch(0.32 0.08 250)`): White text `oklch(1 0 0)` - Ratio 9.2:1 ✓
- Accent (Cyan-Blue `oklch(0.55 0.18 220)`): White text `oklch(1 0 0)` - Ratio 5.1:1 ✓
- Background (Near-White `oklch(0.98 0.005 250)`): Dark text `oklch(0.22 0.02 250)` - Ratio 12.8:1 ✓
- Risk-High (Red `oklch(0.60 0.22 25)`): White text `oklch(1 0 0)` - Ratio 4.9:1 ✓

## Font Selection
Typography must convey institutional authority while maintaining exceptional legibility for data-dense tables and extended reading sessions.

- **Display/Headings**: IBM Plex Sans (600-700 weight) - Geometric precision that feels technical yet approachable, conveying data-driven rigor
- **Body/UI**: Inter (400-500 weight) - Optimized for screen readability with excellent spacing and clear numerals for financial data
- **Code/Monospace**: JetBrains Mono (400 weight) - For wallet addresses, API keys, and technical identifiers

**Typographic Hierarchy**:
- H1 (Page Title): IBM Plex Sans Bold / 32px / -0.02em letter-spacing / 1.2 line-height
- H2 (Section Heading): IBM Plex Sans SemiBold / 24px / -0.01em / 1.3 line-height
- H3 (Subsection): IBM Plex Sans SemiBold / 18px / normal / 1.4 line-height
- Body (Standard): Inter Regular / 15px / normal / 1.6 line-height
- Small (Metadata): Inter Regular / 13px / normal / 1.5 line-height
- Table Data: Inter Medium / 14px / normal / 1.4 line-height for emphasis on key metrics

## Animations
Animations should feel purposeful and immediate, reinforcing interactions without delaying workflows. Use subtle micro-interactions to provide feedback and guide attention.

- **Page Transitions**: 200ms fade with 8px vertical slide for route changes
- **Filter Application**: Instant table update with 150ms staggered row fade-in
- **Data Loading**: Skeleton shimmer animation with 1.5s duration, linear gradient sweep
- **Hover States**: 100ms color/shadow transitions on interactive elements
- **Chart Updates**: 400ms ease-out for line/bar animations when data changes
- **Modal Entry**: 200ms scale from 0.96 to 1.0 with fade for dialogs
- **Success Actions**: Subtle 300ms green highlight pulse on save/add actions
- **Metric Changes**: Small bounce animation (150ms) when APY or TVL updates significantly

## Component Selection

**Components**:
- **Table**: Shadcn Table with custom header styling, sticky headers for long lists, row hover states with 50ms transition
- **Card**: Shadcn Card with subtle shadow elevation, used for vault summary, metrics, and section containers
- **Button**: Shadcn Button with variants (default for primary actions, outline for secondary, ghost for tertiary navigation)
- **Badge**: Shadcn Badge customized with risk-specific colors for vault risk levels and strategy types
- **Tabs**: Shadcn Tabs for switching between Explorer/Portfolio/Reports views with underline indicator
- **Dialog**: Shadcn Dialog for vault comparison modals and settings overlays
- **Select**: Shadcn Select with search for protocol/chain filters
- **Input**: Shadcn Input with validation states for wallet address entry
- **Accordion**: Shadcn Accordion for expandable risk factor details and strategy breakdowns
- **Separator**: Shadcn Separator for visual hierarchy in dense layouts
- **Tooltip**: Shadcn Tooltip for metric explanations and risk factor definitions (200ms delay)
- **Skeleton**: Shadcn Skeleton for loading states across tables and cards

**Customizations**:
- **Risk Meter**: Custom component using SVG arc and color gradients mapping 0-10 risk scores to visual gauge
- **Yield Decomposition Chart**: Custom stacked bar chart using Recharts showing base yield vs incentives over time
- **Dependency Graph**: Custom D3-based force-directed graph showing protocol dependencies and shared contracts
- **Allocation Donut**: Custom Recharts donut chart with center metric display for portfolio exposure
- **Historical Chart**: Recharts line chart with dual-axis (APY + TVL) and zoom/pan controls
- **Filter Panel**: Custom multi-select filter component with chip display and clear-all action

**States**:
- **Buttons**: Hover (slight background lightening), Active (scale 0.98), Disabled (50% opacity, cursor not-allowed), Loading (spinner icon)
- **Inputs**: Focus (accent border + ring), Error (red border + error text below), Success (green checkmark icon)
- **Table Rows**: Hover (subtle background color), Selected (accent border-left), Active Sort Column (bold header)
- **Cards**: Hover (subtle shadow increase from elevation-1 to elevation-2 in 100ms)

**Icon Selection** (Phosphor Icons):
- Vault: `Vault` icon for vaults and treasury
- Risk: `Warning` for risk indicators, `ShieldCheck` for audited vaults
- APY: `TrendUp` for yields, `ChartLine` for performance
- Protocol: `Stack` for protocol groupings
- Chain: `Link` for blockchain networks
- Filter: `Funnel` for filter controls
- Compare: `ArrowsLeftRight` for vault comparison
- Export: `DownloadSimple` for PDF/CSV export
- Watchlist: `Star` (filled when active)
- Portfolio: `Briefcase` for treasury view
- Settings: `Gear` for settings page
- Docs: `Book` for documentation
- API: `Code` for API reference

**Spacing**:
- Container padding: `px-6 py-8` on desktop, `px-4 py-6` on mobile
- Card padding: `p-6` for content cards
- Section gaps: `gap-8` between major sections, `gap-4` between related elements
- Table cell padding: `px-4 py-3` for data cells
- Button padding: `px-4 py-2` for default size

**Mobile**:
- Tables convert to stacked cards with key metrics visible (APY, TVL, Risk) on mobile
- Filter panel collapses to sheet/drawer component from bottom
- Charts maintain aspect ratio but reduce height on mobile (h-64 → h-48)
- Navigation switches to bottom tab bar with 4-5 key pages
- Vault detail sections become full-width accordion for progressive disclosure
- Portfolio exposure charts stack vertically instead of grid layout
