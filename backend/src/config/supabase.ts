import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables (force override to get latest changes without restarting process)
try {
  const envPath = path.join(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }
} catch (error) {
  console.error('Failed to force reload env in supabase.ts:', error);
}

// Fallback standard load
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🔌 Supabase Config: url =', supabaseUrl);
console.log('🔌 Supabase Config: key length =', supabaseServiceRoleKey ? supabaseServiceRoleKey.length : 0);
console.log('🔌 Supabase Config: key starts with =', supabaseServiceRoleKey ? supabaseServiceRoleKey.substring(0, 15) : 'NONE');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // We log a warning instead of throwing during development setup, in case env files are not yet populated by the user.
  console.warn('⚠️ Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
