const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const page = '1';
    const limit = '10';
    const skip = (Number(page) - 1) * Number(limit);
    const where = { status: 'PUBLISHED' };

    console.log("Running query with where:", where);
    const blogs = await prisma.blog.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, email: true } },
      },
      orderBy: { publishedDate: 'desc' },
      skip,
      take: Number(limit),
    });
    console.log("Query succeeded! Total blogs retrieved:", blogs.length);
    console.log("Blogs:", JSON.stringify(blogs, null, 2));
  } catch (error) {
    console.error("QUERY FAILED WITH ERROR:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
