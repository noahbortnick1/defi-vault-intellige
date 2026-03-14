from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict
from datetime import datetime


class VaultBase(BaseModel):
    id: str
    address: str
    name: str
    protocol: str
    chain: str
    asset: str
    apy: float
    tvl: float
    strategy: str
    dependencies: List[str] = []
    upgradeability: Literal["immutable", "timelock", "multisig", "eoa"]
    oracle_type: Literal["chainlink", "uniswap", "internal", "none"]
    liquidity_depth: float
    source: str = "defillama"
    updated_at: Optional[datetime] = None


class Vault(VaultBase):
    risk_score: float = 0.0

    class Config:
        from_attributes = True


class RiskFactors(BaseModel):
    protocol_dependency: float = Field(..., ge=0, le=10)
    oracle_risk: float = Field(..., ge=0, le=10)
    upgradeability_risk: float = Field(..., ge=0, le=10)
    liquidity_risk: float = Field(..., ge=0, le=10)


class RiskAnalysis(BaseModel):
    vault_id: str
    overall_score: float = Field(..., ge=0, le=10)
    level: Literal["low", "medium", "high"]
    factors: RiskFactors


class PortfolioPosition(BaseModel):
    vault_id: str
    vault_name: str
    amount: float
    value_usd: float


class Portfolio(BaseModel):
    wallet_address: str
    total_value: float
    positions: List[PortfolioPosition]
    asset_breakdown: Dict[str, float]
    protocol_exposure: Dict[str, float]


class VaultListResponse(BaseModel):
    vaults: List[Vault]
    count: int


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
