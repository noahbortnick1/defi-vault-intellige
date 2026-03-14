# Yield Terminal - Product Requirements Document

Institutional DeFi Yield Intelligence Platform

## Mission Statement

Yield Terminal provides institutional-grade due diligence, risk assessment, and portfolio analytics for DeFi treasury managers, enabling confident capital allocation decisions through explainable risk scoring and comprehensive vault intelligence.

## Experience Qualities

1. **Institutional Credibility** - The interface must project Bloomberg-level seriousness and analytical rigor, establishing trust with fund managers handling millions in capital.

2. **Information Density** - Maximize signal-to-noise ratio with dense, scannable tables and dashboards that surface critical metrics without overwhelming cognitive load.

3. **Explainable Intelligence** - Every score, risk assessment, and recommendation must be transparently derived and drill-down-able, allowing analysts to verify and trust the underlying logic.

## Complexity Level

**Complex Application** (advanced functionality with multiple views)

This is a multi-view institutional SaaS product with sophisticated data relationships, filtering systems, comparison engines, portfolio analytics, and reporting capabilities. It requires comprehensive state management, routing, data modeling, and role-aware UX patterns typical of professional financial analytics platforms.

## Essential Features

### 1. Vault Discovery & Filtering

**Functionality**: Advanced table-based vault browser with institutional-grade filtering and sorting

**Purpose**: Enable rapid discovery and comparison of DeFi yield opportunities across chains and protocols

**Trigger**: User navigates to /vaults or searches from command palette

**Progression**: Land on table → Apply filters (chain/asset/risk/strategy) → Sort by relevant metric → Review matches → Select vault for deep dive → Add to watchlist/comparison

**Success Criteria**: User can filter 100+ vaults down to 3-5 relevant matches within 30 seconds

### 2. Vault Due Diligence View

**Functionality**: Comprehensive single-vault analysis with explainable risk scoring, yield decomposition, dependency mapping, and historical performance

**Purpose**: Provide all information needed for institutional due diligence decision

**Trigger**: User clicks vault from table or search results

**Progression**: View header metrics → Review strategy description → Analyze yield sources → Examine risk factors with explanations → Check dependencies → Review audit coverage → Generate DD report

**Success Criteria**: Analyst can complete preliminary due diligence assessment in under 5 minutes

### 3. Portfolio & Treasury Analytics

**Functionality**: Wallet/treasury exposure analysis showing asset, protocol, and strategy concentration with risk aggregation

**Purpose**: Monitor existing allocations and identify concentration risks

**Trigger**: User enters wallet address or selects demo portfolio

**Progression**: Input wallet → View summary cards → Analyze exposure breakdowns → Review position-level details → Export report

**Success Criteria**: Treasury manager can assess portfolio health and identify concentration risks within 2 minutes

### 4. Yield Radar Event Feed

**Functionality**: Real-time style feed of significant vault state changes (APY spikes, TVL flows, risk changes)

**Purpose**: Surface actionable intelligence about vault ecosystem changes

**Trigger**: User navigates to /radar or receives alert

**Progression**: Scan event feed → Filter by severity/type → Click event → Navigate to affected vault → Take action (watchlist/alert/investigate)

**Success Criteria**: User discovers and acts on meaningful vault changes within minutes of occurrence

### 5. Vault Comparison Engine

**Functionality**: Side-by-side comparison of 2-4 vaults with normalized metrics and highlighting

**Purpose**: Support systematic evaluation of alternative yield strategies

**Trigger**: User selects compare checkboxes from vault table

**Progression**: Select 2-4 vaults → Navigate to comparison view → Review side-by-side metrics → Identify best/worst performers → Generate comparison report

**Success Criteria**: User can objectively compare competing yield strategies and make allocation decision

## Edge Case Handling

- **No Results Found**: Show relevant empty state with filter reset CTA and suggested alternative searches
- **Missing Vault Data**: Display partial data with clear indicators of what's unavailable and why
- **Wallet Connect Failure**: Graceful fallback to demo portfolios with explanatory messaging
- **Report Generation Timeout**: Show progress indicator and offer email delivery option
- **Stale Data**: Display last-updated timestamp prominently and indicate data freshness status
- **Invalid Filters**: Auto-correct to valid ranges with user notification
- **Comparison Overflow**: Limit to 4 vaults with clear messaging about constraint

## Design Direction

The design should evoke precision, trustworthiness, and institutional sophistication. Think Bloomberg Terminal meets modern SaaS—information-dense yet scannable, serious yet not archaic. The palette should feel professional and analytical, with strategic use of color only for status indicators and key metrics. Motion should be purposeful and subtle, never decorative. Typography should establish clear hierarchy with analytical clarity.

## Color Selection

**Approach**: Dark-first professional palette with muted blues for institutional credibility, strategic accent colors for risk bands, and high-contrast neutrals for maximum readability in dense data displays.

**Primary Color**: `oklch(0.35 0.06 240)` - Deep sophisticated blue communicating trust and stability
**Secondary Colors**: 
- Background dark: `oklch(0.12 0.01 240)` - Rich dark base
- Surface elevated: `oklch(0.18 0.015 240)` - Subtle card elevation
- Border subtle: `oklch(0.25 0.02 240)` - Refined separators

**Accent Color**: `oklch(0.68 0.15 200)` - Bright analytical cyan for key actions and APY highlights

**Risk Palette**:
- Low Risk: `oklch(0.65 0.15 145)` - Calm green
- Medium Risk: `oklch(0.72 0.14 75)` - Cautious amber  
- High Risk: `oklch(0.62 0.20 25)` - Alert red

**Foreground/Background Pairings**:
- Primary text on dark background: `oklch(0.95 0.01 240)` on `oklch(0.12 0.01 240)` - Ratio 14.2:1 ✓
- Muted text on dark background: `oklch(0.65 0.02 240)` on `oklch(0.12 0.01 240)` - Ratio 7.8:1 ✓
- Accent text on dark background: `oklch(0.68 0.15 200)` on `oklch(0.12 0.01 240)` - Ratio 8.4:1 ✓
- Primary foreground on accent: `oklch(0.12 0.01 240)` on `oklch(0.68 0.15 200)` - Ratio 8.4:1 ✓

## Font Selection

**Characteristics**: Professional financial typography with technical precision

**Primary Font**: IBM Plex Sans - Modern geometric sans with institutional authority, excellent readability in dense data tables

**Monospace Font**: JetBrains Mono - Technical precision for addresses, values, and code

**Typographic Hierarchy**:
- H1 (Page Title): IBM Plex Sans Bold/36px/tight letter-spacing/-0.02em
- H2 (Section Title): IBM Plex Sans Semibold/24px/tight
- H3 (Card Title): IBM Plex Sans Semibold/18px/normal
- Body (Primary): IBM Plex Sans Regular/15px/1.6 line-height
- Body (Secondary): IBM Plex Sans Regular/14px/1.5 line-height  
- Caption (Labels): IBM Plex Sans Medium/12px/1.4 line-height/uppercase tracking
- Data (Metrics): IBM Plex Sans Semibold/20px/1.2 line-height
- Code (Addresses): JetBrains Mono Regular/13px/1.4 line-height

## Animations

Animations should enhance comprehension and maintain context, never distract. Use for: table row hover highlights (50ms), filter application feedback (150ms), page transitions (200ms), chart data updates (300ms ease), and score explanation reveals (200ms). Avoid: gratuitous page loads, playful bounces, or attention-seeking motion. Every animation must have functional purpose—orienting users during state changes or highlighting important data changes.

## Component Selection

**Core Shadcn Components**: 
- Table (with custom dense mode and column controls)
- Card (elevated and flush variants)
- Button (primary/secondary/ghost states)
- Dialog (for filters, comparisons, exports)
- Tabs (vault detail sections, settings pages)
- Badge (risk levels, status indicators, chains)
- Popover (score explanations, quick previews)
- Command (search palette)
- Select/Input (filters)
- Checkbox (comparison selection, table controls)
- Sheet (mobile navigation, filter drawer)
- Sonner Toast (action feedback)

**Custom Components**:
- VaultTable (TanStack Table with institutional styling)
- MetricCard (large stat display with change indicators)
- YieldBreakdownChart (stacked bar for yield sources)
- RiskScoreRadar (hexagonal risk factor visualization)
- DependencyGraph (interactive protocol dependency map)
- EventFeedItem (radar event card with severity)
- ComparisonMatrix (side-by-side vault grid)
- PortfolioSummary (exposure donut + table)
- ReportLayout (printable document shell)

**States**:
- Buttons: distinct hover with 1px border shift, active press with subtle scale, disabled at 40% opacity
- Inputs: focus with accent ring, error with red left border, success with green checkmark icon
- Table rows: hover with elevated background, selected with accent left border, loading with skeleton pulse

**Icon Selection**: Phosphor icons throughout for consistency—TrendUp/Down for performance, ShieldCheck for security, Lightning for alerts, ChartBar for analytics, Funnel for filters, ArrowsLeftRight for comparison, Export for reports

**Spacing**: 4px base unit—tight (4px) for inline elements, comfortable (8px) for form fields, generous (16px) for card padding, spacious (24px) for section gaps, dramatic (48px) for page sections

**Mobile**: Tables collapse to card-based layouts on <768px, filters move to drawer, charts adapt to full width with reduced detail, command palette remains accessible via bottom nav, metric cards stack vertically with preserved hierarchy
