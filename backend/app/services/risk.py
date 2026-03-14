from app.models.vault import Vault, RiskFactors, RiskAnalysis



def calculate_protocol_dependency_risk(dependencies: list[str]) -> float:
    if len(dependencies) == 0:
        return 2.0
    elif len(dependencies) == 1:
        return 7.0

def calculate_orac
        "chainlink": 2.0,
        "internal"
    }


def calculate_oracle_risk(oracle_type: str) -> float:
    oracle_scores = {
        "chainlink": 2.0,
        "uniswap": 5.0,
        "internal": 8.0,
        "none": 1.0,
    }
    return oracle_scores.get(oracle_type.lower(), 5.0)


def calculate_upgradeability_risk(upgradeability: str) -> float:
    upgrade_scores = {
        "immutable": 1.0,
        "timelock": 3.0,
        "multisig": 6.0,
        "eoa": 10.0,
    }
    return upgrade_scores.get(upgradeability.lower(), 5.0)


def calculate_liquidity_risk(liquidity_depth: float, tvl: float) -> float:
    if tvl == 0:
        return 9.0
    
    ratio = liquidity_depth / tvl
    if ratio >= 3:
        return 2.0
    elif ratio >= 2:
        return 3.0
    elif ratio >= 1.5:
        return 5.0
    elif ratio >= 1:
        return 7.0
    return 9.0


def get_risk_level(score: float) -> Literal["low", "medium", "high"]:
    if score <= 3:
        return "low"
    elif score <= 6:
        return "medium"
    return "high"


def calculate_risk_score(vault: Vault) -> RiskAnalysis:
    protocol_dependency = calculate_protocol_dependency_risk(vault.dependencies)
    oracle_risk = calculate_oracle_risk(vault.oracle_type)
    upgradeability_risk = calculate_upgradeability_risk(vault.upgradeability)
    liquidity_risk = calculate_liquidity_risk(vault.liquidity_depth, vault.tvl)

    weights = {
        "protocol_dependency": 0.30,
        "oracle_risk": 0.25,
        "upgradeability_risk": 0.25,
        "liquidity_risk": 0.20,
    }

    overall_score = (
        protocol_dependency * weights["protocol_dependency"]
        + oracle_risk * weights["oracle_risk"]
        + upgradeability_risk * weights["upgradeability_risk"]
        + liquidity_risk * weights["liquidity_risk"]
    )

    overall_score = round(overall_score, 1)

    return RiskAnalysis(
        vault_id=vault.id,
        overall_score=overall_score,
        level=get_risk_level(overall_score),
        factors=RiskFactors(
            protocol_dependency=protocol_dependency,
            oracle_risk=oracle_risk,
            upgradeability_risk=upgradeability_risk,
            liquidity_risk=liquidity_risk,
        ),
    )

def calculate_upgradeability_risk(upgradeability: str) -> float:
    upgrade_scores = {
        "immutable": 1.0,
        "timelock": 3.0,
        "multisig": 6.0,
        "eoa": 10.0,
    }
    return upgrade_scores.get(upgradeability.lower(), 5.0)


def calculate_liquidity_risk(liquidity_depth: float, tvl: float) -> float:
    if tvl == 0:
        return 9.0
    
    ratio = liquidity_depth / tvl
    if ratio >= 3:
        return 2.0
    elif ratio >= 2:
        return 3.0
    elif ratio >= 1.5:
        return 5.0
    elif ratio >= 1:
        return 7.0
    return 9.0


def get_risk_level(score: float) -> Literal["low", "medium", "high"]:
    if score <= 3:
        return "low"
    elif score <= 6:
        return "medium"
    return "high"


def calculate_risk_score(vault: Vault) -> RiskAnalysis:
    protocol_dependency = calculate_protocol_dependency_risk(vault.dependencies)
    oracle_risk = calculate_oracle_risk(vault.oracle_type)
    upgradeability_risk = calculate_upgradeability_risk(vault.upgradeability)
    liquidity_risk = calculate_liquidity_risk(vault.liquidity_depth, vault.tvl)

    weights = {
        "protocol_dependency": 0.30,
        "oracle_risk": 0.25,
        "upgradeability_risk": 0.25,
        "liquidity_risk": 0.20,
    }

    overall_score = (
        protocol_dependency * weights["protocol_dependency"]
        + oracle_risk * weights["oracle_risk"]
        + upgradeability_risk * weights["upgradeability_risk"]
        + liquidity_risk * weights["liquidity_risk"]
    )

    overall_score = round(overall_score, 1)

    return RiskAnalysis(
        vault_id=vault.id,
        overall_score=overall_score,
        level=get_risk_level(overall_score),
        factors=RiskFactors(
            protocol_dependency=protocol_dependency,
            oracle_risk=oracle_risk,
            upgradeability_risk=upgradeability_risk,
            liquidity_risk=liquidity_risk,
        ),
    )
