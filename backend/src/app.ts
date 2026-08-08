import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler, notFound } from './middlewares/errorHandler';

// Load .env variables
dotenv.config();

const app: Application = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);      // Mounted on root /api (e.g., /api/services)
app.use('/api/admin', adminRoutes);  // Mounted on /api/admin (protected routes)

// ── 404 & Error Handlers ───────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
