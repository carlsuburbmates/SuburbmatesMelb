#!/usr/bin/env node

/**
 * Check current database state
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkState() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check what tables exist
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log('📋 Existing tables:');
    console.log('─'.repeat(60));
    if (result.rows.length === 0) {
      console.log('   (none - database is empty)');
    } else {
      result.rows.forEach(row => {
        console.log(`   ✓ ${row.tablename}`);
      });
    }

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkState();
