from pydantic import BaseModel, Field
from typing import Literal, List, Optional
from datetime import datetime


class RawVaultData(BaseModel):
    """Raw vault data from external source"""
    pool_id: str
    chain: str
    project: str
    symbol: str
    tvl_usd: float
    apy: float
    apy_base: Optional[float] = None
    apy_reward: Optional[float] = None
    pool: Optional[str] = None


class NormalizedVault(BaseModel):
    """Normalized vault data for our system"""
    id: str
    address: str
    name: str
    protocol: str
    chain: str
    asset: str
    apy: float
    tvl: float
    strategy: str
    dependencies: List[str] = Field(default_factory=list)
    upgradeability: Literal["immutable", "timelock", "multisig", "eoa"] = "timelock"
    oracle_type: Literal["chainlink", "uniswap", "internal", "none"] = "chainlink"
    liquidity_depth: float = 0.0
    source: str = "defillama"
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True
