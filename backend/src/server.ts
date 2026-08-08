import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './config/prisma';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Verify DB connection before starting
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Sapirox Backend running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
// Trigger reload for connection pooler update

