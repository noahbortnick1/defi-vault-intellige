import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Wallet,
  LinkBreak,
  Copy,
  CheckCircle,
  Warning,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { formatAddress } from '@/lib/web3Rpc';
import type { Chain } from '@/lib/types';

const CHAIN_NAMES: Record<Chain, string> = {
  ethereum: 'Ethereum',
  arbitrum: 'Arbitrum',
  base: 'Base',
  optimism: 'Optimism',
  polygon: 'Polygon',
  bsc: 'BNB Chain',
};

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const {
    connection,
    isConnecting,
    error,
    connectMetaMask,
    connectManual,
    switchChain,
    disconnect,
    getChainName,
    isMetaMaskInstalled,
  } = useWalletConnect();

  const [manualAddress, setManualAddress] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMetaMaskConnect = async () => {
    try {
      await connectMetaMask();
      toast.success('Wallet connected successfully');
      setIsDialogOpen(false);
      if (onConnect && connection) {
        onConnect(connection.address);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  const handleManualConnect = async () => {
    if (!manualAddress.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }

    try {
      await connectManual(manualAddress);
      toast.success('Wallet address added');
      setIsDialogOpen(false);
      setManualAddress('');
      if (onConnect) {
        onConnect(manualAddress);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid address');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const handleSwitchChain = async (chain: Chain) => {
    try {
      await switchChain(chain);
      toast.success(`Switched to ${CHAIN_NAMES[chain]}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to switch chain');
    }
  };

  const copyAddress = () => {
    if (connection?.address) {
      navigator.clipboard.writeText(connection.address);
      toast.success('Address copied to clipboard');
    }
  };

  if (connection?.isConnected) {
    const currentChain = getChainName(connection.chainId);

    return (
      <Card className="border-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Wallet className="text-accent" size={20} weight="fill" />
              </div>
              <div>
                <CardTitle className="text-base">Wallet Connected</CardTitle>
                <CardDescription className="text-xs">
                  {connection.provider === 'manual' ? 'Manual Address' : 'MetaMask'}
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <CheckCircle className="mr-1" size={14} weight="fill" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
              {formatAddress(connection.address)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
            >
              <Copy size={16} />
            </Button>
          </div>

          {connection.provider !== 'manual' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Network</label>
              <Select
                value={currentChain}
                onValueChange={(value) => handleSwitchChain(value as Chain)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHAIN_NAMES).map(([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={handleDisconnect}
          >
            <LinkBreak className="mr-2" size={16} />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wallet className="mr-2" size={20} weight="fill" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to track positions and analyze your portfolio
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <Warning className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="metamask" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metamask">MetaMask</TabsTrigger>
            <TabsTrigger value="manual">Manual Address</TabsTrigger>
          </TabsList>

          <TabsContent value="metamask" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Connect with MetaMask</CardTitle>
                <CardDescription>
                  Use your MetaMask browser extension to connect
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isMetaMaskInstalled ? (
                  <Alert>
                    <Warning className="h-4 w-4" />
                    <AlertDescription>
                      MetaMask is not installed.{' '}
                      <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium"
                      >
                        Install MetaMask
                      </a>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleMetaMaskConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <ArrowsClockwise className="mr-2 animate-spin" size={16} />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2" size={16} weight="fill" />
                        Connect MetaMask
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Enter Address Manually</CardTitle>
                <CardDescription>
                  Track any Ethereum address without connecting a wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Wallet Address</label>
                  <Input
                    placeholder="0x..."
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleManualConnect}
                  disabled={isConnecting || !manualAddress.trim()}
                >
                  {isConnecting ? (
                    <>
                      <ArrowsClockwise className="mr-2 animate-spin" size={16} />
                      Adding...
                    </>
                  ) : (
                    'Add Address'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
