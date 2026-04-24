# 1StopRemittance

<<<<<<< HEAD
Compare exchange rates across 8+ providers in real-time. Find the best deal and send money internationally using live data from the Wise Comparison API.

## Quick Start

```bash
npm install
npm run dev
```

## Wise API Integration

This app uses the [Wise Comparison API (v4)](https://docs.wise.com/api-reference/comparison) to fetch **real, live provider rates** — not estimates.

### Setup your API token

1. Sign up or log in at [wise.com](https://wise.com)
2. Go to **Settings → API tokens → Create token**
3. Copy `.env.example` to `.env` and paste your token:

```bash
cp .env.example .env
```

```env
WISE_API_TOKEN=your_token_here
WISE_API_ENV=live
```

### API Endpoints (Vercel Serverless Functions)

| Endpoint | Description |
|---|---|
| `GET /api/comparison?sourceCurrency=USD&targetCurrency=INR&sendAmount=1000` | Compare rates across all providers for a corridor |
| `GET /api/rates?source=USD&target=INR` | Get live mid-market exchange rate |

Both endpoints proxy to the Wise API server-side (no CORS issues) and cache responses for 60 seconds.

### How it works

- The frontend calls `/api/comparison` which proxies to `api.wise.com/v4/comparisons`
- Wise returns real quotes collected from 3rd party provider websites (~hourly)
- If the API is unavailable (no token, rate limit, etc.), the app gracefully falls back to estimated mock data
- A "Live from Wise API" / "Estimated rates (demo)" badge shows which mode is active
- Rates auto-refresh every 60 seconds

### Affiliate Integration

The Wise affiliate link (`https://wise.prf.hn/click/camref:1100l5J9wt`) is embedded at every touchpoint: comparison CTA buttons, provider names, send-money flow, and dashboard transaction links.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Add environment variables:
   - `WISE_API_TOKEN` = your Wise API token
   - `WISE_API_ENV` = `live` (or `sandbox` for testing)
5. Click **Deploy** — Vercel auto-detects Vite + serverless functions

Or via CLI:

```bash
npm i -g vercel
vercel env add WISE_API_TOKEN
vercel
```

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Recharts (charts)
- Lucide React (icons)
- Wise Comparison API v4 (live rates)
- Vercel Serverless Functions (API proxy)
=======
Compare money transfer rates and send smarter to Nigeria, the Philippines, and other popular remittance destinations.

## About

1StopRemittance is a Next.js (App Router) comparison platform for diaspora communities. It aggregates live-style rates from providers like Wise, Remitly, Western Union, and others, and helps users find the best deal when sending money home.

**Features**
- Side-by-side provider comparison (exchange rate, fees, amount received)
- Corridor-specific pages (USA → Nigeria, USA → Philippines, etc.)
- Money transfer guides
- Fully static/SSR-friendly — no random values that cause hydration mismatches

## Tech stack

- **Framework** — [Next.js](https://nextjs.org) 15 (App Router)
- **Styling** — Tailwind CSS v4
- **Database** — PostgreSQL via [Prisma](https://prisma.io) (schema ready; migrations managed via Prisma CLI)
- **Deployment** — [Vercel](https://vercel.com)

## Local setup

### Prerequisites

- Node.js 18+
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### Steps

```bash
# 1. Install dependencies (also runs prisma generate via postinstall)
npm install

# 2. Create a .env.local file with your database URL
# Replace user, password, localhost, and db name with your actual credentials
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/1stopremittance"' > .env.local

# 3. Push the schema to your database
npm run db:push

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Database commands

| Command | Description |
|---|---|
| `npm run db:generate` | Re-generate the Prisma client after schema changes |
| `npm run db:push` | Push schema changes to the database without a migration |
| `npm run db:migrate` | Create and apply a named migration |
| `npm run db:studio` | Open Prisma Studio to browse data |

## Deployment

The app is configured for Vercel. Set the `DATABASE_URL` environment variable in your Vercel project settings, then push to deploy.

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> f989f60a72658072c0df74c8944a7238257aa02f
