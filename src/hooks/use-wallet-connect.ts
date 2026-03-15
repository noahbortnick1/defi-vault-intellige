import { useState, useEffect, useCallback } from 'react';
import { isValidAddress } from '@/lib/web3Rpc';
import type { Chain } from '@/lib/types';

interface WalletConnection {
  address: string;
  isConnected: boolean;
  chain: Chain;
  provider: 'metamask' | 'manual';
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const CHAIN_ID_TO_NAME: Record<number, Chain> = {
  1: 'ethereum',
  42161: 'arbitrum',
  10: 'optimism',
  8453: 'base',
  137: 'polygon',
  56: 'bsc',
};

const CHAIN_IDS: Record<Chain, number> = {
  ethereum: 1,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  polygon: 137,
  bsc: 56,
};

export function useWalletConnect() {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeConnection = connection || null;

  const detectProvider = useCallback((): EthereumProvider | null => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum as EthereumProvider;
    }
    return null;
  }, []);

  const getChainName = useCallback((chainId: number): Chain => {
    return CHAIN_ID_TO_NAME[chainId] || 'ethereum';
  }, []);

  const connectMetaMask = useCallback(async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {
      const provider = detectProvider();
      if (!provider) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
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

      setIsConnecting(false);
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

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      setConnection((current) =>
        current ? {
          ...current,
          chain,
        } : null
      );
    } catch (err: any) {
      if (err.code === 4902) {
        setError(`Chain ${chain} is not added to MetaMask. Please add it manually.`);
      } else {
        const message = err instanceof Error ? err.message : 'Failed to switch chain';
        setError(message);
      }
    }
  }, [detectProvider]);

  const connectManual = useCallback((address: string): void => {
    setError(null);

    if (!isValidAddress(address)) {
      setError('Invalid Ethereum address');
      return;
    }

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
        const accounts = await provider.request({
          method: 'eth_accounts',
        }) as string[];

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
        }
      } catch (err) {
        console.error('Failed to check existing connection:', err);
      }
    };

    checkConnection();
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
      }
    };

    const handleChainChanged = (chainIdHex: unknown) => {
      const chainId = parseInt(chainIdHex as string, 16);
      const chain = getChainName(chainId);

      setConnection((current) =>
        current ? {
          ...current,
          chain,
        } : null
      );
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, [detectProvider, safeConnection, disconnect, getChainName]);

  const isMetaMaskInstalled = useCallback((): boolean => {
    const provider = detectProvider();
    return provider?.isMetaMask === true;
  }, [detectProvider]);

  return {
    connection: safeConnection,
    isConnecting,
    error,
    connectMetaMask,
    switchChain,
    connectManual,
    disconnect,
    isMetaMaskInstalled,
  };
}
