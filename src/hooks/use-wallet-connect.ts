import { useState, useEffect, useCallback } from 'react';
import { isValidAddress } from '@/lib/web3Rpc';
import type { Chain } from '@/lib/types';

  address: string;
  isConnected: boo
}
interface EthereumProvi
  on: (event: string, handler: (...args: unknown[]) => void) => void;
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
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
      con

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
      setError(messag

      setIsConnecting(false);
      await provider.request({
       

        current ? {
          chainId: targetChain
      );

        setError(`Chain ${chain} is not added t

      setConnection({
  }, [detectProvider]);
        chainId,
    setError(null);

    const

      } else {
      setupChainListener(provider);
    } catch (err) {
    };
    provider.on('account
    return () =>
    };

    }
  }, [detectProvider]);



      provider.remo

  const i
      const normalizedAddress = address.toLowerCase();

    const provider = detectProvider();
    if (provider && safeConnection?.provider === 'metamask'
      c

      setConnection({
    }

    const checkConnection 
      
        r

        const accounts = await provider.request({
        }) as string[];
        if (acco
            met
          const chainId = par
     
  }, []);

            });
        }
    
    };
    checkConnection();

    }

    connectManual,
    disconnect,

}







          ...current,



    } catch (err) {







    }
  }, [detectProvider]);




  }, []);











      }







  }, [disconnect]);



      const chainId = parseInt(chainIdHex as string, 16);



    };



    return () => {


  }, []);

  const isMetaMaskInstalled = useCallback((): boolean => {
    const provider = detectProvider();
    return provider?.isMetaMask === true;
  }, [detectProvider]);




    if (provider && safeConnection?.provider === 'metamask') {





        cleanupChain();

    }





























        }





    checkConnection();
  }, [detectProvider, safeConnection]);


    connection: safeConnection,





    disconnect,



}
