/**
 * UNCLAIMED SEED SCRIPT v3 — Suburbmates Concierge
 * 
 * Creates directory listings as UNCLAIMED — one placeholder auth user per listing.
 * Uses internal email pattern: unclaimed+{slug}@suburbmates.internal
 * These are NOT real emails — they are system identifiers replaced on claim.
 * 
 * Schema constraint: business_profiles.user_id has a UNIQUE constraint,
 * so each listing requires its own user record.
 * 
 * Claim flow: Creator finds listing via search-first → submits claim →
 * admin approves → listing user_id is transferred to the claiming user.
 */

import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import { resolveRegionId, resolveCategoryId } from "./seed-mapping";
import { scrapeOpenGraph } from "../src/lib/scraper";

dotenv.config({ path: ".env.local" });
dotenv.config();

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

async function runSeeder() {
  console.log(`\n========================================`);
  console.log(`UNCLAIMED SEED v3 (DRY_RUN=${DRY_RUN})`);
  console.log(`========================================\n`);

  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`ERROR: CSV not found at ${CSV_FILE_PATH}`);
    process.exit(1);
  }

  const queue = parseCSV(fs.readFileSync(CSV_FILE_PATH, "utf-8"));
  console.log(`Loaded ${queue.length} rows from CSV\n`);

  let successCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const row = queue[i];
    const refs: { authUserId?: string; userId?: string; vendorId?: string; profileId?: string; productId?: string } = {};

    console.log(`\n--- Row ${i + 1}/${queue.length}: ${row.business_name} ---`);

    try {
      if (!row.business_name || !row.region || !row.category || !row.product_url) {
        throw new Error("Missing required CSV column (business_name|region|category|product_url).");
      }

      const region_id = resolveRegionId(row.region);
      const category_id = resolveCategoryId(row.category);
      const bizSlug = slugify(row.business_name);
      const internalEmail = `unclaimed+${bizSlug}@suburbmates.internal`;

      console.log(`[✓] Mappings → Region: ${region_id}, Category: ${category_id}`);
      console.log(`[*] Internal ID: ${internalEmail}`);

      // Scrape
      console.log(`[*] Scraping: ${row.product_url}`);
      let metadata = { title: "", description: "", image: "" };
      try {
        metadata = await scrapeOpenGraph(row.product_url);
        console.log(`[✓] Scraped: "${metadata.title?.substring(0, 50)}"`);
      } catch {
        console.log(`[!] Scrape timeout (non-fatal)`);
      }

      if (DRY_RUN) {
        console.log(`[SIM] Auth + User + Vendor + Profile + Product would be created`);
        successCount++;
        continue;
      }

      // 1. Create auth user (placeholder)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: internalEmail,
        email_confirm: true,
        user_metadata: { user_type: "vendor", seeded: true, unclaimed: true },
      });
      if (authError || !authData.user) throw new Error(`Auth failed: ${authError?.message}`);
      refs.authUserId = authData.user.id;

      // 2. Create public.users
      const { error: userError } = await supabaseAdmin.from("users").insert({
        id: refs.authUserId,
        email: internalEmail,
        user_type: "vendor",
      });
      if (userError) throw new Error(`public.users failed: ${userError.message}`);
      refs.userId = refs.authUserId;

      // 3. Create vendor
      const { data: vendorData, error: vendorError } = await supabaseAdmin
        .from("vendors").insert({
          user_id: refs.authUserId,
          business_name: row.business_name,
          primary_region_id: region_id,
          vendor_status: "active",
        }).select("id").single();
      if (vendorError) throw new Error(`Vendor failed: ${vendorError.message}`);
      refs.vendorId = vendorData.id;

      // 4. Create business profile
      const uniqueSlug = await generateUniqueBusinessSlug(row.business_name);
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("business_profiles").insert({
          user_id: refs.authUserId,
          business_name: row.business_name,
          slug: uniqueSlug,
          category_id: category_id,
          suburb_id: region_id,
          profile_description: row.description || null,
          profile_image_url: metadata.image || null,
          website: row.product_url,
          vendor_status: "active",
          is_public: true,
        }).select("id").single();
      if (profileError) throw new Error(`Profile failed: ${profileError.message}`);
      refs.profileId = profileData.id;

      // 5. Create product
      const productTitle = metadata.title || row.business_name;
      const productSlug = await generateUniqueProductSlug(refs.vendorId, productTitle);
      const { data: productData, error: productError } = await supabaseAdmin
        .from("products").insert({
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
        }).select("id").single();
      if (productError) throw new Error(`Product failed: ${productError.message}`);
      refs.productId = productData.id;

      console.log(`[✓] ${uniqueSlug} → LIVE`);
      successCount++;

    } catch (err) {
      console.error(`[X] FAILED: ${row.business_name} — ${err instanceof Error ? err.message : err}`);

      // Cleanup
      if (!DRY_RUN) {
        if (refs.productId) await supabaseAdmin.from("products").delete().eq("id", refs.productId);
        if (refs.profileId) await supabaseAdmin.from("business_profiles").delete().eq("id", refs.profileId);
        if (refs.vendorId) await supabaseAdmin.from("vendors").delete().eq("id", refs.vendorId);
        if (refs.userId) await supabaseAdmin.from("users").delete().eq("id", refs.userId);
        if (refs.authUserId) await supabaseAdmin.auth.admin.deleteUser(refs.authUserId);
        console.log(`[~] Cleaned up`);
      }

      console.error(`ABORTING.`);
      process.exit(1);
    }
  }

  console.log(`\n========================================`);
  console.log(`COMPLETE: ${successCount}/${queue.length} seeded`);
  console.log(`========================================\n`);
}

runSeeder();
