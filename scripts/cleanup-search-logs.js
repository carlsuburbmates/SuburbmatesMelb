#!/usr/bin/env node

/**
 * Search Log Cleanup
 * Deletes telemetry rows older than 90 days to minimize PII exposure
 * and keep analytics tables lean for the free Supabase tier.
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

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function main() {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace("T", " ")
    .replace("Z", "+00");

  console.log(`🧹 Removing search_logs entries older than ${cutoff}`);
  const { error, count } = await supabase
    .from("search_logs")
    .delete({ count: "exact" })
    .lt("created_at", cutoff);

  if (error) {
    if (error.message?.includes("search_logs")) {
      console.warn("⚠️  search_logs table not found; did migration 010 run?");
      return;
    }
    throw error;
  }

  console.log(`✅ Deleted ${count ?? 0} search log(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("cleanup-search-logs failed", error);
    process.exit(1);
  });
