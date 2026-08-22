const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function testConnection() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  const { data, count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error("❌ Connection failed!");
    console.error(error.message);
    process.exit(1);
  } else {
    console.log("✅ Connection successful!");
    console.log("Database 'users' table reached. Row count:", count);
    process.exit(0);
  }
}

testConnection();
