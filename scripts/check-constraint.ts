import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  // Clean up orphaned auth user from failed run
  const { data: authList } = await sb.auth.admin.listUsers();
  const concierge = authList?.users?.find(u => u.email === 'concierge@suburbmates.com.au');
  if (concierge) {
    console.log(`Found orphaned concierge auth user: ${concierge.id}`);
    await sb.auth.admin.deleteUser(concierge.id);
    console.log(`Deleted orphaned auth user`);
  }

  // Check existing user_type values
  const { data } = await sb.from('users').select('user_type').limit(5);
  console.log('Existing user_types:', JSON.stringify(data));

  // Try valid types
  for (const t of ['business_owner', 'customer', 'admin']) {
    const testId = `00000000-0000-0000-0000-00000000000${['business_owner','customer','admin'].indexOf(t)}`;
    const { error } = await sb.from('users').upsert({ id: testId, email: `probe-${t}@test.com`, user_type: t });
    console.log(`user_type="${t}" ->`, error ? `REJECTED: ${error.message.substring(0,80)}` : 'ACCEPTED');
    if (!error) await sb.from('users').delete().eq('id', testId);
  }
}
check();
