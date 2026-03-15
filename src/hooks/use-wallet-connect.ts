import { useState, useEffect, useCallback } from 'react';
import { isValidAddress } from '@/lib/web3Rp

  address: string;

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  provider: 'metamask' | 'walletconnect' | 'coinbase' | 'manual' | null;
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

const CHAIN_ID_T
  42161: 'arbitrum',
  10: 'optimism',
  5


  const [error, setError] = useState<strin
  const safeCo
  const detectProv
    
      return wi
    
  }, []);
  


    return CHAIN

    setIsConnec

      const provi
      if (!p
  

      }) as string[];
      if (!accounts || accounts.length === 0) {
      }
      const chainIdHex = await provider.request({

      const chainId = parseInt(chainIdHex, 1

        chainId,
        provider: 'metamask',

      setupChainListener(p
      const message = err ins
     
    
  }, [detectProv
  const c

  const isMetaMaskInstalled = useCallback((): boolean => {
    const provider = detectProvider();
    return provider?.isMetaMask === true;
  }, [detectProvider]);

      }
      setConnection({
        c

    } catch (err) {
      setError(message);
    } finally {


    const provider = detectProvider();

      return;

    con

        method: 'wallet_switchEthereumChain',
      });
      setConnection((

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      const chainIdHex = await provider.request({
        method: 'eth_chainId',
      }) as string;

      const chainId = parseInt(chainIdHex, 16);

    }
        address: accounts[0].toLowerCase(),
  const disconne
        isConnected: true,
        provider: 'metamask',
      });

      setupAccountsListener(provider);
        disconnect();
        const newAd
      const message = err instanceof Error ? err.message : 'Failed to connect to MetaMask';
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    r
  }, [detectProvider, setConnection]);

  const connectManual = useCallback(async (address: string, chain: Chain = 'ethereum'): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {

      
      if (!isValidAddress(normalizedAddress)) {
        throw new Error('Invalid Ethereum address format');
      }

    const provider = 
        address: normalizedAddress,
        chainId: CHAIN_IDS[chain],
        isConnected: true,
        provider: 'manual',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect manually';
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }


  const switchChain = useCallback(async (chain: Chain): Promise<void> => {
    const provider = detectProvider();
    
    if (!provider) {
      setError('Cannot switch chain: no provider detected');
      return;
     

    const targetChainId = CHAIN_IDS[chain];
    const chainIdHex = `0x${targetChainId.toString(16)}`;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      setConnection((current) => 
        current ? {
          ...current!,
          chainId: targetChainId,
        } : null
      );
    getChainName,
      const error = err as { code?: number };
      if (error.code === 4902) {
        setError(`Chain ${chain} is not added to your wallet`);
      } else {
        setError('Failed to switch chain');
      }
      throw err;

  }, [detectProvider, setConnection]);

  const disconnect = useCallback(() => {
    setConnection(null);
    setError(null);


  const setupAccountsListener = useCallback((provider: EthereumProvider) => {
    const handleAccountsChanged = (accounts: unknown) => {
      const accountsArray = accounts as string[];
      if (accountsArray.length === 0) {
        disconnect();
      } else {
        const newAddress = accountsArray[0].toLowerCase();
        setConnection((current) =>
          current ? { ...current, address: newAddress } : null
        );

    };

    provider.on('accountsChanged', handleAccountsChanged);

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [disconnect, setConnection]);

  const setupChainListener = useCallback((provider: EthereumProvider) => {
    const handleChainChanged = (chainIdHex: unknown) => {

      setConnection((current) =>
        current ? { ...current, chainId } : null
      );


    provider.on('chainChanged', handleChainChanged);


      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, [setConnection]);

  useEffect(() => {
    const provider = detectProvider();
    

      const cleanupAccounts = setupAccountsListener(provider);
      const cleanupChain = setupChainListener(provider);

      return () => {
        cleanupAccounts();

      };

  }, [safeConnection?.provider, detectProvider, setupAccountsListener, setupChainListener]);

  useEffect(() => {
    const checkConnection = async () => {
      const provider = detectProvider();
      
      if (!provider || safeConnection?.provider !== 'metamask') {
        return;
      }

      try {
        const accounts = await provider.request({
          method: 'eth_accounts',
        }) as string[];

        if (accounts.length > 0) {
          const chainIdHex = await provider.request({
            method: 'eth_chainId',
          }) as string;
          const chainId = parseInt(chainIdHex, 16);

          if (accounts[0].toLowerCase() !== safeConnection.address || chainId !== safeConnection.chainId) {
            setConnection({
              address: accounts[0].toLowerCase(),
              chainId,
              isConnected: true,
              provider: 'metamask',
            });
          }

      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };


  }, [detectProvider, safeConnection, setConnection]);

  return {

    isConnecting,
    error,
    connectMetaMask,
    connectManual,
    switchChain,

    getChainName,
    isMetaMaskInstalled,
  };

