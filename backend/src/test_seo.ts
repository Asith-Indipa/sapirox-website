import { PrismaClient } from '@prisma/client';

async function testConnection(url: string, label: string) {
  console.log(`\nTesting connection for: [${label}]`);
  const prisma = new PrismaClient({
    datasources: {
      db: { url }
    }
  });

  try {
    const result = await prisma.sEOSetting.findFirst();
    console.log(`✅ Success for [${label}]! Connection works.`);
    return true;
  } catch (error: any) {
    console.error(`❌ Failed for [${label}]:`, error.message || error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const password = "SapiroxDev2026";
  const projectRef = "curmsmeoaplplvycdeev";
  
  // Test 1: Standard pooler URL with ?pgbouncer=true (Recommended)
  const url1 = `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  await testConnection(url1, "Standard Pooler (6543) + pgbouncer=true");

  // Test 2: Pooler URL without pgbouncer parameter
  const url2 = `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
  await testConnection(url2, "Pooler (6543) without parameters");

  // Test 3: Session mode pooler URL (using port 5432)
  const url3 = `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`;
  await testConnection(url3, "Pooler Session Mode (5432)");
}

main();
