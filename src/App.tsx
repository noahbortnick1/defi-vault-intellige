import { useState, useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Vault, 
  ChartLine, 
  Briefcase, 
  Book, 
  Gear, 
  TrendUp, 
  ShieldCheck, 
  Warning,
  Star,
  Funnel,
  ArrowsLeftRight,
  MagnifyingGlass,
  Lightning
} from '@phosphor-icons/react';
import { generateMockVaults, generateMockPortfolio, generateMockAlerts, PROTOCOLS } from '@/lib/mockData';
import { formatCurrency, formatPercent, formatDate, getChainName, getRiskColor, getRiskBgColor } from '@/lib/format';
import type { Vault as VaultType, Chain, AssetType, StrategyType, RiskLevel } from '@/lib/types';
import { DiscoveryEnginePanel } from '@/components/DiscoveryEnginePanel';

type Page = 'landing' | 'vaults' | 'portfolio' | 'discovery' | 'docs' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [vaults, setVaults] = useKV<VaultType[]>('vaults', []);
  const [watchlist, setWatchlist] = useKV<string[]>('watchlist', []);
  const [selectedVault, setSelectedVault] = useState<VaultType | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [chainFilter, setChainFilter] = useState<Chain | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl' | 'riskScore'>('tvl');

  if (!vaults || vaults.length === 0) {
    const mockVaults = generateMockVaults(50);
    setVaults(mockVaults);
  }

  const safeVaults = vaults || [];
  const safeWatchlist = watchlist || [];

  const filteredVaults = useMemo(() => {
    return safeVaults
      .filter((vault) => {
        const matchesSearch = vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vault.protocol.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesChain = chainFilter === 'all' || vault.chain === chainFilter;
        const matchesRisk = riskFilter === 'all' || vault.riskLevel === riskFilter;
        return matchesSearch && matchesChain && matchesRisk;
      })
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [safeVaults, searchTerm, chainFilter, riskFilter, sortBy]);

  const toggleWatchlist = (vaultId: string) => {
    setWatchlist((current) => {
      const currentList = current || [];
      return currentList.includes(vaultId)
        ? currentList.filter((id) => id !== vaultId)
        : [...currentList, vaultId];
    });
  };

  const renderLanding = () => (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Vault className="text-primary-foreground" size={24} weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DeFi Vault Intelligence</h1>
              <p className="text-xs text-muted-foreground">Institutional Treasury Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setCurrentPage('docs')}>
              <Book className="mr-2" size={18} />
              Docs
            </Button>
            <Button onClick={() => setCurrentPage('vaults')}>
              Launch App
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge className="mb-4">Institutional Grade Analytics</Badge>
            <h2 className="text-5xl font-bold tracking-tight">
              Due Diligence for
              <br />
              <span className="text-accent">DeFi Treasury Management</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive risk assessment, yield analysis, and portfolio monitoring for funds, treasuries,
              and developers deploying capital in DeFi protocols.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => setCurrentPage('vaults')}>
              <ChartLine className="mr-2" size={20} />
              Explore Vaults
            </Button>
            <Button size="lg" variant="outline" onClick={() => setCurrentPage('docs')}>
              <Book className="mr-2" size={20} />
              Read Documentation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <Card>
              <CardHeader>
                <ShieldCheck className="text-accent mb-2" size={32} />
                <CardTitle>Explainable Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every risk score breaks down into smart contract, liquidity, market, centralization, and complexity factors with clear explanations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendUp className="text-accent mb-2" size={32} />
                <CardTitle>Yield Decomposition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Understand yield sources: base yield vs. incentives, trading fees vs. borrow interest. See sustainability metrics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Briefcase className="text-accent mb-2" size={32} />
                <CardTitle>Portfolio Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor treasury exposure across assets, protocols, and strategies. Track concentrations and generate reports.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-12 mt-24">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>DeFi Vault Intelligence • Powered by Spark</p>
        </div>
      </footer>
    </div>
  );

  const renderVaultExplorer = () => (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Vault className="text-primary-foreground" size={24} weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DeFi Vault Intelligence</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setCurrentPage('vaults')}>
              <ChartLine className="mr-2" size={18} />
              Vaults
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPage('discovery')}>
              <Lightning className="mr-2" size={18} />
              Discovery
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPage('portfolio')}>
              <Briefcase className="mr-2" size={18} />
              Portfolio
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPage('docs')}>
              <Book className="mr-2" size={18} />
              Docs
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPage('settings')}>
              <Gear className="mr-2" size={18} />
              Settings
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Vault Explorer</h2>
            <p className="text-muted-foreground">
              Discover and analyze yield vaults across {vaults?.length || 0} protocols and chains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total TVL</CardDescription>
                <CardTitle className="text-2xl">
                  {formatCurrency(safeVaults.reduce((sum, v) => sum + v.tvl, 0))}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Average APY</CardDescription>
                <CardTitle className="text-2xl">
                  {formatPercent(safeVaults.reduce((sum, v) => sum + v.apy, 0) / safeVaults.length)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Vaults</CardDescription>
                <CardTitle className="text-2xl">{safeVaults.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Watchlist</CardDescription>
                <CardTitle className="text-2xl">{safeWatchlist.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filters</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setChainFilter('all');
                    setRiskFilter('all');
                  }}
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as RiskLevel | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'apy' | 'tvl' | 'riskScore')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tvl">TVL (High to Low)</SelectItem>
                    <SelectItem value="apy">APY (High to Low)</SelectItem>
                    <SelectItem value="riskScore">Risk (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {filteredVaults.slice(0, 20).map((vault) => (
              <Card key={vault.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedVault(vault)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{vault.name}</h3>
                        {vault.verified && (
                          <ShieldCheck className="text-accent" size={20} weight="fill" />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(vault.id);
                          }}
                        >
                          <Star 
                            size={18} 
                            weight={safeWatchlist.includes(vault.id) ? 'fill' : 'regular'}
                            className={safeWatchlist.includes(vault.id) ? 'text-yellow-500' : ''}
                          />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{vault.protocol.name}</Badge>
                        <Badge variant="outline">{getChainName(vault.chain)}</Badge>
                        <Badge variant="outline">{vault.asset}</Badge>
                        <Badge className={getRiskBgColor(vault.riskLevel)}>
                          <span className={getRiskColor(vault.riskLevel)}>{vault.riskLevel.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{vault.strategyDescription}</p>
                    </div>
                    <div className="flex gap-8 ml-8">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">APY</p>
                        <p className="text-2xl font-bold text-accent">{formatPercent(vault.apy)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">TVL</p>
                        <p className="text-2xl font-bold">{formatCurrency(vault.tvl)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Risk Score</p>
                        <p className={`text-2xl font-bold ${getRiskColor(vault.riskLevel)}`}>
                          {vault.riskScore.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVaultDetail = () => {
    if (!selectedVault) return null;

    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedVault(null)}>
              ← Back to Vaults
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <ArrowsLeftRight className="mr-2" size={18} />
                Compare
              </Button>
              <Button>
                Generate Report
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl font-bold">{selectedVault.name}</h2>
                {selectedVault.verified && (
                  <ShieldCheck className="text-accent" size={32} weight="fill" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedVault.protocol.name}</Badge>
                <Badge variant="outline">{getChainName(selectedVault.chain)}</Badge>
                <Badge variant="outline">{selectedVault.asset}</Badge>
                <Badge variant="outline">{selectedVault.strategyType}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Current APY</CardDescription>
                  <CardTitle className="text-3xl text-accent">{formatPercent(selectedVault.apy)}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Value Locked</CardDescription>
                  <CardTitle className="text-3xl">{formatCurrency(selectedVault.tvl)}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Risk Score</CardDescription>
                  <CardTitle className={`text-3xl ${getRiskColor(selectedVault.riskLevel)}`}>
                    {selectedVault.riskScore.toFixed(1)} / 10
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Inception</CardDescription>
                  <CardTitle className="text-xl">{formatDate(selectedVault.inception)}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
                <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedVault.strategyDescription}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Protocol Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Protocol</p>
                        <p className="font-medium">{selectedVault.protocol.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{selectedVault.protocol.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Protocol TVL</p>
                        <p className="font-medium">{formatCurrency(selectedVault.protocol.tvl)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Audits</p>
                        <p className="font-medium">{selectedVault.protocol.audits.length} completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="yield" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Yield Breakdown</CardTitle>
                    <CardDescription>Understanding where yields come from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedVault.apyBreakdown.map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{source.type.toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">{source.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">{formatPercent(source.apy)}</p>
                            <p className="text-sm text-muted-foreground">{source.token}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Factor Analysis</CardTitle>
                    <CardDescription>
                      Overall Risk Score: <span className={`font-bold ${getRiskColor(selectedVault.riskLevel)}`}>
                        {selectedVault.riskScore.toFixed(1)} / 10
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedVault.riskFactors.map((factor, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium capitalize">{factor.category.replace('-', ' ')}</p>
                              <p className="text-sm text-muted-foreground">Weight: {(factor.weight * 100).toFixed(0)}%</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">{factor.score.toFixed(1)} / 10</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{factor.description}</p>
                          <div className="bg-secondary p-3 rounded-md">
                            <p className="text-sm font-medium mb-1">Mitigations:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {factor.mitigations.map((mitigation, midx) => (
                                <li key={midx}>• {mitigation}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dependencies" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Protocol Dependencies</CardTitle>
                    <CardDescription>External protocols this vault depends on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedVault.dependencies.length > 0 ? (
                      <div className="space-y-4">
                        {selectedVault.dependencies.map((dep, idx) => (
                          <div key={idx} className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{dep.protocol}</p>
                                <Badge variant="outline">{dep.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{dep.description}</p>
                            </div>
                            <Badge 
                              className={
                                dep.riskImpact === 'critical' ? 'bg-red-100 text-red-700' :
                                dep.riskImpact === 'high' ? 'bg-orange-100 text-orange-700' :
                                dep.riskImpact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }
                            >
                              {dep.riskImpact.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No external dependencies</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="governance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Governance Model</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Governance Type</p>
                      <p className="font-medium text-lg capitalize">{selectedVault.governance.type.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Details</p>
                      <p className="text-muted-foreground">{selectedVault.governance.details}</p>
                    </div>
                    {selectedVault.governance.timelock && (
                      <div>
                        <p className="text-sm text-muted-foreground">Timelock</p>
                        <p className="font-medium">{selectedVault.governance.timelock}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  };

  const renderDiscovery = () => (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Vault className="text-primary-foreground" size={24} weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DeFi Vault Intelligence</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setCurrentPage('vaults')}>
              <ChartLine className="mr-2" size={18} />
              Vaults
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPage('discovery')}>
              <Lightning className="mr-2" size={18} />
              Discovery
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPage('portfolio')}>
              <Briefcase className="mr-2" size={18} />
              Portfolio
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPage('docs')}>
              <Book className="mr-2" size={18} />
              Docs
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPage('settings')}>
              <Gear className="mr-2" size={18} />
              Settings
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <DiscoveryEnginePanel />
      </div>
    </div>
  );

  const renderPage = () => {
    if (selectedVault) {
      return renderVaultDetail();
    }

    switch (currentPage) {
      case 'landing':
        return renderLanding();
      case 'vaults':
        return renderVaultExplorer();
      case 'discovery':
        return renderDiscovery();
      case 'portfolio':
        return renderLanding();
      case 'docs':
        return renderLanding();
      case 'settings':
        return renderLanding();
      default:
        return renderLanding();
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}

export default App;
