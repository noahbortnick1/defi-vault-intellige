import { useState, useEffect } from 'react';
import type { Vault, Chain } from '@/lib/types';
import {
  fetchRealVaultDataWithCache,
  fetchVaultsByChain,
  fetchVaultsByProtocol,
  fetchVaultsByAsset,
  searchVaults,
  calculateVaultStats,
  type VaultStats,
} from '@/lib/blockchainData';

interface UseRealVaultsOptions {
  chain?: Chain;
  protocol?: string;
  asset?: string;
  autoFetch?: boolean;
}

interface UseRealVaultsReturn {
  vaults: Vault[];
  isLoading: boolean;
  error: Error | null;
  stats: VaultStats | null;
  refetch: () => Promise<void>;
  search: (query: string) => Promise<void>;
}

export function useRealVaults(options: UseRealVaultsOptions = {}): UseRealVaultsReturn {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<VaultStats | null>(null);

  const fetchVaults = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: Vault[];

      if (options.chain) {
        data = await fetchVaultsByChain(options.chain);
      } else if (options.protocol) {
        data = await fetchVaultsByProtocol(options.protocol);
      } else if (options.asset) {
        data = await fetchVaultsByAsset(options.asset);
      } else {
        data = await fetchRealVaultDataWithCache();
      }

      setVaults(data);
      setStats(calculateVaultStats(data));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch vaults'));
      setVaults([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const search = async (query: string) => {
    if (!query.trim()) {
      await fetchVaults();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchVaults(query);
      setVaults(data);
      setStats(calculateVaultStats(data));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchVaults();
    }
  }, [options.chain, options.protocol, options.asset]);

  return {
    vaults,
    isLoading,
    error,
    stats,
    refetch: fetchVaults,
    search,
  };
}
