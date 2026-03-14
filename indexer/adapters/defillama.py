import requests
import os
from typing import List, Optional
from datetime import datetime
from adapters.base import BaseAdapter
from schemas.vault import NormalizedVault, RawVaultData


class DeFiLlamaAdapter(BaseAdapter):
    """Adapter for DeFiLlama Yields API"""
    
    def __init__(self, api_url: Optional[str] = None):
        self.api_url = api_url or os.getenv("DEFILLAMA_API_URL", "https://yields.llama.fi")
        self.pools_endpoint = f"{self.api_url}/pools"
    
    def get_source_name(self) -> str:
        return "defillama"
    
    def fetch_vaults(self, limit: int = 100) -> List[NormalizedVault]:
        """
        Fetch vault data from DeFiLlama and normalize it.
        
        Args:
            limit: Maximum number of vaults to return
        
        Returns:
            List of normalized vault objects
        """
        print(f"Fetching vaults from DeFiLlama API: {self.pools_endpoint}")
        
        try:
            response = requests.get(self.pools_endpoint, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            pools = data.get("data", [])
            print(f"Found {len(pools)} total pools from DeFiLlama")
            
            normalized_vaults = []
            
            for pool in pools[:limit]:
                try:
                    normalized = self._normalize_pool(pool)
                    if normalized:
                        normalized_vaults.append(normalized)
                except Exception as e:
                    print(f"Error normalizing pool {pool.get('pool', 'unknown')}: {e}")
                    continue
            
            print(f"Successfully normalized {len(normalized_vaults)} vaults")
            return normalized_vaults
            
        except requests.RequestException as e:
            print(f"Error fetching from DeFiLlama API: {e}")
            return []
    
    def _normalize_pool(self, pool: dict) -> Optional[NormalizedVault]:
        """Normalize a DeFiLlama pool to our vault schema"""
        
        tvl = pool.get("tvlUsd", 0)
        if tvl < 10000:
            return None
        
        apy = pool.get("apy", 0)
        if apy <= 0 or apy > 1000:
            return None
        
        pool_id = pool.get("pool", "")
        chain = pool.get("chain", "unknown").lower()
        project = pool.get("project", "unknown").lower()
        symbol = pool.get("symbol", "Unknown")
        
        asset = self._extract_asset(symbol)
        
        strategy = self._infer_strategy(project, symbol)
        dependencies = self._infer_dependencies(project)
        upgradeability = self._infer_upgradeability(project)
        oracle_type = self._infer_oracle_type(project)
        
        liquidity_depth = tvl * 1.5
        
        vault_id = pool_id.replace("-", "_")
        
        address = pool.get("poolMeta", pool_id)
        if isinstance(address, str) and not address.startswith("0x"):
            address = f"0x{hash(address) % (10 ** 40):040x}"
        elif not isinstance(address, str):
            address = f"0x{hash(pool_id) % (10 ** 40):040x}"
        
        return NormalizedVault(
            id=vault_id,
            address=address,
            name=f"{project.title()} {symbol} Vault",
            protocol=project,
            chain=chain,
            asset=asset,
            apy=round(apy, 2),
            tvl=tvl,
            strategy=strategy,
            dependencies=dependencies,
            upgradeability=upgradeability,
            oracle_type=oracle_type,
            liquidity_depth=liquidity_depth,
            source="defillama",
            updated_at=datetime.utcnow().isoformat(),
        )
    
    def _extract_asset(self, symbol: str) -> str:
        """Extract primary asset from symbol"""
        common_assets = ["USDC", "USDT", "DAI", "ETH", "WETH", "WBTC", "BTC"]
        
        symbol_upper = symbol.upper()
        for asset in common_assets:
            if asset in symbol_upper:
                return asset
        
        parts = symbol.split("-")
        return parts[0] if parts else symbol
    
    def _infer_strategy(self, project: str, symbol: str) -> str:
        """Infer strategy description from project and symbol"""
        strategies = {
            "aave": "Lend asset on Aave money market, earn interest from borrowers",
            "compound": "Supply asset to Compound protocol, earn COMP rewards",
            "curve": "Provide liquidity to Curve stablecoin pool, earn trading fees",
            "convex": "Stake Curve LP tokens on Convex, earn boosted CRV + CVX rewards",
            "yearn": "Auto-compound strategy optimizing yield across protocols",
            "lido": "Stake ETH with Lido, earn staking rewards as stETH",
            "uniswap": "Provide liquidity to Uniswap pool, earn trading fees",
            "balancer": "Provide liquidity to Balancer pool, earn fees and BAL rewards",
        }
        return strategies.get(project, f"Yield optimization strategy for {symbol}")
    
    def _infer_dependencies(self, project: str) -> List[str]:
        """Infer protocol dependencies"""
        deps_map = {
            "aave": ["Chainlink Oracles"],
            "compound": ["Chainlink Oracles", "Uniswap V3"],
            "curve": ["Chainlink Oracles"],
            "convex": ["Curve Finance", "Chainlink Oracles"],
            "yearn": ["Curve Finance", "Uniswap V3"],
            "balancer": ["Chainlink Oracles"],
        }
        return deps_map.get(project, [])
    
    def _infer_upgradeability(self, project: str) -> str:
        """Infer upgradeability pattern"""
        patterns = {
            "compound": "timelock",
            "aave": "timelock",
            "maker": "timelock",
            "uniswap": "immutable",
            "curve": "multisig",
            "yearn": "multisig",
        }
        return patterns.get(project, "timelock")
    
    def _infer_oracle_type(self, project: str) -> str:
        """Infer oracle type"""
        oracle_map = {
            "aave": "chainlink",
            "compound": "chainlink",
            "maker": "chainlink",
            "uniswap": "uniswap",
            "curve": "internal",
        }
        return oracle_map.get(project, "chainlink")
