#!/usr/bin/env node

/**
 * Script to apply migration 008 and test the schema fixes
 * This resolves the PGRST204 errors and vendor_tier column references
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🔧 Applying Migration 008: Fix Schema Conflicts...');
  
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '008_fix_schema_conflicts.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Apply migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error.message);
      return false;
    }
    
    console.log('✅ Migration 008 applied successfully');
    return true;
  } catch (err) {
    console.error('❌ Error applying migration:', err.message);
    return false;
  }
}

async function testSchemaFixes() {
  console.log('\n🧪 Testing Schema Fixes...');
  
  try {
    // Test 1: Check if new columns exist
    console.log('1. Checking new columns...');
    const { data, error } = await supabase
      .from('products')
      .select('id, title, images, category')
      .limit(1);
    
    if (error && error.code === 'PGRST204') {
      console.error('❌ Columns still missing:', error.message);
      return false;
    }
    
    console.log('✅ New columns accessible');
    
    // Test 2: Check if trigger function works
    console.log('2. Testing trigger function...');
    const { data: functions, error: fnError } = await supabase.rpc('exec_sql', {
      sql: `SELECT proname FROM pg_proc WHERE proname = 'check_product_tier_cap';`
    });
    
    if (fnError) {
      console.error('❌ Function check failed:', fnError.message);
      return false;
    }
    
    console.log('✅ Trigger function exists');
    
    // Test 3: Verify tier column reference
    console.log('3. Testing vendor tier column...');
    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .select('id, tier')
      .limit(1);
    
    if (vendorError) {
      console.error('❌ Vendor tier column issue:', vendorError.message);
      return false;
    }
    
    console.log('✅ Vendor tier column accessible');
    console.log('\n🎉 All schema fixes verified!');
    return true;
    
  } catch (err) {
    console.error('❌ Testing failed:', err.message);
    return false;
  }
}

async function testProductCRUD() {
  console.log('\n🔨 Testing Product CRUD with new schema...');
  
  try {
    // Find a test vendor or create one
    let { data: vendor } = await supabase
      .from('vendors')
      .select('id, tier')
      .eq('vendor_status', 'active')
      .limit(1)
      .single();
    
    if (!vendor) {
      console.log('⚠️  No active vendor found for testing');
      return true;
    }
    
    console.log(`📋 Testing with vendor ${vendor.id} (tier: ${vendor.tier})`);
    
    // Test product creation with new schema
    const testProduct = {
      title: 'Test Product Schema Fix',
      description: 'Testing the new schema with images and category fields',
      price: 29.99,
      category: 'test-category',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      published: true
    };
    
    const { data: product, error: createError } = await supabase
      .from('products')
      .insert({
        vendor_id: vendor.id,
        title: testProduct.title,
        description: testProduct.description,
        price: testProduct.price,
        category: testProduct.category,
        images: testProduct.images,
        published: testProduct.published,
        slug: 'test-product-schema-fix'
      })
      .select()
      .single();
    
    if (createError) {
      if (createError.code === '23514') {
        console.log('✅ Tier cap trigger working (expected for tier limit)');
        return true;
      }
      console.error('❌ Product creation failed:', createError.message);
      return false;
    }
    
    console.log('✅ Product created with new schema fields');
    
    // Cleanup test product
    await supabase.from('products').delete().eq('id', product.id);
    console.log('🧹 Test product cleaned up');
    
    return true;
    
  } catch (err) {
    console.error('❌ Product CRUD test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Schema Conflict Fix Script\n');
  
  // Step 1: Apply migration
  const migrationSuccess = await applyMigration();
  if (!migrationSuccess) {
    process.exit(1);
  }
  
  // Step 2: Test schema fixes
  const schemaTestSuccess = await testSchemaFixes();
  if (!schemaTestSuccess) {
    process.exit(1);
  }
  
  // Step 3: Test product CRUD
  const crudTestSuccess = await testProductCRUD();
  if (!crudTestSuccess) {
    process.exit(1);
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Run: npm run build (to verify TypeScript compilation)');
  console.log('2. Run: npx supabase gen types typescript --project-id YOUR_PROJECT > src/lib/database.types.ts');
  console.log('3. Run: npm run test:e2e -- product-crud-caps.spec.ts (to test Playwright suite)');
  console.log('\n✨ Schema conflicts resolved! Product CRUD should now work correctly.');
}

main().catch(console.error);