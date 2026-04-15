/**
 * UNCLAIMED SEED SCRIPT — Suburbmates Concierge v2
 * 
 * Creates directory listings WITHOUT individual auth users.
 * Uses a single system "concierge" user to own all unclaimed listings.
 * Creators claim their listings via the existing search-first onboarding flow.
 * 
 * IMPORTANT: No fake emails are generated. All listings are owned by the
 * documented system user concierge@suburbmates.com.au until claimed.
 * 
 * Insert order:
 * 1. Create/reuse system auth user (concierge@suburbmates.com.au)
 * 2. Create/reuse public.users row
 * 3. For each CSV row:
 *    a. Create vendor record (pointing to system user)
 *    b. Create business_profile (pointing to system user)
 *    c. Scrape product_url for metadata
 *    d. Create product (pointing to vendor)
 * 4. All listings visible immediately (vendor_status=active, is_public=true)
 */

import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import { resolveRegionId, resolveCategoryId } from "./seed-mapping";
import { scrapeOpenGraph } from "../src/lib/scraper";

dotenv.config({ path: ".env.local" });
dotenv.config();

const SYSTEM_EMAIL = "concierge@suburbmates.com.au";
const DRY_RUN = process.argv.includes("--dry-run");
const CSV_FILE_PATH = "./scripts/seed_queue.csv";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueBusinessSlug(name: string): Promise<string> {
  const baseSlug = slugify(name) || `business-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;
  while (true) {
    const { data, error } = await supabaseAdmin
      .from("business_profiles").select("id").eq("slug", slug).maybeSingle();
    if (error) throw new Error(`Slug check failed: ${error.message}`);
    if (!data) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function generateUniqueProductSlug(vendorId: string, title: string): Promise<string> {
  const baseSlug = slugify(title) || `product-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;
  while (true) {
    const { data, error } = await supabaseAdmin
      .from("products").select("id").eq("vendor_id", vendorId).eq("slug", slug).maybeSingle();
    if (error) throw new Error(`Product slug check failed: ${error.message}`);
    if (!data) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

function parseCSV(content: string) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim() !== "");
  const headers = lines[0]
    .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map((h) => h.replace(/^"|"$/g, "").trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((val) => val.replace(/^"|"$/g, "").trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, index) => { obj[h] = values[index] || ""; });
    rows.push(obj);
  }
  return rows;
}

async function ensureSystemUser(): Promise<string> {
  // Check if system user already exists in auth
  const { data: authList } = await supabaseAdmin.auth.admin.listUsers();
  const existing = authList?.users?.find(u => u.email === SYSTEM_EMAIL);
  
  if (existing) {
    console.log(`[✓] System user already exists: ${existing.id}`);
    return existing.id;
  }

  if (DRY_RUN) {
    console.log(`[SIMULATION] Would create system auth user: ${SYSTEM_EMAIL}`);
    return "dry-run-system-id";
  }

  // Create system auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: SYSTEM_EMAIL,
    email_confirm: true,
    user_metadata: { user_type: "business_owner", role: "system_concierge" },
  });
  if (authError || !authData.user) throw new Error(`System auth creation failed: ${authError?.message}`);
  const userId = authData.user.id;
  console.log(`[✓] Created system auth user: ${userId}`);

  // Create public.users row
  const { error: userError } = await supabaseAdmin.from("users").insert({
    id: userId,
    email: SYSTEM_EMAIL,
    user_type: "business_owner",
  });
  if (userError) throw new Error(`System public.users insert failed: ${userError.message}`);
  console.log(`[✓] Created system public.users row`);

  return userId;
}

async function runSeeder() {
  console.log(`\n========================================`);
  console.log(`UNCLAIMED SEED v2 (DRY_RUN=${DRY_RUN})`);
  console.log(`========================================\n`);

  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`ERROR: CSV not found at ${CSV_FILE_PATH}`);
    process.exit(1);
  }

  const queue = parseCSV(fs.readFileSync(CSV_FILE_PATH, "utf-8"));
  console.log(`Loaded ${queue.length} rows from CSV\n`);

  // Step 1: Ensure system user exists
  const systemUserId = await ensureSystemUser();

  // Step 2: Process each row
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const row = queue[i];
    const refs: { vendorId?: string; profileId?: string; productId?: string } = {};
    
    console.log(`\n--- Row ${i + 1}/${queue.length}: ${row.business_name} ---`);
    
    try {
      // Validate required fields (email NOT required for unclaimed seed)
      if (!row.business_name || !row.region || !row.category || !row.product_url) {
        throw new Error("Missing required CSV column (business_name|region|category|product_url).");
      }

      const region_id = resolveRegionId(row.region);
      const category_id = resolveCategoryId(row.category);
      console.log(`[✓] Mappings → Region: ${region_id} (${row.region}), Category: ${category_id} (${row.category})`);

      // Scrape metadata
      console.log(`[*] Scraping: ${row.product_url}`);
      let metadata = { title: "", description: "", image: "" };
      try {
        metadata = await scrapeOpenGraph(row.product_url);
        console.log(`[✓] Scraped: title="${metadata.title?.substring(0, 60)}..."`);
      } catch (scrapeErr) {
        console.log(`[!] Scrape failed (non-fatal): ${scrapeErr instanceof Error ? scrapeErr.message : "unknown"}`);
        // Use CSV description as fallback — don't fail the row
      }

      if (DRY_RUN) {
        console.log(`[SIMULATION] Vendor: ${row.business_name} → region=${region_id}`);
        console.log(`[SIMULATION] Profile: category=${category_id}, suburb_id=${region_id}, is_public=true`);
        console.log(`[SIMULATION] Product: title="${metadata.title || row.business_name}", is_active=true`);
        console.log(`[✓] Dry-run passed for ${row.business_name}`);
        successCount++;
        continue;
      }

      // Create vendor
      const { data: vendorData, error: vendorError } = await supabaseAdmin
        .from("vendors")
        .insert({
          user_id: systemUserId,
          business_name: row.business_name,
          primary_region_id: region_id,
          vendor_status: "active",
        })
        .select("id")
        .single();
      if (vendorError) throw new Error(`Vendor insert failed: ${vendorError.message}`);
      refs.vendorId = vendorData.id;
      console.log(`[✓] Vendor: ${refs.vendorId}`);

      // Create business profile
      const bizSlug = await generateUniqueBusinessSlug(row.business_name);
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("business_profiles")
        .insert({
          user_id: systemUserId,
          business_name: row.business_name,
          slug: bizSlug,
          category_id: category_id,
          suburb_id: region_id,
          profile_description: row.description || null,
          profile_image_url: metadata.image || null,
          website: row.product_url,
          vendor_status: "active",
          is_public: true,
        })
        .select("id")
        .single();
      if (profileError) throw new Error(`Profile insert failed: ${profileError.message}`);
      refs.profileId = profileData.id;
      console.log(`[✓] Profile: ${bizSlug} (${refs.profileId})`);

      // Create product
      const productTitle = metadata.title || row.business_name;
      const productSlug = await generateUniqueProductSlug(refs.vendorId, productTitle);
      const { data: productData, error: productError } = await supabaseAdmin
        .from("products")
        .insert({
          vendor_id: refs.vendorId,
          title: productTitle,
          description: metadata.description || row.description || null,
          product_url: row.product_url,
          image_urls: metadata.image ? [metadata.image] : [],
          category_id: category_id,
          slug: productSlug,
          is_active: true,
          is_archived: false,
          deleted_at: null,
        })
        .select("id")
        .single();
      if (productError) throw new Error(`Product insert failed: ${productError.message}`);
      refs.productId = productData.id;
      console.log(`[✓] Product: ${productSlug}`);

      console.log(`>>> SUCCESS: ${row.business_name} <<<`);
      successCount++;

    } catch (err) {
      failCount++;
      console.error(`\n[X] FAILED: ${row.business_name}`);
      console.error(err instanceof Error ? err.message : String(err));

      // Cleanup partial writes
      if (!DRY_RUN) {
        if (refs.productId) await supabaseAdmin.from("products").delete().eq("id", refs.productId);
        if (refs.profileId) await supabaseAdmin.from("business_profiles").delete().eq("id", refs.profileId);
        if (refs.vendorId) await supabaseAdmin.from("vendors").delete().eq("id", refs.vendorId);
        console.log(`[~] Cleaned up partial writes for ${row.business_name}`);
      }

      // ABORT on first failure per spec
      console.error(`ABORTING: Fix the failing row and re-run.`);
      process.exit(1);
    }
  }

  console.log(`\n========================================`);
  console.log(`COMPLETE: ${successCount} succeeded, ${failCount} failed`);
  console.log(`========================================\n`);
}

runSeeder();
