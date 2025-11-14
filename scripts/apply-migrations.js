#!/usr/bin/env node

/**
 * Suburbmates V1.1 - Migration Application Script
 * Applies SQL migrations to Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

// Track which migrations have been applied
async function getMigrationHistory() {
  // Create migrations tracking table if it doesn't exist
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // We'll need to use raw SQL query
  console.log('📋 Checking migration history table...');
  
  return [];
}

async function applyMigration(filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf-8');

  console.log(`\n📝 Applying migration: ${filename}`);
  console.log('─'.repeat(60));

  // Split by semicolon and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`   Found ${statements.length} SQL statements`);

  // Note: Supabase JS client doesn't support raw SQL execution
  // Migrations must be applied via Supabase Studio or CLI
  
  console.log('⚠️  Cannot apply migrations via JS client.');
  console.log('   Please apply via one of these methods:');
  console.log('   1. Supabase Studio SQL Editor');
  console.log('   2. Supabase CLI: supabase db push');
  console.log('   3. Direct psql connection');
  
  return false;
}

async function main() {
  console.log('🚀 Suburbmates V1.1 - Migration Tool\n');
  console.log('='.repeat(60));

  // Read all migration files
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`\n📂 Found ${files.length} migration files:\n`);
  files.forEach((f, i) => {
    console.log(`   ${i + 1}. ${f}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n⚠️  IMPORTANT: Migrations for Supabase Hosted Database');
  console.log('\nTo apply these migrations, use one of these methods:\n');
  
  console.log('METHOD 1: Supabase Studio (Recommended)');
  console.log('─────────────────────────────────────────');
  console.log('1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to "SQL Editor"');
  console.log('4. Copy and paste each migration file');
  console.log('5. Click "Run"\n');

  console.log('METHOD 2: Supabase CLI');
  console.log('─────────────────────────────────────────');
  console.log('1. Link project: supabase link --project-ref hmmqhwnxylqcbffjffpj');
  console.log('2. Push migrations: supabase db push\n');

  console.log('METHOD 3: Direct PostgreSQL Connection');
  console.log('─────────────────────────────────────────');
  console.log('1. Get connection string from Supabase Dashboard');
  console.log('2. Run: psql "your-connection-string" -f supabase/migrations/001_initial_schema.sql\n');

  console.log('='.repeat(60));
  console.log('\n📋 Migration Files to Apply (in order):\n');
  
  files.forEach((f, i) => {
    const filepath = path.join(MIGRATIONS_DIR, f);
    const stats = fs.statSync(filepath);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`   ${i + 1}. ${f} (${size} KB)`);
  });

  console.log('\n✅ Migration files are ready to be applied manually.\n');
}

main().catch(console.error);
