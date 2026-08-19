import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './config/prisma';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Attempt DB connection but allow app to start regardless
    prisma.$connect()
      .then(() => {
        console.log('✅ Database connected successfully');
      })
      .catch((error) => {
        console.error('⚠️ Database connection failed on startup, using runtime retry:', error.message || error);
      });

    app.listen(PORT, () => {
      console.log(`🚀 Sapirox Backend running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to bootstrap backend:', error);
    process.exit(1);
  }
}

bootstrap();
// Trigger reload for direct database connection (port 5432) update
