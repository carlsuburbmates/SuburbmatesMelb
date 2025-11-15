#!/usr/bin/env node

/**
 * Apply Migration 007 via Supabase Management API
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration007() {
  console.log('🚀 Applying Migration 007: Stage 3 Enhancements\n');
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/007_stage3_enhancements.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  
  console.log('📝 Reading migration file...');
  console.log('   File:', migrationPath);
  console.log('   Size:', sql.length, 'bytes\n');
  
  console.log('⚠️  Note: Supabase JS client cannot execute raw SQL migrations.');
  console.log('   Please apply via Supabase Studio SQL Editor:\n');
  console.log('   1. Go to: https://supabase.com/dashboard/project/hmmqhwnxylqcbffjffpj/sql/new');
  console.log('   2. Copy the SQL from: supabase/migrations/007_stage3_enhancements.sql');
  console.log('   3. Paste and click "Run"\n');
  
  console.log('📋 Migration preview (first 500 chars):\n');
  console.log(sql.substring(0, 500));
  console.log('\n...\n');
}

applyMigration007();
