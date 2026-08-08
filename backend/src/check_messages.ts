import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.contactMessage.count();
  console.log(`📊 Total Contact Messages in Database: ${count}`);
  
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log('📝 Last 5 Messages:', JSON.stringify(messages, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
