import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MagnifyingGlass,
  Lightning,
  CheckCircle,
  Warning,
  Clock,
  Cube,
  Database,
  ChartBar,
} from '@phosphor-icons/react';
import { DiscoveryEngine } from '@/lib/discovery';
import type { DiscoveryResult, IndexerJob } from '@/lib/discovery';
import { ArchitectureVisualization } from '@/components/ArchitectureVisualization';

export function DiscoveryEnginePanel() {
  const [engine] = useState(() => new DiscoveryEngine());
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [jobs, setJobs] = useState<IndexerJob[]>([]);
  const [stats, setStats] = useState<{
    aggregatorCount: number;
    registryCount: number;
    onchainCount: number;
    totalUnique: number;
    duration: number;
  } | null>(null);

  const runDiscovery = async () => {
    setIsRunning(true);
    setResults([]);
    setJobs([]);
    setStats(null);

    try {
      const chains = ['ethereum', 'arbitrum', 'base', 'optimism', 'polygon'];
      const discovery = await engine.runFullDiscovery(chains);

      setResults(discovery.discovered);
      setJobs(discovery.jobs);
      setStats(discovery.stats);
    } catch (error) {
      console.error('Discovery failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'aggregator':
        return <Database size={16} weight="fill" />;
      case 'registry':
        return <Cube size={16} weight="fill" />;
      case 'onchain':
        return <ChartBar size={16} weight="fill" />;
      default:
        return <MagnifyingGlass size={16} />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'aggregator':
        return 'bg-blue-100 text-blue-700';
      case 'registry':
        return 'bg-purple-100 text-purple-700';
      case 'onchain':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getJobStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircle size={16} weight="fill" />, color: 'text-green-600' };
      case 'running':
        return { icon: <Lightning size={16} weight="fill" />, color: 'text-blue-600' };
      case 'failed':
        return { icon: <Warning size={16} weight="fill" />, color: 'text-red-600' };
      default:
        return { icon: <Clock size={16} />, color: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Vault Discovery Engine</h2>
          <p className="text-muted-foreground mt-1">
            Automatic detection across aggregators, registries, and onchain patterns
          </p>
        </div>
        <Button onClick={runDiscovery} disabled={isRunning} size="lg">
          {isRunning ? (
            <>
              <Lightning className="mr-2 animate-pulse" size={20} weight="fill" />
              Running Discovery...
            </>
          ) : (
            <>
              <MagnifyingGlass className="mr-2" size={20} />
              Run Discovery
            </>
          )}
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Aggregator</CardDescription>
              <CardTitle className="text-3xl">{stats.aggregatorCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Registry</CardDescription>
              <CardTitle className="text-3xl">{stats.registryCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Onchain</CardDescription>
              <CardTitle className="text-3xl">{stats.onchainCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Unique</CardDescription>
              <CardTitle className="text-3xl text-accent">{stats.totalUnique}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Duration</CardDescription>
              <CardTitle className="text-2xl">{(stats.duration / 1000).toFixed(2)}s</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="results">
            Discovery Results ({results.length})
          </TabsTrigger>
          <TabsTrigger value="jobs">
            Indexer Jobs ({jobs.length})
          </TabsTrigger>
          <TabsTrigger value="architecture">
            Architecture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {results.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MagnifyingGlass size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No results yet. Click "Run Discovery" to start finding vaults.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Discovered Vaults</CardTitle>
                <CardDescription>
                  Vaults discovered across all three layers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {results.map((result, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {result.vaultAddress}
                            </code>
                            <Badge variant="outline" className="capitalize">
                              {result.chain}
                            </Badge>
                            <Badge className={getSourceColor(result.source)}>
                              <span className="flex items-center gap-1">
                                {getSourceIcon(result.source)}
                                {result.source}
                              </span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Protocol: {result.protocol}</span>
                            <span>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                            <span>
                              {new Date(result.discoveredAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <Progress value={result.confidence * 100} className="w-24" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indexer Jobs</CardTitle>
              <CardDescription>
                Background workers scanning chains and protocols
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Clock size={48} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No jobs running yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const status = getJobStatus(job.status);
                    return (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={status.color}>{status.icon}</div>
                          <div>
                            <p className="font-medium capitalize">
                              {job.type.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {job.chain}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="capitalize">
                            {job.status}
                          </Badge>
                          {job.vaultsProcessed !== undefined && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {job.vaultsProcessed} vaults
                            </p>
                          )}
                          {job.error && (
                            <p className="text-sm text-red-600 mt-1">{job.error}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <ArchitectureVisualization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
