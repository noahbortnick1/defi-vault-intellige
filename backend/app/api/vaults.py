from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.models.vault import VaultListResponse, Vault, RiskAnalysis, Portfolio
from app.services.vault_service import get_vault_service
from app.services.risk import calculate_risk_score

router = APIRouter(prefix="/api/v1", tags=["vaults"])


@router.get("/vaults", response_model=VaultListResponse)
async def get_vaults(
    chain: Optional[str] = Query(None, description="Filter by blockchain"),
    protocol: Optional[str] = Query(None, description="Filter by protocol"),
    min_apy: Optional[float] = Query(None, description="Minimum APY threshold"),
):
    """
    Retrieve all vaults with optional filtering.
    
    - **chain**: Filter by blockchain (ethereum, arbitrum, optimism, etc.)
    - **protocol**: Filter by protocol (aave, compound, yearn, etc.)
    - **min_apy**: Minimum APY threshold
    """
    service = get_vault_service()
    vaults = service.get_all_vaults(chain=chain, protocol=protocol, min_apy=min_apy)
    
    return VaultListResponse(vaults=vaults, count=len(vaults))


@router.get("/vaults/{address}", response_model=Vault)
async def get_vault(address: str):
    """
    Get detailed information about a specific vault.
    
    - **address**: Vault contract address
    """
    service = get_vault_service()
    vault = service.get_vault_by_address(address)
    
    if not vault:
        raise HTTPException(status_code=404, detail="Vault not found")
    
    return vault


@router.get("/vaults/{address}/risk", response_model=RiskAnalysis)
async def get_vault_risk(address: str):
    """
    Calculate and retrieve risk analysis for a vault.
    
    - **address**: Vault contract address
    
    Returns a composite risk score (0-10) with factor breakdown:
    - Protocol dependency risk
    - Oracle risk
    - Upgradeability risk
    - Liquidity risk
    """
    service = get_vault_service()
    vault = service.get_vault_by_address(address)
    
    if not vault:
        raise HTTPException(status_code=404, detail="Vault not found")
    
    return calculate_risk_score(vault)


@router.get("/portfolio/{wallet}", response_model=Portfolio)
async def get_portfolio(wallet: str):
    """
    Retrieve portfolio positions and analytics for a wallet.
    
    - **wallet**: Wallet address
    
    Returns:
    - Total portfolio value
    - Individual vault positions
    - Asset breakdown
    - Protocol exposure
    """
    service = get_vault_service()
    portfolio = service.get_portfolio(wallet)
    
    return portfolio
