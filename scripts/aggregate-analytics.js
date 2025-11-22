#!/usr/bin/env node

/**
 * Daily Analytics Rollup
 * Summarises search telemetry + marketplace inventory and writes a JSON artifact.
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

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

function startOfUtcDay(date = new Date()) {
  const copy = new Date(date);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

function aggregateFilter(logs, key) {
  const map = new Map();
  logs.forEach((row) => {
    const filters = (row.filters ?? {}) || {};
    const value = filters[key];
    if (!value) return;
    map.set(value, (map.get(value) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }));
}

async function fetchSearchRollup(startIso) {
  const { data, error } = await supabase
    .from("search_logs")
    .select("filters, result_count")
    .gte("created_at", startIso);
  if (error) {
    if (error.message?.includes("search_logs")) {
      console.warn(
        "⚠️  search_logs table missing – run migration 010_create_search_logs.sql"
      );
      return {
        totalEvents: 0,
        zeroResultCount: 0,
        zeroResultRate: 0,
        topSuburbs: [],
        topCategories: [],
      };
    }
    throw error;
  }

  const logs = data ?? [];
  const zeroResultCount = logs.filter((row) => (row.result_count ?? 0) === 0).length;

  return {
    totalEvents: logs.length,
    zeroResultCount,
    zeroResultRate: logs.length === 0 ? 0 : zeroResultCount / logs.length,
    topSuburbs: aggregateFilter(logs, "suburb"),
    topCategories: aggregateFilter(logs, "category"),
  };
}

async function fetchInventoryRollup() {
  const [{ count: totalProducts, error: totalError }, { count: liveProducts, error: liveError }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("published", true),
    ]);

  if (totalError) throw totalError;
  if (liveError) throw liveError;

  const { count: activeVendors, error: vendorError } = await supabase
    .from("vendors")
    .select("*", { count: "exact", head: true })
    .eq("vendor_status", "active");
  if (vendorError) throw vendorError;

  return {
    totalProducts: totalProducts ?? 0,
    liveProducts: liveProducts ?? 0,
    activeVendors: activeVendors ?? 0,
  };
}

async function writeReport(summary) {
  const analyticsDir = path.join(process.cwd(), "reports", "analytics");
  fs.mkdirSync(analyticsDir, { recursive: true });

  const fileName = path.join(analyticsDir, `daily-${summary.date}.json`);
  fs.writeFileSync(fileName, JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(analyticsDir, "latest.json"), JSON.stringify(summary, null, 2));
  console.log(`📈 Wrote analytics rollup to ${fileName}`);
}

async function main() {
  const start = startOfUtcDay();
  const summary = {
    date: start.toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    search: await fetchSearchRollup(start.toISOString()),
    inventory: await fetchInventoryRollup(),
  };

  await writeReport(summary);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("aggregate-analytics failed", error);
    process.exit(1);
  });
