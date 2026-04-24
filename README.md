# 1StopRemittance

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
