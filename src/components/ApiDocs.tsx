import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Code } from '@phosphor-icons/react';

export function ApiDocs() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/vaults',
      description: 'Retrieve all vaults with optional filtering',
      params: [
        { name: 'chain', type: 'string', required: false, description: 'Filter by blockchain' },
        { name: 'protocol', type: 'string', required: false, description: 'Filter by protocol' },
        { name: 'minApy', type: 'number', required: false, description: 'Minimum APY threshold' },
      ],
      example: `GET /api/vaults?chain=ethereum&minApy=5

{
  "vaults": [
    {
      "id": "vault-1",
      "name": "Aave USDC Vault",
      "protocol": "aave",
      "chain": "ethereum",
      "asset": "USDC",
      "apy": 8.5,
      "tvl": 125000000,
      "riskScore": 3.2
    }
  ],
  "count": 1
}`,
    },
    {
      method: 'GET',
      path: '/api/vault/{address}',
      description: 'Get detailed information about a specific vault',
      params: [
        { name: 'address', type: 'string', required: true, description: 'Vault contract address' },
      ],
      example: `GET /api/vault/0x1234...5678

{
  "id": "vault-1",
  "address": "0x1234...5678",
  "name": "Aave USDC Vault",
  "protocol": "aave",
  "strategy": "Lend asset on primary money market...",
  "dependencies": ["Chainlink Oracles"],
  "upgradeability": "timelock",
  "oracleType": "chainlink"
}`,
    },
    {
      method: 'GET',
      path: '/api/vault/{address}/risk',
      description: 'Calculate and retrieve risk analysis for a vault',
      params: [
        { name: 'address', type: 'string', required: true, description: 'Vault contract address' },
      ],
      example: `GET /api/vault/0x1234...5678/risk

{
  "vaultId": "vault-1",
  "overallScore": 3.2,
  "factors": {
    "protocolDependency": 3.0,
    "oracleRisk": 2.0,
    "upgradeabilityRisk": 3.0,
    "liquidityRisk": 5.0
  },
  "level": "low"
}`,
    },
    {
      method: 'GET',
      path: '/api/portfolio/{wallet}',
      description: 'Retrieve portfolio positions and analytics for a wallet',
      params: [
        { name: 'wallet', type: 'string', required: true, description: 'Wallet address' },
      ],
      example: `GET /api/portfolio/0xabcd...ef01

{
  "walletAddress": "0xabcd...ef01",
  "totalValue": 500000,
  "positions": [
    {
      "vaultId": "vault-1",
      "amount": 100000,
      "valueUSD": 100000
    }
  ],
  "assetBreakdown": {
    "USDC": 250000,
    "ETH": 150000,
    "DAI": 100000
  },
  "protocolExposure": {
    "aave": 200000,
    "compound": 300000
  }
}`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-muted-foreground">
          RESTful API endpoints for accessing vault data, risk analysis, and portfolio information
        </p>
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Base URL</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="font-mono text-accent">https://api.vaultintel.io/v1</code>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            All API requests require an API key passed in the Authorization header:
          </p>
          <div className="bg-card p-4 rounded border font-mono text-sm">
            Authorization: Bearer YOUR_API_KEY
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {endpoints.map((endpoint, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Badge className="font-mono">{endpoint.method}</Badge>
                <code className="font-mono text-base">{endpoint.path}</code>
              </CardTitle>
              <CardDescription>{endpoint.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {endpoint.params && (
                <div>
                  <h4 className="font-medium mb-3">Parameters</h4>
                  <div className="space-y-2">
                    {endpoint.params.map((param, pidx) => (
                      <div key={pidx} className="flex gap-4 items-start text-sm">
                        <code className="font-mono text-accent bg-accent/10 px-2 py-1 rounded min-w-24">
                          {param.name}
                        </code>
                        <span className="text-muted-foreground min-w-16">{param.type}</span>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <span className="text-muted-foreground flex-1">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Code />
                  Example Request & Response
                </h4>
                <pre className="bg-card p-4 rounded border overflow-x-auto text-xs font-mono">
                  {endpoint.example}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
