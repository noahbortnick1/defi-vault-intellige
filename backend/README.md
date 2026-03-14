# DeFi Vault Intelligence - Backend API

FastAPI backend service providing vault analytics and risk assessment.

## Setup

### Install Dependencies

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` as needed.

### Run Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

Or using Python directly:

```bash
python -m app.main
```

## API Documentation

Once running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app & config
│   ├── api/
│   │   ├── __init__.py
│   │   └── vaults.py        # Vault endpoints
│   ├── models/
│   │   ├── __init__.py
│   │   └── vault.py         # Pydantic schemas
│   └── services/
│       ├── __init__.py
│       ├── risk.py          # Risk calculation
│       └── vault_service.py # Vault data service
├── requirements.txt
└── .env.example
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/vaults` | List all vaults |
| GET | `/api/v1/vaults/{address}` | Get vault details |
| GET | `/api/v1/vaults/{address}/risk` | Get risk analysis |
| GET | `/api/v1/portfolio/{wallet}` | Get portfolio |

## Development

The service loads seed data from `../indexer/data/vaults.json` if available, otherwise generates mock data.

To use real indexed data:
1. Run the indexer first: `cd ../indexer && python run_indexer.py`
2. Start the backend: `uvicorn app.main:app --reload`
