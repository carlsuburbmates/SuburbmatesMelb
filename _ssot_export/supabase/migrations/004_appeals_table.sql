-- Suburbmates V1.1 - Appeals Table
-- Based on v1.1-docs/07_QUALITY_AND_LEGAL/07.1_LEGAL_COMPLIANCE_AND_DATA.md
-- Handles vendor appeals for suspensions and disputes

-- Appeals table for vendor suspension appeals
CREATE TABLE IF NOT EXISTS appeals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    appeal_type VARCHAR(50) NOT NULL CHECK (appeal_type IN ('suspension', 'dispute_resolution', 'policy_violation', 'account_restriction')),
    
    -- Reference to the original issue
    related_dispute_id UUID REFERENCES disputes(id) ON DELETE SET NULL,
    related_suspension_reason TEXT,
    
    -- Appeal details
    appeal_reason TEXT NOT NULL,
    evidence_urls TEXT[], -- Array of URLs to supporting documents
    vendor_statement TEXT,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'withdrawn')),
    
    -- Review details
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Admin who reviewed
    review_notes TEXT,
    review_decision TEXT,
    reviewed_at TIMESTAMPTZ,
    
    -- Timeline enforcement (14 days to appeal, 48h to review)
    appeal_deadline TIMESTAMPTZ NOT NULL,
    review_deadline TIMESTAMPTZ,
    
    -- Outcome
    outcome VARCHAR(20) CHECK (outcome IN ('suspension_overturned', 'suspension_upheld', 'partial_relief', 'no_action')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appeals

-- Vendors can view and create their own appeals
CREATE POLICY "Vendors can view own appeals" ON appeals
FOR SELECT USING (
    vendor_id IN (
        SELECT id FROM vendors WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Vendors can create own appeals" ON appeals
FOR INSERT WITH CHECK (
    vendor_id IN (
        SELECT id FROM vendors WHERE user_id = auth.uid()
    )
    AND status = 'pending'
    AND appeal_deadline > NOW()
);

-- Vendors can update their own pending appeals (e.g., withdraw)
CREATE POLICY "Vendors can update own pending appeals" ON appeals
FOR UPDATE USING (
    vendor_id IN (
        SELECT id FROM vendors WHERE user_id = auth.uid()
    )
    AND status = 'pending'
)
WITH CHECK (
    vendor_id IN (
        SELECT id FROM vendors WHERE user_id = auth.uid()
    )
);

-- Admins can view and manage all appeals
CREATE POLICY "Admins can view all appeals" ON appeals
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.user_type = 'admin'
    )
);

CREATE POLICY "Admins can update appeals" ON appeals
FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.user_type = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.user_type = 'admin'
    )
);

-- Indexes for performance
CREATE INDEX idx_appeals_vendor_id ON appeals(vendor_id);
CREATE INDEX idx_appeals_status ON appeals(status);
CREATE INDEX idx_appeals_reviewed_by ON appeals(reviewed_by);
CREATE INDEX idx_appeals_deadlines ON appeals(appeal_deadline, review_deadline);
CREATE INDEX idx_appeals_related_dispute ON appeals(related_dispute_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_appeals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_appeals_updated_at
BEFORE UPDATE ON appeals
FOR EACH ROW EXECUTE FUNCTION update_appeals_updated_at();

-- Trigger to set review_deadline when status changes to 'under_review'
CREATE OR REPLACE FUNCTION set_appeal_review_deadline()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'under_review' AND OLD.status = 'pending' THEN
        NEW.review_deadline = NOW() + INTERVAL '48 hours';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_appeal_review_deadline
BEFORE UPDATE ON appeals
FOR EACH ROW EXECUTE FUNCTION set_appeal_review_deadline();

-- Function to check if appeal is within deadline
CREATE OR REPLACE FUNCTION is_appeal_within_deadline(vendor_uuid UUID, suspension_date TIMESTAMPTZ)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN suspension_date + INTERVAL '14 days' > NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to auto-reject expired appeals (to be run by scheduled job)
CREATE OR REPLACE FUNCTION auto_reject_expired_appeals()
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    UPDATE appeals
    SET 
        status = 'rejected',
        outcome = 'no_action',
        review_notes = 'Automatically rejected due to expired appeal deadline',
        reviewed_at = NOW()
    WHERE 
        status = 'pending'
        AND appeal_deadline < NOW();
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql;

-- Add appeals to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE appeals;

-- Comments for documentation
COMMENT ON TABLE appeals IS 'Vendor appeals for suspensions, disputes, and policy violations';
COMMENT ON COLUMN appeals.appeal_type IS 'Type of appeal: suspension, dispute_resolution, policy_violation, account_restriction';
COMMENT ON COLUMN appeals.appeal_deadline IS 'Vendors have 14 days from suspension to appeal';
COMMENT ON COLUMN appeals.review_deadline IS 'Admins have 48 hours from under_review status to decide';
COMMENT ON COLUMN appeals.outcome IS 'Final decision: suspension_overturned, suspension_upheld, partial_relief, no_action';
