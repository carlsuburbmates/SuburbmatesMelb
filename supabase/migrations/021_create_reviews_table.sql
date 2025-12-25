-- Create Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying reviews by business
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);

-- Add RLS policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read reviews
CREATE POLICY "Public reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Authenticated users can insert reviews
CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = customer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = customer_id);

-- Trigger to update updated_at
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
