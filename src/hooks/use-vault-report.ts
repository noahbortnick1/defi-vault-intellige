import { useState, useEffect } from 'react';
import { generateVaultDDReportWithAI } from '@/lib/reportApi';
import type { Vault, VaultDDReport } from '@/lib/types';

export interface UseVaultReportResult {
  report: VaultDDReport | null;
  isLoading: boolean;
  error: string | null;
  regenerate: () => Promise<void>;
}

export function useVaultReport(vault: Vault | null): UseVaultReportResult {
  const [report, setReport] = useState<VaultDDReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    if (!vault) {
      setError('No vault provided');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const generatedReport = await generateVaultDDReportWithAI(vault);
      setReport(generatedReport);
    } catch (err) {
      console.error('Failed to generate vault report:', err);
      setError('Failed to generate report. Please try again.');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (vault) {
      generateReport();
    }
  }, [vault?.id]);

  return {
    report,
    isLoading,
    error,
    regenerate: generateReport,
  };
}
