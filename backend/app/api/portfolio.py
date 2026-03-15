from fastapi import APIRouter, HTTPException, Path
from app.models.portfolio import (
    PortfolioResponse,
    PositionsResponse,
    ExposureResponse,
    PortfolioSummaryResponse,
)
from app.services.portfolio_service import portfolio_service

router = APIRouter(prefix="/api/v1/portfolio", tags=["portfolio"])


@router.get(
    "/{wallet}",
    response_model=PortfolioResponse,
    summary="Get portfolio overview",
    description="Retrieve portfolio overview including total value, positions count, and risk metrics for a specific wallet address.",
)
async def get_portfolio(
    wallet: str = Path(..., description="Wallet address (Ethereum format)")
):
    """
    Get portfolio overview for a wallet address.
    
    Returns:
    - wallet_address
    - name (if available)
    - owner_type
    - total_value
    - daily_change
    - total_yield_earned
    - position_count
    - risk_score
    """
    portfolio = portfolio_service.get_portfolio(wallet)
    if not portfolio:
        raise HTTPException(
            status_code=404,
            detail=f"Portfolio not found for wallet {wallet}. Try one of the demo wallets: 0x1234567890abcdef1234567890abcdef12345678, 0xabcdef1234567890abcdef1234567890abcdef12, or 0xfedcba0987654321fedcba0987654321fedcba09"
        )
    return portfolio


@router.get(
    "/{wallet}/positions",
    response_model=PositionsResponse,
    summary="Get portfolio positions",
    description="Retrieve detailed list of all positions in a portfolio including vault allocations, PnL, and performance metrics.",
)
async def get_positions(
    wallet: str = Path(..., description="Wallet address (Ethereum format)")
):
    """
    Get all positions for a wallet's portfolio.
    
    Returns:
    - wallet_address
    - positions[] (detailed position data)
    - total_positions
    - total_value
    
    Each position includes:
    - vault_id and vault_name
    - protocol
    - asset
    - value and shares
    - pnl and pnl_percent
    - apy
    - share_of_portfolio
    - chain
    """
    positions = portfolio_service.get_positions(wallet)
    if not positions:
        raise HTTPException(
            status_code=404,
            detail=f"Portfolio not found for wallet {wallet}"
        )
    return positions


@router.get(
    "/{wallet}/exposure",
    response_model=ExposureResponse,
    summary="Get portfolio exposure analysis",
    description="Retrieve portfolio exposure breakdown by asset, protocol, chain, and strategy type.",
)
async def get_exposure(
    wallet: str = Path(..., description="Wallet address (Ethereum format)")
):
    """
    Get exposure analysis for a portfolio.
    
    Returns:
    - asset_breakdown (by asset with chain distribution)
    - protocol_exposure (by protocol with vault count)
    - chain_exposure (by blockchain)
    - strategy_exposure (by strategy type)
    - top_assets (list)
    - top_protocols (list)
    """
    exposure = portfolio_service.get_exposure(wallet)
    if not exposure:
        raise HTTPException(
            status_code=404,
            detail=f"Portfolio not found for wallet {wallet}"
        )
    return exposure


@router.get(
    "/{wallet}/summary",
    response_model=PortfolioSummaryResponse,
    summary="Get comprehensive portfolio summary",
    description="Retrieve comprehensive portfolio summary with performance metrics, risk analysis, and historical returns.",
)
async def get_summary(
    wallet: str = Path(..., description="Wallet address (Ethereum format)")
):
    """
    Get comprehensive summary for a portfolio.
    
    Returns:
    - summary (overall portfolio metrics)
    - risk_metrics (risk analysis)
    - performance_7d, performance_30d, performance_90d
    
    Summary includes:
    - total_value
    - daily_change
    - total_yield_earned
    - yield_rate_30d
    - position_count, protocol_count, chain_count
    - avg_risk_score
    
    Risk metrics include:
    - overall_risk
    - risk_adjusted_return
    - concentration_risk
    - liquidity_risk
    - protocol_risk
    """
    summary = portfolio_service.get_summary(wallet)
    if not summary:
        raise HTTPException(
            status_code=404,
            detail=f"Portfolio not found for wallet {wallet}"
        )
    return summary
