#!/usr/bin/env node

/**
 * Suburbmates V1.1 - Direct Migration Runner
 * Uses pg library to execute migrations directly
 */

const fs = require('fs');
const path = require('path');

// Check if pg is installed
try {
  require.resolve('pg');
} catch (e) {
  console.log('❌ PostgreSQL client (pg) not installed.');
  console.log('   Run: npm install pg');
  process.exit(1);
}

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

async function runMigrations() {
  console.log('🚀 Suburbmates V1.1 - Direct Migration Runner\n');
  console.log('='.repeat(60));

  // Get DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('\n❌ DATABASE_URL not found in .env.local');
    console.log('\nPlease add your Supabase database connection string:');
    console.log('   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres\n');
    console.log('Get it from: Supabase Dashboard → Settings → Database → Connection String (URI)\n');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    console.log('\n📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read all migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📂 Found ${files.length} migration files:\n`);

    for (const file of files) {
      const filepath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filepath, 'utf-8');

      console.log(`📝 Applying: ${file}`);
      console.log('─'.repeat(60));

      try {
        // Execute the entire SQL file
        await client.query(sql);
        console.log(`✅ SUCCESS: ${file}\n`);
      } catch (error) {
        // Check if it's a "already exists" type error (safe to skip)
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key')) {
          console.log(`⚠️  SKIPPED: ${file} (already applied)\n`);
        } else {
          console.log(`❌ FAILED: ${file}`);
          console.log(`   Error: ${error.message}`);
          console.log(`   Hint: ${error.hint || 'N/A'}\n`);
          throw error;
        }
      }
    }

    console.log('='.repeat(60));
    console.log('✅ All migrations applied successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
