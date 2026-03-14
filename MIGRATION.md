# Frontend Refactoring - Full-Stack Conversion

## Changes Made

### 1. Removed Spark Dependencies
- Removed `@github/spark` from package.json
- Replaced `useKV` with standard React state + API calls
- Replaced Spark-specific imports with standard React patterns

### 2. Added API Client
- Created `/frontend/src/lib/api.ts` - API client service
- Created `/frontend/src/types/api.ts` - TypeScript types matching backend

### 3. Environment Configuration
- Added `.env.example` with `VITE_API_URL`
- API URL defaults to `http://localhost:8000`

### 4. Key File Changes

#### App.tsx
**Before:**
```typescript
import { useKV } from '@github/spark/hooks';
const [vaults, setVaults] = useKV<Vault[]>('vaults', []);
```

**After:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const { data, isLoading } = useQuery({
  queryKey: ['vaults'],
  queryFn: () => apiClient.getVaults(),
});
```

### 5. Data Flow

**Old (Spark):**
```
Mock Data → useKV → LocalStorage → UI
```

**New (Full-Stack):**
```
DeFiLlama → Indexer → JSON/DB → Backend API → Frontend
```

## Frontend Structure

```
frontend/
├── src/
│   ├── components/      # Reused from prototype
│   │   ├── ui/          # shadcn components (unchanged)
│   │   ├── VaultExplorer.tsx
│   │   ├── VaultDetail.tsx
│   │   ├── ApiDocs.tsx
│   │   ├── MetricCard.tsx
│   │   ├── RiskBadge.tsx
│   │   └── YieldChart.tsx
│   ├── lib/
│   │   ├── api.ts       # NEW: API client
│   │   ├── utils.ts     # (unchanged)
│   │   └── risk.ts      # Keep for display helpers
│   ├── types/
│   │   └── api.ts       # NEW: API types
│   ├── App.tsx          # REFACTORED: API calls
│   ├── index.css        # (unchanged)
│   └── main.tsx         # (unchanged)
├── package.json         # NEW: No Spark deps
├── .env.example         # NEW
├── Dockerfile           # NEW
└── README.md            # NEW
```

## Setup Instructions

### Install Dependencies
```bash
cd frontend
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

### Run Development Server
```bash
npm run dev
```

## API Integration

The frontend now uses React Query for data fetching:

```typescript
// Fetch vaults
const { data, isLoading, error } = useQuery({
  queryKey: ['vaults'],
  queryFn: () => apiClient.getVaults(),
});

// Fetch specific vault
const { data: vault } = useQuery({
  queryKey: ['vault', address],
  queryFn: () => apiClient.getVaultByAddress(address),
});

// Fetch risk analysis
const { data: risk } = useQuery({
  queryKey: ['risk', address],
  queryFn: () => apiClient.getVaultRisk(address),
});
```

## Portable Export

The frontend can now be:
1. Built independently: `npm run build`
2. Served from any static host
3. Pointed to any backend via `VITE_API_URL`
4. Run outside Spark with standard `npm install`

## Next Steps

1. Copy all component files from `/src/components` to `/frontend/src/components`
2. Refactor `App.tsx` to use React Query
3. Add Portfolio page with wallet input
4. Add loading/error states for all API calls
5. Test against live backend
