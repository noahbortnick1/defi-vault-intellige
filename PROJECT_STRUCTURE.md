# DeFi Vault Intelligence - Project Structure

## Final Directory Tree

```
defi-vault-intelligence/
├── README.md                    # Main project documentation
├── MIGRATION.md                 # Spark → Full-stack migration guide
├── docker-compose.yml           # Docker orchestration
├── .gitignore                   # Git ignore rules
│
├── frontend/                    # React/TypeScript dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn components (40+)
│   │   │   ├── VaultExplorer.tsx
│   │   │   ├── VaultDetail.tsx
│   │   │   ├── ApiDocs.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── RiskBadge.tsx
│   │   │   └── YieldChart.tsx
│   │   ├── lib/
│   │   │   ├── api.ts           # API client service
│   │   │   ├── utils.ts
│   │   │   └── risk.ts          # Risk display helpers
│   │   ├── types/
│   │   │   └── api.ts           # TypeScript API types
│   │   ├── App.tsx              # Main app (refactored for API)
│   │   ├── index.css            # Tailwind + theme
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json             # No Spark dependencies
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .env.example             # VITE_API_URL
│   ├── Dockerfile
│   └── README.md
│
├── backend/                     # FastAPI Python backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── vaults.py        # Vault endpoints
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── vault.py         # Pydantic schemas
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── risk.py          # Risk calculation engine
│   │       └── vault_service.py # Vault data service
│   ├── requirements.txt
│   ├── .env.example             # API config
│   ├── Dockerfile
│   └── README.md
│
├── indexer/                     # Data indexer
│   ├── adapters/
│   │   ├── __init__.py
│   │   ├── base.py              # Base adapter interface
│   │   └── defillama.py         # DeFiLlama adapter
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── vault.py             # Vault schemas
│   ├── data/                    # Output directory
│   │   ├── vaults.json          # Normalized vault data
│   │   └── stats.json           # Indexing statistics
│   ├── run_indexer.py           # Main entry point
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── docs/                        # Documentation
    └── README.md                # API docs, architecture, deployment
```

## Key Files Created/Modified

### Backend (New)
- ✅ `/backend/app/main.py` - FastAPI application
- ✅ `/backend/app/api/vaults.py` - REST endpoints
- ✅ `/backend/app/models/vault.py` - Pydantic models
- ✅ `/backend/app/services/risk.py` - Risk engine
- ✅ `/backend/app/services/vault_service.py` - Data service
- ✅ `/backend/requirements.txt` - Python dependencies
- ✅ `/backend/Dockerfile` - Container config
- ✅ `/backend/.env.example` - Environment template

### Indexer (New)
- ✅ `/indexer/run_indexer.py` - Main indexer script
- ✅ `/indexer/adapters/defillama.py` - DeFiLlama integration
- ✅ `/indexer/schemas/vault.py` - Data schemas
- ✅ `/indexer/requirements.txt` - Python dependencies
- ✅ `/indexer/.env.example` - Environment template

### Frontend (Refactored)
- ✅ `/frontend/package.json` - Removed Spark dependencies
- ✅ `/frontend/src/lib/api.ts` - API client (replaces Spark)
- ✅ `/frontend/src/types/api.ts` - TypeScript types
- ✅ `/frontend/.env.example` - API URL config
- ✅ `/frontend/Dockerfile` - Container config
- ⚠️  `/frontend/src/App.tsx` - NEEDS REFACTOR (still using useKV)
- ⚠️  Components need to be copied from `/src/components/`

### Infrastructure
- ✅ `/docker-compose.yml` - Full-stack orchestration
- ✅ `/docs/README.md` - Complete documentation
- ✅ `/README.md` - Project overview
- ✅ `/MIGRATION.md` - Migration guide
- ✅ `/.gitignore` - Updated ignore rules

## Components To Copy

The following need to be copied from `/src/components/` to `/frontend/src/components/`:

```bash
# From prototype to frontend
cp -r src/components/ui frontend/src/components/
cp src/components/VaultExplorer.tsx frontend/src/components/
cp src/components/VaultDetail.tsx frontend/src/components/
cp src/components/ApiDocs.tsx frontend/src/components/
cp src/components/MetricCard.tsx frontend/src/components/
cp src/components/RiskBadge.tsx frontend/src/components/
cp src/components/YieldChart.tsx frontend/src/components/

# Copy lib utilities
cp src/lib/utils.ts frontend/src/lib/
cp src/lib/risk.ts frontend/src/lib/

# Copy config files
cp index.html frontend/
cp vite.config.ts frontend/
cp tailwind.config.js frontend/
cp tsconfig.json frontend/
cp src/index.css frontend/src/
cp src/main.tsx frontend/src/
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/vaults` | List vaults (with filters) |
| GET | `/api/v1/vaults/{address}` | Get vault details |
| GET | `/api/v1/vaults/{address}/risk` | Get risk analysis |
| GET | `/api/v1/portfolio/{wallet}` | Get portfolio data |

## Data Flow

```
┌─────────────────┐
│  DeFiLlama API  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Indexer     │ Normalize & save
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  vaults.json    │ Seed data
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │ FastAPI service
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Frontend     │ React dashboard
└─────────────────┘
```

## Setup Commands

### 1. Run Indexer (Generate seed data)
```bash
cd indexer
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run_indexer.py
```

### 2. Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Or Use Docker
```bash
docker-compose up
```

## Environment Variables

### Backend
```env
ENVIRONMENT=development
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173
SEED_DATA_PATH=../indexer/data/vaults.json
```

### Frontend
```env
VITE_API_URL=http://localhost:8000
```

### Indexer
```env
DEFILLAMA_API_URL=https://yields.llama.fi
OUTPUT_DIR=./data
```

## Next Implementation Steps

1. ✅ Backend API structure - COMPLETE
2. ✅ Indexer with DeFiLlama - COMPLETE
3. ✅ Frontend API client - COMPLETE
4. ⚠️  Refactor App.tsx to use API client - PENDING
5. ⚠️  Copy components to frontend/ - PENDING
6. ⚠️  Add Portfolio page - PENDING
7. ⚠️  Add loading/error states - PENDING
8. ⚠️  Test full stack integration - PENDING

## Testing the Stack

1. Run indexer: `cd indexer && python run_indexer.py`
2. Verify `indexer/data/vaults.json` created
3. Start backend: `cd backend && uvicorn app.main:app --reload`
4. Test API: `curl http://localhost:8000/api/v1/health`
5. Test vaults: `curl http://localhost:8000/api/v1/vaults`
6. Start frontend: `cd frontend && npm run dev`
7. Open browser: `http://localhost:5173`

## Deployment Checklist

- [ ] PostgreSQL migration (replace JSON seed)
- [ ] Add API authentication
- [ ] Add rate limiting
- [ ] Set up Redis caching
- [ ] Configure production CORS
- [ ] Add monitoring/logging
- [ ] Set up CI/CD pipeline
- [ ] Configure domain & SSL
- [ ] Database backups
- [ ] Error tracking (Sentry)
