import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import { resolveRegionId, resolveCategoryId } from "./seed-mapping";
import { scrapeOpenGraph } from "../src/lib/scraper";

dotenv.config({ path: ".env.local" });
dotenv.config();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueBusinessSlug(name: string) {
  const baseSlug = slugify(name) || `business-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from("business_profiles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Business slug check failed: ${error.message}`);
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

async function generateUniqueSlug(vendorId: string, title: string) {
  const baseSlug = slugify(title) || `product-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("vendor_id", vendorId)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Product slug check failed: ${error.message}`);
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

// Initialize Supabase connected via Service Role (bypassing RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const CSV_FILE_PATH = "./scripts/seed_queue.csv";
const DRY_RUN = process.argv.includes("--dry-run");

// Simple regex CSV parser handling escaped commas
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
    headers.forEach((h, index) => {
      obj[h] = values[index] || "";
    });
    rows.push(obj);
  }
  return rows;
}

async function runSeeder() {
  console.log(`Starting Concierge Seeder... (DRY_RUN=${DRY_RUN})`);
  
  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`ERROR: CSV file not found at ${CSV_FILE_PATH}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(CSV_FILE_PATH, "utf-8");
  const queue = parseCSV(fileContent);

  for (let index = 0; index < queue.length; index++) {
    const row = queue[index];
    const createdRefs: {
      authUserId?: string;
      userId?: string;
      vendorId?: string;
      profileId?: string;
      productId?: string;
    } = {};
    console.log(`\n--- Processing Row ${index + 1}: ${row.business_name} ---`);
    try {
      // 1) Validate Input
      if (!row.email || !row.business_name || !row.region || !row.category || !row.product_url) {
        throw new Error("Missing required CSV column (email|business_name|region|category|product_url).");
      }

      // 2) Resolve Dictionaries (Abort on missing mapping)
      const region_id = resolveRegionId(row.region);
      const category_id = resolveCategoryId(row.category);
      console.log(`[✓] Resolved Mappings -> Region: ${region_id}, Category: ${category_id}`);

      // 3) Scrape Metadata
      console.log(`[*] Scraping URL: ${row.product_url}`);
      // Only mock scrape if dry run purely to avoid real requests unless necessary, 
      // but actually doing the real scrape during dry run validates the scrape contract!
      const metadata = await scrapeOpenGraph(row.product_url);
      console.log(`[✓] Scraped Metadata:`, metadata);

      if (DRY_RUN) {
        console.log(`[SIMULATION] Auth user would be created for: ${row.email}`);
        console.log(`[SIMULATION] public.users row would be inserted with user_type=business_owner`);
        console.log(`[SIMULATION] Vendor would be created: ${row.business_name} (region: ${region_id}, vendor_status=active)`);
        console.log(`[SIMULATION] Slugs would be generated handling collisions`);
        console.log(`[SIMULATION] Business Profile inserted: category=${category_id}, is_public=true, vendor_status=active`);
        console.log(`[SIMULATION] Product inserted: title="${metadata.title}", is_active=true, is_archived=false, deleted_at=null`);
        console.log(`[✓] Dry-run validation passed for ${row.business_name}`);
        continue;
      }

      // 4) Create Auth User
      console.log(`[*] Creating Supabase Auth User: ${row.email}`);
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: row.email,
        email_confirm: true,
        user_metadata: {
          user_type: 'business_owner',
        },
      });
      if (authError || !authData.user) throw new Error(`Auth failed: ${authError?.message}`);
      const userId = authData.user.id;
      createdRefs.authUserId = userId;
      console.log(`[✓] Created Auth User ID: ${userId}`);

      // 4.5) Insert public.users row (required FK for vendors.user_id)
      console.log(`[*] Inserting public.users row...`);
      const { error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: row.email,
          user_type: 'business_owner',
        });
      if (userError) throw new Error(`public.users insert failed: ${userError.message}`);
      createdRefs.userId = userId;
      console.log(`[✓] Created public.users row for ${userId}`);

      // 5) Insert Vendor
      console.log(`[*] Inserting Vendor...`);
      const { data: vendorData, error: vendorError } = await supabaseAdmin
        .from("vendors")
        .insert({
          user_id: userId,
          business_name: row.business_name,
          primary_region_id: region_id,
          vendor_status: 'active',
        })
        .select("id")
        .single();
      if (vendorError || !vendorData) throw new Error(`Vendor insert failed: ${vendorError?.message}`);
      const vendorId = vendorData.id;
      createdRefs.vendorId = vendorId;
      console.log(`[✓] Created Vendor ID: ${vendorId}`);

      // 6) Generate Slugs
      const safeBusinessSlug = await generateUniqueBusinessSlug(row.business_name);
      const safeProductSlug = await generateUniqueSlug(vendorId, metadata.title || "product");

      // 7) Insert Business Profile
      console.log(`[*] Inserting Business Profile...`);
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("business_profiles")
        .insert({
          user_id: userId,
          business_name: row.business_name,
          slug: safeBusinessSlug,
          category_id: category_id,
          profile_description: row.description || null,
          profile_image_url: metadata.image || null,
          vendor_status: 'active',
          is_public: true,
        })
        .select('id')
        .single();
      if (profileError) throw new Error(`Profile insert failed: ${profileError.message}`);
      createdRefs.profileId = profileData?.id;
      console.log(`[✓] Created Business Profile for ${safeBusinessSlug}`);

      // 8) Insert Product
      console.log(`[*] Inserting Product...`);
      const { data: productData, error: productError } = await supabaseAdmin
        .from("products")
        .insert({
          vendor_id: vendorId,
          title: metadata.title || row.business_name,
          description: metadata.description || row.description || null,
          product_url: row.product_url,
          image_urls: metadata.image ? [metadata.image] : [],
          category_id: category_id,
          slug: safeProductSlug,
          is_active: true, // REQUIRED
          is_archived: false,
          deleted_at: null,
        })
        .select('id');
      if (productError) throw new Error(`Product insert failed: ${productError.message}`);
      createdRefs.productId = Array.isArray(productData) ? productData[0]?.id : undefined;
      console.log(`[✓] Created Product for ${safeProductSlug}`);

      console.log(`\n>>> SUCCESSFULLY SEEDED: ${row.business_name} <<<`);

    } catch (err) {
      if (!DRY_RUN) {
        if (createdRefs.productId) {
          await supabaseAdmin.from('products').delete().eq('id', createdRefs.productId);
        }
        if (createdRefs.profileId) {
          await supabaseAdmin.from('business_profiles').delete().eq('id', createdRefs.profileId);
        } else if (createdRefs.userId) {
          await supabaseAdmin.from('business_profiles').delete().eq('user_id', createdRefs.userId);
        }
        if (createdRefs.vendorId) {
          await supabaseAdmin.from('vendors').delete().eq('id', createdRefs.vendorId);
        }
        if (createdRefs.userId) {
          await supabaseAdmin.from('users').delete().eq('id', createdRefs.userId);
        }
        if (createdRefs.authUserId) {
          await supabaseAdmin.auth.admin.deleteUser(createdRefs.authUserId);
        }
      }
      console.error(`\n[X] FAILURE ON ROW ${index + 1}: ${row.business_name}`);
      console.error(err instanceof Error ? err.message : String(err));
      console.error(`ABORTING RUN DUE TO FAILURE.`);
      process.exit(1);
    }
  }

  console.log(`\nFinished processing ${queue.length} profiles.`);
}

runSeeder();
