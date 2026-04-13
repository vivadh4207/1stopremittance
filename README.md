# 1Stop Remittance

A production-ready international money transfer platform built with Node.js, Next.js 14, PostgreSQL, and Stripe.

## Tech Stack
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Frontend**: Next.js 14 App Router + Tailwind CSS + TypeScript
- **Database**: PostgreSQL 15
- **Auth**: JWT (access 15m + refresh 7d) + bcrypt
- **Payments**: Stripe
- **FX Rates**: Open Exchange Rates API (with mock fallback)
- **Containerization**: Docker + docker-compose

## Quick Start

```bash
cp .env.example .env
# Edit .env with your Stripe and Open Exchange Rates keys
docker-compose up --build
# App available at http://localhost:3000
# API available at http://localhost:3001/api
```

## Features
- User registration, login, JWT refresh token rotation
- KYC document submission and verification
- USD wallet with balance tracking
- Multi-step send money flow with live rate calculation
- Fee: 1.5% + $2.99 flat | Rate spread: 2%
- Stripe payment intent integration
- Admin dashboard (users, transfers, stats, charts)
- Rate limiting: 100 req/15min general, 5 req/15min on auth
- KYC required for transfers > $500

## Supported Corridors
USD → KES, GHS, NGN, PHP, INR, MXN, GBP, EUR, CAD, AUD

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/users/me | Get profile |
| GET | /api/wallets | Get wallet balance |
| POST | /api/transfers/quote | Get transfer quote |
| POST | /api/transfers/send | Send money |
| GET | /api/exchange-rates?from=USD&to=KES | Get rate |
| POST | /api/kyc/submit | Submit KYC docs |
| GET | /api/admin/stats | Admin statistics |

## Environment Variables
See `.env.example` for all required variables.

## Monetization
- Transfer fee: 1.5% of send amount + $2.99 flat
- FX spread: 2% markup on mid-market rate
