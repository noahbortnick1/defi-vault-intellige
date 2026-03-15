import { useState, useEffect, useCallback } from 'react';
import { isValidAddress } from '@/lib/web3Rp

  address: string;

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  provider: 'metamask' | 'walletconnect' | 'coinbase' | 'manual' | null;
 


  interface Window {
  }

  ethereum: 1,
  base: 8453,
 

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

      setConnection({
        chainId,
       

      setupChainListener(provider);
    } catch (err) {
      setError(mess

    }



      const normalizedAddress = address.trim().toLowerCase();
      i

      setConnection({
        chainId:
        provider

      const message = err ins
      thr

  }, [setConnection]);
  const switchChain = useCallback(a

      setError('Can
    }
    const targetChainId 

      await pro
        params: [{ chainId: c

        ...current!,

    } catch (err: unknown) {
        const error = err 
          setError(

    }


  }, [setConnection]);
  const setupAccountsListener = useCallback((provider: Ethe
      c

        const newAddr
          current ? { ...current, a
      }


      pro

  const setupChainL
      const chainId = parseInt(chainIdHex as string, 16);
        current ? { ...c
    };
    provider.on
    return () => {
    }


    if (provider && safeConnection?.provider === 'metamask') {
      const cleanupChain = setupChainL

        cleanupChain();
    }

    c

    try {
        method: 'eth_accounts',

        c
        }) as string;
        const chainId = parseInt(chainIdHex, 

         

          setConnection({
            chainId,
            provider: 'metamask
        }

    }

    checkConnection();

    connection: safeConnection,
    error
    con
    disconnect,
    i
}











































































































