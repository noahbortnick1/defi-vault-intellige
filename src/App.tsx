import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Vault } from '@/lib/types';
import { generateMockVaults } from '@/lib/mockData';
import { VaultExplorer } from '@/components/VaultExplorer';
import { VaultDetail } from '@/components/VaultDetail';
import { ApiDocs } from '@/components/ApiDocs';
import { MetricCard } from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { Vault as VaultIcon, ChartLine, Code } from '@phosphor-icons/react';
import { Toaster } from '@/components/ui/sonner';
import { formatCurrency } from '@/lib/risk';

type View = 'explorer' | 'detail' | 'api';

function App() {
  const [vaults, setVaults] = useKV<Vault[]>('vaults', []);
  const [currentView, setCurrentView] = useState<View>('explorer');
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vaults || vaults.length === 0) {
      const mockVaults = generateMockVaults(50);
      setVaults(mockVaults);
    }
    setLoading(false);
  }, []);

  const safeVaults = vaults || [];
  const totalTVL = safeVaults.reduce((sum, v) => sum + v.tvl, 0);
  const avgAPY = safeVaults.length > 0 ? safeVaults.reduce((sum, v) => sum + v.apy, 0) / safeVaults.length : 0;
  const avgRisk = safeVaults.length > 0 ? safeVaults.reduce((sum, v) => sum + v.riskScore, 0) / safeVaults.length : 0;

  const handleSelectVault = (vault: Vault) => {
    setSelectedVault(vault);
    setCurrentView('detail');
  };

  const handleBackToExplorer = () => {
    setSelectedVault(null);
    setCurrentView('explorer');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <VaultIcon className="text-primary-foreground" size={24} weight="bold" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DeFi Vault Intelligence</h1>
                <p className="text-xs text-muted-foreground">Institutional-grade vault analytics</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <Button
                variant={currentView === 'explorer' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('explorer')}
                className="flex items-center gap-2"
              >
                <ChartLine />
                Vaults
              </Button>
              <Button
                variant={currentView === 'api' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('api')}
                className="flex items-center gap-2"
              >
                <Code />
                API
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="h-96 bg-card rounded-lg animate-pulse" />
          </div>
        ) : (
          <>
            {currentView === 'explorer' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Vault Explorer</h2>
                  <p className="text-muted-foreground">
                    Discover and analyze yield vaults across protocols and chains
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard label="Total TVL" value={formatCurrency(totalTVL)} />
                  <MetricCard label="Average APY" value={`${avgAPY.toFixed(2)}%`} />
                  <MetricCard label="Average Risk" value={avgRisk.toFixed(1)} />
                </div>
                <VaultExplorer vaults={safeVaults} onSelectVault={handleSelectVault} />
              </div>
            )}
            {currentView === 'detail' && selectedVault && (
              <VaultDetail vault={selectedVault} onBack={handleBackToExplorer} />
            )}
            {currentView === 'api' && <ApiDocs />}
          </>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>DeFi Vault Intelligence Platform • Powered by Spark</p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
