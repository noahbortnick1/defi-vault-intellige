import json
import os
from pathlib import Path
from typing import List, Optional, Dict
from app.models.vault import Vault, Portfolio, PortfolioPosition
from app.services.risk import calculate_risk_score
from datetime import datetime


class VaultService:
    def __init__(self, seed_data_path: str):
        self.seed_data_path = seed_data_path
        self._vaults: List[Vault] = []
        self._load_vaults()

    def _load_vaults(self):
        seed_path = Path(self.seed_data_path)
        
        if seed_path.exists():
            with open(seed_path, "r") as f:
                data = json.load(f)
                for vault_data in data:
                    vault = Vault(**vault_data)
                    risk_analysis = calculate_risk_score(vault)
                    vault.risk_score = risk_analysis.overall_score
                    self._vaults.append(vault)
        else:
            self._vaults = self._generate_mock_vaults()

    def _generate_mock_vaults(self) -> List[Vault]:
        mock_vaults = []
        protocols = ["aave", "compound", "yearn", "curve", "convex"]
        chains = ["ethereum", "arbitrum", "optimism", "polygon"]
        assets = ["USDC", "USDT", "DAI", "ETH", "WBTC"]
        
        for i in range(50):
            vault = Vault(
                id=f"vault-{i+1}",
                address=f"0x{'0'*38}{i:02d}",
                name=f"{protocols[i % len(protocols)].title()} {assets[i % len(assets)]} Vault",
                protocol=protocols[i % len(protocols)],
                chain=chains[i % len(chains)],
                asset=assets[i % len(assets)],
                apy=round(5 + (i % 20), 2),
                tvl=1_000_000 + (i * 100_000),
                strategy="Automated yield optimization strategy",
                dependencies=[],
                upgradeability="timelock",
                oracle_type="chainlink",
                liquidity_depth=2_000_000 + (i * 150_000),
                source="mock",
                updated_at=datetime.utcnow(),
            )
            risk_analysis = calculate_risk_score(vault)
            vault.risk_score = risk_analysis.overall_score
            mock_vaults.append(vault)
        
        return mock_vaults

    def get_all_vaults(
        self,
        chain: Optional[str] = None,
        protocol: Optional[str] = None,
        min_apy: Optional[float] = None,
    ) -> List[Vault]:
        vaults = self._vaults

        if chain:
            vaults = [v for v in vaults if v.chain.lower() == chain.lower()]
        if protocol:
            vaults = [v for v in vaults if v.protocol.lower() == protocol.lower()]
        if min_apy is not None:
            vaults = [v for v in vaults if v.apy >= min_apy]

        return vaults

    def get_vault_by_address(self, address: str) -> Optional[Vault]:
        for vault in self._vaults:
            if vault.address.lower() == address.lower():
                return vault
        return None

    def get_portfolio(self, wallet_address: str) -> Portfolio:
        if not self._vaults:
            return Portfolio(
                wallet_address=wallet_address,
                total_value=0.0,
                positions=[],
                asset_breakdown={},
                protocol_exposure={},
            )

        positions = [
            PortfolioPosition(
                vault_id=self._vaults[0].id,
                vault_name=self._vaults[0].name,
                amount=50000.0,
                value_usd=50000.0,
            ),
            PortfolioPosition(
                vault_id=self._vaults[1].id,
                vault_name=self._vaults[1].name,
                amount=75000.0,
                value_usd=75000.0,
            ),
        ]

        total_value = sum(p.value_usd for p in positions)

        asset_breakdown = {
            "USDC": 50000.0,
            "ETH": 75000.0,
        }

        protocol_exposure = {
            self._vaults[0].protocol: 50000.0,
            self._vaults[1].protocol: 75000.0,
        }

        return Portfolio(
            wallet_address=wallet_address,
            total_value=total_value,
            positions=positions,
            asset_breakdown=asset_breakdown,
            protocol_exposure=protocol_exposure,
        )


vault_service: Optional[VaultService] = None


def get_vault_service() -> VaultService:
    global vault_service
    if vault_service is None:
        seed_path = os.getenv("SEED_DATA_PATH", "../indexer/data/vaults.json")
        vault_service = VaultService(seed_path)
    return vault_service
