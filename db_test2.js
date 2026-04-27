const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('apps/web/.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.*)/)[1];
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('profiles').update({ bio: 'test' }).eq('id', '2183bd35-49d8-44f5-87b5-c95f14b6488c');
  console.log("Error when updating bio:", error);
}
run();
