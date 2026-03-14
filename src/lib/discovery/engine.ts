import { AggregatorLayer } from './aggregator';
import { RegistryLayer } from './registry';
import { OnchainDetector } from './onchain';
import { StrategyClassifier } from './strategy';
import type { DiscoveryResult, IndexerJob } from './types';

export class DiscoveryEngine {
  private aggregator: AggregatorLayer;
  private registry: RegistryLayer;
  private onchain: OnchainDetector;
  private classifier: StrategyClassifier;
  private jobs: IndexerJob[] = [];

  constructor() {
    this.aggregator = new AggregatorLayer();
    this.registry = new RegistryLayer();
    this.onchain = new OnchainDetector();
    this.classifier = new StrategyClassifier();
  }

  async runFullDiscovery(chains: string[]): Promise<{
    discovered: DiscoveryResult[];
    jobs: IndexerJob[];
    stats: {
      aggregatorCount: number;
      registryCount: number;
      onchainCount: number;
      totalUnique: number;
      duration: number;
    };
  }> {
    const startTime = Date.now();
    const allResults: DiscoveryResult[] = [];

    console.log('🔍 Starting vault discovery engine...');

    const aggregatorJob = this.createJob('vault_discovery', 'multi-chain');
    allResults.push(...(await this.runAggregatorDiscovery(aggregatorJob)));

    const registryJob = this.createJob('vault_discovery', 'multi-chain');
    allResults.push(...(await this.runRegistryDiscovery(registryJob)));

    for (const chain of chains) {
      const onchainJob = this.createJob('vault_discovery', chain);
      allResults.push(...(await this.runOnchainDiscovery(chain, onchainJob)));
    }

    const uniqueResults = this.deduplicateResults(allResults);
    const duration = Date.now() - startTime;

    const aggregatorCount = allResults.filter((r) => r.source === 'aggregator').length;
    const registryCount = allResults.filter((r) => r.source === 'registry').length;
    const onchainCount = allResults.filter((r) => r.source === 'onchain').length;

    console.log(`✅ Discovery complete: ${uniqueResults.length} unique vaults found`);
    console.log(`   📊 Aggregator: ${aggregatorCount}`);
    console.log(`   📋 Registry: ${registryCount}`);
    console.log(`   ⛓️  Onchain: ${onchainCount}`);
    console.log(`   ⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);

    return {
      discovered: uniqueResults,
      jobs: this.jobs,
      stats: {
        aggregatorCount,
        registryCount,
        onchainCount,
        totalUnique: uniqueResults.length,
        duration,
      },
    };
  }

  private async runAggregatorDiscovery(job: IndexerJob): Promise<DiscoveryResult[]> {
    this.startJob(job);
    try {
      const results = await this.aggregator.discoverVaults();
      this.completeJob(job, results.length);
      return results;
    } catch (error) {
      this.failJob(job, error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private async runRegistryDiscovery(job: IndexerJob): Promise<DiscoveryResult[]> {
    this.startJob(job);
    try {
      const results = await this.registry.discoverAllRegistries();
      this.completeJob(job, results.length);
      return results;
    } catch (error) {
      this.failJob(job, error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private async runOnchainDiscovery(chain: string, job: IndexerJob): Promise<DiscoveryResult[]> {
    this.startJob(job);
    try {
      const latestBlock = 20000000;
      const fromBlock = latestBlock - 100000;
      const results = await this.onchain.scanBlockRange(chain, fromBlock, latestBlock);
      this.completeJob(job, results.length);
      return results;
    } catch (error) {
      this.failJob(job, error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private deduplicateResults(results: DiscoveryResult[]): DiscoveryResult[] {
    const seen = new Map<string, DiscoveryResult>();

    for (const result of results) {
      const key = `${result.chain}:${result.vaultAddress}`;
      const existing = seen.get(key);

      if (!existing || result.confidence > existing.confidence) {
        seen.set(key, result);
      }
    }

    return Array.from(seen.values());
  }

  private createJob(
    type: IndexerJob['type'],
    chain: string
  ): IndexerJob {
    const job: IndexerJob = {
      id: `${type}-${chain}-${Date.now()}`,
      type,
      chain,
      status: 'pending',
    };
    this.jobs.push(job);
    return job;
  }

  private startJob(job: IndexerJob): void {
    job.status = 'running';
    job.startedAt = Date.now();
  }

  private completeJob(job: IndexerJob, vaultsProcessed: number): void {
    job.status = 'completed';
    job.completedAt = Date.now();
    job.vaultsProcessed = vaultsProcessed;
  }

  private failJob(job: IndexerJob, error: string): void {
    job.status = 'failed';
    job.completedAt = Date.now();
    job.error = error;
  }

  getJobs(): IndexerJob[] {
    return this.jobs;
  }

  async classifyVaultStrategy(vaultAddress: string) {
    return this.classifier.simulateStrategyClassification(vaultAddress);
  }

  getAggregator(): AggregatorLayer {
    return this.aggregator;
  }

  getRegistry(): RegistryLayer {
    return this.registry;
  }

  getOnchainDetector(): OnchainDetector {
    return this.onchain;
  }

  getStrategyClassifier(): StrategyClassifier {
    return this.classifier;
  }
}
