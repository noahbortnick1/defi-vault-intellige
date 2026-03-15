import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import type { Vault as ApiVault, VaultsQueryParams } from '@/api/types';
import type { Vault as UIVault } from '@/lib/types';

const mapApiVaultToUI = (apiVault: ApiVault): UIVault => {
  const strategyTypeMap: Record<string, UIVault['strategyType']> = {
    'lending': 'lending',
    'lp': 'lp-farming',
    'leveraged_lending': 'lending',
    'delta_neutral': 'delta-neutral',
    'yield_tokenization': 'real-yield',
    'options': 'delta-neutral',
    'staking': 'staking',
  };

  const chainMap: Record<string, UIVault['chain']> = {
    'ethereum': 'ethereum',
    'arbitrum': 'arbitrum',
    'optimism': 'optimism',
    'base': 'base',
    'polygon': 'polygon',
    'bsc': 'bsc',
  };

  const riskScore = apiVault.risk_score;
  const riskBand: UIVault['riskBand'] = riskScore <= 3 ? 'low' : riskScore <= 6 ? 'medium' : 'high';
  const riskLevel = riskScore <= 3 ? 'low' : riskScore <= 6 ? 'medium' : 'high';

  const realYield = apiVault.yield_sources?.includes('incentives') 
    ? apiVault.apy * 0.6 
    : apiVault.apy;
  const incentiveYield = apiVault.yield_sources?.includes('incentives')
    ? apiVault.apy * 0.4
    : 0;

  return {
    id: apiVault.id,
    slug: apiVault.id,
    name: apiVault.name,
    protocolId: apiVault.protocol.toLowerCase(),
    protocolName: apiVault.protocol,
    chain: chainMap[apiVault.chain] || 'ethereum',
    asset: apiVault.asset,
    category: apiVault.strategy_type,
    strategyType: strategyTypeMap[apiVault.strategy_type] || 'lending',
    description: apiVault.strategy || `${apiVault.name} vault strategy`,
    strategyDescription: apiVault.strategy || `${apiVault.name} vault strategy`,
    apy: apiVault.apy,
    realYield,
    incentiveYield,
    feeYield: 0,
    tvl: apiVault.tvl,
    liquidityAvailable: apiVault.tvl * 0.1,
    riskScore: apiVault.risk_score,
    riskBand,
    riskLevel,
    liquidityScore: apiVault.liquidity_depth === 'high' ? 9 : 
                    apiVault.liquidity_depth === 'medium' ? 6 : 3,
    status: 'active',
    sourceWindow: '7d',
    updatedAt: apiVault.updated_at,
    dependencyIds: apiVault.dependencies || [],
    governance: {
      hasTimelock: apiVault.upgradeability === 'timelock_upgradeable',
      timelockDuration: apiVault.upgradeability === 'timelock_upgradeable' ? '24h' : undefined,
      adminControls: [],
      isUpgradeable: apiVault.upgradeability !== 'immutable',
      multisigThreshold: undefined,
    },
    audits: [],
    redFlags: [],
    tags: [],
    institutionalGrade: apiVault.liquidity_depth === 'high' && 
                       apiVault.risk_score <= 4 &&
                       (apiVault.upgradeability === 'immutable' || 
                        apiVault.upgradeability === 'timelock_upgradeable'),
    vaultAddress: apiVault.address,
    verified: true,
  };
};

export function useVaultsApi(params?: VaultsQueryParams) {
  const [vaults, setVaults] = useState<UIVault[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchVaults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getVaults(params);
        
        if (mounted) {
          const mappedVaults = response.items.map(mapApiVaultToUI);
          setVaults(mappedVaults);
          setTotal(response.total);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch vaults'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchVaults();

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(params)]);

  return { vaults, loading, error, total };
}
