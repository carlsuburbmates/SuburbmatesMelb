-- Migration: Create featured_slot_reminders table for idempotency and audit
-- Windows: 7 days and 2 days

CREATE TABLE IF NOT EXISTS public.featured_slot_reminders (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    featured_slot_id uuid NOT NULL REFERENCES public.featured_slots(id) ON DELETE CASCADE,
    vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    reminder_window integer NOT NULL, -- e.g., 7 or 2
    status text NOT NULL DEFAULT 'sent', -- 'sent', 'failed'
    sent_at timestamp with time zone NOT NULL DEFAULT now(),
    error text,
    
    -- Ensure idempotency: only one reminder per slot per window
    CONSTRAINT unique_slot_window UNIQUE (featured_slot_id, reminder_window)
);

-- Enable RLS
ALTER TABLE public.featured_slot_reminders ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role can manage reminders" ON public.featured_slot_reminders
    USING (auth.role() = 'service_role');

-- Vendors can view their own reminders for transparency
CREATE POLICY "Vendors can view their own reminders" ON public.featured_slot_reminders
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM public.vendors WHERE id = vendor_id));

COMMENT ON TABLE public.featured_slot_reminders IS 'Audit trail and idempotency guard for featured slot expiry reminders.';
