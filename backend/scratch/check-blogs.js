const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const blogs = await prisma.blog.findMany({
    include: {
      category: true,
      tags: true,
    }
  });
  console.log("ALL BLOGS IN DATABASE:");
  console.log(JSON.stringify(blogs, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
