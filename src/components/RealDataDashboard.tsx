import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowsClockwise,
  CheckCircle,
  Warning,
  TrendUp,
  Vault,
  ChartBar,
  Database,
  Lightning,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { useRealVaults } from '@/hooks/use-real-vaults';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { Vault as VaultType } from '@/lib/types';

interface RealDataDashboardProps {
  onSelectVault?: (vaultId: string) => void;
}

export function RealDataDashboard({ onSelectVault }: RealDataDashboardProps) {
  const { vaults, isLoading, error, stats, refetch, search } = useRealVaults();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  const handleSearch = async () => {
    await search(searchQuery);
  };

  const filteredVaults = vaults.filter(vault => {
    if (selectedChain && vault.chain !== selectedChain) return false;
    if (selectedProtocol && !(vault.protocol?.toLowerCase() || '').includes(selectedProtocol.toLowerCase())) return false;
    return true;
  });

  const topProtocols = stats ? Object.entries(stats.protocols)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) : [];

  const topChains = stats ? Object.entries(stats.chains)
    .sort((a, b) => b[1] - a[1]) : [];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent/50 bg-gradient-to-br from-accent/10 via-accent/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-accent/20 rounded-xl">
                  <Database className="text-accent" size={32} weight="fill" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Real Blockchain Data</CardTitle>
                  <Badge className="bg-accent text-accent-foreground mt-1">LIVE</Badge>
                </div>
              </div>
              <CardDescription className="text-base">
                Powered by DeFiLlama API + Direct RPC Calls - Real-time vault data from 500+ protocols
              </CardDescription>
            </div>
            <Button
              onClick={refetch}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <ArrowsClockwise className="mr-2" size={18} weight={isLoading ? 'bold' : 'regular'} />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </CardHeader>

        {stats && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Vault size={20} className="text-accent" weight="fill" />
                  <p className="text-xs text-muted-foreground font-semibold">Total Vaults</p>
                </div>
                <p className="text-2xl font-bold">{stats.totalVaults.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendUp size={20} className="text-accent" weight="fill" />
                  <p className="text-xs text-muted-foreground font-semibold">Total TVL</p>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalTVL)}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Lightning size={20} className="text-accent" weight="fill" />
                  <p className="text-xs text-muted-foreground font-semibold">Avg APY</p>
                </div>
                <p className="text-2xl font-bold text-accent">{formatPercent(stats.avgAPY)}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <ChartBar size={20} className="text-accent" weight="fill" />
                  <p className="text-xs text-muted-foreground font-semibold">Protocols</p>
                </div>
                <p className="text-2xl font-bold">{Object.keys(stats.protocols).length}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {error && (
        <Card className="border-2 border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Warning className="text-destructive" size={24} weight="fill" />
              <CardTitle className="text-destructive">Error Loading Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error.message}</p>
            <Button onClick={refetch} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Search & Filter Vaults</CardTitle>
            <CardDescription>Search across {vaults.length.toLocaleString()} live vaults</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by name, protocol, or asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                <MagnifyingGlass className="mr-2" size={18} />
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {topChains.map(([chain, count]) => (
                <Badge
                  key={chain}
                  variant={selectedChain === chain ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedChain(selectedChain === chain ? null : chain)}
                >
                  {chain} ({count})
                </Badge>
              ))}
            </div>

            {selectedChain && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChain(null)}
              >
                Clear Chain Filter
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Protocols</CardTitle>
            <CardDescription>By vault count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </>
              ) : (
                topProtocols.map(([protocol, count]) => (
                  <button
                    key={protocol}
                    onClick={() => setSelectedProtocol(selectedProtocol === protocol ? null : protocol)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      selectedProtocol === protocol
                        ? 'bg-accent/20 border border-accent'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <span className="font-medium text-sm">{protocol}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Vaults</CardTitle>
              <CardDescription>
                Showing {filteredVaults.length} of {vaults.length} vaults
              </CardDescription>
            </div>
            {selectedProtocol && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProtocol(null)}
              >
                Clear Protocol Filter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVaults.slice(0, 50).map((vault) => (
                <div
                  key={vault.id}
                  className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onSelectVault?.(vault.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{vault.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {vault.chain}
                        </Badge>
                        {vault.stablecoin && (
                          <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                            Stablecoin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {vault.protocol} • {vault.asset}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">APY: </span>
                          <span className="font-semibold text-accent">
                            {formatPercent(vault.apy)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">TVL: </span>
                          <span className="font-semibold">
                            {formatCurrency(vault.tvl)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk: </span>
                          <span className={`font-semibold ${
                            vault.risk_score < 5 ? 'text-green-400' : 
                            vault.risk_score < 7 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {vault.risk_score.toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="text-accent" size={24} weight="fill" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
