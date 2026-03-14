# DeFi Vault Intelligence Platform

A full-stack DeFi vault analytics and risk assessment platform for institutional investors and developers.

## 🏗️ Architecture

This is a monorepo containing:

- **`/frontend`** - React/TypeScript dashboard with Vite
- **`/backend`** - FastAPI REST API with Python
- **`/indexer`** - Python data indexer for DeFi protocols
- **`/docs`** - API documentation site
- **`/shared`** - Shared TypeScript/Python schemas

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (recommended)

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up

# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

#### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Indexer (seed data)

```bash
cd indexer
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run_indexer.py
```

#### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📦 Data Flow

```
DeFiLlama API → Indexer → Seed JSON → Backend API → Frontend
                    ↓
              PostgreSQL (future)
```

## 🎯 Features

### Vault Explorer
- Browse 50+ yield vaults across chains
- Filter by protocol, chain, APY, risk
- Real-time sorting and search

### Vault Detail Pages
- Strategy breakdown
- Risk analysis with factor scoring
- APY history charts
- Protocol dependencies
- Contract details

### Risk Engine
- Composite 0-10 risk scoring
- Factors: protocol dependency, oracle risk, upgradeability, liquidity
- Backend-calculated with factor breakdown

### Portfolio Analytics
- Wallet position tracking
- Asset breakdown charts
- Protocol exposure analysis
- Total portfolio value

### Developer API
- RESTful endpoints
- OpenAPI/Swagger docs
- Rate limiting
- API key authentication (future)

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/vaults` | List all vaults |
| GET | `/api/v1/vaults/{address}` | Get vault details |
| GET | `/api/v1/vaults/{address}/risk` | Get risk analysis |
| GET | `/api/v1/portfolio/{wallet}` | Get portfolio data |

## 🔧 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- Recharts for visualizations
- React Query for data fetching

### Backend
- FastAPI
- Pydantic for schemas
- PostgreSQL (future)
- CORS enabled for local dev

### Indexer
- Python 3.11+
- Requests for API calls
- Adapters for DeFiLlama, Yearn, etc.

## 📁 Project Structure

```
.
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # React hooks
│   │   ├── lib/          # Utilities
│   │   └── App.tsx       # Main app
│   └── package.json
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── models/       # Pydantic models
│   │   ├── services/     # Business logic
│   │   └── main.py       # App entry
│   └── requirements.txt
├── indexer/              # Data indexer
│   ├── adapters/         # Protocol adapters
│   ├── schemas/          # Data schemas
│   └── run_indexer.py
├── docs/                 # Documentation
├── docker-compose.yml
└── README.md
```

## 🗄️ Data Model

### Vault Schema
```typescript
{
  id: string
  address: string
  name: string
  protocol: string
  chain: string
  asset: string
  apy: number
  tvl: number
  risk_score: number
  strategy: string
  dependencies: string[]
  oracle_type: string
  upgradeability: string
  liquidity_depth: number
  updated_at: datetime
  source: string
}
```

## 🛣️ Roadmap

- [x] Frontend prototype with mock data
- [x] Backend API structure
- [x] DeFiLlama indexer adapter
- [ ] PostgreSQL integration
- [ ] Real-time indexing service
- [ ] Wallet portfolio tracking
- [ ] Additional protocol adapters (Yearn, Morpho, Beefy)
- [ ] WebSocket subscriptions
- [ ] Advanced risk models
- [ ] Backtesting engine

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📞 Support

- Documentation: [/docs](./docs)
- Issues: GitHub Issues
- API Docs: http://localhost:8000/docs
