-- Suburbmates V1.1 Initial Database Schema
-- Based on v1.1-docs/03_ARCHITECTURE/03.0_TECHNICAL_OVERVIEW.md requirements

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create LGAs table (Local Government Areas)
CREATE TABLE lgas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    council_abbreviation VARCHAR(50),
    featured_slot_cap INTEGER DEFAULT 5,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Users table (extended from auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_type VARCHAR(20) CHECK (user_type IN ('customer', 'vendor', 'admin')) DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create Vendors table (extends users)
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(20) CHECK (tier IN ('none', 'basic', 'pro', 'suspended')) DEFAULT 'none',
    business_name VARCHAR(200),
    bio TEXT,
    primary_lga_id INTEGER REFERENCES lgas(id),
    secondary_lgas INTEGER[], -- Array of LGA IDs
    logo_url VARCHAR(500),
    profile_color_hex VARCHAR(7),
    profile_url VARCHAR(100) UNIQUE, -- Custom profile URL slug
    abn_verified BOOLEAN DEFAULT FALSE,
    abn VARCHAR(11),
    abn_verified_at TIMESTAMPTZ,
    product_count INTEGER DEFAULT 0,
    storage_used_mb DECIMAL(5,2) DEFAULT 0,
    stripe_account_id VARCHAR(255), -- Stripe Connect account ID
    pro_subscription_id VARCHAR(255), -- Stripe subscription for Pro tier
    pro_subscribed_at TIMESTAMPTZ,
    pro_cancelled_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    inactivity_flagged_at TIMESTAMPTZ,
    suspension_reason TEXT,
    suspended_at TIMESTAMPTZ,
    can_appeal BOOLEAN DEFAULT FALSE,
    payment_reversal_count INTEGER DEFAULT 0,
    payment_reversal_window_start TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id INTEGER REFERENCES categories(id),
    delivery_type VARCHAR(20) CHECK (delivery_type IN ('download', 'license_key', 'service_booking')),
    file_type VARCHAR(50),
    file_url VARCHAR(500),
    file_size_mb DECIMAL(5,2),
    thumbnail_url VARCHAR(500),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create Featured Slots table
CREATE TABLE featured_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    lga_id INTEGER REFERENCES lgas(id),
    category_id INTEGER REFERENCES categories(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
    stripe_payment_intent_id VARCHAR(255),
    charged_amount_cents INTEGER NOT NULL, -- Amount in cents
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lga_id, category_id, start_date, end_date) -- Prevent double-booking
);

-- Create Featured Queue table
CREATE TABLE featured_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    lga_id INTEGER REFERENCES lgas(id),
    category_id INTEGER REFERENCES categories(id),
    position INTEGER,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    notified_at TIMESTAMPTZ,
    payment_deadline TIMESTAMPTZ,
    status VARCHAR(20) CHECK (status IN ('waiting', 'invited', 'paid', 'declined', 'expired')) DEFAULT 'waiting',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vendor_id, lga_id, category_id) -- One position per vendor per LGA per category
);

-- Create Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id),
    vendor_id UUID REFERENCES vendors(id),
    product_id UUID REFERENCES products(id),
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    commission_cents INTEGER DEFAULT 0, -- Calculated: amount * tier_commission_rate / 100
    vendor_net_cents INTEGER NOT NULL, -- amount - commission
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('pending', 'succeeded', 'failed', 'reversed')) DEFAULT 'pending',
    download_url VARCHAR(500), -- From product file_url
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Refund Requests table
CREATE TABLE refund_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id),
    customer_id UUID REFERENCES users(id),
    reason TEXT NOT NULL,
    description TEXT,
    amount_cents INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'pending',
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejected_reason TEXT,
    stripe_refund_id VARCHAR(255),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Disputes table
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    refund_request_id UUID REFERENCES refund_requests(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    vendor_id UUID REFERENCES vendors(id),
    customer_id UUID REFERENCES users(id),
    admin_id UUID REFERENCES users(id),
    status VARCHAR(20) CHECK (status IN ('open', 'under_review', 'resolved', 'cancelled')) DEFAULT 'open',
    resolution_type VARCHAR(30) CHECK (resolution_type IN ('buyer_refund', 'vendor_keeps', 'split')) DEFAULT 'under_review',
    resolution_notes TEXT,
    evidence_customer JSONB, -- Evidence from customer
    evidence_vendor JSONB, -- Evidence from vendor
    decision_by_admin UUID REFERENCES users(id),
    decision_notes TEXT,
    decision_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Transactions Log table
CREATE TABLE transactions_log (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('tier_upgrade', 'featured_purchase', 'commission_deducted', 'vendor_transfer', 'support_adjustment', 'refund_processed', 'dispute_resolution')),
    vendor_id UUID REFERENCES vendors(id),
    amount_cents INTEGER NOT NULL,
    reason TEXT,
    stripe_reference VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for performance
CREATE INDEX idx_vendors_tier ON vendors(tier);
CREATE INDEX idx_vendors_primary_lga ON vendors(primary_lga_id);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_featured_slots_lga ON featured_slots(lga_id);
CREATE INDEX idx_featured_slots_status ON featured_slots(status);
CREATE INDEX idx_featured_queue_lga_position ON featured_queue(lga_id, position);
CREATE INDEX idx_featured_queue_joined_at ON featured_queue(joined_at);
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_published ON products(published);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_refund_requests_order ON refund_requests(order_id);
CREATE INDEX idx_refund_requests_status ON refund_requests(status);
CREATE INDEX idx_disputes_vendor ON disputes(vendor_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- Insert default LGAs for Melbourne (from v1.1-docs/08_REFERENCE_MATERIALS/08.0_MELBOURNE_SUBURBS_REFERENCE.md)
INSERT INTO lgas (name, council_abbreviation, featured_slot_cap) VALUES
('Banyule', 'BANYULE', 5),
('Bayside', 'BAYSIDE', 5),
('Boroondara', 'BOROONDARA', 5),
('Brimbank', 'BRIMBANK', 5),
('Casey', 'CASEY', 5),
('Darebin', 'DAREBIN', 5),
('Frankston', 'FRANKSTON', 5),
('Glen Eira', 'GLEN EIRA', 5),
('Greater Dandenong', 'GREATER DANDENONG', 5),
('Hobsons Bay', 'HOBSONS BAY', 5),
('Hume', 'HUME', 5),
('Kingston', 'KINGSTON', 5),
('Knox', 'KNOX', 5),
('Manningham', 'MANNINGHAM', 5),
('Maribyrnong', 'MARIBYRNONG', 5),
('Maroondah', 'MAROONDAH', 5),
('Melbourne', 'MELBOURNE', 5),
('Melton', 'MELTON', 5),
('Monash', 'MONASH', 5),
('Moonee Valley', 'MOONEE VALLEY', 5),
('Moreland', 'MORELAND', 5),
('Mornington Peninsula', 'MORNINGTON PENINSULA', 5),
('Nillumbik', 'NILLUMBIK', 5),
('Port Phillip', 'PORT PHILLIP', 5),
('Stonnington', 'STONNINGTON', 5),
('Whitehorse', 'WHITEhorse', 5),
('Whittlesea', 'WHITTLESEA', 5),
('Wyndham', 'WYNDHAM', 5),
('Yarra', 'YARRA', 5),
('Yarra Ranges', 'YARRA RANGES', 5)
ON CONFLICT (name) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Digital Downloads', 'digital-downloads', 'Digital products and downloads'),
('Software', 'software', 'Applications and software tools'),
('Templates', 'templates', 'Design and document templates'),
('Courses', 'courses', 'Online courses and education'),
('Services', 'services', 'Professional services'),
('Consulting', 'consulting', 'Business and personal consulting'),
('Creative', 'creative', 'Art, music, and creative services'),
('Events', 'events', 'Workshops and events')
ON CONFLICT (slug) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_refund_requests_updated_at BEFORE UPDATE ON refund_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();