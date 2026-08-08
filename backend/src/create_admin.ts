import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Use service role key to bypass email confirmation checks!
);

async function main() {
  const email = 'admin@sapirox.com';
  const password = 'SapiroxAdmin2026!'; // secure setup password

  console.log('⏳ Creating Admin User in Supabase Auth...');
  
  // 1. Create user in Supabase Auth using service role key (auto-confirms email)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('ℹ️ User is already registered in Supabase auth. Attempting to link local database record...');
      
      // Let's get the user ID
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      const existingAuthUser = listData?.users.find(u => u.email === email);
      if (existingAuthUser) {
        await createLocalUser(existingAuthUser.id, email);
      }
    } else {
      console.error('❌ Supabase Auth creation failed:', authError.message);
      return;
    }
  } else if (authData && authData.user) {
    console.log(`✅ Supabase Auth user created! ID: ${authData.user.id}`);
    await createLocalUser(authData.user.id, email);
  }
}

async function createLocalUser(authId: string, email: string) {
  // Check if prisma user already exists
  const existingPrismaUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingPrismaUser) {
    console.log(`ℹ️ Local user record already exists in database. Updating to SUPER_ADMIN...`);
    const updated = await prisma.user.update({
      where: { email },
      data: { role: 'SUPER_ADMIN' }
    });
    console.log(`🎉 Success! User ${updated.email} is now a ${updated.role}`);
  } else {
    console.log(`⏳ Creating local database record linked to Supabase ID...`);
    const newUser = await prisma.user.create({
      data: {
        id: authId,
        email,
        role: 'SUPER_ADMIN'
      }
    });
    console.log(`🎉 Success! Super Admin User created in database: ${newUser.email} with ID: ${newUser.id}`);
  }
}

main()
  .catch((e) => {
    console.error('Fatal Error running setup:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
