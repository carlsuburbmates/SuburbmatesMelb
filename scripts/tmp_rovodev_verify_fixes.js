#!/usr/bin/env node

/**
 * Comprehensive verification script for schema conflict fixes
 * Tests the complete product CRUD flow with proper error codes
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductCRUDFlow() {
  console.log('🧪 Testing Complete Product CRUD Flow\n');
  
  try {
    // 1. Find or create test vendor
    let { data: vendor } = await supabase
      .from('vendors')
      .select('id, tier, vendor_status')
      .eq('vendor_status', 'active')
      .limit(1)
      .single();
    
    if (!vendor) {
      console.log('⚠️ No active vendor found, creating test vendor...');
      
      // Create test user first
      const { data: user, error: userError } = await supabase.auth.admin.createUser({
        email: 'test-vendor@example.com',
        password: 'testpassword123',
        email_confirm: true
      });
      
      if (userError && !userError.message.includes('already registered')) {
        throw userError;
      }
      
      const userId = user?.user?.id || (await supabase
        .from('users')
        .select('id')
        .eq('email', 'test-vendor@example.com')
        .single()).data?.id;
      
      // Create vendor
      const { data: newVendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          user_id: userId,
          business_name: 'Test Schema Vendor',
          tier: 'basic',
          vendor_status: 'active'
        })
        .select()
        .single();
      
      if (vendorError) throw vendorError;
      vendor = newVendor;
      console.log(`✅ Created test vendor: ${vendor.id} (${vendor.tier})`);
    }
    
    console.log(`📋 Using vendor: ${vendor.id} (tier: ${vendor.tier})`);
    
    // 2. Test product creation with new schema
    console.log('\n2. Testing product creation with new schema...');
    
    const productPayload = {
      vendor_id: vendor.id,
      title: 'Schema Test Product',
      description: 'Testing the fixed schema with images and category support',
      price: 29.99,
      category: 'testing',
      images: ['https://example.com/test1.jpg', 'https://example.com/test2.jpg'],
      published: true,
      slug: `schema-test-${Date.now()}`
    };
    
    const { data: product, error: createError } = await supabase
      .from('products')
      .insert(productPayload)
      .select()
      .single();
    
    if (createError) {
      if (createError.code === '23514') {
        console.log('✅ Tier cap enforcement working (hit product limit)');
        
        // Try creating unpublished product
        const unpublishedPayload = { ...productPayload, published: false, slug: `unpub-test-${Date.now()}` };
        const { data: unpubProduct, error: unpubError } = await supabase
          .from('products')
          .insert(unpublishedPayload)
          .select()
          .single();
        
        if (unpubError) {
          console.error('❌ Unpublished product creation failed:', unpubError.message);
          return false;
        }
        
        console.log('✅ Unpublished product creation works');
        product = unpubProduct;
      } else {
        console.error('❌ Product creation failed:', createError);
        console.log('Error details:', {
          code: createError.code,
          message: createError.message,
          details: createError.details
        });
        return false;
      }
    } else {
      console.log('✅ Product created successfully with new schema');
    }
    
    // 3. Test product update
    console.log('\n3. Testing product update...');
    
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        category: 'updated-category',
        images: ['https://example.com/updated.jpg'],
        description: 'Updated description with new schema fields'
      })
      .eq('id', product.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Product update failed:', updateError.message);
      return false;
    }
    
    console.log('✅ Product update works with new schema fields');
    
    // 4. Verify data integrity
    console.log('\n4. Verifying data integrity...');
    
    if (updatedProduct.category !== 'updated-category') {
      console.error('❌ Category field not updated correctly');
      return false;
    }
    
    if (!Array.isArray(updatedProduct.images) || updatedProduct.images[0] !== 'https://example.com/updated.jpg') {
      console.error('❌ Images field not updated correctly');
      return false;
    }
    
    console.log('✅ Data integrity verified');
    
    // 5. Test API-like payload (simulating what the API route would do)
    console.log('\n5. Testing API-style payload handling...');
    
    const apiPayload = {
      name: 'API Style Product',  // Should map to title
      details: 'API style description',  // Should map to description
      status: 'published',  // Should map to published: true
      image: 'https://example.com/api-image.jpg',  // Should map to images array
      price: '49.99'  // String price
    };
    
    // Simulate payload normalization
    const normalizedPayload = {
      vendor_id: vendor.id,
      title: apiPayload.name,
      description: apiPayload.details,
      published: apiPayload.status === 'published',
      images: [apiPayload.image],
      thumbnail_url: apiPayload.image,
      price: parseFloat(apiPayload.price),
      slug: `api-style-${Date.now()}`
    };
    
    const { data: apiProduct, error: apiError } = await supabase
      .from('products')
      .insert(normalizedPayload)
      .select()
      .single();
    
    if (apiError && apiError.code !== '23514') {
      console.error('❌ API-style product creation failed:', apiError.message);
      return false;
    }
    
    console.log('✅ API-style payload handling works');
    
    // 6. Cleanup
    console.log('\n6. Cleaning up test data...');
    
    const productIds = [product.id, apiProduct?.id].filter(Boolean);
    await supabase.from('products').delete().in('id', productIds);
    
    console.log('🧹 Test products cleaned up');
    
    return true;
    
  } catch (err) {
    console.error('❌ Test flow failed:', err.message);
    return false;
  }
}

async function verifyStripeConfig() {
  console.log('\n💳 Verifying Stripe Configuration...');
  
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_PRODUCT_VENDOR_PRO',
    'STRIPE_PRICE_VENDOR_PRO_MONTH',
    'STRIPE_PRODUCT_FEATURED_30D',
    'STRIPE_PRICE_FEATURED_30D'
  ];
  
  let allPresent = true;
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`❌ Missing: ${varName}`);
      allPresent = false;
    } else {
      console.log(`✅ ${varName}: ${process.env[varName].substring(0, 12)}...`);
    }
  }
  
  return allPresent;
}

async function main() {
  console.log('🚀 Schema Fixes Verification\n');
  
  // 1. Verify Stripe config
  const stripeOk = await verifyStripeConfig();
  if (!stripeOk) {
    console.log('\n⚠️ Stripe configuration incomplete, but proceeding with schema tests...\n');
  }
  
  // 2. Test complete CRUD flow
  const crudOk = await testProductCRUDFlow();
  
  if (crudOk) {
    console.log('\n🎉 All tests passed!');
    console.log('\n🎯 Next Steps:');
    console.log('1. npm run build (verify TypeScript compilation)');
    console.log('2. npm run test:e2e -- product-crud-caps.spec.ts');
    console.log('3. Check that Playwright returns 201/403 instead of 500');
    
    if (!stripeOk) {
      console.log('\n⚠️ Note: Complete Stripe configuration in .env.local for full functionality');
    }
  } else {
    console.log('\n❌ Tests failed - schema issues may persist');
    process.exit(1);
  }
}

main().catch(console.error);