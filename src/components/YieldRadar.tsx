import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightning, TrendUp, TrendDown, Warning, Plus, Minus, ArrowRight, Funnel } from '@phosphor-icons/react';
import { RADAR_EVENTS } from '@/lib/mockData';
import { formatCurrency, formatPercent, formatTimeAgo, getChainName } from '@/lib/format';
import type { EventType, EventSeverity } from '@/lib/types';

interface YieldRadarProps {
  onNavigateToVault: (vaultId: string) => void;
  renderNav: () => React.ReactNode;
}

export function YieldRadar({ onNavigateToVault, renderNav }: YieldRadarProps) {
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<EventSeverity | 'all'>('all');
  const [chainFilter, setChainFilter] = useState<string>('all');

  const filteredEvents = useMemo(() => {
    return RADAR_EVENTS.filter((event) => {
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
      const matchesChain = chainFilter === 'all' || event.chain === chainFilter;
      
      return matchesType && matchesSeverity && matchesChain;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [typeFilter, severityFilter, chainFilter]);

  const getSeverityColor = (severity: EventSeverity) => {
    const colors: Record<EventSeverity, string> = {
      'critical': 'bg-red-500/20 text-red-400 border-red-500/30',
      'high': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'low': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[severity];
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'apy-spike':
      case 'tvl-inflow':
        return <TrendUp size={20} weight="bold" />;
      case 'apy-drop':
      case 'tvl-outflow':
        return <TrendDown size={20} weight="bold" />;
      case 'risk-change':
      case 'governance-change':
      case 'liquidity-warning':
        return <Warning size={20} weight="bold" />;
      case 'new-vault':
        return <Plus size={20} weight="bold" />;
      default:
        return <Lightning size={20} weight="bold" />;
    }
  };

  const getEventColor = (type: EventType) => {
    if (type.includes('spike') || type.includes('inflow') || type === 'new-vault') {
      return 'text-green-400';
    }
    if (type.includes('drop') || type.includes('outflow') || type.includes('warning')) {
      return 'text-red-400';
    }
    return 'text-accent';
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setSeverityFilter('all');
    setChainFilter('all');
  };

  const activeFiltersCount = [
    typeFilter !== 'all',
    severityFilter !== 'all',
    chainFilter !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {renderNav()}

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Yield Radar</h2>
            <p className="text-muted-foreground">
              Real-time feed of meaningful vault changes and market intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Events</CardDescription>
                <CardTitle className="text-2xl">{RADAR_EVENTS.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Critical Alerts</CardDescription>
                <CardTitle className="text-2xl text-red-400">
                  {RADAR_EVENTS.filter(e => e.severity === 'critical').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>High Priority</CardDescription>
                <CardTitle className="text-2xl text-orange-400">
                  {RADAR_EVENTS.filter(e => e.severity === 'high').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Last 24h</CardDescription>
                <CardTitle className="text-2xl">{RADAR_EVENTS.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Funnel size={20} className="text-muted-foreground" />
                  <CardTitle>Filters</CardTitle>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount} active</Badge>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as EventType | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Event Types</SelectItem>
                    <SelectItem value="apy-spike">APY Spike</SelectItem>
                    <SelectItem value="apy-drop">APY Drop</SelectItem>
                    <SelectItem value="tvl-inflow">TVL Inflow</SelectItem>
                    <SelectItem value="tvl-outflow">TVL Outflow</SelectItem>
                    <SelectItem value="new-vault">New Vault</SelectItem>
                    <SelectItem value="risk-change">Risk Change</SelectItem>
                    <SelectItem value="governance-change">Governance Change</SelectItem>
                    <SelectItem value="incentive-change">Incentive Change</SelectItem>
                    <SelectItem value="liquidity-warning">Liquidity Warning</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as EventSeverity | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={chainFilter} onValueChange={setChainFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chains</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Feed ({filteredEvents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No events match your filters</p>
                  <Button variant="ghost" onClick={clearFilters} className="mt-4">
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-5 border border-border rounded-lg hover:border-accent/50 hover:bg-card/50 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getEventColor(event.type)} bg-current/10`}>
                          {getEventIcon(event.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                <Badge className={getSeverityColor(event.severity)}>
                                  {event.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">{event.protocolName}</Badge>
                                <Badge variant="outline" className="text-xs">{getChainName(event.chain)}</Badge>
                                <span className="text-xs text-muted-foreground">{formatTimeAgo(event.timestamp)}</span>
                              </div>
                            </div>
                            {event.metadata.changePercent && (
                              <div className="text-right flex-shrink-0">
                                <p className={`text-2xl font-bold ${
                                  event.metadata.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {event.metadata.changePercent > 0 ? '+' : ''}
                                  {formatPercent(Math.abs(event.metadata.changePercent))}
                                </p>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                          {event.metadata && (event.metadata.oldValue !== undefined || event.metadata.newValue !== undefined) && (
                            <div className="flex items-center gap-4 text-sm mb-3">
                              {event.metadata.oldValue !== undefined && (
                                <div>
                                  <span className="text-muted-foreground">From: </span>
                                  <span className="font-mono">
                                    {event.type.includes('apy') || event.type.includes('risk')
                                      ? formatPercent(event.metadata.oldValue)
                                      : formatCurrency(event.metadata.oldValue)}
                                  </span>
                                </div>
                              )}
                              {event.metadata.newValue !== undefined && (
                                <div>
                                  <span className="text-muted-foreground">To: </span>
                                  <span className="font-mono">
                                    {event.type.includes('apy') || event.type.includes('risk')
                                      ? formatPercent(event.metadata.newValue)
                                      : formatCurrency(event.metadata.newValue)}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="p-3 bg-accent/5 border-l-2 border-accent rounded-r">
                            <p className="text-sm">
                              <span className="font-medium text-accent">Why it matters: </span>
                              <span className="text-muted-foreground">{event.whyItMatters}</span>
                            </p>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onNavigateToVault(event.vaultId)}
                            >
                              View Vault
                              <ArrowRight className="ml-2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
