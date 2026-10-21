import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';

import { validateEnv, getAllowedOrigins } from './config/env.js';
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Refuse to boot with missing/placeholder secrets.
validateEnv();

const app = express();

// Behind a reverse proxy (Render, Heroku, Nginx...) set TRUST_PROXY=1 so
// rate limiting sees real client IPs and `secure` cookies work.
if (process.env.TRUST_PROXY) {
  const v = process.env.TRUST_PROXY;
  app.set('trust proxy', /^\d+$/.test(v) ? Number(v) : v === 'true' ? 1 : v);
}

await connectDB();

// --- Security & parsing middleware -----------------------------------------
app.use(helmet());

const allowedOrigins = getAllowedOrigins();
app.use(
  cors({
    origin: (origin, cb) => {
      // No Origin header = same-origin / curl / server-to-server; allow.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true, // required so the httpOnly refresh-token cookie is sent/received
  })
);
app.use(express.json({ limit: '10kb' })); // small limit — this API never needs large payloads
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ / . operators from user input to block NoSQL injection
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);

// --- Routes ------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    success: dbUp,
    message: dbUp ? 'Bella Vista API is running' : 'Database not connected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Bella Vista API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful shutdown so in-flight requests finish and the DB closes cleanly.
const shutdown = (signal) => {
  console.log(`${signal} received — shutting down`);
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
