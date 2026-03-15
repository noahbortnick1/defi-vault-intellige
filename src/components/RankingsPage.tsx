import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  TrendUp, 
  ShieldCheck, 
  CurrencyDollar,
  Drop,
  Trophy,
  Target,
  ChartBar,
  Buildings,
  MagnifyingGlass,
  SlidersHorizontal,
  FileText,
} from '@phosphor-icons/react';
import { VAULTS } from '@/lib/mockData';
import { rankVaults, filterAndRankVaults } from '@/lib/ranking';
import type { RankingMode, Chain } from '@/lib/types';
import { formatCurrency, formatPercent, getRiskBgColor } from '@/lib/format';

interface RankingsPageProps {
  renderNav: () => JSX.Element;
  onNavigateToVault: (vaultId: string) => void;
  onGenerateReport: (vaultId: string) => void;
}

export function RankingsPage({ renderNav, onNavigateToVault, onGenerateReport }: RankingsPageProps) {
  const [rankingMode, setRankingMode] = useState<RankingMode>('risk-adjusted');
  const [filterAsset, setFilterAsset] = useState<string>('all');
  const [filterChain, setFilterChain] = useState<string>('all');
  const [filterProtocol, setFilterProtocol] = useState<string>('all');
  const [filterRiskBand, setFilterRiskBand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const rankedVaults = useMemo(() => {
    const filters: any = {};
    if (filterAsset !== 'all') filters.asset = filterAsset;
    if (filterChain !== 'all') filters.chain = filterChain;
    if (filterProtocol !== 'all') filters.protocol = filterProtocol;
    if (filterRiskBand !== 'all') filters.riskBand = filterRiskBand;

    let ranked = Object.keys(filters).length > 0
      ? filterAndRankVaults(VAULTS, rankingMode, filters)
      : rankVaults(VAULTS, rankingMode);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      ranked = ranked.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.protocolName.toLowerCase().includes(query) ||
        v.asset.toLowerCase().includes(query)
      );
    }

    return ranked;
  }, [rankingMode, filterAsset, filterChain, filterProtocol, filterRiskBand, searchQuery]);

  const uniqueAssets = Array.from(new Set(VAULTS.map(v => v.asset))).sort();
  const uniqueChains = Array.from(new Set(VAULTS.map(v => v.chain))).sort();
  const uniqueProtocols = Array.from(new Set(VAULTS.map(v => v.protocolName))).sort();

  const getModeIcon = (mode: RankingMode) => {
    switch (mode) {
      case 'risk-adjusted': return <Target size={18} weight="duotone" />;
      case 'highest-yield': return <TrendUp size={18} weight="duotone" />;
      case 'institutional-fit': return <Buildings size={18} weight="duotone" />;
      case 'best-liquidity': return <Drop size={18} weight="duotone" />;
    }
  };

  const getModeDescription = (mode: RankingMode) => {
    switch (mode) {
      case 'risk-adjusted': return 'Optimizes for best risk-adjusted returns with balanced weighting';
      case 'highest-yield': return 'Prioritizes maximum APY while maintaining acceptable risk levels';
      case 'institutional-fit': return 'Focus on audit quality, liquidity depth, and low risk profiles';
      case 'best-liquidity': return 'Emphasizes exit capacity and TVL depth for large allocations';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Trophy className="text-accent" size={28} weight="duotone" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Vault Rankings</h1>
              <p className="text-muted-foreground">
                Intelligent vault scoring across multiple dimensions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${rankingMode === 'risk-adjusted' ? 'border-2 border-accent bg-accent/5' : 'hover:border-accent/50'}`}
            onClick={() => setRankingMode('risk-adjusted')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Target size={32} weight="duotone" className={rankingMode === 'risk-adjusted' ? 'text-accent' : 'text-muted-foreground'} />
                {rankingMode === 'risk-adjusted' && (
                  <Badge className="bg-accent text-accent-foreground">Active</Badge>
                )}
              </div>
              <CardTitle className="text-lg mt-3">Best Risk-Adjusted</CardTitle>
              <CardDescription className="text-sm">
                Balanced scoring across risk, yield, and liquidity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${rankingMode === 'highest-yield' ? 'border-2 border-accent bg-accent/5' : 'hover:border-accent/50'}`}
            onClick={() => setRankingMode('highest-yield')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <TrendUp size={32} weight="duotone" className={rankingMode === 'highest-yield' ? 'text-accent' : 'text-muted-foreground'} />
                {rankingMode === 'highest-yield' && (
                  <Badge className="bg-accent text-accent-foreground">Active</Badge>
                )}
              </div>
              <CardTitle className="text-lg mt-3">Highest Yield</CardTitle>
              <CardDescription className="text-sm">
                Maximum APY optimization with acceptable risk
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${rankingMode === 'institutional-fit' ? 'border-2 border-accent bg-accent/5' : 'hover:border-accent/50'}`}
            onClick={() => setRankingMode('institutional-fit')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Buildings size={32} weight="duotone" className={rankingMode === 'institutional-fit' ? 'text-accent' : 'text-muted-foreground'} />
                {rankingMode === 'institutional-fit' && (
                  <Badge className="bg-accent text-accent-foreground">Active</Badge>
                )}
              </div>
              <CardTitle className="text-lg mt-3">Best Institutional Fit</CardTitle>
              <CardDescription className="text-sm">
                Audit quality, liquidity, and conservative risk
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${rankingMode === 'best-liquidity' ? 'border-2 border-accent bg-accent/5' : 'hover:border-accent/50'}`}
            onClick={() => setRankingMode('best-liquidity')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Drop size={32} weight="duotone" className={rankingMode === 'best-liquidity' ? 'text-accent' : 'text-muted-foreground'} />
                {rankingMode === 'best-liquidity' && (
                  <Badge className="bg-accent text-accent-foreground">Active</Badge>
                )}
              </div>
              <CardTitle className="text-lg mt-3">Best Liquidity</CardTitle>
              <CardDescription className="text-sm">
                Deep TVL and exit capacity for large positions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Filters & Search</CardTitle>
                <CardDescription>{getModeDescription(rankingMode)}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2" size={16} />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </CardHeader>
          {showFilters && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Asset</label>
                  <Select value={filterAsset} onValueChange={setFilterAsset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assets</SelectItem>
                      {uniqueAssets.map(asset => (
                        <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Chain</label>
                  <Select value={filterChain} onValueChange={setFilterChain}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Chains</SelectItem>
                      {uniqueChains.map(chain => (
                        <SelectItem key={chain} value={chain}>{chain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Protocol</label>
                  <Select value={filterProtocol} onValueChange={setFilterProtocol}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Protocols</SelectItem>
                      {uniqueProtocols.map(protocol => (
                        <SelectItem key={protocol} value={protocol}>{protocol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Risk Band</label>
                  <Select value={filterRiskBand} onValueChange={setFilterRiskBand}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search vaults..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="space-y-3">
          {rankedVaults.slice(0, 20).map((vault) => (
            <Card key={vault.id} className="hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  <div className="lg:col-span-1 flex items-center justify-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg font-bold text-lg
                      ${vault.ranking.rank === 1 ? 'bg-yellow-500/20 text-yellow-300' :
                        vault.ranking.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                        vault.ranking.rank === 3 ? 'bg-orange-500/20 text-orange-300' :
                        'bg-muted text-muted-foreground'}`}
                    >
                      {vault.ranking.rank}
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{vault.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {vault.protocolName}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {vault.chain}
                          </Badge>
                          <Badge className={`text-xs ${getRiskBgColor(vault.riskBand)}`}>
                            {vault.riskBand} risk
                          </Badge>
                          {vault.institutionalGrade && (
                            <Badge className="text-xs bg-accent/10 text-accent border-accent/20">
                              Institutional
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 text-center">
                    <div className="text-2xl font-bold text-accent">
                      {vault.ranking.overallScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>

                  <div className="lg:col-span-1 text-center">
                    <div className="text-xl font-semibold text-foreground">
                      {formatPercent(vault.apy)}
                    </div>
                    <div className="text-xs text-muted-foreground">APY</div>
                  </div>

                  <div className="lg:col-span-1 text-center">
                    <div className="text-sm font-semibold">
                      {vault.riskScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Risk</div>
                  </div>

                  <div className="lg:col-span-1 text-center">
                    <div className="text-sm font-semibold">
                      {vault.liquidityScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Liquidity</div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigateToVault(vault.id)}
                      >
                        <ChartBar className="mr-2" size={16} />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        onClick={() => onGenerateReport(vault.id)}
                      >
                        <FileText className="mr-2" size={16} />
                        DD Report
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Ranking rationale:</span> {vault.ranking.reasoning}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rankedVaults.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <MagnifyingGlass className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-semibold mb-2">No vaults found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
