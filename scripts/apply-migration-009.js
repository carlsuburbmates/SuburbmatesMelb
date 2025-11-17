#!/usr/bin/env node

/**
 * Apply Migration 009 via Supabase Management UI
 */

const fs = require("fs");
const path = require("path");

function main() {
  const migrationPath = path.join(
    __dirname,
    "../supabase/migrations/009_vendor_product_quota.sql"
  );

  if (!fs.existsSync(migrationPath)) {
    console.error("Migration file not found:", migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");

  console.log("🚀 Migration 009: Vendor Product Quotas\n");
  console.log("File:", migrationPath);
  console.log("Size:", sql.length, "bytes\n");
  console.log("⚠️  Run this SQL manually in Supabase Studio:");
  console.log(
    "   https://supabase.com/dashboard/project/hmmqhwnxylqcbffjffpj/sql/new\n"
  );
  console.log("📋 Preview (first 400 chars):\n");
  console.log(sql.substring(0, 400));
  console.log("\n...");
}

main();
