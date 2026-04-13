import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import kycRoutes from './routes/kyc';
import walletsRoutes from './routes/wallets';
import transfersRoutes from './routes/transfers';
import exchangeRatesRoutes from './routes/exchangeRates';
import paymentsRoutes from './routes/payments';
import adminRoutes from './routes/admin';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
  }),
);

// Stripe webhook needs raw body - register BEFORE JSON parser
app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
    skip: (_req, res) => config.nodeEnv === 'test' || res.statusCode < 400,
  }),
);

// Rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: process.env['npm_package_version'] || '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/wallets', walletsRoutes);
app.use('/api/transfers', transfersRoutes);
app.use('/api/exchange-rates', exchangeRatesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler - must be last
app.use(errorHandler);

export default app;
