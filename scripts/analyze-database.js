#!/usr/bin/env node

/**
 * Comprehensive Database Analysis Script
 * Analyzes current database state before migrations
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function analyzeDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('🔍 COMPREHENSIVE DATABASE ANALYSIS');
    console.log('='.repeat(70));
    console.log('\n');

    // 1. List all tables
    console.log('📋 EXISTING TABLES:');
    console.log('-'.repeat(70));
    const tablesResult = await client.query(`
      SELECT tablename, schemaname
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('   ❌ No tables found - database is empty\n');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   ✓ ${row.tablename}`);
      });
      console.log(`\n   Total: ${tablesResult.rows.length} tables\n`);
    }

    // 2. For each table, show structure
    if (tablesResult.rows.length > 0) {
      console.log('\n📊 TABLE STRUCTURES:');
      console.log('-'.repeat(70));
      
      for (const table of tablesResult.rows) {
        const tableName = table.tablename;
        
        // Get columns
        const columnsResult = await client.query(`
          SELECT 
            column_name, 
            data_type, 
            character_maximum_length,
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
            AND table_name = $1
          ORDER BY ordinal_position;
        `, [tableName]);

        console.log(`\n   📄 ${tableName.toUpperCase()}`);
        console.log('   ' + '─'.repeat(66));
        
        columnsResult.rows.forEach(col => {
          const type = col.character_maximum_length 
            ? `${col.data_type}(${col.character_maximum_length})`
            : col.data_type;
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`   ${col.column_name.padEnd(30)} ${type.padEnd(20)} ${nullable}${defaultVal}`);
        });

        // Get row count
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   ${'─'.repeat(66)}`);
        console.log(`   Rows: ${countResult.rows[0].count}`);
      }
    }

    // 3. Check for missing expected tables
    console.log('\n\n🎯 EXPECTED TABLES CHECK:');
    console.log('-'.repeat(70));
    
    const expectedTables = [
      'lgas',
      'categories', 
      'users',
      'vendors',
      'business_profiles',
      'products',
      'featured_slots',
      'featured_queue',
      'orders',
      'refund_requests',
      'disputes',
      'transactions_log',
      'appeals'
    ];

    const existingTableNames = tablesResult.rows.map(r => r.tablename);
    
    expectedTables.forEach(expected => {
      if (existingTableNames.includes(expected)) {
        console.log(`   ✅ ${expected}`);
      } else {
        console.log(`   ❌ ${expected} (MISSING)`);
      }
    });

    // 4. Check RLS status
    console.log('\n\n🔒 ROW LEVEL SECURITY STATUS:');
    console.log('-'.repeat(70));
    
    const rlsResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    rlsResult.rows.forEach(row => {
      const status = row.rowsecurity ? '✅ ENABLED' : '❌ DISABLED';
      console.log(`   ${row.tablename.padEnd(30)} ${status}`);
    });

    // 5. Check for foreign key constraints
    console.log('\n\n🔗 FOREIGN KEY CONSTRAINTS:');
    console.log('-'.repeat(70));
    
    const fkResult = await client.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `);

    if (fkResult.rows.length === 0) {
      console.log('   (No foreign keys found)\n');
    } else {
      fkResult.rows.forEach(fk => {
        console.log(`   ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    }

    // 6. Check indexes
    console.log('\n\n📇 INDEXES:');
    console.log('-'.repeat(70));
    
    const indexResult = await client.query(`
      SELECT
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);

    if (indexResult.rows.length === 0) {
      console.log('   (No indexes found)\n');
    } else {
      let currentTable = '';
      indexResult.rows.forEach(idx => {
        if (idx.tablename !== currentTable) {
          console.log(`\n   ${idx.tablename}:`);
          currentTable = idx.tablename;
        }
        console.log(`     - ${idx.indexname}`);
      });
    }

    // 7. Summary
    console.log('\n\n📋 SUMMARY:');
    console.log('='.repeat(70));
    console.log(`   Tables created: ${tablesResult.rows.length}`);
    console.log(`   Foreign keys: ${fkResult.rows.length}`);
    console.log(`   Indexes: ${indexResult.rows.length}`);
    console.log(`   RLS enabled tables: ${rlsResult.rows.filter(r => r.rowsecurity).length}`);
    
    const missingTables = expectedTables.filter(t => !existingTableNames.includes(t));
    if (missingTables.length > 0) {
      console.log(`   ⚠️  Missing tables: ${missingTables.join(', ')}`);
    } else {
      console.log(`   ✅ All expected tables present`);
    }

    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

analyzeDatabase();
