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

- **Functionality**: High-density filterable table with 24+ vaults across chains, protocols, and strategies. Multi-dimensional filters (chain, asset, protocol, strategy, risk band, TVL range, APY range, institutional-grade only), sortable colum
- **Trigger**: User clicks "Explore Vaults" or navigates to /vaults

### Vault Detail P
- **Purpose**: Provide complete due diligence data for confident allocation decisions
- **Progression**: Load overview → Review strategy → Analyze yield sources → Examine risk fact

- **Functionality**: Side-by-side matrix comparing 2-4 vaults across all key metrics (APY, real yield, TVL, risk factor
- **Trigger**: User selects vaults from explorer and clicks compare

### Portfolio / Treas
- **Purpose**: Monitor and analyze existing DeFi treasury allocations
- **Progression**: Select demo portfolio → View summary → Analyze exposures → Review 

- **Functionality**: Real-time feed of meaningful vault events (APY spikes, TVL flows, risk changes, governance updates, liquidity deterioration). Filterable by event type, chain, p
- **Trigger**: User navigates to Radar page

### Due Diligence Re
- **Purpose**: Export-ready DD documentation for investment committees
- **Progression**: Generate report → Review sections → Export PD

- **Functionality**: Visualize the automatic vault discovery system showing three layers (aggregators, protoc
- **Trigger**: User navigates to Discovery page or from navigation

## Edge Case Handling
- **No vaults in filtered view**: Show empty state with filter reset button and suggestion to broaden criteria
- **Portfolio wallet not found**: Graceful error with demo portfolio 
- **Report generation failure**: Retry mechanis
- **Historical data gaps**: Show available data with gaps marked clearly
## Design Direction

## Color Select
**Deep professional dark theme** with cyan accent for emphasis and data visualization colors optimized for financial charts.
- **Primary Color**: `oklch(0.35 0.06 240)` - Deep slate blue for structural elem
  - `oklch(0.25 0.02 240)` - Deeper slate f
- **Accent Color**: `oklch(0.68 0.15 200)` - Bright cyan for CTAs, highlights, and key metrics, cr
  - Background `oklch(0.12 0.01 240)`: Foreground `oklch(0.95 0.01 240)` - Ratio 14.5:1 ✓




  - H1 (Page Title): IBM Plex Sans Bold / 36px / tight letter spacing (-0.02
  - H3 (Card Title): IBM Plex Sans SemiBold / 18px / normal spacing
  - Caption: IBM Plex Sans Medium / 12px / uppercase / 0.05em letter spacing

## Animations
Animations should be **subtle and functional**, never decorative. Use for state transitions, loading feedback, and drawing attention to data updates. Maximum 300ms duration for most transitions. Focus on smooth
## Component Selection
- **Components**: 
  - Cards: shadcn Card for metric summaries, vault overviews, feature highlights
  - Forms: React Hook Form + Zod + shadcn Form components for wallet input, alerts

  - Tabs: shadcn Tabs

  - Risk badge component with color-coded severity (low/medium/high)
  - Dependency graph visualization (custom D3 or simple node display)
  - Event feed item with severity styling and action links
  
  - Buttons: distinct hover (slight brightness increase), active (pressed ins
  - Table rows: hover background change, selected background distinct, 
  

  - Vault for vault

  - Warning for risk factors

  

  - Grid gaps: gap-6 for major grids, gap-4 for tighter layouts, gap-2 for inline elements

  - Tables switch to card-based layout below 768px
  - Filters move to bott
  - Compare view shows one vault at a time with tabs
  - Sticky headers for key navigation elements













































































