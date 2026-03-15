import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MagnifyingGlass, Funnel, Star, ShieldCheck, TrendUp, ArrowUp, ArrowDown, CircleNotch } from '@phosphor-icons/react';
import { useVaultsApi } from '@/hooks/use-vaults-api';
import { formatCurrency, formatPercent, getRiskBgColor, getChainName, getStrategyLabel } from '@/lib/format';
import type { Vault, Chain, RiskBand, StrategyType } from '@/lib/types';
import type { VaultsQueryParams } from '@/api/types';

interface VaultExplorerProps {
  onNavigateToVault: (vaultId: string) => void;
  watchlist: string[];
  onToggleWatchlist: (vaultId: string) => void;
  renderNav: () => React.ReactNode;
}

export function VaultExplorer({ onNavigateToVault, watchlist, onToggleWatchlist, renderNav }: VaultExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [chainFilter, setChainFilter] = useState<Chain | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<RiskBand | 'all'>('all');
  const [strategyFilter, setStrategyFilter] = useState<StrategyType | 'all'>('all');
  const [institutionalOnly, setInstitutionalOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'tvl' | 'apy' | 'riskScore'>('tvl');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const apiParams = useMemo<VaultsQueryParams>(() => {
    const params: VaultsQueryParams = {
      limit: 100,
      sort: sortBy === 'riskScore' ? 'risk_score' : sortBy,
      order: sortDirection,
    };

    if (chainFilter !== 'all') {
      params.chain = chainFilter;
    }

    if (strategyFilter !== 'all') {
      const strategyMap: Record<string, string> = {
        'lending': 'lending',
        'lp-farming': 'lp',
        'delta-neutral': 'delta_neutral',
        'basis-trade': 'delta_neutral',
        'staking': 'staking',
      };
      params.strategy_type = strategyMap[strategyFilter] as any;
    }

    return params;
  }, [chainFilter, strategyFilter, sortBy, sortDirection]);

  const { vaults: apiVaults, loading, error, total } = useVaultsApi(apiParams);

  const filteredVaults = useMemo(() => {
    let vaults = apiVaults.filter((vault) => {
      const matchesSearch = vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vault.protocolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vault.asset.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRisk = riskFilter === 'all' || vault.riskBand === riskFilter;
      const matchesInstitutional = !institutionalOnly || vault.institutionalGrade;
      
      return matchesSearch && matchesRisk && matchesInstitutional;
    });

    return vaults;
  }, [apiVaults, searchTerm, riskFilter, institutionalOnly]);

  const clearFilters = () => {
    setSearchTerm('');
    setChainFilter('all');
    setRiskFilter('all');
    setStrategyFilter('all');
    setInstitutionalOnly(false);
  };

  const activeFiltersCount = [
    searchTerm !== '',
    chainFilter !== 'all',
    riskFilter !== 'all',
    strategyFilter !== 'all',
    institutionalOnly
  ].filter(Boolean).length;

  const totalTvl = filteredVaults.reduce((sum, v) => sum + v.tvl, 0);
  const avgApy = filteredVaults.length > 0 
    ? filteredVaults.reduce((sum, v) => sum + v.apy, 0) / filteredVaults.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Vault Explorer</h2>
            <p className="text-muted-foreground">
              Browse and analyze {total} institutional-grade DeFi yield opportunities
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <CircleNotch className="animate-spin" size={24} />
                <span>Loading vaults from API...</span>
              </div>
            </div>
          )}

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">Failed to load vaults: {error.message}</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total TVL</CardDescription>
                    <CardTitle className="text-2xl">
                      {formatCurrency(totalTvl)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Average APY</CardDescription>
                    <CardTitle className="text-2xl text-accent">
                      {formatPercent(avgApy)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Vaults Tracked</CardDescription>
                    <CardTitle className="text-2xl">{total}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Watchlist</CardDescription>
                    <CardTitle className="text-2xl">{watchlist.length}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Funnel size={20} className="text-muted-foreground" />
                      <CardTitle>Filters</CardTitle>
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary">{activeFiltersCount} active</Badge>
                      )}
                    </div>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <MagnifyingGlass className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search vaults..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={chainFilter} onValueChange={(v) => setChainFilter(v as Chain | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chains</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="bsc">BSC</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as RiskBand | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Risk Band" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={strategyFilter} onValueChange={(v) => setStrategyFilter(v as StrategyType | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Strategies</SelectItem>
                    <SelectItem value="lending">Lending</SelectItem>
                    <SelectItem value="lp-farming">LP Farming</SelectItem>
                    <SelectItem value="delta-neutral">Delta Neutral</SelectItem>
                    <SelectItem value="basis-trade">Basis Trade</SelectItem>
                    <SelectItem value="staking">Staking</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={institutionalOnly ? 'default' : 'outline'}
                  onClick={() => setInstitutionalOnly(!institutionalOnly)}
                  className="justify-start"
                >
                  <ShieldCheck className="mr-2" size={18} />
                  Institutional
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vaults ({filteredVaults.length})</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tvl">Sort by TVL</SelectItem>
                      <SelectItem value="apy">Sort by APY</SelectItem>
                      <SelectItem value="riskScore">Sort by Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredVaults.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No vaults match your filters</p>
                    <Button variant="ghost" onClick={clearFilters} className="mt-4">
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  filteredVaults.map((vault) => (
                    <div
                      key={vault.id}
                      className="p-5 border border-border rounded-lg hover:border-accent/50 hover:bg-card/50 transition-all cursor-pointer group"
                      onClick={() => onNavigateToVault(vault.id)}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                              {vault.name}
                            </h3>
                            {vault.verified && (
                              <ShieldCheck className="text-accent flex-shrink-0" size={20} weight="fill" />
                            )}
                            {vault.institutionalGrade && (
                              <Badge variant="outline" className="border-accent/50 text-accent flex-shrink-0">
                                Institutional
                              </Badge>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleWatchlist(vault.id);
                              }}
                              className="ml-auto flex-shrink-0"
                            >
                              <Star
                                size={20}
                                weight={watchlist.includes(vault.id) ? 'fill' : 'regular'}
                                className={watchlist.includes(vault.id) ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}
                              />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {vault.protocolName}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getChainName(vault.chain)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {vault.asset}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getStrategyLabel(vault.strategyType)}
                            </Badge>
                            <Badge className={`text-xs ${getRiskBgColor(vault.riskLevel)}`}>
                              {vault.riskLevel.toUpperCase()} RISK
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {vault.strategyDescription}
                          </p>
                        </div>

                        <div className="flex gap-8 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">APY</p>
                            <p className="text-2xl font-bold text-accent">{formatPercent(vault.apy)}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <TrendUp size={12} />
                              <span>Real: {formatPercent(vault.realYield)}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">TVL</p>
                            <p className="text-2xl font-bold">{formatCurrency(vault.tvl)}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Liquidity: {vault.liquidityScore.toFixed(1)}/10
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                            <p className={`text-2xl font-bold ${getRiskBgColor(vault.riskLevel).split(' ')[1]}`}>
                              {vault.riskScore.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {vault.riskBand}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
