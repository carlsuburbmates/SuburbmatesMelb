#!/usr/bin/env node

/**
 * Apply Migration 008 via Supabase Management UI
 * Fixes schema conflicts (images/category columns + tier trigger)
 */

const fs = require("fs");
const path = require("path");

function main() {
  const migrationPath = path.join(
    __dirname,
    "../supabase/migrations/008_fix_schema_conflicts.sql"
  );

  if (!fs.existsSync(migrationPath)) {
    console.error("Migration file not found:", migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");

  console.log("🚀 Migration 008: Fix Schema Conflicts\n");
  console.log("File:", migrationPath);
  console.log("Size:", sql.length, "bytes\n");
  console.log("⚠️  Supabase client cannot run raw SQL migrations from Node.");
  console.log("   Please run the SQL manually via Supabase Studio:\n");
  console.log(
    "   1. Open https://supabase.com/dashboard/project/hmmqhwnxylqcbffjffpj/sql/new"
  );
  console.log(
    "   2. Copy/paste the contents of supabase/migrations/008_fix_schema_conflicts.sql"
  );
  console.log('   3. Click "Run" and verify it succeeds.\n');

  console.log("📋 Preview (first 500 chars):\n");
  console.log(sql.substring(0, 500));
  console.log("\n...");
}

main();
