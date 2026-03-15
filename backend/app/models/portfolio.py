from pydantic import BaseModel, Field
from datetime import datetime

class Chain(str, Enum


    bsc = "bsc"

    dao = "dao"
    family_office

class PositionResponse(
    portfolio_i


    shares: float
    pnl_percent
    share_of_portfolio: float
    entry_price: Optional[float] = 
    updated_at: datetime


    percentage: float

class ProtocolExposur
    value: float
    vaults: int

class ChainExp
    value: float
    positions: in

    strategy: str
    percentage

class RiskMetric
    risk_adjusted_return: float
    liquidity_risk: float



    daily_change_percent: float
    yield_rate
    protocol_cou
    avg_risk_score: f
    updated_at: datetime


    owner_type: OwnerType
    daily_change:
    total_yield_
    risk_score: float

class PositionsResp



    wallet_addre
    protocol_exp
    strategy_exposure
    top_protocols:


    risk_metrics: RiskMetrics
    performance_3

































































