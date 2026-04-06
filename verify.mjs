import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing remote credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("=== POST-APPLY VERIFICATION ===");
  
  // 1. Check Regions
  const { count: regionCount, error: rErr } = await supabase.from('regions').select('*', { count: 'exact', head: true });
  console.log(`Regions Count: ${rErr ? rErr.message : regionCount}`);

  // 2. Check Categories
  const { count: catCount, error: cErr } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  console.log(`Categories Count: ${cErr ? cErr.message : catCount}`);

  // 3. Verify PURGE (tables should NOT exist or return error)
  const purgeTables = ['disputes', 'marketplace_sales', 'orders', 'refund_requests'];
  for (const table of purgeTables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error && error.code === '42P01') {
      console.log(`Purge Verified: Table '${table}' does not exist.`);
    } else if (error) {
      console.log(`Purge Issue checking '${table}': ${error.message} (Code: ${error.code})`);
    } else {
      console.warn(`WARNING: Table '${table}' STILL EXISTS!`);
    }
  }

  // 4. Verify feature_slots column
  const { error: fErr } = await supabase.from('featured_slots').select('stripe_payment_intent_id').limit(1);
  if (fErr && fErr.code === '42703') {
    console.log(`Purge Verified: Column 'stripe_payment_intent_id' does not exist in 'featured_slots'.`);
  } else if (fErr) {
    console.log(`Issue checking 'featured_slots' column: ${fErr.message} (Code: ${fErr.code})`);
  } else {
    console.warn(`WARNING: Column 'stripe_payment_intent_id' STILL EXISTS in 'featured_slots'!`);
  }
}

verify().catch(console.error);
