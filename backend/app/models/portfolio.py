from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum


class Chain(str, Enum):
    ethereum = "ethereum"
    arbitrum = "arbitrum"
    base = "base"
    optimism = "optimism"
    polygon = "polygon"
    bsc = "bsc"


class OwnerType(str, Enum):
    dao = "dao"
    hedge_fund = "hedge-fund"
    family_office = "family-office"
    individual = "individual"


class PositionResponse(BaseModel):
    id: str
    portfolio_id: str
    vault_id: str
    vault_name: str
    protocol: str
    asset: str
    value: float
    shares: float
    pnl: float
    pnl_percent: float
    apy: float
    share_of_portfolio: float
    chain: Chain
    entry_price: Optional[float] = None
    current_price: Optional[float] = None
    updated_at: datetime


class AssetBreakdown(BaseModel):
    asset: str
    value: float
    percentage: float
    chains: Dict[str, float]


class ProtocolExposure(BaseModel):
    protocol: str
    value: float
    percentage: float
    vaults: int
    avg_risk: float


class ChainExposure(BaseModel):
    chain: Chain
    value: float
    percentage: float
    positions: int


class StrategyExposure(BaseModel):
    strategy: str
    value: float
    percentage: float
    positions: int


class RiskMetrics(BaseModel):
    overall_risk: float
    risk_adjusted_return: float
    concentration_risk: float
    liquidity_risk: float
    protocol_risk: float


class PortfolioSummary(BaseModel):
    wallet_address: str
    total_value: float
    daily_change: float
    daily_change_percent: float
    total_yield_earned: float
    yield_rate_30d: float
    position_count: int
    protocol_count: int
    chain_count: int
    avg_risk_score: float
    last_rebalance: Optional[datetime] = None
    updated_at: datetime


class PortfolioResponse(BaseModel):
    wallet_address: str
    name: Optional[str] = None
    owner_type: OwnerType
    total_value: float
    daily_change: float
    daily_change_percent: float
    total_yield_earned: float
    position_count: int
    risk_score: float
    updated_at: datetime


class PositionsResponse(BaseModel):
    wallet_address: str
    positions: List[PositionResponse]
    total_positions: int
    total_value: float


class ExposureResponse(BaseModel):
    wallet_address: str
    asset_breakdown: List[AssetBreakdown]
    protocol_exposure: List[ProtocolExposure]
    chain_exposure: List[ChainExposure]
    strategy_exposure: List[StrategyExposure]
    top_assets: List[str]
    top_protocols: List[str]


class PortfolioSummaryResponse(BaseModel):
    wallet_address: str
    summary: PortfolioSummary
    risk_metrics: RiskMetrics
    performance_7d: float
    performance_30d: float
    performance_90d: float
