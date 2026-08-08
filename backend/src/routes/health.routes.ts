import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

// GET /api/health — returns server status and DB connectivity check
router.get('/', async (_req: Request, res: Response) => {
  try {
    // Verify database connectivity with a lightweight query
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: '✅ Sapirox API is running',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch {
    res.status(503).json({
      success: false,
      message: '⚠️ Sapirox API is running but database is unreachable',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

export default router;
