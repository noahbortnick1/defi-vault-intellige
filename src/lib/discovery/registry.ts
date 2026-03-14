import type { ProtocolRegistry, DiscoveryResult } from './types';

export class RegistryLayer {
  private registries: ProtocolRegistry[] = [
    {
      name: 'Yearn Finance',
      chain: 'ethereum',
      registryAddress: '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804',
      vaultListMethod: 'getVaults()',
    },
    {
      name: 'Beefy Finance',
      chain: 'polygon',
      registryAddress: '0x...beefy-registry',
      vaultListMethod: 'getAllVaults()',
    },
    {
      name: 'Morpho',
      chain: 'ethereum',
      registryAddress: '0x...morpho-registry',
      vaultListMethod: 'getMarkets()',
    },
    {
      name: 'Pendle',
      chain: 'arbitrum',
      registryAddress: '0x...pendle-registry',
      vaultListMethod: 'getAllMarkets()',
    },
    {
      name: 'Enzyme',
      chain: 'ethereum',
      registryAddress: '0x...enzyme-registry',
      vaultListMethod: 'getVaultAddresses()',
    },
  ];

  async scanRegistry(registry: ProtocolRegistry): Promise<DiscoveryResult[]> {
    const vaults = await this.simulateRegistryScan(registry);
    return vaults.map((address) => ({
      vaultAddress: address,
      chain: registry.chain,
      protocol: registry.name,
      source: 'registry' as const,
      confidence: 0.95,
      discoveredAt: Date.now(),
      metadata: {
        registryAddress: registry.registryAddress,
        method: registry.vaultListMethod,
      },
    }));
  }

  private async simulateRegistryScan(registry: ProtocolRegistry): Promise<string[]> {
    const mockVaults: Record<string, string[]> = {
      'Yearn Finance': [
        '0x19d3364a399d251e894ac732651be8b0e4e85001',
        '0xa354f35829ae975e850e23e9615b11da1b3dc4de',
        '0x5f18c75abdae578b483e5f43f12a39cf75b973a9',
        '0x341bb10d8f5947f3066502dc8125d9b8949fd3d6',
      ],
      'Beefy Finance': [
        '0x...beefy-vault-1',
        '0x...beefy-vault-2',
        '0x...beefy-vault-3',
      ],
      'Morpho': [
        '0x...morpho-market-1',
        '0x...morpho-market-2',
        '0x...morpho-market-3',
        '0x...morpho-market-4',
      ],
      'Pendle': [
        '0x...pendle-market-1',
        '0x...pendle-market-2',
      ],
      'Enzyme': [
        '0x...enzyme-vault-1',
        '0x...enzyme-vault-2',
        '0x...enzyme-vault-3',
      ],
    };

    return mockVaults[registry.name] || [];
  }

  async discoverAllRegistries(): Promise<DiscoveryResult[]> {
    const results = await Promise.all(
      this.registries.map((registry) => this.scanRegistry(registry))
    );
    return results.flat();
  }

  getRegistries(): ProtocolRegistry[] {
    return this.registries;
  }
}
