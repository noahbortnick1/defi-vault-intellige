# Portfolio API Layer

This document describes the real portfolio API layer added to Yield Terminal, designed for institutional DeFi treasury management.

## Overview

The portfolio API provides comprehensive endpoints for tracking, analyzing, and monitoring DeFi portfolio exposures across multiple chains and protocols.

## Architecture

The portfolio system is structured in three layers:

```
Frontend (React/TypeScript)
    ↓
API Service Layer (TypeScript)
    ↓
Backend Endpoints (FastAPI/Python)
    ↓
Data Adapters (Seeded → Future: Onchain)
```

## API Endpoints

### 1. GET /api/v1/portfolio/:wallet

Get portfolio overview for a wallet address.

**Response:**
```json
{
  "wallet_address": "0x...",
  "name": "Axiom DAO Treasury",
  "owner_type": "dao",
  "total_value": 12450000,
  "daily_change": 45200,
  "daily_change_percent": 0.36,
  "total_yield_earned": 530000,
  "position_count": 5,
  "risk_score": 2.8,
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### 2. GET /api/v1/portfolio/:wallet/positions

Get detailed list of all positions in a portfolio.

**Response:**
```json
{
  "wallet_address": "0x...",
  "positions": [
    {
      "id": "pos-123",
      "portfolio_id": "0x...",
      "vault_id": "vault-yearn-usdc",
      "vault_name": "Yearn USDC Vault",
      "protocol": "Yearn",
      "asset": "USDC",
      "value": 4200000,
      "shares": 4180000,
      "pnl": 142000,
      "pnl_percent": 3.5,
      "apy": 6.2,
      "share_of_portfolio": 33.73,
      "chain": "ethereum",
      "entry_price": 1.0,
      "current_price": 1.034,
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total_positions": 5,
  "total_value": 12450000
}
```

### 3. GET /api/v1/portfolio/:wallet/exposure

Get exposure breakdown by asset, protocol, chain, and strategy.

**Response:**
```json
{
  "wallet_address": "0x...",
  "asset_breakdown": [
    {
      "asset": "USDC",
      "value": 8750000,
      "percentage": 70.28,
      "chains": {
        "ethereum": 5300000,
        "arbitrum": 3450000
      }
    }
  ],
  "protocol_exposure": [
    {
      "protocol": "Yearn",
      "value": 4200000,
      "percentage": 33.73,
      "vaults": 2,
      "avg_risk": 2.1
    }
  ],
  "chain_exposure": [
    {
      "chain": "ethereum",
      "value": 10550000,
      "percentage": 84.72,
      "positions": 4
    }
  ],
  "strategy_exposure": [
    {
      "strategy": "Lending",
      "value": 8092500,
      "percentage": 65,
      "positions": 5
    }
  ],
  "top_assets": ["USDC", "ETH", "WBTC"],
  "top_protocols": ["Yearn", "Morpho", "Aave"]
}
```

### 4. GET /api/v1/portfolio/:wallet/summary

Get comprehensive summary with risk metrics and performance.

**Response:**
```json
{
  "wallet_address": "0x...",
  "summary": {
    "wallet_address": "0x...",
    "total_value": 12450000,
    "daily_change": 45200,
    "daily_change_percent": 0.36,
    "total_yield_earned": 530000,
    "yield_rate_30d": 4.2,
    "position_count": 5,
    "protocol_count": 3,
    "chain_count": 2,
    "avg_risk_score": 2.8,
    "last_rebalance": "2024-01-08T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "risk_metrics": {
    "overall_risk": 2.8,
    "risk_adjusted_return": 1.52,
    "concentration_risk": 3.37,
    "liquidity_risk": 2.1,
    "protocol_risk": 2.24
  },
  "performance_7d": 1.8,
  "performance_30d": 4.2,
  "performance_90d": 12.6
}
```

## Demo Wallets

Three seeded demo wallets are available for testing:

1. **Axiom DAO Treasury**
   - Address: `0x1234567890abcdef1234567890abcdef12345678`
   - Type: DAO
   - Value: $12.45M

2. **Titan Capital Fund**
   - Address: `0xabcdef1234567890abcdef1234567890abcdef12`
   - Type: Hedge Fund
   - Value: $28.75M

3. **Sterling Family Office**
   - Address: `0xfedcba0987654321fedcba0987654321fedcba09`
   - Type: Family Office
   - Value: $8.92M

## Frontend Integration

The frontend includes a TypeScript API service layer at `src/lib/portfolioApi.ts`:

```typescript
import { portfolioApi } from '@/lib/portfolioApi';

// Get portfolio
const portfolio = await portfolioApi.getPortfolio(walletAddress);

// Get positions
const positions = await portfolioApi.getPositions(walletAddress);

// Get exposure
const exposure = await portfolioApi.getExposure(walletAddress);

// Get summary
const summary = await portfolioApi.getSummary(walletAddress);
```

## Extending with Real Onchain Data

The backend is structured to support pluggable data adapters. To add real onchain tracking:

### 1. EOA Wallet Adapter

Track standard Ethereum addresses:

```python
# backend/app/adapters/eoa_adapter.py

class EOAAdapter:
    async def get_balances(self, address: str):
        # Fetch ERC20 balances from RPC
        pass
    
    async def get_defi_positions(self, address: str):
        # Scan for vault positions
        pass
```

### 2. Safe Multisig Adapter

Track Gnosis Safe treasuries:

```python
# backend/app/adapters/safe_adapter.py

class SafeAdapter:
    async def get_safe_info(self, address: str):
        # Fetch from Safe API
        pass
```

### 3. Vault Position Adapter

Detect vault positions across protocols:

```python
# backend/app/adapters/vault_adapter.py

class VaultPositionAdapter:
    protocols = ['yearn', 'morpho', 'aave', 'compound']
    
    async def scan_positions(self, address: str):
        # Check balance in known vault contracts
        pass
```

### 4. Lending Position Adapter

Track lending protocol positions:

```python
# backend/app/adapters/lending_adapter.py

class LendingAdapter:
    async def get_aave_positions(self, address: str):
        pass
    
    async def get_compound_positions(self, address: str):
        pass
```

### 5. LP Position Adapter

Track liquidity pool positions:

```python
# backend/app/adapters/lp_adapter.py

class LPAdapter:
    async def get_uniswap_positions(self, address: str):
        pass
    
    async def get_curve_positions(self, address: str):
        pass
```

## Data Flow for Real Implementation

```
User Input (Wallet Address)
    ↓
API Endpoint
    ↓
Portfolio Service
    ↓
┌───────────────┴──────────────┐
│                               │
EOA Adapter              Safe Adapter
    ↓                            ↓
Token Balances           Safe Balances
    ↓                            ↓
┌───────────────┬────────────────┴───────────────┐
│               │                                 │
Vault Adapter   Lending Adapter           LP Adapter
    ↓               ↓                             ↓
Vault Positions  Lending Positions         LP Positions
    │               │                             │
    └───────────────┴─────────────────────────────┘
                    ↓
            Aggregate & Calculate
                    ↓
            Return to Frontend
```

## Configuration

Set the API URL in your environment:

```bash
# Frontend .env
VITE_API_URL=http://localhost:8000

# Backend .env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Running the System

### Start Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Start Frontend

```bash
npm run dev
```

### Access API Docs

Visit `http://localhost:8000/docs` for interactive API documentation.

## Future Enhancements

1. **Real-time Updates**: WebSocket support for live portfolio updates
2. **Historical Data**: Time-series storage for portfolio performance tracking
3. **Multi-chain Support**: Expand to Solana, Cosmos, etc.
4. **Advanced Analytics**: Correlation analysis, risk-adjusted returns
5. **Alert System**: Price alerts, rebalancing suggestions
6. **Export Options**: PDF reports, CSV exports
7. **Benchmarking**: Compare against indices or peer portfolios

## Security Considerations

- Never store private keys
- Use read-only RPC endpoints
- Implement rate limiting
- Add authentication for production
- Validate all wallet addresses
- Sanitize user inputs

## API Portability

This API layer is designed to be portable outside Spark:

- Standard FastAPI backend
- RESTful endpoints
- JSON responses
- No Spark-specific dependencies
- Can be deployed to any Python hosting platform
- Frontend can consume from any HTTP client

## Support

For questions or issues with the portfolio API:

1. Check API docs at `/docs`
2. Review error messages in API responses
3. Verify wallet address format
4. Ensure backend is running
5. Check CORS configuration
