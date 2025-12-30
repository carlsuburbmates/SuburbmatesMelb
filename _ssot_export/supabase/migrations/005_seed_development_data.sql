-- Suburbmates V1.1 - Development Seed Data
-- WARNING: This seed data is for DEVELOPMENT ONLY
-- DO NOT run this in production

-- Seed LGAs (31 Melbourne Councils)
-- Based on v1.1-docs/08_REFERENCE_MATERIALS/08.0_MELBOURNE_SUBURBS_REFERENCE.md

INSERT INTO lgas (name, council_abbreviation, active) VALUES
    ('Banyule', 'BANYULE', true),
    ('Bayside', 'BAYSIDE', true),
    ('Boroondara', 'BOROONDARA', true),
    ('Brimbank', 'BRIMBANK', true),
    ('Cardinia', 'CARDINIA', true),
    ('Casey', 'CASEY', true),
    ('Darebin', 'DAREBIN', true),
    ('Frankston', 'FRANKSTON', true),
    ('Glen Eira', 'GLEN EIRA', true),
    ('Greater Dandenong', 'GREATER DANDENONG', true),
    ('Hobsons Bay', 'HOBSONS BAY', true),
    ('Hume', 'HUME', true),
    ('Kingston', 'KINGSTON', true),
    ('Knox', 'KNOX', true),
    ('Manningham', 'MANNINGHAM', true),
    ('Maribyrnong', 'MARIBYRNONG', true),
    ('Maroondah', 'MAROONDAH', true),
    ('Melbourne', 'MELBOURNE', true),
    ('Melton', 'MELTON', true),
    ('Monash', 'MONASH', true),
    ('Moonee Valley', 'MOONEE VALLEY', true),
    ('Moreland', 'MORELAND', true),
    ('Mornington Peninsula', 'MORNINGTON PENINSULA', true),
    ('Nillumbik', 'NILLUMBIK', true),
    ('Port Phillip', 'PORT PHILLIP', true),
    ('Stonnington', 'STONNINGTON', true),
    ('Whitehorse', 'WHITEHORSE', true),
    ('Whittlesea', 'WHITTLESEA', true),
    ('Wyndham', 'WYNDHAM', true),
    ('Yarra', 'YARRA', true),
    ('Yarra Ranges', 'YARRA RANGES', true)
ON CONFLICT (name) DO NOTHING;

-- Seed Categories (Digital Product Categories)
-- Based on marketplace requirements

INSERT INTO categories (name, slug, description, active) VALUES
    ('Guides & Ebooks', 'guides-ebooks', 'Digital guides, ebooks, and tutorials', true),
    ('Templates & Tools', 'templates-tools', 'Business templates, spreadsheets, and productivity tools', true),
    ('Courses & Training', 'courses-training', 'Online courses and training materials', true),
    ('Graphics & Design', 'graphics-design', 'Design assets, templates, and graphics', true),
    ('Software & Apps', 'software-apps', 'Digital software and applications', true),
    ('Music & Audio', 'music-audio', 'Music tracks, sound effects, and audio files', true),
    ('Photography', 'photography', 'Stock photos and digital photography', true),
    ('Business Services', 'business-services', 'Business consulting and digital services', true),
    ('Marketing Materials', 'marketing-materials', 'Marketing assets and promotional materials', true),
    ('Legal Documents', 'legal-documents', 'Legal templates and documents', true)
ON CONFLICT (slug) DO NOTHING;

-- Development Test Users
-- NOTE: Users MUST be created through Supabase Auth first
-- This section creates vendor and product records for testing
-- To use these, you need to:
-- 1. Create actual users via Supabase Auth Dashboard or signup API
-- 2. Replace the UUIDs below with real auth.users IDs
-- 3. Then run this migration

-- For now, we'll skip user creation and just document the structure

DO $$
DECLARE
    vendor_basic_uuid UUID;
    vendor_pro_uuid UUID;
    test_lga_id INTEGER;
    test_category_id INTEGER;
BEGIN
    -- Get a test LGA and category
    SELECT id INTO test_lga_id FROM lgas WHERE name = 'Melbourne' LIMIT 1;
    SELECT id INTO test_category_id FROM categories WHERE slug = 'guides-ebooks' LIMIT 1;

    -- Only create test vendors if we have valid user IDs
    -- (These would need to be real auth.users IDs in production)
    -- Commenting out for now since we need real auth users first
    
    -- Example of how to create test data once you have real auth users:
    /*
    INSERT INTO vendors (id, user_id, business_name, abn, tier, vendor_status, stripe_account_id, stripe_onboarding_complete, can_sell_products, product_quota, storage_quota_gb, commission_rate) VALUES
        (
            uuid_generate_v4(),
            'YOUR-REAL-AUTH-USER-ID-HERE',
            'Test Vendor Store',
            '12345678901',
            'basic',
            'active',
            'acct_test_123',
            true,
            true,
            10,
            5,
            0.08
        )
    ON CONFLICT DO NOTHING;
    */
    
    RAISE NOTICE 'Seed data loaded successfully. To add test users, create them via Supabase Auth first.';

END $$;

-- Comments
COMMENT ON TABLE lgas IS 'Seeded with 31 Melbourne councils for development';
COMMENT ON TABLE categories IS 'Seeded with 10 digital product categories';
