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

type Page = 'landing' | 'vaults' | 'vault-detail' | 'radar' | 'portfolio' | 'portfolio-api' | 'discovery' | 'wallet-tracker' | 'compare' | 'reports' | 'pricing' | 'docs' | 'settings';

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
              variant={currentPage === 'vaults' || currentPage === 'vault-detail' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('vaults')}
              size="sm"
            >
              <Vault className="mr-2" size={18} />
              Vaults
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
              variant={currentPage === 'portfolio' || currentPage === 'portfolio-api' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('portfolio-api')}
              size="sm"
            >
              <Briefcase className="mr-2" size={18} />
              Portfolio API
            </Button>
            <Button 
              variant={currentPage === 'discovery' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('discovery')}
              size="sm"
            >
              <MagnifyingGlass className="mr-2" size={18} />
              Discovery
            </Button>
            <Button 
              variant={currentPage === 'wallet-tracker' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('wallet-tracker')}
              size="sm"
            >
              <Vault className="mr-2" size={18} />
              Wallet Tracker
            </Button>
            <Button 
              variant={currentPage === 'pricing' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('pricing')}
              size="sm"
            >
              <CurrencyDollar className="mr-2" size={18} />
              Pricing
            </Button>
            <Button 
              variant={currentPage === 'docs' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentPage('docs')}
              size="sm"
            >
              <Book className="mr-2" size={18} />
              Docs
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
              Know where DeFi yield comes from
              <br />
              <span className="text-accent">before you allocate</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Due diligence, risk assessment, and portfolio analytics for institutional DeFi treasury management.
              Explainable risk scoring and comprehensive vault intelligence for confident capital allocation.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={() => setCurrentPage('vaults')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Vault className="mr-2" size={20} />
                Explore Vaults
              </Button>
              <Button size="lg" variant="outline" onClick={() => setCurrentPage('portfolio')}>
                <Briefcase className="mr-2" size={20} />
                View Demo Portfolio
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setCurrentPage('docs')}>
                <Book className="mr-2" size={20} />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 border-accent/50 hover:border-accent transition-colors bg-gradient-to-br from-accent/5 to-background">
            <CardHeader>
              <MagnifyingGlass className="text-accent mb-3" size={40} weight="duotone" />
              <CardTitle className="text-xl">Automated Vault Discovery</CardTitle>
              <Badge className="w-fit bg-accent/10 text-accent border-accent/20 text-xs">Technical Moat</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Three-layer discovery system automatically finds 90-95% of vaults across aggregators, protocol registries, and onchain patterns. No manual curation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 hover:border-accent/30 transition-colors">
            <CardHeader>
              <ShieldCheck className="text-accent mb-3" size={40} weight="duotone" />
              <CardTitle className="text-xl">Explainable Risk Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every risk score breaks down into smart contract, liquidity, market, and governance factors with transparent explanations. No black boxes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 hover:border-accent/30 transition-colors">
            <CardHeader>
              <ChartLine className="text-accent mb-3" size={40} weight="duotone" />
              <CardTitle className="text-xl">Yield Decomposition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Understand yield sources: base yield vs. incentives, trading fees vs. borrow interest. Assess sustainability and real returns.
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
            Explore vaults, analyze portfolios, and make confident allocation decisions with institutional-grade intelligence.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => setCurrentPage('vaults')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Explore Vaults
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setCurrentPage('pricing')}>
              View Pricing
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
          <h2 className="text-4xl font-bold mb-8">Documentation</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Learn how to use Yield Terminal effectively</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-muted-foreground">
                    Yield Terminal provides institutional-grade DeFi yield intelligence. Browse vaults, analyze risk,
                    monitor portfolios, and make data-driven allocation decisions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Core Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Vault Explorer: Browse and filter 100+ DeFi yield opportunities</li>
                    <li>Risk Scoring: Transparent, explainable risk assessments</li>
                    <li>Yield Radar: Real-time feed of meaningful vault changes</li>
                    <li>Portfolio Analytics: Monitor treasury allocations and exposures</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Framework</CardTitle>
                <CardDescription>Understanding our risk scoring methodology</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Risk scores range from 0-10 and aggregate multiple risk factors with transparent weighting:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Smart Contract Security (30%):</strong> Audit coverage, code complexity, historical incidents</li>
                  <li><strong>Liquidity Risk (25%):</strong> TVL depth, withdrawal capacity, utilization rates</li>
                  <li><strong>Market Risk (20%):</strong> Asset volatility, depeg scenarios, incentive sustainability</li>
                  <li><strong>Protocol Stability (15%):</strong> Protocol maturity, TVL history, governance strength</li>
                  <li><strong>Governance & Admin (10%):</strong> Admin controls, timelock delays, upgradeability</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Institutional Grade:</strong> Vaults with risk score ≤4.0, TVL ≥$50M, and verified status.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yield Decomposition</CardTitle>
                <CardDescription>How we break down APY sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Total APY is decomposed into sustainable and non-sustainable components:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Real Yield:</strong> Sustainable earnings from fees and protocol revenue</li>
                  <li><strong>Incentive Yield:</strong> Token rewards that may decline over time</li>
                  <li><strong>Trading Fees:</strong> DEX trading fees, borrow interest, etc.</li>
                  <li><strong>Base Yield:</strong> Core protocol emissions and staking rewards</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Sustainability Assessment:</strong> Higher real yield percentage indicates more sustainable returns.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Integrate Yield Terminal data into your systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Available for Pro, Team, and Institutional plans. RESTful API with comprehensive vault and portfolio data.
                </p>
                <div className="space-y-2 font-mono text-sm">
                  <p className="text-muted-foreground">GET /api/v1/vaults</p>
                  <p className="text-muted-foreground">GET /api/v1/vaults/:id</p>
                  <p className="text-muted-foreground">GET /api/v1/portfolios/:address</p>
                  <p className="text-muted-foreground">GET /api/v1/radar/events</p>
                </div>
                <Button variant="outline" className="mt-4">
                  View Full API Docs
                </Button>
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
      case 'vaults':
        return <VaultExplorer onNavigateToVault={navigateToVault} watchlist={safeWatchlist} onToggleWatchlist={toggleWatchlist} renderNav={renderNav} />;
      case 'vault-detail':
        return selectedVaultId ? <VaultDetail vaultId={selectedVaultId} onNavigateBack={navigateBack} renderNav={renderNav} watchlist={safeWatchlist} onToggleWatchlist={toggleWatchlist} /> : null;
      case 'radar':
        return <YieldRadar onNavigateToVault={navigateToVault} renderNav={renderNav} />;
      case 'portfolio':
        return <PortfolioView portfolioId={selectedPortfolioId} onSelectPortfolio={setSelectedPortfolioId} renderNav={renderNav} />;
      case 'portfolio-api':
        return <PortfolioApiView renderNav={renderNav} />;
      case 'discovery':
        return renderDiscovery();
      case 'wallet-tracker':
        return renderWalletTracker();
      case 'pricing':
        return renderPricing();
      case 'docs':
        return renderDocs();
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
