# DeFi Vault Intelligence - Frontend

React/TypeScript dashboard for vault analytics and risk assessment.

## Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set `VITE_API_URL` to your backend URL (default: `http://localhost:8000`).

### Run Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`.

## Building for Production

```bash
npm run build
```

Output will be in `./dist`.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── VaultExplorer.tsx
│   │   ├── VaultDetail.tsx
│   │   ├── ApiDocs.tsx
│   │   ├── MetricCard.tsx
│   │   ├── RiskBadge.tsx
│   │   └── YieldChart.tsx
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   ├── utils.ts         # Utilities
│   │   └── risk.ts          # Risk helpers
│   ├── types/
│   │   └── api.ts           # TypeScript types
│   ├── App.tsx              # Main app
│   ├── index.css            # Styles
│   └── main.tsx             # Entry point
├── index.html
└── package.json
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **React Query** - Data fetching
- **D3.js** - Charts
- **Recharts** - Charts
- **Phosphor Icons** - Icons

## Key Features

### Vault Explorer
- Browse vaults across protocols
- Real-time filtering and sorting
- Search by name, asset, or protocol

### Vault Detail Pages
- Strategy breakdown
- Risk analysis visualization
- APY history charts
- Contract information

### API Documentation
- Interactive endpoint docs
- Example requests/responses
- Parameter descriptions

### Portfolio Analytics (Future)
- Wallet position tracking
- Asset breakdown
- Protocol exposure

## API Integration

The frontend uses a centralized API client (`src/lib/api.ts`) for all backend communication:

```typescript
import { apiClient } from '@/lib/api';

// Get all vaults
const vaults = await apiClient.getVaults();

// Get vault by address
const vault = await apiClient.getVaultByAddress(address);

// Get risk analysis
const risk = await apiClient.getVaultRisk(address);

// Get portfolio
const portfolio = await apiClient.getPortfolio(walletAddress);
```

## React Query Usage

Data fetching uses React Query for caching and state management:

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const { data, isLoading, error } = useQuery({
  queryKey: ['vaults'],
  queryFn: () => apiClient.getVaults(),
});
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

## Development

### Run Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment

### Static Hosting

The frontend is a static single-page application that can be deployed to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

Example Vercel deployment:

```bash
npm run build
vercel --prod
```

### Docker

```bash
docker build -t defi-vault-frontend .
docker run -p 5173:5173 -e VITE_API_URL=https://api.yourdomain.com defi-vault-frontend
```

### Environment-Specific Builds

```bash
# Development
VITE_API_URL=http://localhost:8000 npm run build

# Production
VITE_API_URL=https://api.yourdomain.com npm run build
```

## Styling

The app uses a custom dark theme with:
- Space Grotesk font family
- JetBrains Mono for code
- Custom OKLCH color palette
- Tailwind utility classes
- shadcn component variants

Theme customization is in `src/index.css`.

## Components

### UI Components (shadcn)
Pre-built accessible components from shadcn/ui:
- Buttons, Cards, Dialogs
- Forms, Inputs, Selects
- Tables, Tabs, Tooltips
- 40+ components total

### Custom Components

#### VaultExplorer
Main vault browsing interface with filtering, sorting, and search.

#### VaultDetail
Detailed vault view with risk analysis, charts, and contract info.

#### ApiDocs
Interactive API documentation page.

#### MetricCard
Reusable metric display card with optional trend indicator.

#### RiskBadge
Color-coded risk score badge (low/medium/high).

#### YieldChart
D3-based APY history line chart with animations.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### API Connection Issues

If the frontend can't reach the backend:

1. Check `VITE_API_URL` in `.env`
2. Verify backend is running: `curl http://localhost:8000/api/v1/health`
3. Check CORS settings in backend
4. Check browser console for errors

### Build Errors

If you encounter build errors:

1. Delete `node_modules`: `rm -rf node_modules`
2. Delete lock file: `rm package-lock.json`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## License

MIT
