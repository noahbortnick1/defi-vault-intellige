# Strategy Map Implementation

## Overview

The **Strategy Map** is a visual intelligence layer that transforms Yield Terminal from a ranked list of vaults into an interactive visual model of the DeFi yield universe. This feature allows users to explore how vaults, protocols, assets, strategies, and chains relate to each other through an interactive force-directed graph.

## Key Features

### 1. Visual Graph Network
- **Interactive D3.js force-directed graph** showing relationships between entities
- **Node types**: Assets, Strategy Types, Protocols, Vaults, Chains
- **Edge types**: Uses, Depends On, Belongs To, Allocates To
- **Zoom and pan** capabilities for exploring large networks
- **Drag and drop** nodes to reorganize the layout

### 2. Node Encoding
- **Node size** = TVL (for vaults and protocols)
- **Node color** = Risk band for vaults (green=low, orange=medium, red=high)
- **Node type colors**:
  - Assets: Blue (#68A3E0)
  - Strategies: Purple (#9370DB)
  - Protocols: Green (#50C878)
  - Vaults: Risk-based (green/orange/red)
  - Chains: Orange (#FFB347)

### 3. View Modes
- **All Strategies**: Complete universe view showing all relationships
- **By Asset**: Filter to show vaults for specific assets (USDC, ETH, WBTC, etc.)
- **By Protocol**: Focus on vaults from specific protocols (Morpho, Yearn, Aave, etc.)
- **By Chain**: Narrow down to specific blockchain networks

### 4. Interactive Features
- **Click vaults** to navigate to detail pages
- **Hover nodes** to see detailed metrics in tooltip:
  - Vault: APY, TVL, Risk Score
  - Protocol: Total TVL across all vaults
  - Asset/Chain/Strategy: Type identification
- **Drag nodes** to customize layout
- **Reset view** to return to default state

### 5. Graph Statistics
- Total nodes in current view
- Number of vaults shown
- Number of protocols
- Total connections (edges)

## Architecture

### Data Model

**StrategyNode Interface:**
```typescript
interface StrategyNode {
  id: string;
  type: NodeType; // 'asset' | 'strategy_type' | 'protocol' | 'vault' | 'chain'
  label: string;
  protocol?: string;
  chain?: string;
  asset?: string;
  vault_id?: string;
  tvl?: number;
  apy?: number;
  risk_score?: number;
  metadata?: Record<string, any>;
}
```

**StrategyEdge Interface:**
```typescript
interface StrategyEdge {
  id: string;
  from_node_id: string;
  to_node_id: string;
  type: EdgeType; // 'uses' | 'depends_on' | 'belongs_to' | 'allocates_to'
  weight?: number;
  metadata?: Record<string, any>;
}
```

### Graph Building Logic

The `buildStrategyGraph` function in `/src/lib/strategyMap.ts`:

1. **Filters vaults** based on selected asset, protocol, or chain
2. **Extracts unique entities** (assets, strategies, protocols, chains)
3. **Creates nodes** for each unique entity with appropriate metadata
4. **Generates edges** representing relationships:
   - Asset → Vault (allocates_to)
   - Strategy → Vault (uses)
   - Vault → Protocol (belongs_to)
   - Vault → Chain (depends_on)

### Component Structure

**StrategyMap Component** (`/src/components/StrategyMap.tsx`):

- **SVG Canvas**: D3.js renders the force-directed graph
- **Control Panel**: View mode selector and filter dropdowns
- **Info Tooltip**: Appears on node hover with detailed metrics
- **Legend**: Color-coded key for node types
- **Statistics Panel**: Shows current graph metrics
- **Usage Guide**: Instructions for interacting with the map

## Use Cases

### 1. Allocator Workflow
**Goal**: Find optimal USDC deployment opportunities

**Flow**:
1. Set view mode to "By Asset"
2. Select "USDC" from filter
3. View all USDC strategies visually clustered
4. Click high-performing vault nodes (larger size, green color)
5. Open vault detail page for due diligence

### 2. Researcher Workflow
**Goal**: Understand protocol dependencies

**Flow**:
1. Set view mode to "By Protocol"
2. Select protocol (e.g., "Morpho")
3. See all Morpho vaults and their connections
4. Identify shared dependencies (e.g., all using Aave liquidity)
5. Assess concentration risk

### 3. Treasury Workflow
**Goal**: Identify diversification opportunities

**Flow**:
1. Start with "All Strategies" view
2. Observe visual clusters of overcrowded strategies
3. Find underexplored areas with fewer connections
4. Click vaults in less dense areas for new opportunities

### 4. Risk Analysis Workflow
**Goal**: Map protocol risk cascades

**Flow**:
1. Hover over vault nodes to see risk scores
2. Follow edges to see dependencies
3. Identify vaults with complex dependency chains
4. Assess systemic risk through shared protocols

## Product Integration

The Strategy Map integrates seamlessly with other Yield Terminal modules:

- **Vault Explorer**: Alternative to table view for visual discovery
- **Rankings**: Vault sizes reflect their ranking scores
- **Detail Pages**: Click-through from map nodes
- **Research**: Visual context for protocol relationships
- **Portfolio**: Future feature to overlay user positions on the map

## Technical Implementation

### D3.js Force Simulation

The graph uses D3's force simulation with:
- **Link force**: Maintains edge connections at ~80px distance
- **Charge force**: Pushes nodes apart with -300 strength
- **Center force**: Keeps graph centered in viewport
- **Collision force**: Prevents node overlap with radius ~30px

### Performance Optimizations

- **Selective rendering**: Only creates nodes/edges for filtered vaults
- **Efficient filtering**: Uses Set data structures for deduplication
- **Simulation throttling**: Alpha target ensures smooth drag interactions
- **SVG grouping**: Groups related elements for efficient transforms

### Responsive Design

- **Zoom controls**: 0.5x to 3x scale range
- **Pan support**: Drag background to reposition entire graph
- **Mobile considerations**: Touch-friendly node sizes and spacing
- **Adaptive layout**: Graph adjusts to container width

## Future Enhancements

### Planned Features

1. **Index Map View**: Show which vaults belong to specific indices
2. **Portfolio Overlay**: Display user's positions on the strategy map
3. **Flow Map**: Visualize capital movement across protocols
4. **Dependency Depth**: Color code by dependency chain length
5. **Time Series**: Animate graph changes over time
6. **Search & Highlight**: Find and highlight specific vaults/protocols
7. **Export**: Save map as image or shareable link
8. **Clustering Algorithm**: Auto-group related strategies visually

### Database Support

When moving to production with a real database:

**strategy_nodes table:**
```sql
CREATE TABLE strategy_nodes (
  id UUID PRIMARY KEY,
  node_type TEXT NOT NULL,
  label TEXT NOT NULL,
  protocol TEXT,
  chain TEXT,
  asset TEXT,
  vault_id UUID,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**strategy_edges table:**
```sql
CREATE TABLE strategy_edges (
  id UUID PRIMARY KEY,
  from_node_id UUID NOT NULL,
  to_node_id UUID NOT NULL,
  edge_type TEXT NOT NULL,
  weight NUMERIC(20,4),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### API Endpoints (Future)

```
GET /api/v1/map/strategy
GET /api/v1/map/asset/:asset
GET /api/v1/map/protocol/:name
GET /api/v1/map/vault/:address
GET /api/v1/map/portfolio/:wallet
```

## Strategic Value

The Strategy Map is one of the strongest differentiators for Yield Terminal:

1. **Visual Intelligence**: Transforms complex data into intuitive patterns
2. **Relationship Discovery**: Reveals connections tables can't show
3. **Market Structure**: Shows where yield clusters exist
4. **Competitive Moat**: Few competitors offer visual analytics at this level
5. **Terminal Feel**: Elevates the product from dashboard to intelligence platform

## Conclusion

The Strategy Map turns Yield Terminal into a true visual model of the DeFi yield universe. By combining interactive graph visualization with real vault data, it provides allocators, researchers, and treasury managers with a powerful tool for understanding market structure, identifying opportunities, and assessing systemic risk.

This feature positions Yield Terminal as more than just a vault directory—it becomes an essential intelligence layer for institutional DeFi capital allocation.
