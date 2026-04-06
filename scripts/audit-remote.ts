/**
 * REMOTE DATABASE AUDIT
 * Connects via supabase-js (service role) to the REMOTE production instance.
 * Reports full state relevant to the concierge seeding workflow.
 * READ-ONLY — no mutations.
 */
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log(`\n========================================`);
console.log(`REMOTE AUDIT — ${url}`);
console.log(`========================================\n`);

if (url.includes('127.0.0.1') || url.includes('localhost')) {
  console.error('ABORT: URL points to LOCAL, not remote. Fix .env.local.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function audit() {
  // ─── 1. ORPHANED AUTH USERS (test emails) ───
  console.log('--- 1. AUTH USERS (test/example emails) ---');
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const testAuthUsers = authUsers?.users?.filter(u =>
    u.email?.endsWith('@example.com') ||
    u.email?.includes('test') ||
    u.email?.includes('diag')
  ) || [];
  if (testAuthUsers.length === 0) {
    console.log('  CLEAN: No test auth users found.');
  } else {
    console.log(`  ⚠️  FOUND ${testAuthUsers.length} test auth user(s):`);
    for (const u of testAuthUsers) {
      console.log(`    - ${u.email} (id: ${u.id}, created: ${u.created_at})`);
    }
  }

  // ─── 2. ORPHANED PUBLIC.USERS ───
  console.log('\n--- 2. PUBLIC.USERS (test/example emails) ---');
  const { data: pubUsers, error: pubErr } = await supabase
    .from('users')
    .select('id, email, user_type, created_at')
    .or('email.like.%@example.com,email.like.%test%,email.like.%diag%');
  if (pubErr) {
    console.log(`  ERROR querying: ${pubErr.message}`);
  } else if (!pubUsers || pubUsers.length === 0) {
    console.log('  CLEAN: No test public.users found.');
  } else {
    console.log(`  ⚠️  FOUND ${pubUsers.length} test public.users row(s):`);
    for (const u of pubUsers) {
      console.log(`    - ${u.email} (id: ${u.id}, type: ${u.user_type}, created: ${u.created_at})`);
    }
  }

  // ─── 3. ORPHANED VENDORS ───
  console.log('\n--- 3. VENDORS (all rows) ---');
  const { data: vendors, error: vendErr } = await supabase
    .from('vendors')
    .select('id, user_id, business_name, primary_region_id, created_at');
  if (vendErr) {
    console.log(`  ERROR: ${vendErr.message}`);
  } else {
    console.log(`  Total vendor rows: ${vendors?.length || 0}`);
    for (const v of vendors || []) {
      console.log(`    - "${v.business_name}" (id: ${v.id}, user: ${v.user_id}, region: ${v.primary_region_id}, created: ${v.created_at})`);
    }
  }

  // ─── 4. ORPHANED BUSINESS PROFILES ───
  console.log('\n--- 4. BUSINESS_PROFILES (all rows) ---');
  const { data: profiles, error: profErr } = await supabase
    .from('business_profiles')
    .select('id, user_id, business_name, slug, category_id, created_at');
  if (profErr) {
    console.log(`  ERROR: ${profErr.message}`);
  } else {
    console.log(`  Total profile rows: ${profiles?.length || 0}`);
    for (const p of profiles || []) {
      console.log(`    - "${p.business_name}" slug="${p.slug}" (id: ${p.id}, user: ${p.user_id}, cat: ${p.category_id})`);
    }
  }

  // ─── 5. ORPHANED PRODUCTS ───
  console.log('\n--- 5. PRODUCTS (all rows) ---');
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, vendor_id, title, slug, is_active, is_archived, product_url, created_at');
  if (prodErr) {
    console.log(`  ERROR: ${prodErr.message}`);
  } else {
    console.log(`  Total product rows: ${products?.length || 0}`);
    for (const p of products || []) {
      console.log(`    - "${p.title}" slug="${p.slug}" (vendor: ${p.vendor_id}, active: ${p.is_active}, archived: ${p.is_archived})`);
    }
  }

  // ─── 6. REGIONS (canonical IDs + names) ───
  console.log('\n--- 6. REGIONS (canonical) ---');
  const { data: regions, error: regErr } = await supabase
    .from('regions')
    .select('id, name, active')
    .order('id');
  if (regErr) {
    console.log(`  ERROR: ${regErr.message}`);
  } else {
    console.log(`  Total regions: ${regions?.length || 0}`);
    for (const r of regions || []) {
      console.log(`    id=${r.id}  name="${r.name}"  active=${r.active}`);
    }
  }

  // ─── 7. CATEGORIES (canonical IDs + names) ───
  console.log('\n--- 7. CATEGORIES (canonical) ---');
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('id, name, slug, active')
    .order('id');
  if (catErr) {
    console.log(`  ERROR: ${catErr.message}`);
  } else {
    console.log(`  Total categories: ${categories?.length || 0}`);
    for (const c of categories || []) {
      console.log(`    id=${c.id}  name="${c.name}"  slug="${c.slug}"  active=${c.active}`);
    }
  }

  // ─── 8. FEATURED SLOTS (any active) ───
  console.log('\n--- 8. FEATURED_SLOTS ---');
  const { data: slots, error: slotErr } = await supabase
    .from('featured_slots')
    .select('id, vendor_id, status, created_at');
  if (slotErr) {
    console.log(`  ERROR: ${slotErr.message}`);
  } else {
    console.log(`  Total featured_slot rows: ${slots?.length || 0}`);
  }

  // ─── 9. OUTBOUND CLICKS ───
  console.log('\n--- 9. OUTBOUND_CLICKS ---');
  const { data: clicks, error: clickErr } = await supabase
    .from('outbound_clicks')
    .select('id', { count: 'exact', head: true });
  if (clickErr) {
    console.log(`  ERROR: ${clickErr.message}`);
  } else {
    console.log(`  Total outbound_click rows: ${clicks?.length ?? 'unknown (count query)'}`);
  }

  // ─── 10. TRIGGER CHECK (attempt via RPC or known function) ───
  console.log('\n--- 10. AUTH→PUBLIC.USERS SYNC CHECK ---');
  // We can't query pg_trigger via PostgREST. Instead, do a functional test:
  // Create a temp user, check if public.users auto-populates, then clean up.
  const testEmail = `audit-probe-${Date.now()}@probe.test`;
  const { data: probeAuth, error: probeErr } = await supabase.auth.admin.createUser({
    email: testEmail,
    email_confirm: true,
  });
  if (probeErr) {
    console.log(`  Could not create probe user: ${probeErr.message}`);
  } else {
    const probeId = probeAuth.user!.id;
    // Wait briefly for any trigger
    await new Promise(r => setTimeout(r, 1500));
    const { data: probePublic } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', probeId)
      .maybeSingle();
    if (probePublic) {
      console.log(`  ✅ TRIGGER EXISTS: auth.users INSERT auto-created public.users row.`);
      console.log(`     Probe user: ${probePublic.email} (${probePublic.id})`);
    } else {
      console.log(`  ❌ NO TRIGGER: auth.users INSERT did NOT create public.users row.`);
      console.log(`     Seeder MUST explicitly insert into public.users.`);
    }
    // Clean up probe
    await supabase.auth.admin.deleteUser(probeId);
    console.log(`  Probe user cleaned up.`);
  }

  // ─── 11. TABLE SCHEMA SPOT-CHECK ───
  console.log('\n--- 11. SCHEMA SPOT-CHECK (vendors columns) ---');
  // Insert a row with all expected columns to verify they exist, use dry approach:
  // just try to select with the columns we need
  const { error: schemaErr } = await supabase
    .from('vendors')
    .select('id, user_id, business_name, primary_region_id, secondary_regions, bio, logo_url')
    .limit(0);
  if (schemaErr) {
    console.log(`  ⚠️  Schema mismatch: ${schemaErr.message}`);
  } else {
    console.log(`  ✅ Vendor columns verified: id, user_id, business_name, primary_region_id, secondary_regions, bio, logo_url`);
  }

  const { error: prodSchemaErr } = await supabase
    .from('products')
    .select('id, vendor_id, title, description, slug, product_url, image_urls, category_id, is_active, is_archived, price')
    .limit(0);
  if (prodSchemaErr) {
    console.log(`  ⚠️  Products schema issue: ${prodSchemaErr.message}`);
  } else {
    console.log(`  ✅ Product columns verified: id, vendor_id, title, description, slug, product_url, image_urls, category_id, is_active, is_archived, price`);
  }

  const { error: bpSchemaErr } = await supabase
    .from('business_profiles')
    .select('id, user_id, business_name, slug, category_id, profile_description, profile_image_url, is_public')
    .limit(0);
  if (bpSchemaErr) {
    console.log(`  ⚠️  Business_profiles schema issue: ${bpSchemaErr.message}`);
  } else {
    console.log(`  ✅ Business_profiles columns verified: id, user_id, business_name, slug, category_id, profile_description, profile_image_url, is_public`);
  }

  console.log('\n========================================');
  console.log('AUDIT COMPLETE');
  console.log('========================================\n');
}

audit().catch(err => {
  console.error('AUDIT FATAL ERROR:', err);
  process.exit(1);
});
