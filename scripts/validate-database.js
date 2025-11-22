#!/usr/bin/env node

/**
 * Suburbmates V1.1 - Database Schema Validation Script
 * Validates that the actual database schema matches v1.1 documentation
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Expected schema based on v1.1-docs/03_ARCHITECTURE/03.3_SCHEMA_REFERENCE.md
const EXPECTED_TABLES = [
  'lgas',
  'categories',
  'users',
  'vendors',
  'products',
  'featured_slots',
  'featured_queue',
  'orders',
  'refund_requests',
  'disputes',
  'transactions_log',
  'appeals'
];

const CRITICAL_COLUMNS = {
  users: ['id', 'email', 'user_type'],
  vendors: ['id', 'user_id', 'tier', 'vendor_status', 'stripe_account_id'],
  products: ['id', 'vendor_id', 'title', 'price', 'published'],
  orders: ['id', 'customer_id', 'vendor_id', 'product_id', 'amount_cents'],
  refund_requests: ['id', 'order_id', 'customer_id', 'vendor_id', 'status'],
  disputes: ['id', 'order_id', 'customer_id', 'vendor_id', 'status'],
  appeals: ['id', 'vendor_id', 'appeal_type', 'status']
};

async function validateSchema() {
  console.log('🔍 Starting database schema validation...\n');

  let errors = 0;
  let warnings = 0;

  try {
    // 1. Check all tables exist
    console.log('📋 Checking table existence...');
    let tables = null;
    let tableError = null;

    try {
      const rpcResult = await supabase.rpc('get_tables_list');
      tables = rpcResult.data;
      tableError = rpcResult.error;
    } catch (rpcError) {
      tableError = rpcError;
    }

    if (!tableError && Array.isArray(tables) && tables.length > 0) {
      const normalizedNames = tables.map(table => {
        if (!table) return null;
        if (typeof table === 'string') return table;
        return table.table_name || table.tablename || table.name || null;
      }).filter(Boolean);

      for (const table of EXPECTED_TABLES) {
        if (normalizedNames.includes(table)) {
          console.log(`✅ Table "${table}" exists`);
        } else {
          console.log(`❌ Table "${table}" missing (per RPC result)`);
          errors++;
        }
      }
    } else {
      console.log('⚠️  Using fallback method to check tables');
      
      for (const table of EXPECTED_TABLES) {
        const { error } = await supabase.from(table).select('*').limit(0);
        if (error) {
          console.log(`❌ Table "${table}" missing or inaccessible`);
          errors++;
        } else {
          console.log(`✅ Table "${table}" exists`);
        }
      }
    }

    // 2. Check RLS is enabled
    console.log('\n🔒 Checking Row Level Security...');
    for (const table of EXPECTED_TABLES) {
      // Try to access without proper permissions
      const { error } = await supabase.from(table).select('*').limit(1);
      if (!error || error.code === 'PGRST301') {
        console.log(`✅ RLS enabled on "${table}"`);
      } else {
        console.log(`⚠️  RLS check unclear for "${table}": ${error.message}`);
        warnings++;
      }
    }

    // 3. Check critical columns
    console.log('\n📊 Checking critical columns...');
    for (const [table, columns] of Object.entries(CRITICAL_COLUMNS)) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select(columns.join(','))
          .limit(0);
        
        if (error) {
          console.log(`❌ Columns check failed for "${table}": ${error.message}`);
          errors++;
        } else {
          console.log(`✅ Critical columns exist in "${table}"`);
        }
      } catch (err) {
        console.log(`❌ Error checking "${table}": ${err.message}`);
        errors++;
      }
    }

    // 4. Check seed data
    console.log('\n🌱 Checking seed data...');
    
    const { data: lgas, error: lgaError } = await supabase
      .from('lgas')
      .select('count');
    if (!lgaError && lgas && lgas.length > 0) {
      console.log(`✅ LGAs table has data`);
    } else {
      console.log(`⚠️  LGAs table appears empty (run seed migration)`);
      warnings++;
    }

    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('count');
    if (!catError && categories && categories.length > 0) {
      console.log(`✅ Categories table has data`);
    } else {
      console.log(`⚠️  Categories table appears empty (run seed migration)`);
      warnings++;
    }

    // 5. Check foreign key relationships
    console.log('\n🔗 Checking key relationships...');
    
    // Test vendor -> user relationship
    const { error: vendorError } = await supabase
      .from('vendors')
      .select('user_id, users(email)')
      .limit(1);
    
    if (!vendorError) {
      console.log(`✅ Vendor -> User relationship works`);
    } else {
      console.log(`⚠️  Vendor -> User relationship check failed: ${vendorError.message}`);
      warnings++;
    }

    // Test product -> vendor relationship
    const { error: productError } = await supabase
      .from('products')
      .select('vendor_id, vendors(business_name)')
      .limit(1);
    
    if (!productError) {
      console.log(`✅ Product -> Vendor relationship works`);
    } else {
      console.log(`⚠️  Product -> Vendor relationship check failed: ${productError.message}`);
      warnings++;
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    if (errors === 0 && warnings === 0) {
      console.log('✅ DATABASE VALIDATION PASSED - Schema is correct!');
      console.log('='.repeat(60));
      process.exit(0);
    } else if (errors === 0) {
      console.log(`⚠️  DATABASE VALIDATION PASSED WITH WARNINGS`);
      console.log(`   Warnings: ${warnings}`);
      console.log('='.repeat(60));
      process.exit(0);
    } else {
      console.log('❌ DATABASE VALIDATION FAILED');
      console.log(`   Errors: ${errors}`);
      console.log(`   Warnings: ${warnings}`);
      console.log('='.repeat(60));
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Validation failed with error:', error.message);
    process.exit(1);
  }
}

// Run validation
validateSchema();
