import { useState, useMemo } from 'react';
import { Vault } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/risk';
import { RiskBadge } from './RiskBadge';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MagnifyingGlass, SortAscending, SortDescending } from '@phosphor-icons/react';
import { Card } from './ui/card';

interface VaultExplorerProps {
  vaults: Vault[];
  onSelectVault: (vault: Vault) => void;
}

type SortField = 'apy' | 'tvl' | 'riskScore' | 'name';
type SortDirection = 'asc' | 'desc';

export function VaultExplorer({ vaults, onSelectVault }: VaultExplorerProps) {
  const [search, setSearch] = useState('');
  const [chainFilter, setChainFilter] = useState<string>('all');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('tvl');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedVaults = useMemo(() => {
    let filtered = vaults;

    if (search) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.asset.toLowerCase().includes(search.toLowerCase()) ||
          v.protocol.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (chainFilter !== 'all') {
      filtered = filtered.filter((v) => v.chain === chainFilter);
    }

    if (protocolFilter !== 'all') {
      filtered = filtered.filter((v) => v.protocol === protocolFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [vaults, search, chainFilter, protocolFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <SortAscending className="inline ml-1" size={16} />
    ) : (
      <SortDescending className="inline ml-1" size={16} />
    );
  };

  const chains = Array.from(new Set(vaults.map((v) => v.chain)));
  const protocols = Array.from(new Set(vaults.map((v) => v.protocol)));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vaults..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={chainFilter} onValueChange={setChainFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chains</SelectItem>
            {chains.map((chain) => (
              <SelectItem key={chain} value={chain}>
                {chain.charAt(0).toUpperCase() + chain.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={protocolFilter} onValueChange={setProtocolFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Protocol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Protocols</SelectItem>
            {protocols.map((protocol) => (
              <SelectItem key={protocol} value={protocol}>
                {protocol.charAt(0).toUpperCase() + protocol.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('name')}
                >
                  Vault <SortIcon field="name" />
                </TableHead>
                <TableHead>Chain</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground text-right"
                  onClick={() => handleSort('apy')}
                >
                  APY <SortIcon field="apy" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground text-right"
                  onClick={() => handleSort('tvl')}
                >
                  TVL <SortIcon field="tvl" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground text-right"
                  onClick={() => handleSort('riskScore')}
                >
                  Risk <SortIcon field="riskScore" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedVaults.map((vault) => (
                <TableRow
                  key={vault.id}
                  className="cursor-pointer hover:bg-card"
                  onClick={() => onSelectVault(vault)}
                >
                  <TableCell className="font-medium">{vault.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {vault.chain}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-medium">{vault.asset}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-[oklch(0.75_0.15_195)] font-semibold">
                      {formatPercent(vault.apy)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(vault.tvl)}
                  </TableCell>
                  <TableCell className="text-right">
                    <RiskBadge score={vault.riskScore} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {filteredAndSortedVaults.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No vaults found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
