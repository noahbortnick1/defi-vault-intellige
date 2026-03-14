import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Database,
  Cube,
  ChartBar,
  Lightning,
  ShieldCheck,
  TrendUp,
  Gauge,
  GitBranch,
} from '@phosphor-icons/react';

export function ArchitectureVisualization() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Three-Layer Discovery Architecture</CardTitle>
          <CardDescription>
            How the engine automatically finds 90-95% of vaults across chains
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <Database size={32} weight="fill" className="text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">Layer 1: Aggregators</h4>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    85% Confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Fastest way to bootstrap. Pull from DeFiLlama, protocol registries, and curated vault lists.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-mono">DeFiLlama yields API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-mono">Protocol registries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-mono">Curated vault lists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-mono">Historical APY data</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-6 bg-border"></div>
                <div className="text-xs text-muted-foreground font-semibold">VALIDATED BY</div>
                <div className="w-px h-6 bg-border"></div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <Cube size={32} weight="fill" className="text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">Layer 2: Protocol Registries</h4>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    95% Confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Many protocols expose vault registries onchain. Read these contracts directly for official vault lists.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="font-mono">Yearn: getVaults()</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="font-mono">Morpho: getMarkets()</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="font-mono">Pendle: getAllMarkets()</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="font-mono">Enzyme: getVaultAddresses()</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-6 bg-border"></div>
                <div className="text-xs text-muted-foreground font-semibold">AUGMENTED BY</div>
                <div className="w-px h-6 bg-border"></div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <ChartBar size={32} weight="fill" className="text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">Layer 3: Onchain Detection</h4>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    98% Confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  The real moat. Detect vault contracts by patterns like ERC4626, Yearn V2, Compound, and Aave.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-mono">ERC4626 detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-mono">Yearn V2 pattern</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-mono">Compound market detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-mono">Aave aToken identification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <GitBranch size={20} weight="bold" />
              Post-Discovery Processing Pipeline
            </h4>
            
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 border rounded-lg bg-muted/30">
                <Lightning size={24} className="text-accent mb-2" weight="fill" />
                <div className="text-sm font-semibold mb-1">Strategy Classification</div>
                <p className="text-xs text-muted-foreground">
                  Detect lending, LP farming, delta neutral, or staking strategies
                </p>
              </div>

              <div className="p-3 border rounded-lg bg-muted/30">
                <ShieldCheck size={24} className="text-accent mb-2" weight="fill" />
                <div className="text-sm font-semibold mb-1">Risk Assessment</div>
                <p className="text-xs text-muted-foreground">
                  Smart contract, liquidity, dependency, and market risk analysis
                </p>
              </div>

              <div className="p-3 border rounded-lg bg-muted/30">
                <TrendUp size={24} className="text-accent mb-2" weight="fill" />
                <div className="text-sm font-semibold mb-1">Yield Decomposition</div>
                <p className="text-xs text-muted-foreground">
                  Break APY into base yield, fees, incentives, and rebases
                </p>
              </div>

              <div className="p-3 border rounded-lg bg-muted/30">
                <Gauge size={24} className="text-accent mb-2" weight="fill" />
                <div className="text-sm font-semibold mb-1">Continuous Updates</div>
                <p className="text-xs text-muted-foreground">
                  TVL every 5min, APY every 30min, risk daily, strategy weekly
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Complete Discovery Flow</h4>
            <div className="flex items-center gap-2 text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
              <span className="text-blue-600 font-semibold">Aggregator seed</span>
              <span>→</span>
              <span className="text-purple-600 font-semibold">Protocol registry scan</span>
              <span>→</span>
              <span className="text-green-600 font-semibold">Onchain vault detector</span>
              <span>→</span>
              <span className="text-orange-600 font-semibold">Strategy classifier</span>
              <span>→</span>
              <span className="text-red-600 font-semibold">Risk assessor</span>
              <span>→</span>
              <span className="text-indigo-600 font-semibold">Yield decomposer</span>
              <span>→</span>
              <span className="text-accent font-bold">Vault database</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why This Is The Real Moat</CardTitle>
          <CardDescription>
            Automatic discovery vs manual curation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ Competitors (Manual)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span className="text-muted-foreground">Manually add vaults</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span className="text-muted-foreground">Manually classify strategies</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span className="text-muted-foreground">Manually score risk</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span className="text-muted-foreground">Limited coverage (~100-500 vaults)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span className="text-muted-foreground">Slow to discover new vaults</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">×</span>
                  <span className="text-muted-foreground">High maintenance cost</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">✓ Our System (Automatic)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-muted-foreground">Automatically discovers vaults</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-muted-foreground">Automatically classifies strategies</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-muted-foreground">Automatically scores risk</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-muted-foreground">Comprehensive coverage (~5,000+ vaults)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-muted-foreground">Real-time discovery of new vaults</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-muted-foreground">Scales with minimal intervention</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
