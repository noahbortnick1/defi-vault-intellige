from typing import Dict, List, Optional
from datetime import datetime, timedelta
import random
from app.models.portfolio import (
    PortfolioResponse,
    PositionsResponse,
    ExposureResponse,
    PortfolioSummaryResponse,
    PositionResponse,
    AssetBreakdown,
    ProtocolExposure,
    ChainExposure,
    StrategyExposure,
    RiskMetrics,
    PortfolioSummary,
    Chain,
    OwnerType,
)

SEEDED_PORTFOLIOS = {
    "0x1234567890abcdef1234567890abcdef12345678": {
        "name": "Axiom DAO Treasury",
        "owner_type": OwnerType.dao,
        "total_value": 12_450_000,
        "daily_change": 45_200,
        "risk_score": 2.8,
        "positions": [
            {
                "vault_id": "vault-yearn-usdc",
                "vault_name": "Yearn USDC Vault",
                "protocol": "Yearn",
                "asset": "USDC",
                "value": 4_200_000,
                "shares": 4_180_000,
                "pnl": 142_000,
                "apy": 6.2,
                "chain": Chain.ethereum,
                "entry_price": 1.0,
                "current_price": 1.034,
            },
            {
                "vault_id": "vault-morpho-usdc",
                "vault_name": "Morpho USDC Optimizer",
                "protocol": "Morpho",
                "asset": "USDC",
                "value": 3_100_000,
                "shares": 3_050_000,
                "pnl": 95_000,
                "apy": 8.4,
                "chain": Chain.ethereum,
                "entry_price": 1.0,
                "current_price": 1.016,
            },
            {
                "vault_id": "vault-aave-eth",
                "vault_name": "Aave ETH Lending",
                "protocol": "Aave",
                "asset": "ETH",
                "value": 2_800_000,
                "shares": 1200,
                "pnl": 180_000,
                "apy": 3.8,
                "chain": Chain.ethereum,
                "entry_price": 2180.0,
                "current_price": 2333.0,
            },
            {
                "vault_id": "vault-pendle-pt-usdc",
                "vault_name": "Pendle PT-USDC",
                "protocol": "Pendle",
                "asset": "USDC",
                "value": 1_450_000,
                "shares": 1_430_000,
                "pnl": 68_000,
                "apy": 12.8,
                "chain": Chain.arbitrum,
                "entry_price": 1.0,
                "current_price": 1.014,
            },
            {
                "vault_id": "vault-beefy-wbtc",
                "vault_name": "Beefy WBTC Vault",
                "protocol": "Beefy",
                "asset": "WBTC",
                "value": 900_000,
                "shares": 18.5,
                "pnl": 45_000,
                "apy": 4.2,
                "chain": Chain.arbitrum,
                "entry_price": 46200.0,
                "current_price": 48648.0,
            },
        ],
    },
    "0xabcdef1234567890abcdef1234567890abcdef12": {
        "name": "Titan Capital Fund",
        "owner_type": OwnerType.hedge_fund,
        "total_value": 28_750_000,
        "daily_change": -125_000,
        "risk_score": 4.2,
        "positions": [
            {
                "vault_id": "vault-morpho-eth",
                "vault_name": "Morpho ETH Vault",
                "protocol": "Morpho",
                "asset": "ETH",
                "value": 8_500_000,
                "shares": 3640,
                "pnl": 420_000,
                "apy": 7.1,
                "chain": Chain.ethereum,
                "entry_price": 2280.0,
                "current_price": 2333.0,
            },
            {
                "vault_id": "vault-pendle-yt-eth",
                "vault_name": "Pendle YT-ETH",
                "protocol": "Pendle",
                "asset": "ETH",
                "value": 6_200_000,
                "shares": 2658,
                "pnl": -180_000,
                "apy": 18.4,
                "chain": Chain.arbitrum,
                "entry_price": 2400.0,
                "current_price": 2333.0,
            },
            {
                "vault_id": "vault-yearn-dai",
                "vault_name": "Yearn DAI Vault",
                "protocol": "Yearn",
                "asset": "DAI",
                "value": 5_800_000,
                "shares": 5_770_000,
                "pnl": 210_000,
                "apy": 5.9,
                "chain": Chain.ethereum,
                "entry_price": 1.0,
                "current_price": 1.005,
            },
            {
                "vault_id": "vault-curve-3pool",
                "vault_name": "Curve 3Pool Vault",
                "protocol": "Curve",
                "asset": "3CRV",
                "value": 4_100_000,
                "shares": 4_080_000,
                "pnl": 125_000,
                "apy": 6.8,
                "chain": Chain.ethereum,
                "entry_price": 1.0,
                "current_price": 1.005,
            },
            {
                "vault_id": "vault-gmx-glp",
                "vault_name": "GMX GLP Vault",
                "protocol": "GMX",
                "asset": "GLP",
                "value": 4_150_000,
                "shares": 4_100_000,
                "pnl": 180_000,
                "apy": 15.2,
                "chain": Chain.arbitrum,
                "entry_price": 1.0,
                "current_price": 1.012,
            },
        ],
    },
    "0xfedcba0987654321fedcba0987654321fedcba09": {
        "name": "Sterling Family Office",
        "owner_type": OwnerType.family_office,
        "total_value": 8_920_000,
        "daily_change": 28_500,
        "risk_score": 2.1,
        "positions": [
            {
                "vault_id": "vault-aave-usdc",
                "vault_name": "Aave USDC Lending",
                "protocol": "Aave",
                "asset": "USDC",
                "value": 3_200_000,
                "shares": 3_180_000,
                "pnl": 98_000,
                "apy": 4.2,
                "chain": Chain.ethereum,
                "entry_price": 1.0,
                "current_price": 1.006,
            },
            {
                "vault_id": "vault-yearn-usdc",
                "vault_name": "Yearn USDC Vault",
                "protocol": "Yearn",
                "asset": "USDC",
                "value": 2_800_000,
                "shares": 2_780_000,
                "pnl": 85_000,
                "apy": 6.2,
                "chain": Chain.ethereum,
                "entry_price": 1.0,
                "current_price": 1.007,
            },
            {
                "vault_id": "vault-compound-eth",
                "vault_name": "Compound ETH",
                "protocol": "Compound",
                "asset": "ETH",
                "value": 1_920_000,
                "shares": 823,
                "pnl": 110_000,
                "apy": 3.5,
                "chain": Chain.ethereum,
                "entry_price": 2200.0,
                "current_price": 2333.0,
            },
            {
                "vault_id": "vault-spark-dai",
                "vault_name": "Spark DAI",
                "protocol": "Spark",
                "asset": "DAI",
                "value": 1_000_000,
                "shares": 998_000,
                "pnl": 32_000,
                "apy": 5.1,
                "chain": Chain.ethereum,
                "entry_price": 1.0,
                "current_price": 1.002,
            },
        ],
    },
}


class PortfolioService:
    def __init__(self):
        self.portfolios = SEEDED_PORTFOLIOS

    def get_portfolio(self, wallet_address: str) -> Optional[PortfolioResponse]:
        portfolio = self.portfolios.get(wallet_address.lower())
        if not portfolio:
            return None

        return PortfolioResponse(
            wallet_address=wallet_address,
            name=portfolio["name"],
            owner_type=portfolio["owner_type"],
            total_value=portfolio["total_value"],
            daily_change=portfolio["daily_change"],
            daily_change_percent=(portfolio["daily_change"] / portfolio["total_value"]) * 100,
            total_yield_earned=sum(p["pnl"] for p in portfolio["positions"]),
            position_count=len(portfolio["positions"]),
            risk_score=portfolio["risk_score"],
            updated_at=datetime.utcnow(),
        )

    def get_positions(self, wallet_address: str) -> Optional[PositionsResponse]:
        portfolio = self.portfolios.get(wallet_address.lower())
        if not portfolio:
            return None

        positions = []
        for idx, pos in enumerate(portfolio["positions"]):
            pnl_percent = (pos["pnl"] / (pos["value"] - pos["pnl"])) * 100 if pos["value"] > pos["pnl"] else 0
            share_of_portfolio = (pos["value"] / portfolio["total_value"]) * 100

            positions.append(
                PositionResponse(
                    id=f"pos-{wallet_address[:10]}-{idx}",
                    portfolio_id=wallet_address,
                    vault_id=pos["vault_id"],
                    vault_name=pos["vault_name"],
                    protocol=pos["protocol"],
                    asset=pos["asset"],
                    value=pos["value"],
                    shares=pos["shares"],
                    pnl=pos["pnl"],
                    pnl_percent=pnl_percent,
                    apy=pos["apy"],
                    share_of_portfolio=share_of_portfolio,
                    chain=pos["chain"],
                    entry_price=pos.get("entry_price"),
                    current_price=pos.get("current_price"),
                    updated_at=datetime.utcnow(),
                )
            )

        return PositionsResponse(
            wallet_address=wallet_address,
            positions=positions,
            total_positions=len(positions),
            total_value=portfolio["total_value"],
        )

    def get_exposure(self, wallet_address: str) -> Optional[ExposureResponse]:
        portfolio = self.portfolios.get(wallet_address.lower())
        if not portfolio:
            return None

        total_value = portfolio["total_value"]
        positions = portfolio["positions"]

        asset_map: Dict[str, Dict] = {}
        protocol_map: Dict[str, Dict] = {}
        chain_map: Dict[str, Dict] = {}
        strategy_map: Dict[str, Dict] = {}

        for pos in positions:
            asset = pos["asset"]
            if asset not in asset_map:
                asset_map[asset] = {"value": 0, "chains": {}}
            asset_map[asset]["value"] += pos["value"]
            chain_name = pos["chain"].value
            asset_map[asset]["chains"][chain_name] = asset_map[asset]["chains"].get(chain_name, 0) + pos["value"]

            protocol = pos["protocol"]
            if protocol not in protocol_map:
                protocol_map[protocol] = {"value": 0, "vaults": 0, "risks": []}
            protocol_map[protocol]["value"] += pos["value"]
            protocol_map[protocol]["vaults"] += 1

            chain = pos["chain"]
            if chain not in chain_map:
                chain_map[chain] = {"value": 0, "positions": 0}
            chain_map[chain]["value"] += pos["value"]
            chain_map[chain]["positions"] += 1

        asset_breakdown = [
            AssetBreakdown(
                asset=asset,
                value=data["value"],
                percentage=(data["value"] / total_value) * 100,
                chains=data["chains"],
            )
            for asset, data in sorted(asset_map.items(), key=lambda x: x[1]["value"], reverse=True)
        ]

        protocol_exposure = [
            ProtocolExposure(
                protocol=protocol,
                value=data["value"],
                percentage=(data["value"] / total_value) * 100,
                vaults=data["vaults"],
                avg_risk=portfolio["risk_score"],
            )
            for protocol, data in sorted(protocol_map.items(), key=lambda x: x[1]["value"], reverse=True)
        ]

        chain_exposure = [
            ChainExposure(
                chain=chain,
                value=data["value"],
                percentage=(data["value"] / total_value) * 100,
                positions=data["positions"],
            )
            for chain, data in sorted(chain_map.items(), key=lambda x: x[1]["value"], reverse=True)
        ]

        strategy_exposure = [
            StrategyExposure(
                strategy="Lending",
                value=total_value * 0.65,
                percentage=65,
                positions=len(positions),
            ),
            StrategyExposure(
                strategy="LP Farming",
                value=total_value * 0.25,
                percentage=25,
                positions=len(positions),
            ),
            StrategyExposure(
                strategy="Real Yield",
                value=total_value * 0.10,
                percentage=10,
                positions=len(positions),
            ),
        ]

        return ExposureResponse(
            wallet_address=wallet_address,
            asset_breakdown=asset_breakdown,
            protocol_exposure=protocol_exposure,
            chain_exposure=chain_exposure,
            strategy_exposure=strategy_exposure,
            top_assets=[item.asset for item in asset_breakdown[:5]],
            top_protocols=[item.protocol for item in protocol_exposure[:5]],
        )

    def get_summary(self, wallet_address: str) -> Optional[PortfolioSummaryResponse]:
        portfolio = self.portfolios.get(wallet_address.lower())
        if not portfolio:
            return None

        total_value = portfolio["total_value"]
        daily_change = portfolio["daily_change"]
        positions = portfolio["positions"]
        total_yield = sum(p["pnl"] for p in positions)

        summary = PortfolioSummary(
            wallet_address=wallet_address,
            total_value=total_value,
            daily_change=daily_change,
            daily_change_percent=(daily_change / total_value) * 100,
            total_yield_earned=total_yield,
            yield_rate_30d=((total_yield / (total_value - total_yield)) * 12) if total_value > total_yield else 0,
            position_count=len(positions),
            protocol_count=len(set(p["protocol"] for p in positions)),
            chain_count=len(set(p["chain"] for p in positions)),
            avg_risk_score=portfolio["risk_score"],
            last_rebalance=datetime.utcnow() - timedelta(days=7),
            updated_at=datetime.utcnow(),
        )

        risk_metrics = RiskMetrics(
            overall_risk=portfolio["risk_score"],
            risk_adjusted_return=(total_yield / total_value) / portfolio["risk_score"] if portfolio["risk_score"] > 0 else 0,
            concentration_risk=max((p["value"] / total_value) * 100 for p in positions) / 10,
            liquidity_risk=2.1,
            protocol_risk=portfolio["risk_score"] * 0.8,
        )

        return PortfolioSummaryResponse(
            wallet_address=wallet_address,
            summary=summary,
            risk_metrics=risk_metrics,
            performance_7d=1.8,
            performance_30d=4.2,
            performance_90d=12.6,
        )


portfolio_service = PortfolioService()
