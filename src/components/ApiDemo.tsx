import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/api';
import { ApiReportViewer } from '@/components/ApiReportViewer';
import type { Vault, RankingEntry, VaultRiskReport, Portfolio, VaultReport, RankingMode } from '@/api/types';
import { Database, ChartBar, ShieldCheck, Briefcase, FileText, Zap, Sparkle } from '@phosphor-icons/react';

export function ApiDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReportViewer, setShowReportViewer] = useState(false);

  const [vaultAddress, setVaultAddress] = useState('0x123abc');
  const [walletAddress, setWalletAddress] = useState('0xabc...');
  const [assetFilter, setAssetFilter] = useState('USDC');
  const [rankingMode, setRankingMode] = useState<RankingMode>('risk_adjusted');

  const executeApiCall = async (apiCall: () => Promise<any>, label: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await apiCall();
      setResult({ label, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showReportViewer ? (
        <div>
          <Button 
            variant="ghost" 
            onClick={() => setShowReportViewer(false)}
            className="mb-4"
          >
            ← Back to API Demo
          </Button>
          <ApiReportViewer 
            vaultAddress={vaultAddress}
            onClose={() => setShowReportViewer(false)}
          />
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-3xl font-bold mb-2">API Demo Console</h2>
            <p className="text-muted-foreground">
              Test the Yield Terminal API endpoints with live data and AI-enhanced reports
            </p>
          </div>

          <Tabs defaultValue="health" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="vaults">Vaults</TabsTrigger>
              <TabsTrigger value="vault">Vault Detail</TabsTrigger>
              <TabsTrigger value="rankings">Rankings</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="report">Reports</TabsTrigger>
            </TabsList>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-accent" size={24} />
                GET /api/v1/health
              </CardTitle>
              <CardDescription>Check API status and version</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => executeApiCall(() => apiClient.health(), 'Health Check')}
                disabled={loading}
              >
                Test Health Endpoint
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaults" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="text-accent" size={24} />
                GET /api/v1/vaults
              </CardTitle>
              <CardDescription>List vaults with filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset Filter</label>
                <Select value={assetFilter} onValueChange={setAssetFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="ALL">All Assets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => executeApiCall(
                  () => apiClient.getVaults({ 
                    asset: assetFilter === 'ALL' ? undefined : assetFilter,
                    limit: 10 
                  }), 
                  'Vaults List'
                )}
                disabled={loading}
              >
                Get Vaults
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vault" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="text-accent" size={24} />
                GET /api/v1/vaults/:address
              </CardTitle>
              <CardDescription>Get detailed vault information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vault Address</label>
                <Select value={vaultAddress} onValueChange={setVaultAddress}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0x123abc">Morpho USDC (0x123abc)</SelectItem>
                    <SelectItem value="0x456def">Yearn USDC (0x456def)</SelectItem>
                    <SelectItem value="0x789ghi">Pendle PT-USDC (0x789ghi)</SelectItem>
                    <SelectItem value="0xabc123">Aave V3 USDC (0xabc123)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => executeApiCall(
                    () => apiClient.getVault(vaultAddress), 
                    'Vault Detail'
                  )}
                  disabled={loading}
                >
                  Get Vault
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => executeApiCall(
                    () => apiClient.getVaultRisk(vaultAddress), 
                    'Vault Risk'
                  )}
                  disabled={loading}
                >
                  Get Risk Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="text-accent" size={24} />
                GET /api/v1/rankings
              </CardTitle>
              <CardDescription>Get ranked vaults by scoring mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ranking Mode</label>
                <Select value={rankingMode} onValueChange={(v) => setRankingMode(v as RankingMode)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk_adjusted">Risk Adjusted</SelectItem>
                    <SelectItem value="highest_yield">Highest Yield</SelectItem>
                    <SelectItem value="institutional">Institutional Fit</SelectItem>
                    <SelectItem value="best_liquidity">Best Liquidity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => executeApiCall(
                  () => apiClient.getRankings({ 
                    mode: rankingMode,
                    asset: 'USDC',
                    limit: 10 
                  }), 
                  'Rankings'
                )}
                disabled={loading}
              >
                Get Rankings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="text-accent" size={24} />
                GET /api/v1/portfolio/:wallet
              </CardTitle>
              <CardDescription>Get portfolio overview and positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <Input 
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0xabc..."
                />
              </div>
              <Button 
                onClick={() => executeApiCall(
                  () => apiClient.getPortfolio(walletAddress), 
                  'Portfolio'
                )}
                disabled={loading}
              >
                Get Portfolio
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkle className="text-accent" size={24} weight="fill" />
                AI-Enhanced Vault Reports
              </CardTitle>
              <CardDescription>Generate comprehensive DD reports with AI insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vault Address</label>
                <Select value={vaultAddress} onValueChange={setVaultAddress}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0x123abc">Morpho USDC (0x123abc)</SelectItem>
                    <SelectItem value="0x456def">Yearn USDC (0x456def)</SelectItem>
                    <SelectItem value="0x789ghi">Pendle PT-USDC (0x789ghi)</SelectItem>
                    <SelectItem value="0xabc123">Aave V3 USDC (0xabc123)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => setShowReportViewer(true)}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Sparkle className="mr-2" size={18} weight="fill" />
                Generate AI-Enhanced Report
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Reports include AI-generated insights, risk assessment, and recommendations
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {loading && (
        <Card className="border-accent/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <span className="text-muted-foreground">Loading...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">
              <strong>Error:</strong> {error}
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-accent" size={20} />
              {result.label}
            </CardTitle>
            <CardDescription>API Response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs font-mono">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
            
            {result.data && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">Quick Stats:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {result.data.items && (
                    <Badge variant="outline">
                      {result.data.items.length} items
                    </Badge>
                  )}
                  {result.data.total !== undefined && (
                    <Badge variant="outline">
                      Total: {result.data.total}
                    </Badge>
                  )}
                  {result.data.total_value && (
                    <Badge variant="outline">
                      ${(result.data.total_value / 1000000).toFixed(2)}M
                    </Badge>
                  )}
                  {result.data.vault && (
                    <Badge variant="outline">
                      APY: {result.data.vault.apy}%
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
        </>
      )}
    </div>
  );
}
