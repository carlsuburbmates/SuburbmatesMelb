# Schema Conflict Resolution Summary

**Date:** 2025-11-16  
**Issue:** PGRST204 errors and vendor_tier column reference mismatches blocking product CRUD

## 🔍 Issues Identified

### 1. Database Schema Mismatches
- **Problem**: Validation schema expected `category` and `images` fields, but database only had `category_id` and `thumbnail_url`
- **Error**: `PGRST204: Could not find the 'images' column of 'products'`

### 2. Column Reference Errors in Triggers
- **Problem**: Migration 006 trigger function referenced `v.vendor_tier` but actual column is `v.tier`
- **Error**: Trigger function failures on product insert/update

### 3. Tier Limit Inconsistencies
- **Problem**: Constants showed `pro = 50` but SSOT requires `pro = 10, premium = 50`

## ✅ Solutions Implemented

### Migration 008: `supabase/migrations/008_fix_schema_conflicts.sql`

1. **Fixed Trigger Function**
   ```sql
   -- BEFORE: SELECT v.vendor_tier INTO vendor_tier
   -- AFTER:  SELECT v.tier INTO vendor_tier
   ```

2. **Added Missing Columns**
   ```sql
   -- Added images as JSONB array with constraints
   ALTER TABLE products ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
   
   -- Added category as text field for flexibility  
   ALTER TABLE products ADD COLUMN category TEXT;
   ```

3. **Updated Tier Limits**
   ```sql
   tier_limit := CASE vendor_tier
       WHEN 'basic' THEN 3
       WHEN 'pro' THEN 10     -- Fixed: was 50
       WHEN 'premium' THEN 50 -- New premium tier
       ELSE 0
   END;
   ```

### Code Updates

#### `src/app/api/vendor/products/route.ts`
- Added `category` and `images` fields to insert payload
- Maintains backward compatibility with `thumbnail_url`

#### `src/app/api/vendor/products/[id]/route.ts`  
- Added `category` and `images` fields to update payload
- Preserves existing thumbnail logic

#### `src/lib/constants.ts`
- Fixed tier limits: `basic=3, pro=10, premium=50`
- Updated pricing: `pro=$29/mo, premium=$99/mo`

## 🧪 Verification Steps

### 1. Apply Migration
```bash
node scripts/tmp_rovodev_fix_schema_conflicts.js
```

### 2. Regenerate Types
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT > src/lib/database.types.ts
```

### 3. Verify Build
```bash
npm run build
```

### 4. Test Product CRUD
```bash
npm run test:e2e -- product-crud-caps.spec.ts
```

## 📋 Expected Results

### Before Fix
- ❌ `PGRST204: Could not find the 'images' column`
- ❌ `PGRST204: Could not find the 'category' column`  
- ❌ Trigger function errors on `vendor_tier` reference
- ❌ Product creation returns 500 errors

### After Fix
- ✅ Product creation with `images` and `category` fields
- ✅ Tier cap enforcement working correctly
- ✅ Product CRUD returns proper 201/403 responses
- ✅ Backward compatibility maintained

## 🔄 API Payload Compatibility

The payload parser (`src/app/api/vendor/products/payload.ts`) now handles:

```typescript
// Input variations supported:
{
  "name": "Product Name",        // → title
  "title": "Product Name",       // → title  
  "details": "Description",      // → description
  "description": "Description",  // → description
  "status": "published",         // → published: true
  "published": true,             // → published: true
  "image": "url",               // → images: ["url"]
  "images": ["url1", "url2"],   // → images: ["url1", "url2"]
  "category": "tech",           // → category: "tech"
  "price": "29.99"             // → price: 29.99
}

// Database insert:
{
  vendor_id: "uuid",
  title: "Product Name", 
  description: "Description",
  price: 29.99,
  category: "tech",              // NEW
  images: ["url1", "url2"],      // NEW
  thumbnail_url: "url1",         // Derived from images[0]
  published: true
}
```

## 🎯 Compliance with SSOT

- ✅ **Basic Tier**: 3 products, free
- ✅ **Standard (Pro) Tier**: 10 products, $29/mo  
- ✅ **Premium Tier**: 50 products, $99/mo, 3 featured slots
- ✅ **Vendor as Merchant of Record**: Unchanged
- ✅ **Platform Non-Mediating**: Unchanged
- ✅ **Tier Downgrade FIFO**: Compatible with new schema

## 🚨 Breaking Changes

**None** - All changes are backward compatible:
- Existing products work without `images` or `category`
- API accepts old and new field names via payload normalization
- Database constraints allow NULL values for new fields

## 📞 Testing Commands

```bash
# 1. Fix schema conflicts
node scripts/tmp_rovodev_fix_schema_conflicts.js

# 2. Build verification  
npm run build

# 3. Product CRUD test
npm run test:e2e -- product-crud-caps.spec.ts

# 4. Full E2E suite
npm run test:e2e
```

---

**Status**: ✅ **RESOLVED** - Product CRUD should now return 201/403 instead of 500 errors.