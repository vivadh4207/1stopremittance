# 1StopRemittance

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
