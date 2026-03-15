import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, Vault, Stack, Link as LinkIcon, Repeat, ArrowsLeftRight } from '@phosphor-icons/react';
import { buildStrategyGraph, type StrategyNode, type StrategyEdge } from '@/lib/strategyMap';
import { VAULTS } from '@/lib/mockData';
import { formatCurrency, getRiskBgColor } from '@/lib/format';

interface StrategyMapProps {
  onVaultClick?: (vaultId: string) => void;
}

type ViewMode = 'all' | 'asset' | 'protocol' | 'chain';

export function StrategyMap({ onVaultClick }: StrategyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const filterOptions = useMemo(() => {
    if (viewMode === 'asset') {
      return Array.from(new Set(VAULTS.map(v => v.asset))).sort();
    } else if (viewMode === 'protocol') {
      return Array.from(new Set(VAULTS.map(v => v.protocol))).sort();
    } else if (viewMode === 'chain') {
      return Array.from(new Set(VAULTS.map(v => v.chain))).sort();
    }
    return [];
  }, [viewMode]);

  const graphData = useMemo(() => {
    if (viewMode === 'all') {
      return buildStrategyGraph(VAULTS);
    } else if (viewMode === 'asset' && selectedFilter) {
      return buildStrategyGraph(VAULTS, selectedFilter);
    } else if (viewMode === 'protocol' && selectedFilter) {
      return buildStrategyGraph(VAULTS, undefined, selectedFilter);
    } else if (viewMode === 'chain' && selectedFilter) {
      return buildStrategyGraph(VAULTS, undefined, undefined, selectedFilter);
    }
    return buildStrategyGraph(VAULTS);
  }, [viewMode, selectedFilter]);

  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 600;

    const g = svg
      .append('g')
      .attr('class', 'graph-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(['asset', 'strategy_type', 'protocol', 'vault', 'chain'])
      .range(['#68A3E0', '#9370DB', '#50C878', '#FF6B6B', '#FFB347']);

    const simulation = d3.forceSimulation(graphData.nodes as any)
      .force('link', d3.forceLink(graphData.edges as any)
        .id((d: any) => d.id)
        .distance(80)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    const link = g.append('g')
      .selectAll('line')
      .data(graphData.edges)
      .enter()
      .append('line')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', (d) => Math.sqrt(d.weight || 1) / 5000 || 1);

    const node = g.append('g')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    node.append('circle')
      .attr('r', (d) => {
        if (d.type === 'vault') {
          return Math.max(8, Math.min(30, Math.sqrt(d.tvl || 0) / 1000));
        }
        return d.type === 'asset' ? 20 : d.type === 'protocol' ? 18 : 15;
      })
      .attr('fill', (d) => {
        if (d.type === 'vault' && d.risk_score !== undefined) {
          const riskBand = d.risk_score < 3 ? 'low' : d.risk_score < 6 ? 'medium' : 'high';
          return riskBand === 'low' ? '#50C878' : riskBand === 'medium' ? '#FFB347' : '#FF6B6B';
        }
        return colorScale(d.type);
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('opacity', 0.85);

    node.append('text')
      .text((d) => d.label)
      .attr('x', 0)
      .attr('y', (d) => {
        if (d.type === 'vault') {
          return Math.max(8, Math.min(30, Math.sqrt(d.tvl || 0) / 1000)) + 14;
        }
        return d.type === 'asset' ? 26 : d.type === 'protocol' ? 24 : 21;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', (d) => d.type === 'vault' ? '10px' : '12px')
      .attr('font-weight', (d) => d.type === 'vault' ? 'normal' : '600')
      .attr('fill', 'var(--foreground)')
      .style('pointer-events', 'none');

    node.on('click', (event, d) => {
      if (d.type === 'vault' && d.vault_id && onVaultClick) {
        onVaultClick(d.vault_id);
      }
    });

    node.on('mouseenter', (event, d) => {
      setHoveredNode(d.id);
    });

    node.on('mouseleave', () => {
      setHoveredNode(null);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graphData, onVaultClick]);

  const hoveredNodeData = hoveredNode
    ? graphData.nodes.find(n => n.id === hoveredNode)
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Strategy Map</CardTitle>
              <CardDescription className="mt-2">
                Visual intelligence layer exploring DeFi vault relationships across assets, strategies, protocols, and chains
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              Interactive Graph
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View Mode:</span>
              <Select
                value={viewMode}
                onValueChange={(value) => {
                  setViewMode(value as ViewMode);
                  setSelectedFilter('');
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="asset">By Asset</SelectItem>
                  <SelectItem value="protocol">By Protocol</SelectItem>
                  <SelectItem value="chain">By Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {viewMode !== 'all' && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter:</span>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={`Select ${viewMode}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setViewMode('all');
                  setSelectedFilter('');
                }}
              >
                <Repeat size={16} className="mr-2" />
                Reset View
              </Button>
            </div>
          </div>

          <div className="border rounded-lg bg-card/50 relative">
            <svg
              ref={svgRef}
              width="100%"
              height="600"
              className="bg-background/50"
            />

            {hoveredNodeData && (
              <div className="absolute top-4 right-4 bg-card border rounded-lg p-4 shadow-lg max-w-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {hoveredNodeData.type === 'vault' && <Vault size={18} weight="fill" className="text-accent" />}
                    {hoveredNodeData.type === 'protocol' && <Stack size={18} weight="fill" className="text-accent" />}
                    {hoveredNodeData.type === 'asset' && <Network size={18} weight="fill" className="text-accent" />}
                    {hoveredNodeData.type === 'chain' && <LinkIcon size={18} weight="fill" className="text-accent" />}
                    <span className="font-semibold">{hoveredNodeData.label}</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {hoveredNodeData.type.replace('_', ' ')}
                  </Badge>
                  {hoveredNodeData.type === 'vault' && (
                    <div className="space-y-1 text-sm">
                      {hoveredNodeData.apy && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">APY:</span>
                          <span className="font-medium text-accent">{hoveredNodeData.apy.toFixed(2)}%</span>
                        </div>
                      )}
                      {hoveredNodeData.tvl && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">TVL:</span>
                          <span className="font-medium">{formatCurrency(hoveredNodeData.tvl)}</span>
                        </div>
                      )}
                      {hoveredNodeData.risk_score !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Risk:</span>
                          <Badge className={getRiskBgColor(hoveredNodeData.risk_score)}>
                            {hoveredNodeData.risk_score.toFixed(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  {hoveredNodeData.type === 'protocol' && hoveredNodeData.tvl && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total TVL: </span>
                      <span className="font-medium">{formatCurrency(hoveredNodeData.tvl)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#68A3E0' }} />
              <span className="text-sm">Assets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#9370DB' }} />
              <span className="text-sm">Strategies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#50C878' }} />
              <span className="text-sm">Protocols</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF6B6B' }} />
              <span className="text-sm">Vaults (High Risk)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFB347' }} />
              <span className="text-sm">Chains</span>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">How to use:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Node size</strong> represents TVL for vaults and protocols</li>
              <li><strong>Node color</strong> indicates risk level for vaults (green=low, orange=medium, red=high)</li>
              <li><strong>Click vaults</strong> to open detail pages</li>
              <li><strong>Drag nodes</strong> to rearrange the layout</li>
              <li><strong>Zoom and pan</strong> to explore different areas</li>
              <li><strong>Filter by view mode</strong> to focus on specific dimensions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Graph Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Nodes</p>
              <p className="text-2xl font-semibold">{graphData.nodes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Vaults</p>
              <p className="text-2xl font-semibold">
                {graphData.nodes.filter(n => n.type === 'vault').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Protocols</p>
              <p className="text-2xl font-semibold">
                {graphData.nodes.filter(n => n.type === 'protocol').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Connections</p>
              <p className="text-2xl font-semibold">{graphData.edges.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
