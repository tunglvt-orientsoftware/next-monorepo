const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('apps/web/.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.*)/)[1];
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.storage.getBucket('avatars');
  console.log("Bucket:", data);
  console.log("Bucket Error:", error);
}
run();
