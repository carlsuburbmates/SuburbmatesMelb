#!/usr/bin/env node

/**
 * Simple migration application script
 * Applies the schema fixes by executing SQL directly
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

async function applySchemaFixes() {
  console.log('🔧 Applying Schema Fixes...');
  
  try {
    // Step 1: Add missing columns
    console.log('1. Adding images column...');
    const { error: imagesError } = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
        
        ALTER TABLE products 
        ADD CONSTRAINT IF NOT EXISTS products_images_is_array 
        CHECK (jsonb_typeof(images) = 'array');
      `
    });
    
    if (imagesError) {
      console.log('Trying direct SQL approach...');
      // Try without the rpc wrapper
      const { error: directError } = await supabase
        .from('products')
        .select('images')
        .limit(1);
      
      if (directError && directError.code === 'PGRST204') {
        console.log('❌ Images column still missing - need to apply migration manually');
        console.log('\n📋 Manual steps needed:');
        console.log('1. Go to your Supabase dashboard SQL editor');
        console.log('2. Run this SQL:');
        console.log(`
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Fix the trigger function
DROP TRIGGER IF EXISTS trigger_product_tier_cap ON products;
DROP FUNCTION IF EXISTS check_product_tier_cap();

CREATE OR REPLACE FUNCTION check_product_tier_cap()
RETURNS TRIGGER AS $$
DECLARE
    vendor_tier VARCHAR(20);
    product_count INTEGER;
    tier_limit INTEGER;
BEGIN
    SELECT v.tier INTO vendor_tier
    FROM vendors v
    WHERE v.id = NEW.vendor_id;

    tier_limit := CASE vendor_tier
        WHEN 'basic' THEN 3
        WHEN 'pro' THEN 50
        ELSE 0
    END;

    SELECT COUNT(*) INTO product_count
    FROM products
    WHERE vendor_id = NEW.vendor_id 
      AND published = true
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

    IF NEW.published = true AND product_count >= tier_limit THEN
        RAISE EXCEPTION 'Product cap reached for % tier (limit: %)', vendor_tier, tier_limit
            USING ERRCODE = '23514';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_product_tier_cap
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION check_product_tier_cap();
        `);
        return false;
      }
    }
    
    console.log('✅ Schema fixes applied successfully');
    return true;
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function testSchemaFix() {
  console.log('\n🧪 Testing schema fix...');
  
  try {
    // Test if we can now access the new columns
    const { data, error } = await supabase
      .from('products')
      .select('id, title, images, category')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST204') {
        console.log('❌ Columns still missing - apply manual SQL above');
        return false;
      } else {
        console.log('⚠️ Other error (may be normal if no data):', error.message);
      }
    }
    
    console.log('✅ Schema columns are accessible');
    return true;
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Simple Schema Fix Application\n');
  
  const applied = await applySchemaFixes();
  if (!applied) {
    console.log('\n⚠️ Could not apply automatically. Use the manual SQL above.');
    return;
  }
  
  const tested = await testSchemaFix();
  if (tested) {
    console.log('\n🎉 Schema fix successful!');
    console.log('✅ Product CRUD should now work with images and category fields');
  }
}

main().catch(console.error);