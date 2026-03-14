# DeFi Vault Intelligence - Documentation

## Overview

DeFi Vault Intelligence is a full-stack platform for analyzing yield vaults across DeFi protocols. It provides institutional-grade risk assessment, portfolio analytics, and a developer API.

## Architecture

### System Components

```
┌─────────────┐
│   Frontend  │  React/TypeScript dashboard
└──────┬──────┘
       │ HTTP
┌──────▼──────┐
│   Backend   │  FastAPI REST API
└──────┬──────┘
       │
┌──────▼──────┐
│  PostgreSQL │  Data storage (future)
└─────────────┘

┌─────────────┐
│   Indexer   │  Data ingestion from protocols
└──────┬──────┘
       │
       ▼
   JSON Seed
```

### Technology Stack

**Frontend**
- React 19
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Recharts
- React Query

**Backend**
- FastAPI
- Pydantic
- Python 3.11+
- PostgreSQL (future)

**Indexer**
- Python 3.11+
- Requests
- Protocol adapters

## API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

Currently, no authentication required. API key authentication coming soon.

### Endpoints

#### Health Check

```http
GET /api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### List Vaults

```http
GET /api/v1/vaults
```

Query Parameters:
- `chain` (optional): Filter by blockchain
- `protocol` (optional): Filter by protocol
- `min_apy` (optional): Minimum APY threshold

Response:
```json
{
  "vaults": [
    {
      "id": "vault-1",
      "address": "0x1234...",
      "name": "Aave USDC Vault",
      "protocol": "aave",
      "chain": "ethereum",
      "asset": "USDC",
      "apy": 8.5,
      "tvl": 125000000,
      "risk_score": 3.2,
      "strategy": "Lend asset on Aave...",
      "dependencies": ["Chainlink Oracles"],
      "upgradeability": "timelock",
      "oracle_type": "chainlink",
      "liquidity_depth": 250000000,
      "source": "defillama",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Get Vault Details

```http
GET /api/v1/vaults/{address}
```

Path Parameters:
- `address`: Vault contract address

Response: Single vault object (see above)

#### Get Vault Risk Analysis

```http
GET /api/v1/vaults/{address}/risk
```

Path Parameters:
- `address`: Vault contract address

Response:
```json
{
  "vault_id": "vault-1",
  "overall_score": 3.2,
  "level": "low",
  "factors": {
    "protocol_dependency": 3.0,
    "oracle_risk": 2.0,
    "upgradeability_risk": 3.0,
    "liquidity_risk": 5.0
  }
}
```

Risk Levels:
- `low`: Score 0-3
- `medium`: Score 3-6
- `high`: Score 6-10

#### Get Portfolio

```http
GET /api/v1/portfolio/{wallet}
```

Path Parameters:
- `wallet`: Wallet address

Response:
```json
{
  "wallet_address": "0xabcd...",
  "total_value": 500000,
  "positions": [
    {
      "vault_id": "vault-1",
      "vault_name": "Aave USDC Vault",
      "amount": 100000,
      "value_usd": 100000
    }
  ],
  "asset_breakdown": {
    "USDC": 250000,
    "ETH": 150000,
    "DAI": 100000
  },
  "protocol_exposure": {
    "aave": 200000,
    "compound": 300000
  }
}
```

## Risk Model

### Risk Score Calculation

Risk score is a weighted composite (0-10 scale) of four factors:

1. **Protocol Dependency Risk** (30% weight)
   - 0 dependencies: 2.0
   - 1 dependency: 3.0
   - 2 dependencies: 5.0
   - 3 dependencies: 7.0
   - 4+ dependencies: 9.0

2. **Oracle Risk** (25% weight)
   - None: 1.0
   - Chainlink: 2.0
   - Uniswap TWAP: 5.0
   - Internal: 8.0

3. **Upgradeability Risk** (25% weight)
   - Immutable: 1.0
   - Timelock: 3.0
   - Multisig: 6.0
   - EOA: 10.0

4. **Liquidity Risk** (20% weight)
   - Depth/TVL ratio >= 3x: 2.0
   - Depth/TVL ratio >= 2x: 3.0
   - Depth/TVL ratio >= 1.5x: 5.0
   - Depth/TVL ratio >= 1x: 7.0
   - Depth/TVL ratio < 1x: 9.0

### Risk Level Classification

- **Low Risk** (0-3): Conservative, battle-tested protocols
- **Medium Risk** (3-6): Moderate risk, established protocols
- **High Risk** (6-10): Higher risk, complex strategies

## Data Sources

### Current Sources

1. **DeFiLlama Yields API**
   - URL: https://yields.llama.fi/pools
   - Coverage: 100+ protocols across 50+ chains
   - Update frequency: Real-time

### Future Sources

- Yearn Finance API
- Morpho API
- Beefy Finance API
- Direct onchain reads

## Development

### Local Setup

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd defi-vault-intelligence
   ```

2. **Run indexer** (seed data)
   ```bash
   cd indexer
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python run_indexer.py
   ```

3. **Start backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. **Start frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Setup

```bash
docker-compose up
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deployment

### Environment Variables

**Backend**
```env
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=https://yourdomain.com
SEED_DATA_PATH=/app/data/vaults.json
```

**Frontend**
```env
VITE_API_URL=https://api.yourdomain.com
```

### Production Considerations

1. **Security**
   - Add API key authentication
   - Enable rate limiting
   - Use HTTPS
   - Secure CORS origins

2. **Database**
   - Migrate from JSON to PostgreSQL
   - Set up connection pooling
   - Configure backups

3. **Caching**
   - Add Redis for API responses
   - Cache risk calculations
   - TTL based on data freshness

4. **Monitoring**
   - Set up logging
   - Add health checks
   - Monitor API latency
   - Track error rates

## Support

- GitHub Issues: [project-repo]/issues
- Documentation: /docs
- API Reference: http://localhost:8000/docs

## License

MIT
