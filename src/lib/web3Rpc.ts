import type { Chain } from './types';

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  contractAddress: string;
  balanceFormatted: string;
  valueUsd?: number;
}

export interface VaultPosition {
  vaultAddress: string;
  vaultName: string;
  protocol: string;
  chain: Chain;
  shares: string;
  sharesFormatted: string;
  underlyingAsset: string;
  estimatedValue?: number;
}

export interface WalletData {
  address: string;
  ethBalance: string;
  ethBalanceFormatted: string;
  tokenBalances: TokenBalance[];
  vaultPositions: VaultPosition[];
  lastUpdated: number;
}

const RPC_ENDPOINTS: Record<Chain, string> = {
  ethereum: 'https://eth.llamarpc.com',
  arbitrum: 'https://arbitrum.llamarpc.com',
  base: 'https://base.llamarpc.com',
  optimism: 'https://optimism.llamarpc.com',
  polygon: 'https://polygon.llamarpc.com',
  bsc: 'https://binance.llamarpc.com',
};

const ERC20_BALANCE_OF_ABI = '0x70a08231';
const ERC20_DECIMALS_ABI = '0x313ce567';
const ERC20_SYMBOL_ABI = '0x95d89b41';
const ERC20_NAME_ABI = '0x06fdde03';

const ERC4626_BALANCE_OF_ABI = '0x70a08231';
const ERC4626_ASSET_ABI = '0x38d52e0f';
const ERC4626_TOTAL_ASSETS_ABI = '0x01e1d114';
const ERC4626_TOTAL_SUPPLY_ABI = '0x18160ddd';

interface RpcRequest {
  jsonrpc: string;
  method: string;
  params: unknown[];
  id: number;
}

interface RpcResponse {
  jsonrpc: string;
  id: number;
  result?: string;
  error?: {
    code: number;
    message: string;
  };
}

let requestId = 1;

async function rpcCall(
  chain: Chain,
  method: string,
  params: unknown[]
): Promise<string> {
  const endpoint = RPC_ENDPOINTS[chain];
  
  const request: RpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id: requestId++,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`RPC call failed: ${response.statusText}`);
  }

  const data: RpcResponse = await response.json();

  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  if (!data.result) {
    throw new Error('No result in RPC response');
  }

  return data.result;
}

function padAddress(address: string): string {
  return '0x' + address.slice(2).padStart(64, '0');
}

function formatBalance(balance: string, decimals: number): string {
  const value = BigInt(balance);
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '').slice(0, 6);
  
  if (trimmedFractional === '') {
    return integerPart.toString();
  }
  
  return `${integerPart}.${trimmedFractional}`;
}

function hexToString(hex: string): string {
  if (hex === '0x') return '';
  
  let str = '';
  for (let i = 2; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }
  return str;
}

function decodeString(hex: string): string {
  if (hex === '0x') return '';
  
  try {
    const offset = parseInt(hex.slice(2, 66), 16);
    const length = parseInt(hex.slice(66, 130), 16);
    const data = hex.slice(130, 130 + length * 2);
    return hexToString('0x' + data);
  } catch {
    return '';
  }
}

export async function getEthBalance(
  address: string,
  chain: Chain = 'ethereum'
): Promise<string> {
  const result = await rpcCall(chain, 'eth_getBalance', [address, 'latest']);
  return result;
}

export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string,
  chain: Chain = 'ethereum'
): Promise<string> {
  const data = ERC20_BALANCE_OF_ABI + padAddress(walletAddress).slice(2);
  
  const result = await rpcCall(chain, 'eth_call', [
    {
      to: tokenAddress,
      data,
    },
    'latest',
  ]);
  
  return result;
}

export async function getTokenDecimals(
  tokenAddress: string,
  chain: Chain = 'ethereum'
): Promise<number> {
  const result = await rpcCall(chain, 'eth_call', [
    {
      to: tokenAddress,
      data: ERC20_DECIMALS_ABI,
    },
    'latest',
  ]);
  
  return parseInt(result, 16);
}

export async function getTokenSymbol(
  tokenAddress: string,
  chain: Chain = 'ethereum'
): Promise<string> {
  try {
    const result = await rpcCall(chain, 'eth_call', [
      {
        to: tokenAddress,
        data: ERC20_SYMBOL_ABI,
      },
      'latest',
    ]);
    
    return decodeString(result) || hexToString(result);
  } catch {
    return 'UNKNOWN';
  }
}

export async function getTokenName(
  tokenAddress: string,
  chain: Chain = 'ethereum'
): Promise<string> {
  try {
    const result = await rpcCall(chain, 'eth_call', [
      {
        to: tokenAddress,
        data: ERC20_NAME_ABI,
      },
      'latest',
    ]);
    
    return decodeString(result) || hexToString(result);
  } catch {
    return 'Unknown Token';
  }
}

export async function getVaultShares(
  vaultAddress: string,
  walletAddress: string,
  chain: Chain = 'ethereum'
): Promise<string> {
  return getTokenBalance(vaultAddress, walletAddress, chain);
}

export async function getVaultAsset(
  vaultAddress: string,
  chain: Chain = 'ethereum'
): Promise<string> {
  const result = await rpcCall(chain, 'eth_call', [
    {
      to: vaultAddress,
      data: ERC4626_ASSET_ABI,
    },
    'latest',
  ]);
  
  return '0x' + result.slice(-40);
}

export async function getVaultTotalAssets(
  vaultAddress: string,
  chain: Chain = 'ethereum'
): Promise<string> {
  const result = await rpcCall(chain, 'eth_call', [
    {
      to: vaultAddress,
      data: ERC4626_TOTAL_ASSETS_ABI,
    },
    'latest',
  ]);
  
  return result;
}

export async function getVaultTotalSupply(
  vaultAddress: string,
  chain: Chain = 'ethereum'
): Promise<string> {
  const result = await rpcCall(chain, 'eth_call', [
    {
      to: vaultAddress,
      data: ERC4626_TOTAL_SUPPLY_ABI,
    },
    'latest',
  ]);
  
  return result;
}

export async function getTokenBalanceWithMetadata(
  tokenAddress: string,
  walletAddress: string,
  chain: Chain = 'ethereum'
): Promise<TokenBalance> {
  const [balance, decimals, symbol, name] = await Promise.all([
    getTokenBalance(tokenAddress, walletAddress, chain),
    getTokenDecimals(tokenAddress, chain),
    getTokenSymbol(tokenAddress, chain),
    getTokenName(tokenAddress, chain),
  ]);

  const balanceFormatted = formatBalance(balance, decimals);

  return {
    symbol,
    name,
    balance,
    decimals,
    contractAddress: tokenAddress,
    balanceFormatted,
  };
}

export async function getVaultPosition(
  vaultAddress: string,
  walletAddress: string,
  chain: Chain,
  vaultName?: string,
  protocol?: string
): Promise<VaultPosition | null> {
  try {
    const shares = await getVaultShares(vaultAddress, walletAddress, chain);
    
    if (shares === '0x0' || BigInt(shares) === BigInt(0)) {
      return null;
    }

    const [assetAddress, decimals, totalAssets, totalSupply] = await Promise.all([
      getVaultAsset(vaultAddress, chain),
      getTokenDecimals(vaultAddress, chain),
      getVaultTotalAssets(vaultAddress, chain),
      getVaultTotalSupply(vaultAddress, chain),
    ]);

    const [assetSymbol] = await Promise.all([
      getTokenSymbol(assetAddress, chain),
    ]);

    const sharesFormatted = formatBalance(shares, decimals);

    return {
      vaultAddress,
      vaultName: vaultName || vaultAddress.slice(0, 10) + '...',
      protocol: protocol || 'Unknown',
      chain,
      shares,
      sharesFormatted,
      underlyingAsset: assetSymbol,
    };
  } catch (error) {
    console.error(`Error fetching vault position for ${vaultAddress}:`, error);
    return null;
  }
}

export async function scanWalletForVaults(
  walletAddress: string,
  vaultAddresses: string[],
  chain: Chain
): Promise<VaultPosition[]> {
  const positions = await Promise.all(
    vaultAddresses.map(vaultAddress =>
      getVaultPosition(vaultAddress, walletAddress, chain)
    )
  );

  return positions.filter((p): p is VaultPosition => p !== null);
}

export async function getWalletData(
  address: string,
  chains: Chain[] = ['ethereum'],
  knownTokens: { address: string; chain: Chain }[] = []
): Promise<WalletData> {
  const ethBalance = await getEthBalance(address, chains[0]);
  const ethBalanceFormatted = formatBalance(ethBalance, 18);

  const tokenBalances: TokenBalance[] = [];
  
  for (const token of knownTokens) {
    if (chains.includes(token.chain)) {
      try {
        const balance = await getTokenBalanceWithMetadata(
          token.address,
          address,
          token.chain
        );
        
        if (BigInt(balance.balance) > BigInt(0)) {
          tokenBalances.push(balance);
        }
      } catch (error) {
        console.error(`Error fetching token balance for ${token.address}:`, error);
      }
    }
  }

  return {
    address,
    ethBalance,
    ethBalanceFormatted,
    tokenBalances,
    vaultPositions: [],
    lastUpdated: Date.now(),
  };
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
