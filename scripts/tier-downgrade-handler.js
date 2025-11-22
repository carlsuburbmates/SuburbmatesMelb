#!/usr/bin/env node
/**
 * Script: tier-downgrade-handler
 * Usage: node scripts/tier-downgrade-handler.js <vendor_id> <new_tier>
 * This will compute how many products to unpublish and call the RPC fn_unpublish_oldest_products
 */
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE env vars");
  process.exit(1);
}

const supabaseAdmin = createClient(url, key);

async function main() {
  const [vendorId, newTier] = process.argv.slice(2);
  if (!vendorId || !newTier) {
    console.error(
      "Usage: node scripts/tier-downgrade-handler.js <vendor_id> <new_tier>"
    );
    process.exit(1);
  }

  const { data: published } = await supabaseAdmin
    .from("products")
    .select("id", { count: "exact" })
    .eq("vendor_id", vendorId)
    .eq("published", true);
  const publishedCount = Array.isArray(published) ? published.length : 0;
  const quota = newTier === "basic" ? 10 : newTier === "pro" ? 50 : 0;
  if (publishedCount > quota) {
    const toUnpublish = publishedCount - quota;
    console.log(
      `Unpublishing ${toUnpublish} products for vendor ${vendorId} to meet tier ${newTier}`
    );
    const { error } = await supabaseAdmin.rpc("fn_unpublish_oldest_products", {
      p_vendor_id: vendorId,
      p_to_unpublish: toUnpublish,
    });
    if (error) {
      console.error("RPC error", error);
      process.exit(2);
    }
    console.log("Done");
  } else {
    console.log("No action required");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
