# API Integration Summary

## Overview
Connected the Yield Terminal vault explorer to the new API endpoints using custom React hooks that interact with the API service layer.

## New Hooks Created

### 1. `useVaultsApi` (`src/hooks/use-vaults-api.ts`)
- Fetches paginated vault list from `/api/v1/vaults`
- Maps API vault schema to UI vault schema
- Supports filtering by chain, asset, protocol, strategy type
- Supports sorting and pagination
- Returns: `{ vaults, loading, error, total }`

### 2. `useVaultApi` (`src/hooks/use-vault-api.ts`)
- Fetches individual vault details by ID/address
- Maps API vault schema to UI vault schema
- Returns: `{ vault, loading, error }`

### 3. `useRankingsApi` (`src/hooks/use-rankings-api.ts`)
- Fetches vault rankings from `/api/v1/rankings`
- Supports multiple ranking modes (risk_adjusted, highest_yield, institutional, best_liquidity)
- Supports filtering by asset, chain, strategy type
- Returns: `{ rankings, loading, error, mode }`

## Components Updated

### 1. **VaultExplorer** (`src/components/VaultExplorer.tsx`)
**Changes:**
- Replaced mock data (`VAULTS`) with `useVaultsApi()` hook
- Added loading state with spinner
- Added error handling with error message display
- Updated filters to use API query parameters
- Dynamic stats calculation based on API data
- Maps UI filter values to API parameter format

**Features:**
- Real-time vault data from API
- Server-side filtering and sorting
- Client-side search overlay for additional filtering
- Shows total count from API response

### 2. **VaultDetail** (`src/components/VaultDetail.tsx`)
**Changes:**
- Replaced `getVaultById()` from mock data with `useVaultApi()` hook
- Added loading state during fetch
- Added error handling
- Fetches vault by ID/address from API

**Features:**
- Dynamic vault details from API
- Loading spinner during fetch
- Error messages for failed requests
- Graceful fallback for vault not found

### 3. **RankingsPage** (`src/components/RankingsPage.tsx`)
**Changes:**
- Replaced local ranking calculation with `useRankingsApi()` hook
- Maps UI ranking modes to API modes
- Added loading state with spinner
- Added error handling
- Updated rendering to use API ranking entry structure
- Removed dependency on mock data ranking logic

**Features:**
- Real-time rankings from API
- Multiple ranking modes (risk-adjusted, highest-yield, institutional, best-liquidity)
- Server-side ranking calculation
- Filter support for asset, chain
- Client-side search overlay

## Schema Mapping

### API Vault → UI Vault
The mapper handles differences between API and UI schemas:

**Field Mappings:**
- `risk_score` → `riskScore`
- `strategy_type` → `strategyType` (with type conversion)
- `protocol` → `protocolName`
- Calculates `realYield` and `incentiveYield` from `apy` and `yield_sources`
- Maps `liquidity_depth` ('high'|'medium'|'low') to `liquidityScore` (9|6|3)
- Derives `riskBand` and `riskLevel` from `risk_score`
- Maps `upgradeability` to `governance` structure
- Sets `institutionalGrade` based on liquidity, risk, and upgradeability

**Strategy Type Mapping:**
- `lending` → `lending`
- `lp` → `lp-farming`
- `leveraged_lending` → `lending`
- `delta_neutral` → `delta-neutral`
- `yield_tokenization` → `real-yield`
- `options` → `delta-neutral`
- `staking` → `staking`

**Chain Mapping:**
API and UI use same values: ethereum, arbitrum, optimism, base, polygon, bsc

## API Endpoints Used

1. **GET /api/v1/vaults** - Vault listing with filters/pagination
2. **GET /api/v1/vaults/:address** - Individual vault details
3. **GET /api/v1/rankings** - Ranked vaults by mode

## Benefits

1. **Real Data**: Components now display live data from the API service layer
2. **Scalability**: Server-side filtering and pagination support large datasets
3. **Consistency**: Single source of truth for vault data
4. **Performance**: Optimized queries with only necessary data fetched
5. **Type Safety**: Full TypeScript types from API through to UI
6. **Error Handling**: Graceful degradation with loading and error states
7. **Maintainability**: Clean separation between API client, hooks, and components

## Next Steps

To extend the API integration:
- Connect portfolio tracking endpoints
- Connect report generation endpoints  
- Add vault risk detail endpoint
- Add real-time updates with polling or websockets
- Add caching layer for frequently accessed data
