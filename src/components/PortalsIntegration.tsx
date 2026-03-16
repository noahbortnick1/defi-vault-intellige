import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightning, Vault, TrendUp, Shield, ArrowsLeftRight } from '@phosphor-icons/react';
import { PortalsDeposit } from './PortalsDeposit';
import { portalsApi, type PortalsNetwork, type PortalsPlatform } from '@/lib/portalsApi';
import { toast } from 'sonner';

export function PortalsIntegration() {
  const [networks, setNetworks] = useState<PortalsNetwork[]>([]);
  const [platforms, setPlatforms] = useState<PortalsPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<number>(1);

  useEffect(() => {
    loadPortalsData();
  }, []);

  const loadPortalsData = async () => {
    try {
      setLoading(true);
      const [networksData, platformsData] = await Promise.all([
        portalsApi.getNetworks(),
        portalsApi.getPlatforms(),
      ]);
      setNetworks(networksData);
      setPlatforms(platformsData);
    } catch (error) {
      console.error('Error loading Portals data:', error);
      toast.error('Failed to load Portals data');
    } finally {
      setLoading(false);
    }
  };

  const exampleVaults = [
    {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      chainId: 1,
      name: 'Aave V3 USDC',
      apy: '4.2%',
      tvl: '$2.5B',
      protocol: 'Aave',
    },
    {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      symbol: 'DAI',
      chainId: 1,
      name: 'Compound DAI',
      apy: '3.8%',
      tvl: '$1.2B',
      protocol: 'Compound',
    },
    {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      chainId: 1,
      name: 'Morpho USDT',
      apy: '5.1%',
      tvl: '$800M',
      protocol: 'Morpho',
    },
  ];

  const networkStats = platforms.reduce((acc, platform) => {
    acc[platform.chainId] = (acc[platform.chainId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold mb-2">Portals.fi Integration</h2>
          <p className="text-lg text-muted-foreground">
            Swap and deposit any token into DeFi vaults in a single transaction
          </p>
        </div>
        <Badge className="bg-accent text-accent-foreground px-4 py-2 text-base">
          <Lightning className="mr-2" size={18} weight="fill" />
          Powered by Portals
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-accent/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ArrowsLeftRight className="text-accent" size={24} weight="fill" />
              <CardTitle className="text-lg">Networks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{networks.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Supported chains</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Vault className="text-accent" size={24} weight="fill" />
              <CardTitle className="text-lg">Platforms</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{platforms.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Integrated protocols</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendUp className="text-accent" size={24} weight="fill" />
              <CardTitle className="text-lg">One-Click</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">100%</p>
            <p className="text-sm text-muted-foreground mt-1">Automated swaps</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="text-accent" size={24} weight="fill" />
              <CardTitle className="text-lg">Secure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">0.5%</p>
            <p className="text-sm text-muted-foreground mt-1">Max slippage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">How Portals Works</CardTitle>
          <CardDescription>
            Seamless token swaps and vault deposits in a single transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold">1</span>
                </div>
                <h4 className="font-semibold">Select Token</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-10">
                Choose any token from your wallet - USDC, ETH, WBTC, or any ERC-20
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h4 className="font-semibold">Get Quote</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-10">
                Portals finds the best swap route and calculates exact deposit amount
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold">3</span>
                </div>
                <h4 className="font-semibold">Execute</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-10">
                One transaction swaps your token and deposits into the vault
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="platforms">Supported Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Example Vaults</CardTitle>
              <CardDescription>
                Try depositing into these popular DeFi vaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {exampleVaults.map((vault) => (
                  <div key={vault.address} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{vault.name}</h4>
                        <p className="text-sm text-muted-foreground">{vault.protocol}</p>
                      </div>
                      <Badge variant="outline">{vault.symbol}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">APY</p>
                        <p className="text-lg font-semibold text-accent">{vault.apy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">TVL</p>
                        <p className="text-lg font-semibold">{vault.tvl}</p>
                      </div>
                    </div>
                    <PortalsDeposit
                      vaultAddress={vault.address}
                      vaultSymbol={vault.symbol}
                      vaultChainId={vault.chainId}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supported Networks</CardTitle>
              <CardDescription>
                Portals supports {networks.length} blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {networks.slice(0, 12).map((network) => (
                  <div
                    key={network.chainId}
                    className="p-3 border border-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedNetwork(network.chainId)}
                  >
                    <p className="font-medium text-sm">{network.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {networkStats[network.chainId] || 0} platforms
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integrated Platforms</CardTitle>
              <CardDescription>
                {platforms.length} DeFi protocols available for deposits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {platforms
                  .filter(p => !selectedNetwork || p.chainId === selectedNetwork)
                  .slice(0, 100)
                  .map((platform, index) => (
                    <div
                      key={`${platform.address}-${index}`}
                      className="p-3 border border-border rounded-lg hover:border-accent/30 transition-colors"
                    >
                      <p className="font-medium text-sm truncate">{platform.name}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {platform.category}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
