import { useState, useEffect, useCallback } from 'react';
import { isValidAddress } from '@/lib/web3Rpc';
import type { Chain } from '@/lib/types';

  address: string;
  address: string;
  isConnected: boolean;
  chain: Chain;
  provider: 'metamask' | 'manual';
i

  isMetaMask?: boolean;

  interface Window {
  }

 

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

  arbitrum: 42161,
  base: 8453,
  bsc: 56,

  const [connec
  const [error, s
  const safe
  

    return null;

    return CHAIN_I

    setIsConn

      cons
  

        method: 'eth_requestAccounts

        throw new Error('No accounts found. Please connect




      setConnection({
        isConnected: true,
        provider: 'metamask',

    } catch (err
  }, []);


    setError(null);
    try {

      }
      const targetChainId 


      });
      setConnection((current) =>
          ...current,
        } : null
    } c

        const message = err instanceof Error ? 
      }
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      const chainIdHex = await provider.request({
        method: 'eth_chainId',
      }) as string;

      const chainId = parseInt(chainIdHex, 16);
      const chain = getChainName(chainId);

      setConnection({
        address: accounts[0],
        isConnected: true,
        chain,
        provider: 'metamask',
      });

    setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      setIsConnecting(false);
    }
  }, [detectProvider, getChainName]);

  const switchChain = useCallback(async (chain: Chain): Promise<void> => {
    setError(null);

    try {
      const provider = detectProvider();
      if (!provider) {
        throw new Error('MetaMask is not installed');
      }

      const targetChainId = CHAIN_IDS[chain];
      const chainIdHex = `0x${targetChainId.toString(16)}`;

          setConnection({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      setConnection((current) =>
      }
          ...current,
          chain,
        } : null
  useEff
    } catch (err: any) {
      if (err.code === 4902) {
        setError(`Chain ${chain} is not added to MetaMask. Please add it manually.`);
      }
        const message = err instanceof Error ? err.message : 'Failed to switch chain';
        setError(message);
      }
     


  const connectManual = useCallback((address: string): void => {
    setError(null);

    if (!isValidAddress(address)) {
      setError('Invalid Ethereum address');
      return;
    d

    const normalizedAddress = address.toLowerCase();

    setConnection({
      address: normalizedAddress,
      isConnected: true,
      chain: 'ethereum',
      provider: 'manual',
    });
  }, []);

  const disconnect = useCallback((): void => {
    setConnection(null);
    setError(null);
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      const provider = detectProvider();
      if (!provider) return;

      try {

          method: 'eth_accounts',


        if (accounts && accounts.length > 0) {
          const chainIdHex = await provider.request({
            method: 'eth_chainId',
          }) as string;

          const chainId = parseInt(chainIdHex, 16);
          const chain = getChainName(chainId);

          setConnection({
            address: accounts[0],
            isConnected: true,
            chain,
            provider: 'metamask',
          });

      } catch (err) {
        console.error('Failed to check existing connection:', err);
      }



  }, [detectProvider, getChainName]);

  useEffect(() => {
    const provider = detectProvider();
    if (!provider || safeConnection?.provider !== 'metamask') return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountList = accounts as string[];
      if (accountList.length === 0) {
        disconnect();
      } else {
        setConnection((current) =>
          current ? {
            ...current,
            address: accountList[0],
          } : null
        );

    };

    const handleChainChanged = (chainIdHex: unknown) => {

      const chain = getChainName(chainId);

      setConnection((current) =>
        current ? {
          ...current,
          chain,
        } : null
      );


    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);


      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, [detectProvider, safeConnection, disconnect, getChainName]);






  return {

    isConnecting,
    error,
    connectMetaMask,
    switchChain,
    connectManual,

    isMetaMaskInstalled,
  };

