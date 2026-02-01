const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase URL or Service Key missing in .env');
  process.exit(1);
}

// We use the Service Key on the backend to bypass RLS when necessary 
// (e.g., creating a user before they have a token)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log('✅ Supabase Client Initialized');

module.exports = supabase;