import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Testing DB connection via pooled URL...");
  try {
    const users = await prisma.user.findMany();
    console.log("DB OK! Users count:", users.length);
  } catch (err: any) {
    console.error("DB connection error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
