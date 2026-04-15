import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  // Create a real auth user to test against
  const { data: auth } = await sb.auth.admin.createUser({ email: 'constraint-probe@test.probe', email_confirm: true });
  if (!auth?.user) { console.log('Failed to create probe'); return; }
  const id = auth.user.id;
  console.log(`Probe auth user: ${id}`);

  for (const t of ['customer', 'business_owner', 'vendor', 'creator', 'admin', 'system']) {
    const { error } = await sb.from('users').upsert({ id, email: 'constraint-probe@test.probe', user_type: t });
    console.log(`"${t}" ->`, error ? `REJECTED` : 'ACCEPTED');
    if (!error) await sb.from('users').delete().eq('id', id);
  }

  await sb.auth.admin.deleteUser(id);
  console.log('Probe cleaned up');
}
check();
