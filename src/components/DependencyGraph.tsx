import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TreeStructure,
  Warning,
  ShieldCheck,
  Buildings,
  ChartLine,
  CaretDown,
  CaretRight,
  Circle,
} from '@phosphor-icons/react';
import { VAULTS } from '@/lib/mockData';
import { formatCurrency, getRiskBgColor } from '@/lib/format';
import type { Vault } from '@/lib/types';

/** Extended vault shape that includes fields present in mock data but not yet in the Vault type */
interface MockDependency {
  id: string;
  vaultId?: string;
  protocol: string;
  type: string;
  criticality?: string;
  description?: string;
  riskImpact?: string;
}

interface VaultWithDeps extends Vault {
  dependencies?: MockDependency[];
  strategyDescription?: string;
}

const MOCK_VAULTS = VAULTS as VaultWithDeps[];

interface DependencyNode {
  id: string;
  name: string;
  type: 'vault' | 'protocol' | 'oracle' | 'bridge' | 'token';
  criticality?: 'critical' | 'high' | 'medium' | 'low';
  children: DependencyNode[];
  description?: string;
  riskImpact?: string;
}

const CRITICALITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 border-red-400/30 bg-red-500/10',
  high: 'text-orange-400 border-orange-400/30 bg-orange-500/10',
  medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
  low: 'text-green-400 border-green-400/30 bg-green-500/10',
};

const TYPE_COLORS: Record<string, string> = {
  vault: 'text-primary',
  protocol: 'text-blue-400',
  oracle: 'text-purple-400',
  bridge: 'text-orange-400',
  token: 'text-cyan-400',
};

const TYPE_LABELS: Record<string, string> = {
  vault: 'Vault',
  protocol: 'Protocol',
  oracle: 'Oracle',
  bridge: 'Bridge',
  token: 'Token',
};

function buildDependencyTree(vault: VaultWithDeps): DependencyNode {
  return {
    id: vault.id,
    name: vault.name,
    type: 'vault',
    children: (vault.dependencies || []).map((dep) => ({
      id: dep.id,
      name: dep.protocol,
      type: dep.type as DependencyNode['type'],
      criticality: dep.criticality as DependencyNode['criticality'],
      description: dep.description,
      riskImpact: dep.riskImpact,
      children: [],
    })),
  };
}

interface TreeNodeProps {
  node: DependencyNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}

function TreeNode({ node, depth, expanded, onToggle }: TreeNodeProps) {
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children.length > 0;
  const indent = depth * 24;
  const typeColor = TYPE_COLORS[node.type] || 'text-muted-foreground';
  const critColor = node.criticality ? CRITICALITY_COLORS[node.criticality] : '';

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/40 transition-colors ${
          hasChildren ? 'cursor-pointer' : ''
        }`}
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        {/* Expand/collapse toggle */}
        <span className="text-muted-foreground w-4 shrink-0">
          {hasChildren ? (
            isExpanded ? <CaretDown size={12} /> : <CaretRight size={12} />
          ) : (
            <Circle size={6} weight="fill" className="ml-1" />
          )}
        </span>

        {/* Type icon */}
        <span className={`shrink-0 ${typeColor}`}>
          {node.type === 'vault' && <Buildings size={14} weight="fill" />}
          {node.type === 'protocol' && <ChartLine size={14} />}
          {node.type === 'oracle' && <Circle size={14} />}
          {node.type === 'bridge' && <Warning size={14} />}
          {node.type === 'token' && <ShieldCheck size={14} />}
        </span>

        <span className="font-medium text-sm">{node.name}</span>

        <Badge variant="outline" className={`text-xs ml-1 ${typeColor}`}>
          {TYPE_LABELS[node.type]}
        </Badge>

        {node.criticality && (
          <Badge className={`text-xs ml-1 border ${critColor}`}>
            {node.criticality}
          </Badge>
        )}

        {node.description && (
          <span className="text-xs text-muted-foreground ml-2 truncate max-w-xs hidden md:block">
            {node.description}
          </span>
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="border-l border-border/50 ml-6">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DependencyGraphProps {
  renderNav: () => React.ReactNode;
  onNavigateToVault?: (vaultId: string) => void;
}

export function DependencyGraph({ renderNav, onNavigateToVault }: DependencyGraphProps) {
  const activeVaults = useMemo(
    () => MOCK_VAULTS.filter((v) => v.status === 'active'),
    []
  );

  const [selectedVaultId, setSelectedVaultId] = useState<string>(activeVaults[0]?.id || '');
  // Start with all vault nodes expanded so the tree is visible on first load
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(activeVaults.map((v) => v.id))
  );

  const selectedVault = activeVaults.find((v) => v.id === selectedVaultId);

  const tree = useMemo(
    () => (selectedVault ? buildDependencyTree(selectedVault) : null),
    [selectedVault]
  );

  const handleToggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Aggregate all unique protocol dependencies across all vaults
  const allDeps = useMemo(() => {
    const map = new Map<string, { name: string; vaultCount: number; criticalCount: number; vaults: string[] }>();
    activeVaults.forEach((v) => {
      (v.dependencies || []).forEach((dep) => {
        const entry = map.get(dep.protocol) || { name: dep.protocol, vaultCount: 0, criticalCount: 0, vaults: [] };
        entry.vaultCount++;
        if (dep.criticality === 'critical') entry.criticalCount++;
        entry.vaults.push(v.name);
        map.set(dep.protocol, entry);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.vaultCount - a.vaultCount);
  }, [activeVaults]);

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TreeStructure className="text-orange-400" size={28} weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dependency Graph</h1>
              <p className="text-muted-foreground">
                Protocol dependency trees and risk cascade analysis for every vault
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vault selector */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Select Vault
            </h2>
            {activeVaults.map((vault) => {
              const depCount = vault.dependencies?.length || 0;
              const hasCritical = vault.dependencies?.some((d) => d.criticality === 'critical');
              return (
                <Card
                  key={vault.id}
                  className={`cursor-pointer transition-all ${
                    selectedVaultId === vault.id
                      ? 'border-primary ring-1 ring-primary/30'
                      : 'hover:border-primary/40'
                  }`}
                  onClick={() => setSelectedVaultId(vault.id)}
                >
                  <CardContent className="py-3 px-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{vault.name}</p>
                        <p className="text-xs text-muted-foreground">{vault.protocolName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge className={`text-xs ${getRiskBgColor(vault.riskBand)}`}>
                          Risk {vault.riskScore.toFixed(1)}
                        </Badge>
                        {depCount > 0 ? (
                          <Badge
                            variant="outline"
                            className={`text-xs ${hasCritical ? 'border-red-400/30 text-red-400' : 'border-yellow-400/30 text-yellow-400'}`}
                          >
                            {depCount} dep{depCount !== 1 ? 's' : ''}
                            {hasCritical && ' ⚠'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
                            No deps
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Dependency Tree */}
          <div className="lg:col-span-2 space-y-4">
            {selectedVault && tree && (
              <>
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <CardTitle>{selectedVault.name}</CardTitle>
                        <CardDescription>{selectedVault.strategyDescription || selectedVault.description}</CardDescription>
                      </div>
                      {onNavigateToVault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigateToVault(selectedVault.id)}
                        >
                          Full Analysis
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{formatCurrency(selectedVault.tvl, 0)} TVL</Badge>
                      <Badge className={getRiskBgColor(selectedVault.riskBand)}>
                        Risk Score {selectedVault.riskScore.toFixed(1)}
                      </Badge>
                      <Badge variant="outline">{(selectedVault.dependencies?.length || 0)} dependencies</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Tree visualization */}
                    <div className="bg-muted/20 rounded-lg p-4 border border-border/50 font-mono text-sm">
                      {selectedVault.dependencies && selectedVault.dependencies.length === 0 ? (
                        <div className="flex items-start gap-2">
                          <Buildings size={14} className="text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium">{selectedVault.name}</span>
                            <p className="text-xs text-muted-foreground mt-1 font-sans">
                              No external protocol dependencies. Minimal dependency risk.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <TreeNode
                            node={tree}
                            depth={0}
                            expanded={expanded}
                            onToggle={handleToggle}
                          />
                        </div>
                      )}
                    </div>

                    {/* Dependency Detail */}
                    {selectedVault.dependencies && selectedVault.dependencies.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold">Dependency Risk Cascade</h4>
                        {selectedVault.dependencies.map((dep) => {
                          const critColor = CRITICALITY_COLORS[dep.criticality || 'low'];
                          return (
                            <div
                              key={dep.id}
                              className={`p-3 rounded-lg border ${critColor} bg-opacity-5`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{dep.protocol}</span>
                                <div className="flex gap-2">
                                  <Badge className={`text-xs border ${critColor}`}>
                                    {dep.criticality || 'low'}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {TYPE_LABELS[dep.type]}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">{dep.description}</p>
                              {dep.riskImpact && (
                                <p className="text-xs mt-1 flex items-center gap-1">
                                  <Warning size={10} className="text-yellow-400" />
                                  <span className="text-muted-foreground">Risk impact: </span>
                                  <span className="capitalize">{dep.riskImpact}</span>
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Cross-vault dependency overview */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Protocol Dependency Map</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Protocols referenced as dependencies across all indexed vaults. High dependency counts indicate systemic exposure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allDeps.map((dep) => (
              <Card key={dep.name} className={dep.criticalCount > 0 ? 'border-red-400/20' : ''}>
                <CardContent className="py-4 px-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{dep.name}</span>
                    <div className="flex gap-1">
                      {dep.criticalCount > 0 && (
                        <Badge className="text-xs bg-red-500/10 text-red-400 border-red-400/30">
                          {dep.criticalCount} critical
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {dep.vaultCount} vault{dep.vaultCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used by: {dep.vaults.slice(0, 2).join(', ')}
                    {dep.vaults.length > 2 && ` +${dep.vaults.length - 2} more`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
