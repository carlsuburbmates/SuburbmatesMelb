#!/usr/bin/env node

/**
 * Tier Cap Audit
 * Warns when vendors exceed their product quota so automation / founders can follow up.
 */

const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const ENV_PATH = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(ENV_PATH)) {
  require("dotenv").config({ path: ENV_PATH });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const DEFAULT_TIER_LIMITS = {
  none: 0,
  directory: 0,
  basic: 10,
  pro: 50,
  premium: 50,
  suspended: 0,
};

const supabase = createClient(url, serviceKey, {
  auth: {
    persistSession: false,
  },
});

async function fetchVendors() {
  const { data, error } = await supabase
    .from("vendors")
    .select("id, business_name, tier, product_quota, product_count, vendor_status");
  if (error) {
    throw error;
  }
  return data ?? [];
}

async function fetchPublishedCount(vendorId) {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendorId)
    .eq("published", true);
  if (error) {
    throw error;
  }
  return count ?? 0;
}

async function main() {
  console.log("▶️  Checking vendor product quotas…");
  const vendors = await fetchVendors();
  const offenders = [];

  for (const vendor of vendors) {
    const quota =
      vendor.product_quota ??
      DEFAULT_TIER_LIMITS[vendor.tier] ??
      DEFAULT_TIER_LIMITS.directory;

    if (quota <= 0) continue;

    const productCount =
      vendor.product_count ?? (await fetchPublishedCount(vendor.id));

    if (productCount > quota) {
      offenders.push({
        vendorId: vendor.id,
        businessName: vendor.business_name ?? "Unknown",
        tier: vendor.tier ?? "unknown",
        status: vendor.vendor_status ?? "unknown",
        quota,
        productCount,
        overBy: productCount - quota,
      });
    }
  }

  if (!offenders.length) {
    console.log("✅ All vendors are within their product quotas.");
    return;
  }

  console.warn(
    `⚠️  ${offenders.length} vendor(s) exceed their product quota. Consider running enforceTierProductCap or contacting them.`
  );
  console.table(offenders);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("check-tier-caps failed", error);
    process.exit(1);
  });
