/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    selectedAddress: string | null;
    isMetaMask?: boolean;
  };
}