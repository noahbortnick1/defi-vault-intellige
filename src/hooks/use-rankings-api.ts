import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import type { RankingsQueryParams, RankingMode as ApiRankingMode } from '@/api/types';

export function useRankingsApi(params?: RankingsQueryParams) {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mode, setMode] = useState<ApiRankingMode>('risk_adjusted');

  useEffect(() => {
    let mounted = true;

    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getRankings(params);
        
        if (mounted) {
          setRankings(response.items);
          setMode(response.mode);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch rankings'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRankings();

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(params)]);

  return { rankings, loading, error, mode };
}
