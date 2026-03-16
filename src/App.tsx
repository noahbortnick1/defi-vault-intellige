import { useState, useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ChartBar,
  Vault,
  Lightning,
  Briefcase,
  Book,
  Gear,
  MagnifyingGlass,
  Plus,
  CaretDown,
  ShieldCheck,
  TrendUp,
  CurrencyDollar,
  ChartLine,
  Warning,
  ArrowRight,
  Database,
  Cube,
  Trophy,
  FileText,
} from '@phosphor-icons/react';
import { VAULTS, RADAR_EVENTS, DEMO_PORTFOLIOS, PROTOCOLS } from '@/lib/mockData';
import { formatCurrency, formatPercent, getRiskBgColor, getChainName, getStrategyLabel } from '@/lib/format';
import type { Vault as VaultType, FilterState, Portfolio, RadarEvent } from '@/lib/types';
import { VaultExplorer } from '@/components/VaultExplorer';
import { VaultDetail } from '@/components/VaultDetail';
import { YieldRadar } from '@/components/YieldRadar';
import { PortfolioView } from '@/components/PortfolioView';
import { PortfolioApiView } from '@/components/PortfolioApiView';
import { DiscoveryEnginePanel } from '@/components/DiscoveryEnginePanel';
import { WalletTracker } from '@/components/WalletTracker';
import { RankingsPage } from '@/components/RankingsPage';
import { VaultReportView } from '@/components/VaultReportView';
import { PortfolioReportView } from '@/components/PortfolioReportView';
import { AIPortfolioGenerator } from '@/components/AIPortfolioGenerator';
import { ApiDemo } from '@/components/ApiDemo';
import { PortfolioWithWallet } from '@/components/PortfolioWithWallet';
import { RealDataDashboard } from '@/components/RealDataDashboard';
import { StrategyMap } from '@/components/StrategyMap';
import { PortalsIntegration } from '@/components/PortalsIntegration';

type Page = 'landing' | 'vaults' | 'vault-detail' | 'radar' | 'portfolio' | 'portfolio-api' | 'portfolio-wallet' | 'discovery' | 'wallet-tracker' | 'rankings' | 'vault-report' | 'portfolio-report' | 'ai-portfolio' | 'pricing' | 'docs' | 'api-demo' | 'real-data' | 'strategy-map' | 'portals' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useKV<string[]>('watchlist', []);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('portfolio-dao');

  const safeWatchlist = watchlist || [];

  const navigateToVault = (vaultId: string) => {
    setSelectedVaultId(vaultId);
    setCurrentPage('vault-detail');
  };

  const navigateBack = () => {
    setSelectedVaultId(null);
    setCurrentPage('vaults');
  };

  const navigateToVaultReport = (vaultId: string) => {
    setSelectedVaultId(vaultId);
    setCurrentPage('vault-report');
  };

  const navigateToPortfolioReport = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setCurrentPage('portfolio-report');
  };

  const toggleWatchlist = (vaultId: string) => {
    setWatchlist((current) => {
      const currentList = current || [];
      return currentList.includes(vaultId)
        ? currentList.filter((id) => id !== vaultId)
        : [...currentList, vaultId];
    });
  };

  const renderNav = (showFull: boolean = true) => (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="p-2 bg-primary rounded-lg">
            <ChartBar className="text-primary-foreground" size={24} weight="bold" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold">Yield Terminal</h1>
            <p className="text-xs text-muted-foreground">Institutional DeFi Intelligence</p>
          </div>
        </button>
        
        {showFull && (
          <div className="flex items-center gap-2">
            <Button 
              variant={currentPage === 'real-data' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('real-data')}
              size="sm"
              className="bg-accent/10 hover:bg-accent/20 border border-accent/30"
            >
              <Database className="mr-2" size={18} weight="fill" />
              Live Data
            </Button>
            <Button 
              variant={currentPage === 'vaults' || currentPage === 'vault-detail' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('vaults')}
              size="sm"
            >
              <Vault className="mr-2" size={18} />
              Vaults
            </Button>
            <Button 
              variant={currentPage === 'rankings' || currentPage === 'vault-report' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('rankings')}
              size="sm"
            >
              <ChartBar className="mr-2" size={18} />
              Rankings
            </Button>
            <Button 
              variant={currentPage === 'portfolio' || currentPage === 'portfolio-api' || currentPage === 'portfolio-wallet' || currentPage === 'portfolio-report' || currentPage === 'ai-portfolio' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('portfolio-wallet')}
              size="sm"
            >
              <Briefcase className="mr-2" size={18} />
              Portfolio
            </Button>
            <Button 
              variant={currentPage === 'ai-portfolio' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('ai-portfolio')}
              size="sm"
              className="bg-accent/10 hover:bg-accent/20 border border-accent/30"
            >
              <Lightning className="mr-2" size={18} weight="fill" />
              AI Reports
            </Button>
            <Button 
              variant={currentPage === 'strategy-map' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('strategy-map')}
              size="sm"
              className="bg-accent/10 hover:bg-accent/20 border border-accent/30"
            >
              <Cube className="mr-2" size={18} weight="fill" />
              Strategy Map
            </Button>
            <Button 
              variant={currentPage === 'portals' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('portals')}
              size="sm"
              className="bg-accent/10 hover:bg-accent/20 border border-accent/30"
            >
              <Lightning className="mr-2" size={18} weight="fill" />
              Portals
            </Button>
            <Button 
              variant={currentPage === 'radar' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('radar')}
              size="sm"
            >
              <Lightning className="mr-2" size={18} />
              Radar
            </Button>
            <Button 
              variant={currentPage === 'docs' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('docs')}
              size="sm"
            >
              <Book className="mr-2" size={18} />
              API Docs
            </Button>
            <Button 
              variant={currentPage === 'api-demo' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('api-demo')}
              size="sm"
            >
              <Database className="mr-2" size={18} />
              API Demo
            </Button>
          </div>
        )}
        
        {!showFull && (
          <div className="flex items-center gap-3">
            <Button onClick={() => setCurrentPage('vaults')}>
              Launch App
            </Button>
          </div>
        )}
      </div>
    </nav>
  );

  const renderLanding = () => (
    <div className="min-h-screen bg-background">
      {renderNav(false)}

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-background" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Institutional Grade Analytics
            </Badge>
            
            <h2 className="text-5xl font-bold tracking-tight leading-tight">
              Institutional DeFi Intelligence
              <br />
              <span className="text-accent">for confident capital allocation</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rankings, due diligence reports, and portfolio analytics for treasury management.
              Make data-driven allocation decisions with transparent risk scoring.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={() => setCurrentPage('portals')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Lightning className="mr-2" size={20} weight="fill" />
                Deposit via Portals
              </Button>
              <Button size="lg" onClick={() => setCurrentPage('real-data')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Database className="mr-2" size={20} weight="fill" />
                Live Blockchain Data
              </Button>
              <Button size="lg" onClick={() => setCurrentPage('ai-portfolio')} variant="outline">
                <Lightning className="mr-2" size={20} weight="fill" />
                AI Reports
              </Button>
              <Button size="lg" onClick={() => setCurrentPage('rankings')} variant="outline">
                <ChartBar className="mr-2" size={20} />
                View Rankings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <Card className="border-2 border-accent/50 bg-gradient-to-br from-accent/10 via-accent/5 to-background mb-16">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <Lightning className="text-accent" size={32} weight="fill" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-1">Portals.fi Integration</CardTitle>
                    <Badge className="bg-accent text-accent-foreground">ONE-CLICK DEPOSITS</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Swap any token and deposit into DeFi vaults in a single transaction
                </CardDescription>
              </div>
              <Button 
                onClick={() => setCurrentPage('portals')} 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Lightning className="mr-2" size={20} weight="fill" />
                Try Portals
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Any Token</p>
                <p className="text-sm text-muted-foreground">Deposit with ETH, USDC, WBTC, or any ERC-20</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">One Transaction</p>
                <p className="text-sm text-muted-foreground">Swap + deposit executed atomically</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Best Rates</p>
                <p className="text-sm text-muted-foreground">Optimal routing across DEX aggregators</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">500+ Protocols</p>
                <p className="text-sm text-muted-foreground">Access all major DeFi platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/50 bg-gradient-to-br from-accent/10 via-accent/5 to-background mb-16">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <Database className="text-accent" size={32} weight="fill" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-1">Real Blockchain Data</CardTitle>
                    <Badge className="bg-accent text-accent-foreground">LIVE</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Live vault data from 500+ DeFi protocols via DeFiLlama API + Direct RPC integration
                </CardDescription>
              </div>
              <Button 
                onClick={() => setCurrentPage('real-data')} 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Database className="mr-2" size={20} weight="fill" />
                View Live Data
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Data Sources</p>
                <p className="text-sm text-muted-foreground">DeFiLlama Yields API + Blockchain RPC</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Coverage</p>
                <p className="text-sm text-muted-foreground">500+ vaults across 6 chains</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Update Frequency</p>
                <p className="text-sm text-muted-foreground">Real-time with 5min cache</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Protocols</p>
                <p className="text-sm text-muted-foreground">Aave, Morpho, Yearn, Curve, Pendle & more</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/50 bg-gradient-to-br from-accent/10 via-accent/5 to-background mb-16">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <Lightning className="text-accent" size={32} weight="fill" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-1">AI-Powered Portfolio Reports</CardTitle>
                    <Badge className="bg-accent text-accent-foreground">NEW</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Generate comprehensive portfolio analysis for different sizes and risk profiles using GPT-4
                </CardDescription>
              </div>
              <Button 
                onClick={() => setCurrentPage('ai-portfolio')} 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Lightning className="mr-2" size={20} weight="fill" />
                Try AI Reports
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Portfolio Sizes</p>
                <p className="text-sm text-muted-foreground">Small ($50K-$500K) to Institutional ($50M+)</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Risk Profiles</p>
                <p className="text-sm text-muted-foreground">Conservative to Aggressive strategies</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">AI Analysis</p>
                <p className="text-sm text-muted-foreground">GPT-4 powered insights & recommendations</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-1">Optimization</p>
                <p className="text-sm text-muted-foreground">Actionable rebalancing & new opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 border-accent/50 hover:border-accent transition-colors bg-gradient-to-br from-accent/5 to-background">
            <CardHeader>
              <Trophy className="text-accent mb-3" size={40} weight="duotone" />
              <CardTitle className="text-xl">Intelligent Rankings</CardTitle>
              <Badge className="w-fit bg-accent/10 text-accent border-accent/20 text-xs">Decision Layer</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Multi-dimensional vault ranking by risk-adjusted yield, institutional fit, liquidity depth, and audit quality. Find the best USDC deployments under your risk constraints instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/50 hover:border-accent transition-colors bg-gradient-to-br from-accent/5 to-background">
            <CardHeader>
              <Cube className="text-accent mb-3" size={40} weight="duotone" />
              <CardTitle className="text-xl">Strategy Map</CardTitle>
              <Badge className="w-fit bg-accent/10 text-accent border-accent/20 text-xs">Visual Intelligence</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interactive graph visualization of DeFi vault relationships across assets, strategies, protocols, and chains. Discover patterns and connections that tables can't reveal.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/50 hover:border-accent transition-colors bg-gradient-to-br from-accent/5 to-background">
            <CardHeader>
              <FileText className="text-accent mb-3" size={40} weight="duotone" />
              <CardTitle className="text-xl">DD Reports</CardTitle>
              <Badge className="w-fit bg-accent/10 text-accent border-accent/20 text-xs">Diligence Layer</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive due diligence reports with strategy analysis, yield decomposition, dependency mapping, contract risk assessment, and liquidity profiling. From discovery to allocation decision.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 border-border/50 hover:border-accent/30 transition-colors">
            <CardHeader>
              <MagnifyingGlass className="text-accent mb-3" size={40} weight="duotone" />
              <CardTitle className="text-xl">Automated Discovery</CardTitle>
              <Badge className="w-fit bg-accent/10 text-accent border-accent/20 text-xs">Technical Moat</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Three-layer discovery system finds 90-95% of vaults across aggregators, protocol registries, and onchain patterns. No manual curation required.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-background mb-16">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Discovery Engine</CardTitle>
                <CardDescription>
                  The scalable advantage: automatic vault indexing across all major chains
                </CardDescription>
              </div>
              <Button 
                onClick={() => setCurrentPage('discovery')} 
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                <Lightning className="mr-2" size={18} />
                View Discovery System
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Database size={24} className="text-blue-400" weight="fill" />
                  <h4 className="font-semibold">Layer 1: Aggregators</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bootstrap from DeFiLlama yields API, protocol registries, and curated lists. Fast initial coverage.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Cube size={24} className="text-purple-400" weight="fill" />
                  <h4 className="font-semibold">Layer 2: Registries</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Index protocol registries (Yearn, Beefy, Morpho, Pendle) via onchain contract calls for comprehensive coverage.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ChartBar size={24} className="text-green-400" weight="fill" />
                  <h4 className="font-semibold">Layer 3: Onchain</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Detect ERC4626 patterns and vault signatures directly onchain. Discover vaults competitors miss.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-background">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">Platform Coverage</CardTitle>
            <CardDescription>
              Comprehensive vault intelligence across major DeFi protocols and chains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-caption text-muted-foreground mb-2">Total TVL</p>
                <p className="text-metric text-foreground">{formatCurrency(VAULTS.reduce((sum, v) => sum + v.tvl, 0))}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground mb-2">Vaults Tracked</p>
                <p className="text-metric text-foreground">{VAULTS.length}+</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground mb-2">Protocols</p>
                <p className="text-metric text-foreground">{PROTOCOLS.length}+</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground mb-2">Avg APY</p>
                <p className="text-metric text-accent">
                  {formatPercent(VAULTS.reduce((sum, v) => sum + v.apy, 0) / VAULTS.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card/30 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold">Built for Institutions</h3>
            <p className="text-lg text-muted-foreground">
              Trusted by DAOs, hedge funds, family offices, and protocol treasuries managing millions in DeFi capital. 
              Bloomberg-grade analytics with transparent methodology.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Badge variant="outline" className="text-sm py-2 px-4">DAO Treasuries</Badge>
              <Badge variant="outline" className="text-sm py-2 px-4">Hedge Funds</Badge>
              <Badge variant="outline" className="text-sm py-2 px-4">Family Offices</Badge>
              <Badge variant="outline" className="text-sm py-2 px-4">Protocol Teams</Badge>
              <Badge variant="outline" className="text-sm py-2 px-4">Analysts</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to get started?</h3>
          <p className="text-lg text-muted-foreground">
            Rank vaults, generate DD reports, and make confident allocation decisions with institutional-grade intelligence.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => setCurrentPage('rankings')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              View Rankings
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setCurrentPage('docs')}>
              API Documentation
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                © 2024 Yield Terminal. Institutional DeFi Intelligence Platform.
              </p>
            </div>
            <div className="flex gap-6">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                API
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderPricing = () => (
    <div className="min-h-screen bg-background">
      {renderNav()}
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your institutional needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <p className="text-3xl font-bold mt-4">$0</p>
                <p className="text-sm text-muted-foreground">Forever</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">Get Started</Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Browse all vaults</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Basic risk scores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>5 watchlist items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Public radar feed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/50">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-accent text-accent-foreground">Most Popular</Badge>
                <CardTitle className="text-xl">Pro</CardTitle>
                <p className="text-3xl font-bold mt-4">$299</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Start Trial</Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Detailed risk breakdowns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Portfolio analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Unlimited watchlist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Custom alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>DD reports (10/mo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>API access (1k calls/day)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Team</CardTitle>
                <p className="text-3xl font-bold mt-4">$899</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">Contact Sales</Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>5 team seats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Shared workspaces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Unlimited reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>API access (10k calls/day)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Enterprise</Badge>
                <CardTitle className="text-xl">Institutional</CardTitle>
                <p className="text-3xl font-bold mt-4">Custom</p>
                <p className="text-sm text-muted-foreground">Contact us</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Contact Sales</Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Everything in Team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Unlimited seats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>SLA guarantees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Unlimited API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="text-accent mt-0.5" size={16} />
                    <span>Custom research</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="min-h-screen bg-background">
      {renderNav()}
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">API Documentation</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Core API Endpoints</CardTitle>
                <CardDescription>RESTful API for rankings, vault data, and reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 text-accent">Rankings</h4>
                  <div className="space-y-2 font-mono text-sm bg-muted/30 p-4 rounded-lg">
                    <p className="text-muted-foreground">GET /api/v1/rankings</p>
                    <p className="text-muted-foreground">GET /api/v1/rankings?mode=risk_adjusted</p>
                    <p className="text-muted-foreground">GET /api/v1/rankings?asset=USDC&chain=ethereum</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Returns ranked vaults with composite scores. Supports filtering by asset, chain, protocol, and ranking mode.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-accent">Vaults</h4>
                  <div className="space-y-2 font-mono text-sm bg-muted/30 p-4 rounded-lg">
                    <p className="text-muted-foreground">GET /api/v1/vaults</p>
                    <p className="text-muted-foreground">GET /api/v1/vaults/:id</p>
                    <p className="text-muted-foreground">GET /api/v1/vaults/:id/risk</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-accent">Reports</h4>
                  <div className="space-y-2 font-mono text-sm bg-muted/30 p-4 rounded-lg">
                    <p className="text-muted-foreground">GET /api/v1/reports/vault/:address</p>
                    <p className="text-muted-foreground">GET /api/v1/reports/portfolio/:wallet</p>
                    <p className="text-muted-foreground">GET /api/v1/reports/allocation/:wallet</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Generate comprehensive DD reports with strategy analysis, risk breakdown, and recommendations.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-accent">Portfolio Tracking</h4>
                  <div className="space-y-2 font-mono text-sm bg-muted/30 p-4 rounded-lg">
                    <p className="text-muted-foreground">GET /api/v1/portfolios/:address</p>
                    <p className="text-muted-foreground">GET /api/v1/radar/events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ranking Algorithms</CardTitle>
                <CardDescription>Understanding our multi-dimensional scoring system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Rankings use composite scores based on weighted factors. Each mode optimizes for different allocation strategies:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Risk-Adjusted (Default)</h4>
                    <p className="text-sm text-muted-foreground mb-2">Balanced weighting for conservative allocations</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• APY: 25% weight</li>
                      <li>• Risk Score: 35% weight</li>
                      <li>• Liquidity: 20% weight</li>
                      <li>• Audit Quality: 10% weight</li>
                      <li>• Dependency Complexity: 5% weight</li>
                      <li>• Incentive Dependence: 5% weight</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Highest Yield</h4>
                    <p className="text-sm text-muted-foreground">Optimized for maximum APY (60% weight on yield)</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Institutional Fit</h4>
                    <p className="text-sm text-muted-foreground">Emphasizes audit quality (20%) and liquidity (25%)</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Best Liquidity</h4>
                    <p className="text-sm text-muted-foreground">Prioritizes exit capacity (45% weight on liquidity)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Types</CardTitle>
                <CardDescription>Comprehensive due diligence reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Vault DD Report</h4>
                  <p className="text-sm text-muted-foreground mb-2">Complete strategy and risk analysis including:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Strategy description and complexity assessment</li>
                    <li>Yield source decomposition (real vs. incentive)</li>
                    <li>Dependency mapping with criticality analysis</li>
                    <li>Contract risk (audits, upgradeability, timelocks)</li>
                    <li>Liquidity profile and exit capacity</li>
                    <li>Overall risk score with factor breakdown</li>
                    <li>Red flags and recommendations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Portfolio Report</h4>
                  <p className="text-sm text-muted-foreground mb-2">Treasury analytics with:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Wallet NAV and position summary</li>
                    <li>Asset, protocol, and chain exposure breakdowns</li>
                    <li>Concentration risk analysis (Herfindahl Index)</li>
                    <li>Yield source attribution</li>
                    <li>Diversification recommendations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Allocation Report</h4>
                  <p className="text-sm text-muted-foreground mb-2">Optimized recommendations for:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Target asset and risk band allocations</li>
                    <li>Vault selection with rationale</li>
                    <li>Position sizing with liquidity constraints</li>
                    <li>Downside considerations and risk factors</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication & Rate Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="font-medium mb-1">Free Tier</div>
                  <p className="text-sm text-muted-foreground">100 requests/day, public endpoints only</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="font-medium mb-1">Pro Tier</div>
                  <p className="text-sm text-muted-foreground">1,000 requests/day, full API access including reports</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="font-medium mb-1">Team Tier</div>
                  <p className="text-sm text-muted-foreground">10,000 requests/day, priority support</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="font-medium mb-1">Institutional</div>
                  <p className="text-sm text-muted-foreground">Unlimited requests, custom SLA</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiscovery = () => (
    <div className="min-h-screen bg-background">
      {renderNav()}
      <div className="container mx-auto px-6 py-12">
        <DiscoveryEnginePanel />
      </div>
    </div>
  );

  const renderWalletTracker = () => (
    <div className="min-h-screen bg-background">
      {renderNav()}
      <div className="container mx-auto px-6 py-12">
        <WalletTracker />
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return renderLanding();
      case 'real-data':
        return (
          <div className="min-h-screen bg-background">
            {renderNav()}
            <div className="container mx-auto px-6 py-12">
              <RealDataDashboard onSelectVault={navigateToVault} />
            </div>
          </div>
        );
      case 'vaults':
        return <VaultExplorer onNavigateToVault={navigateToVault} watchlist={safeWatchlist} onToggleWatchlist={toggleWatchlist} renderNav={renderNav} />;
      case 'vault-detail':
        return selectedVaultId ? <VaultDetail vaultId={selectedVaultId} onNavigateBack={navigateBack} renderNav={renderNav} watchlist={safeWatchlist} onToggleWatchlist={toggleWatchlist} /> : null;
      case 'rankings':
        return <RankingsPage renderNav={renderNav} onNavigateToVault={navigateToVault} onGenerateReport={navigateToVaultReport} />;
      case 'vault-report':
        return selectedVaultId ? <VaultReportView vaultId={selectedVaultId} renderNav={renderNav} onNavigateBack={() => setCurrentPage('rankings')} /> : null;
      case 'portfolio-report':
        return <PortfolioReportView portfolioId={selectedPortfolioId} renderNav={renderNav} onNavigateBack={() => setCurrentPage('portfolio-api')} />;
      case 'radar':
        return <YieldRadar onNavigateToVault={navigateToVault} renderNav={renderNav} />;
      case 'portfolio':
        return <PortfolioView portfolioId={selectedPortfolioId} onSelectPortfolio={setSelectedPortfolioId} renderNav={renderNav} />;
      case 'portfolio-api':
        return <PortfolioApiView renderNav={renderNav} />;
      case 'portfolio-wallet':
        return <PortfolioWithWallet renderNav={renderNav} />;
      case 'ai-portfolio':
        return (
          <div className="min-h-screen bg-background">
            {renderNav()}
            <div className="container mx-auto px-6 py-12">
              <AIPortfolioGenerator />
            </div>
          </div>
        );
      case 'discovery':
        return renderDiscovery();
      case 'wallet-tracker':
        return renderWalletTracker();
      case 'strategy-map':
        return (
          <div className="min-h-screen bg-background">
            {renderNav()}
            <div className="container mx-auto px-6 py-12">
              <StrategyMap onVaultClick={navigateToVault} />
            </div>
          </div>
        );
      case 'portals':
        return (
          <div className="min-h-screen bg-background">
            {renderNav()}
            <div className="container mx-auto px-6 py-12">
              <PortalsIntegration />
            </div>
          </div>
        );
      case 'pricing':
        return renderPricing();
      case 'docs':
        return renderDocs();
      case 'api-demo':
        return (
          <div className="min-h-screen bg-background">
            {renderNav()}
            <div className="container mx-auto px-6 py-12">
              <ApiDemo />
            </div>
          </div>
        );
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
