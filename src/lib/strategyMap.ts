import { VAULTS, PROTOCOLS } from './mockData';
import type { Vault } from './types';

export type NodeType = 'asset' | 'strategy_type' | 'protocol' | 'vault' | 'chain';
export type EdgeType = 'uses' | 'depends_on' | 'belongs_to' | 'allocates_to';

export interface StrategyNode {
  id: string;
  type: NodeType;
  label: string;
  protocol?: string;
  chain?: string;
  asset?: string;
  vault_id?: string;
  tvl?: number;
  apy?: number;
  risk_score?: number;
  metadata?: Record<string, any>;
}

export interface StrategyEdge {
  id: string;
  from_node_id: string;
  to_node_id: string;
  type: EdgeType;
  weight?: number;
  metadata?: Record<string, any>;
}

export interface StrategyGraph {
  nodes: StrategyNode[];
  edges: StrategyEdge[];
}

export function buildStrategyGraph(
  vaults: Vault[],
  filterAsset?: string,
  filterProtocol?: string,
  filterChain?: string
): StrategyGraph {
  const nodes: StrategyNode[] = [];
  const edges: StrategyEdge[] = [];
  const nodeIds = new Set<string>();

  let filteredVaults = vaults;
  if (filterAsset) {
    filteredVaults = filteredVaults.filter(v => v.asset === filterAsset);
  }
  if (filterProtocol) {
    filteredVaults = filteredVaults.filter(v => v.protocol === filterProtocol);
  }
  if (filterChain) {
    filteredVaults = filteredVaults.filter(v => v.chain === filterChain);
  }

  const assetSet = new Set<string>();
  const strategyTypeSet = new Set<string>();
  const protocolSet = new Set<string>();
  const chainSet = new Set<string>();

  filteredVaults.forEach(vault => {
    assetSet.add(vault.asset);
    strategyTypeSet.add(vault.strategy);
    protocolSet.add(vault.protocol);
    chainSet.add(vault.chain);
  });

  assetSet.forEach(asset => {
    const id = `asset_${asset}`;
    if (!nodeIds.has(id)) {
      nodes.push({
        id,
        type: 'asset',
        label: asset,
        asset,
      });
      nodeIds.add(id);
    }
  });

  strategyTypeSet.forEach(strategy => {
    const id = `strategy_${strategy}`;
    if (!nodeIds.has(id)) {
      nodes.push({
        id,
        type: 'strategy_type',
        label: strategy,
        metadata: { strategy },
      });
      nodeIds.add(id);
    }
  });

  protocolSet.forEach(protocol => {
    const id = `protocol_${protocol}`;
    if (!nodeIds.has(id)) {
      const protocolVaults = filteredVaults.filter(v => v.protocol === protocol);
      const totalTvl = protocolVaults.reduce((sum, v) => sum + v.tvl, 0);
      nodes.push({
        id,
        type: 'protocol',
        label: protocol,
        protocol,
        tvl: totalTvl,
      });
      nodeIds.add(id);
    }
  });

  chainSet.forEach(chain => {
    const id = `chain_${chain}`;
    if (!nodeIds.has(id)) {
      nodes.push({
        id,
        type: 'chain',
        label: chain,
        chain,
      });
      nodeIds.add(id);
    }
  });

  filteredVaults.forEach(vault => {
    const id = `vault_${vault.id}`;
    if (!nodeIds.has(id)) {
      nodes.push({
        id,
        type: 'vault',
        label: vault.name,
        vault_id: vault.id,
        tvl: vault.tvl,
        apy: vault.apy,
        risk_score: vault.riskScore,
        protocol: vault.protocol,
        chain: vault.chain,
        asset: vault.asset,
      });
      nodeIds.add(id);
    }

    edges.push({
      id: `edge_asset_${vault.asset}_to_vault_${vault.id}`,
      from_node_id: `asset_${vault.asset}`,
      to_node_id: `vault_${vault.id}`,
      type: 'allocates_to',
      weight: vault.tvl,
    });

    edges.push({
      id: `edge_strategy_${vault.strategy}_to_vault_${vault.id}`,
      from_node_id: `strategy_${vault.strategy}`,
      to_node_id: `vault_${vault.id}`,
      type: 'uses',
    });

    edges.push({
      id: `edge_vault_${vault.id}_to_protocol_${vault.protocol}`,
      from_node_id: `vault_${vault.id}`,
      to_node_id: `protocol_${vault.protocol}`,
      type: 'belongs_to',
    });

    edges.push({
      id: `edge_vault_${vault.id}_to_chain_${vault.chain}`,
      from_node_id: `vault_${vault.id}`,
      to_node_id: `chain_${vault.chain}`,
      type: 'depends_on',
    });
  });

  return { nodes, edges };
}

export function getStrategyGraph(): StrategyGraph {
  return buildStrategyGraph(VAULTS);
}

export function getAssetStrategyGraph(asset: string): StrategyGraph {
  return buildStrategyGraph(VAULTS, asset);
}

export function getProtocolStrategyGraph(protocol: string): StrategyGraph {
  return buildStrategyGraph(VAULTS, undefined, protocol);
}

export function getVaultStrategyGraph(vaultAddress: string): StrategyGraph {
  const vault = VAULTS.find(v => v.id === vaultAddress);
  if (!vault) {
    return { nodes: [], edges: [] };
  }
  return buildStrategyGraph([vault]);
}
