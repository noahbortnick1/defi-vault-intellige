import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { portalsApi, type PortalsToken, type PortalsBalance, type PortalsQuote } from '@/lib
import { formatCurrency } from '@/lib/format';
interface PortalsDepositProps {
  vaultSymbol: string;


  const [walletAddress,
  const [selectedToken
  const [quote, setQuot
  const [quoting, setQuot


      loadBalances(window.ethereum.selectedAddress);
    }

    if (!window.ethereum) {
      return;

      setLoading(true);
      const address = accounts[0];
      setConnected(true);

      console.error
    } finally {
      setWalletAddress(window.ethereum.selectedAddress);
      loadBalances(window.ethereum.selectedAddress);
      setConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected. Please install MetaMask.');
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);
      setConnected(true);
      await loadBalances(address);
      toast.success('Wallet connected');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const loadBalances = async (address: string) => {
    try {
      setLoading(true);
      const accountBalances = await portalsApi.getBalances(address, vaultChainId);
      const nonZeroBalances = accountBalances.filter(b => parseFloat(b.amount) > 0);
      setBalances(nonZeroBalances);
    } catch (error) {
      console.error('Error loading balances:', error);
      toast.error('Failed to load balances');
    } finally {
      setLoading(false);
    }
  };

  const getQuote = async () => {
    if (!selectedToken || !inputAmount || !walletAddress) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setQuoting(true);
      const selectedBalance = balances.find(b => b.address === selectedToken);
      if (!selectedBalance) return;

      const amountInWei = (parseFloat(inputAmount) * Math.pow(10, selectedBalance.decimals)).toString();

      const quoteResponse = await portalsApi.getQuote({
        inputToken: `${vaultChainId}:${selectedToken}`,
        outputToken: `${vaultChainId}:${vaultAddress}`,
        inputAmount: amountInWei,
        sender: walletAddress,
        slippageTolerancePercentage: 0.5,
      });

      setQuote(quoteResponse);
      toast.success('Quote received');
    } catch (error) {
      console.error('Error getting quote:', error);
      toast.error('Failed to get quote. Try a different amount or token.');
      setQuote(null);
    } finally {
      setQuoting(false);
    }
  };

  const executeDeposit = async () => {
    if (!quote || !window.ethereum) {
      toast.error('Quote not available or wallet not connected');
      return;
    }

    try {
      setLoading(true);
      
      const txParams = {
        from: walletAddress,
        to: quote.tx.to,
        data: quote.tx.data,
        value: quote.tx.value,
        gas: quote.tx.gasLimit,
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

      toast.success(`Transaction submitted: ${txHash}`);
      setQuote(null);
      setInputAmount('');
      
      if (onSuccess) {
        onSuccess();
      }

      await loadBalances(walletAddress);
    } catch (error: any) {
      console.error('Error executing deposit:', error);
      toast.error(error.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedBalance = balances.find(b => b.address === selectedToken);
  const inputValueUsd = selectedBalance && inputAmount 
    ? parseFloat(inputAmount) * selectedBalance.price 
    : 0;

  return (
    <Card className="border-2 border-accent/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Lightning className="text-accent" size={24} weight="fill" />
          </div>
          <div>
            <CardTitle className="text-xl">Deposit via Portals.fi</CardTitle>
            <CardDescription>
              Swap any token and deposit in one transaction
            </CardDescription>
          </div>
        </div>
        <Badge className="w-fit bg-accent/10 text-accent border-accent/30 mt-2">
          Powered by Portals
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {!connected ? (
          <div className="text-center py-8">
            <Wallet className="mx-auto mb-4 text-muted-foreground" size={48} weight="duotone" />
            <p className="text-sm text-muted-foreground mb-4">
              Connect your wallet to deposit into {vaultSymbol}
            </p>
            <Button 
              onClick={connectWallet} 
              disabled={loading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Wallet className="mr-2" size={18} />
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
        ) : (
          <>
            <div>
              <Label className="text-sm font-medium mb-2 block">Connected Wallet</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="text-accent" size={20} weight="fill" />
                <code className="text-sm font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</code>
              </div>
            </div>

            {balances.length === 0 ? (
              <div className="text-center py-6 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No tokens found in your wallet on this chain
                </p>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="token-select" className="text-sm font-medium mb-2 block">
                    Select Token to Deposit
                  </Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger id="token-select">
                      <SelectValue placeholder="Choose a token" />
                    </SelectTrigger>
                    <SelectContent>
                      {balances.map((balance) => (
                        <SelectItem key={balance.address} value={balance.address}>
                          <div className="flex items-center justify-between gap-4 w-full">
                            <span className="font-medium">{balance.symbol}</span>
                            <span className="text-sm text-muted-foreground">
                              {parseFloat(balance.amount).toFixed(4)} ({formatCurrency(balance.value)})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBalance && (
                  <div>
                    <Label htmlFor="amount-input" className="text-sm font-medium mb-2 block">
                      Amount
                    </Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="amount-input"
                          type="number"
                          placeholder="0.0"
                          value={inputAmount}
                          onChange={(e) => setInputAmount(e.target.value)}
                          step="any"
                          min="0"
                          max={selectedBalance.amount}
                        />
                        <Button
                          variant="outline"
                          onClick={() => setInputAmount(selectedBalance.amount)}
                        >
                          MAX
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Available: {parseFloat(selectedBalance.amount).toFixed(4)} {selectedBalance.symbol}
                        </span>
                        {inputAmount && (
                          <span className="text-accent font-medium">
                            ≈ {formatCurrency(inputValueUsd)}
                          <span c
                          
                        </di
                          
                        
                  

                       
                        </div>
                        <div className="flex justify-between">
                          <span clas
                          </span>
                 
                      <div className="flex items-start gap-2 p
                        <

                    </div>
                    
                      disabled={l
                    
                      <Lightning className="mr-2" size={20} weight="fill" />
                      <ArrowRight className="ml-2" size={20} />
                  </>
              </>
          </>
      </CardContent>
  );




















































