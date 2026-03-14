# DeFi Vault Intelligence - Indexer

Data indexer that fetches and normalizes vault data from multiple sources.

## Features

- **DeFiLlama adapter**: Fetch yield data from DeFiLlama Yields API
- **Extensible architecture**: Easy to add new protocol adapters
- **Data normalization**: Converts diverse data formats to unified schema
- **JSON export**: Saves normalized data for backend consumption

## Setup

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## Usage

### Run the indexer

```bash
python run_indexer.py
```

This will:
1. Fetch vault data from DeFiLlama
2. Normalize the data
3. Save to `./data/vaults.json`
4. Generate statistics in `./data/stats.json`

### Output

The indexer creates:

- **`data/vaults.json`** - Normalized vault data
- **`data/stats.json`** - Indexing statistics

## Project Structure

```
indexer/
├── adapters/
│   ├── __init__.py
│   ├── base.py           # Base adapter interface
│   └── defillama.py      # DeFiLlama adapter
├── schemas/
│   ├── __init__.py
│   └── vault.py          # Vault data schemas
├── data/                 # Output directory
│   ├── vaults.json
│   └── stats.json
├── run_indexer.py        # Main entry point
├── requirements.txt
└── .env.example
```

## Adding New Adapters

To add support for a new protocol:

1. Create adapter in `adapters/`:

```python
from adapters.base import BaseAdapter
from schemas.vault import NormalizedVault

class YearnAdapter(BaseAdapter):
    def get_source_name(self) -> str:
        return "yearn"
    
    def fetch_vaults(self) -> List[NormalizedVault]:
        # Implement fetching logic
        pass
```

2. Import and run in `run_indexer.py`:

```python
from adapters.yearn import YearnAdapter

yearn = YearnAdapter()
vaults.extend(yearn.fetch_vaults())
```

## Data Schema

The normalized vault schema includes:

- `id` - Unique identifier
- `address` - Contract address
- `name` - Vault name
- `protocol` - Protocol (aave, compound, etc.)
- `chain` - Blockchain
- `asset` - Primary asset
- `apy` - Annual percentage yield
- `tvl` - Total value locked
- `strategy` - Strategy description
- `dependencies` - Protocol dependencies
- `oracle_type` - Oracle system used
- `upgradeability` - Upgrade pattern
- `liquidity_depth` - Available liquidity
- `source` - Data source
- `updated_at` - Last update timestamp

## Future Protocol Adapters

Planned adapters:

- [ ] Yearn Finance
- [ ] Morpho
- [ ] Beefy Finance
- [ ] Pendle
- [ ] Enzyme Finance
- [ ] Lagoon
- [ ] Kamino
- [ ] IPOR

## Notes

- The indexer fetches up to 100 vaults by default (configurable)
- Only includes vaults with TVL > $10,000
- Filters out invalid APY values (0% or > 1000%)
- Generates deterministic addresses for pools without explicit addresses
