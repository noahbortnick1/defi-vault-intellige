import { useState, useEffect, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { isValidAddress } from '@/lib/web3Rpc';
import type { Chain } from '@/lib/types';

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  provider: 'metamask' | 'walletconnect' | 'coinbase' | 'manual' | null;
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const CHAIN_IDS: Record<Chain, number> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  optimism: 10,
  polygon: 137,
  bsc: 56,
};

const CHAIN_ID_TO_NAME: Record<number, Chain> = {
  1: 'ethereum',
  42161: 'arbitrum',
  8453: 'base',
  10: 'optimism',
  137: 'polygon',
  56: 'bsc',
};

export function useWalletConnect() {
  const [connection, setConnection] = useKV<WalletConnection | null>('wallet-connection', null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeConnection = connection || null;

  const detectProvider = useCallback((): EthereumProvider | null => {
    if (typeof window === 'undefined') return null;
    
    if (window.ethereum) {
      return window.ethereum;
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
        throw new Error('MetaMask is not installed. Please install MetaMask browser extension.');
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      const chainIdHex = await provider.request({
        method: 'eth_chainId',
      }) as string;

      const chainId = parseInt(chainIdHex, 16);
      const address = accounts[0].toLowerCase();

      if (!isValidAddress(address)) {
        throw new Error('Invalid address format received from wallet.');
      }

      setConnection({
        address,
        chainId,
        isConnected: true,
        provider: 'metamask',
      });

      setupAccountsListener(provider);
      setupChainListener(provider);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [detectProvider, setConnection]);

  const connectManual = useCallback(async (address: string): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {
      const normalizedAddress = address.trim().toLowerCase();

      if (!isValidAddress(normalizedAddress)) {
        throw new Error('Invalid Ethereum address format');
      }

      setConnection({
        address: normalizedAddress,
        chainId: 1,
        isConnected: true,
        provider: 'manual',
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid address';
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [setConnection]);

  const switchChain = useCallback(async (targetChain: Chain): Promise<void> => {
    const provider = detectProvider();

    if (!provider || !safeConnection || safeConnection.provider === 'manual') {
      setError('Cannot switch chain in manual mode or without provider');
      return;
    }

    const targetChainId = CHAIN_IDS[targetChain];
    const chainIdHex = `0x${targetChainId.toString(16)}`;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      setConnection((current) => ({
        ...current!,
        chainId: targetChainId,
      }));

    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err) {
        const error = err as { code: number };
        if (error.code === 4902) {
          setError(`Chain ${targetChain} is not configured in your wallet`);
        }
      }
      throw err;
    }
  }, [detectProvider, safeConnection, setConnection]);

  const disconnect = useCallback((): void => {
    setConnection(null);
    setError(null);
  }, [setConnection]);

  const setupAccountsListener = useCallback((provider: EthereumProvider): void => {
    const handleAccountsChanged = (accounts: unknown) => {
      const accountsArray = accounts as string[];
      if (accountsArray.length === 0) {
        disconnect();
      } else {
        const newAddress = accountsArray[0].toLowerCase();
        setConnection((current) => 
          current ? { ...current, address: newAddress } : null
        );
      }
    };

    provider.on('accountsChanged', handleAccountsChanged);

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [disconnect, setConnection]);

  const setupChainListener = useCallback((provider: EthereumProvider): void => {
    const handleChainChanged = (chainIdHex: unknown) => {
      const chainId = parseInt(chainIdHex as string, 16);
      setConnection((current) => 
        current ? { ...current, chainId } : null
      );
    };

    provider.on('chainChanged', handleChainChanged);

    return () => {
      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, [setConnection]);

  useEffect(() => {
    const provider = detectProvider();
    
    if (provider && safeConnection?.provider === 'metamask') {
      const cleanupAccounts = setupAccountsListener(provider);
      const cleanupChain = setupChainListener(provider);

      return () => {
        cleanupAccounts();
        cleanupChain();
      };
    }
  }, [safeConnection, detectProvider, setupAccountsListener, setupChainListener]);

  const checkConnection = useCallback(async (): Promise<void> => {
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
        const address = accounts[0].toLowerCase();

        if (
          !safeConnection ||
          safeConnection.address !== address ||
          safeConnection.chainId !== chainId
        ) {
          setConnection({
            address,
            chainId,
            isConnected: true,
            provider: 'metamask',
          });
        }
      }
    } catch {
      disconnect();
    }
  }, [detectProvider, safeConnection, setConnection, disconnect]);

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    connection: safeConnection,
    isConnecting,
    error,
    connectMetaMask,
    connectManual,
    switchChain,
    disconnect,
    getChainName,
    isMetaMaskInstalled: !!detectProvider(),
  };
}
