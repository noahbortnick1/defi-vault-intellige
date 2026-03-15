import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Book,
  ShieldCheck,
  FileText,
  MagnifyingGlass,
  ArrowSquareOut,
  Buildings,
  Scales,
  GraduationCap,
  SlidersHorizontal,
} from '@phosphor-icons/react';
import { PROTOCOLS, VAULTS } from '@/lib/mockData';

type ResearchCategory = 'all' | 'whitepaper' | 'audit' | 'governance' | 'research';

interface ResearchItem {
  id: string;
  title: string;
  category: ResearchCategory;
  protocol: string;
  protocolId: string;
  vault?: string;
  date: string;
  url: string;
  description: string;
  tags: string[];
}

const RESEARCH_ITEMS: ResearchItem[] = [
  // Whitepapers
  {
    id: 'wp-aave',
    title: 'Aave V3 Whitepaper',
    category: 'whitepaper',
    protocol: 'Aave',
    protocolId: 'aave',
    date: '2023-01-15',
    url: 'https://github.com/aave/aave-v3-core/blob/master/techpaper/Aave_V3_Technical_Paper.pdf',
    description: 'Technical specification of the Aave V3 lending protocol, including risk parameters, isolation mode, and efficiency mode.',
    tags: ['lending', 'v3', 'technical'],
  },
  {
    id: 'wp-morpho',
    title: 'Morpho Blue Whitepaper',
    category: 'whitepaper',
    protocol: 'Morpho',
    protocolId: 'morpho',
    date: '2023-09-20',
    url: 'https://docs.morpho.org/morpho/concepts/whitepaper',
    description: 'Morpho Blue protocol design: peer-to-peer matching on top of lending pools to improve supply and borrow rates.',
    tags: ['lending', 'p2p', 'optimizer'],
  },
  {
    id: 'wp-pendle',
    title: 'Pendle Finance Whitepaper',
    category: 'whitepaper',
    protocol: 'Pendle',
    protocolId: 'pendle',
    date: '2023-06-10',
    url: 'https://docs.pendle.finance/Introduction',
    description: 'Yield tokenization mechanics, PT/YT splitting, and the Pendle AMM design for trading future yield.',
    tags: ['yield-tokenization', 'pt', 'yt', 'amm'],
  },
  {
    id: 'wp-curve',
    title: 'Curve StableSwap Whitepaper',
    category: 'whitepaper',
    protocol: 'Curve Finance',
    protocolId: 'curve',
    date: '2019-11-12',
    url: 'https://resources.curve.fi/pdf/curve-stableswap.pdf',
    description: 'StableSwap invariant mathematics enabling low-slippage exchange between similarly priced assets.',
    tags: ['amm', 'stableswap', 'dex'],
  },
  {
    id: 'wp-yearn',
    title: 'Yearn V3 Vault Documentation',
    category: 'whitepaper',
    protocol: 'Yearn Finance',
    protocolId: 'yearn',
    date: '2023-04-05',
    url: 'https://docs.yearn.fi/getting-started/products/yvaults/v3',
    description: 'Yearn V3 vault architecture, multi-strategy design, and permissionless vault deployment model.',
    tags: ['yield-aggregator', 'v3', 'multi-strategy'],
  },
  // Audits
  {
    id: 'audit-aave-tob',
    title: 'Aave V3 — Trail of Bits Audit',
    category: 'audit',
    protocol: 'Aave',
    protocolId: 'aave',
    vault: 'Aave V3 USDC',
    date: '2024-01-15',
    url: 'https://github.com/aave/aave-v3-core/tree/master/audits',
    description: 'Security review of Aave V3 core contracts, risk parameters, and liquidation logic. Found 0 critical, 0 high, 2 medium issues.',
    tags: ['trail-of-bits', 'lending', 'v3'],
  },
  {
    id: 'audit-aave-oz',
    title: 'Aave V3 — OpenZeppelin Audit',
    category: 'audit',
    protocol: 'Aave',
    protocolId: 'aave',
    date: '2023-11-20',
    url: 'https://github.com/aave/aave-v3-core/tree/master/audits',
    description: 'Comprehensive security review of Aave V3 core protocol and token logic. Found 0 critical, 0 high, 1 medium issues.',
    tags: ['openzeppelin', 'lending', 'core'],
  },
  {
    id: 'audit-morpho-spearbit',
    title: 'Morpho Blue — Spearbit Audit',
    category: 'audit',
    protocol: 'Morpho',
    protocolId: 'morpho',
    vault: 'Morpho Aave V3 WETH',
    date: '2024-02-20',
    url: 'https://github.com/morpho-org/morpho-blue/tree/main/audits',
    description: 'Security audit of Morpho Blue P2P matching engine, position management, and liquidation mechanics.',
    tags: ['spearbit', 'p2p', 'liquidation'],
  },
  {
    id: 'audit-morpho-certora',
    title: 'Morpho Blue — Certora Formal Verification',
    category: 'audit',
    protocol: 'Morpho',
    protocolId: 'morpho',
    date: '2024-01-30',
    url: 'https://github.com/morpho-org/morpho-blue/tree/main/audits',
    description: 'Formal verification of key invariants and safety properties using Certora Prover.',
    tags: ['certora', 'formal-verification', 'invariants'],
  },
  {
    id: 'audit-pendle-ackee',
    title: 'Pendle Finance — Ackee Audit',
    category: 'audit',
    protocol: 'Pendle',
    protocolId: 'pendle',
    date: '2024-01-10',
    url: 'https://github.com/pendle-finance/pendle-core-v2-public/tree/main/audits',
    description: 'Security review of Pendle V2 AMM, PT/YT mechanics, and router contracts.',
    tags: ['ackee', 'amm', 'yield-tokenization'],
  },
  {
    id: 'audit-yearn-mixbytes',
    title: 'Yearn V3 — MixBytes Audit',
    category: 'audit',
    protocol: 'Yearn Finance',
    protocolId: 'yearn',
    date: '2023-11-30',
    url: 'https://github.com/yearn/yearn-vaults-v3/tree/master/audits',
    description: 'Security audit of Yearn V3 vault strategy framework and harvest logic.',
    tags: ['mixbytes', 'vault-strategy', 'harvest'],
  },
  // Governance
  {
    id: 'gov-aave-risk-params',
    title: 'Aave DAO — Risk Parameter Update Q1 2024',
    category: 'governance',
    protocol: 'Aave',
    protocolId: 'aave',
    date: '2024-02-05',
    url: 'https://governance.aave.com',
    description: 'Governance proposal to adjust collateral factors and liquidation thresholds for USDC markets on Aave V3.',
    tags: ['dao', 'risk-parameters', 'usdc'],
  },
  {
    id: 'gov-morpho-oracle',
    title: 'Morpho DAO — Oracle Upgrade Proposal',
    category: 'governance',
    protocol: 'Morpho',
    protocolId: 'morpho',
    date: '2024-01-22',
    url: 'https://forum.morpho.org',
    description: 'Proposal to upgrade oracle infrastructure for improved price feed reliability and manipulation resistance.',
    tags: ['dao', 'oracle', 'chainlink'],
  },
  {
    id: 'gov-yearn-fee-structure',
    title: 'Yearn DAO — Fee Structure Revision',
    category: 'governance',
    protocol: 'Yearn Finance',
    protocolId: 'yearn',
    date: '2023-12-10',
    url: 'https://gov.yearn.fi',
    description: 'Governance vote on revised management and performance fee tiers for V3 vaults.',
    tags: ['dao', 'fees', 'tokenomics'],
  },
  {
    id: 'gov-pendle-market-add',
    title: 'Pendle DAO — New Market Additions',
    category: 'governance',
    protocol: 'Pendle',
    protocolId: 'pendle',
    date: '2024-02-12',
    url: 'https://governance.pendle.finance',
    description: 'Community proposal to add new PT/YT markets for Aave USDC and Morpho WETH yields.',
    tags: ['dao', 'new-markets', 'pt-yt'],
  },
  // Research Notes
  {
    id: 'research-leveraged-lending',
    title: 'Leveraged Lending Strategy Deep Dive',
    category: 'research',
    protocol: 'Morpho',
    protocolId: 'morpho',
    date: '2024-03-01',
    url: '#',
    description: 'Analysis of recursive borrowing strategies on Morpho and Aave, yield attribution breakdown, and effective leverage calculation methodology.',
    tags: ['strategy', 'leveraged-lending', 'yield-attribution'],
  },
  {
    id: 'research-yield-decomposition',
    title: 'Real Yield vs Incentive Yield: A Framework',
    category: 'research',
    protocol: 'Aave',
    protocolId: 'aave',
    date: '2024-02-20',
    url: '#',
    description: 'Framework for decomposing DeFi yield into sustainable protocol revenue versus token incentive components and sustainability analysis.',
    tags: ['yield-analysis', 'real-yield', 'incentives'],
  },
  {
    id: 'research-risk-cascade',
    title: 'Protocol Dependency Risk Cascades',
    category: 'research',
    protocol: 'Morpho',
    protocolId: 'morpho',
    date: '2024-01-15',
    url: '#',
    description: 'Study of how failures in dependent protocols propagate through complex DeFi strategy stacks, with historical case studies.',
    tags: ['risk', 'dependencies', 'contagion'],
  },
  {
    id: 'research-pendle-pt',
    title: 'Fixed Yield via Pendle PT: Institutional Perspective',
    category: 'research',
    protocol: 'Pendle',
    protocolId: 'pendle',
    date: '2024-02-28',
    url: '#',
    description: 'Analysis of Principal Token mechanics as a fixed-income equivalent for DeFi treasury management.',
    tags: ['fixed-yield', 'pt', 'institutional'],
  },
];

const CATEGORY_CONFIG: Record<ResearchCategory, { label: string; IconComponent: React.ElementType; iconClass: string; color: string }> = {
  all: { label: 'All', IconComponent: Book, iconClass: 'text-primary', color: 'bg-primary/10 text-primary' },
  whitepaper: { label: 'Whitepapers', IconComponent: FileText, iconClass: 'text-blue-400', color: 'bg-blue-500/10 text-blue-400' },
  audit: { label: 'Audit Reports', IconComponent: ShieldCheck, iconClass: 'text-green-400', color: 'bg-green-500/10 text-green-400' },
  governance: { label: 'Governance', IconComponent: Scales, iconClass: 'text-purple-400', color: 'bg-purple-500/10 text-purple-400' },
  research: { label: 'Research Notes', IconComponent: GraduationCap, iconClass: 'text-orange-400', color: 'bg-orange-500/10 text-orange-400' },
};

interface ResearchLibraryProps {
  renderNav: () => React.ReactNode;
}

export function ResearchLibrary({ renderNav }: ResearchLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory>('all');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const protocolOptions = useMemo(() => {
    const ids = Array.from(new Set(RESEARCH_ITEMS.map((r) => r.protocolId)));
    return PROTOCOLS.filter((p) => ids.includes(p.id));
  }, []);

  const filtered = useMemo(() => {
    return RESEARCH_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedProtocol !== 'all' && item.protocolId !== selectedProtocol) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.protocol.toLowerCase().includes(q) ||
          item.tags.some((t) => t.includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, selectedProtocol, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: RESEARCH_ITEMS.length };
    RESEARCH_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Book className="text-primary" size={28} weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Research Library</h1>
              <p className="text-muted-foreground">
                Whitepapers, audit reports, governance proposals, and strategy research for DeFi yield protocols
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search research..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-muted-foreground" />
            {(Object.keys(CATEGORY_CONFIG) as ResearchCategory[]).map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="gap-1"
              >
                {(() => { const { IconComponent } = CATEGORY_CONFIG[cat]; return <IconComponent size={16} />; })()}
                {CATEGORY_CONFIG[cat].label}
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                  {categoryCounts[cat] || 0}
                </Badge>
              </Button>
            ))}
          </div>

          <select
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Protocols</option>
            {protocolOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} resource{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Research Items Grid */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Book size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No research items match your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <ResearchCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Protocol Coverage */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Protocol Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocolOptions.map((protocol) => {
              const items = RESEARCH_ITEMS.filter((r) => r.protocolId === protocol.id);
              const byCategory = {
                whitepaper: items.filter((r) => r.category === 'whitepaper').length,
                audit: items.filter((r) => r.category === 'audit').length,
                governance: items.filter((r) => r.category === 'governance').length,
                research: items.filter((r) => r.category === 'research').length,
              };
              return (
                <Card
                  key={protocol.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => {
                    setSelectedProtocol(protocol.id);
                    setSelectedCategory('all');
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{protocol.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {items.length} resources
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{protocol.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {byCategory.whitepaper > 0 && (
                        <Badge className={`text-xs ${CATEGORY_CONFIG.whitepaper.color}`}>
                          {byCategory.whitepaper} whitepaper{byCategory.whitepaper !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {byCategory.audit > 0 && (
                        <Badge className={`text-xs ${CATEGORY_CONFIG.audit.color}`}>
                          {byCategory.audit} audit{byCategory.audit !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {byCategory.governance > 0 && (
                        <Badge className={`text-xs ${CATEGORY_CONFIG.governance.color}`}>
                          {byCategory.governance} governance
                        </Badge>
                      )}
                      {byCategory.research > 0 && (
                        <Badge className={`text-xs ${CATEGORY_CONFIG.research.color}`}>
                          {byCategory.research} research
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchCard({ item }: { item: ResearchItem }) {
  const config = CATEGORY_CONFIG[item.category];
  const { IconComponent, iconClass } = config;

  return (
    <Card className="hover:border-primary/40 transition-colors flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <IconComponent size={18} className={iconClass} />
            <Badge className={`text-xs shrink-0 ${config.color}`}>{config.label}</Badge>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{item.date}</span>
        </div>
        <CardTitle className="text-sm font-semibold leading-tight mt-2">{item.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Buildings size={12} className="text-muted-foreground" />
          <CardDescription className="text-xs">{item.protocol}</CardDescription>
          {item.vault && (
            <>
              <span className="text-muted-foreground text-xs">·</span>
              <CardDescription className="text-xs">{item.vault}</CardDescription>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{item.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => {
            if (item.url !== '#') {
              window.open(item.url, '_blank', 'noopener,noreferrer');
            }
          }}
          disabled={item.url === '#'}
        >
          <ArrowSquareOut size={14} />
          {item.url === '#' ? 'Internal Research' : 'View Document'}
        </Button>
      </CardContent>
    </Card>
  );
}
