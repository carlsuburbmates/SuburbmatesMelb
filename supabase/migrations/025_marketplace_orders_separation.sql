-- Migration: 025_marketplace_orders_separation.sql
-- Goal: Separate Platform Revenue (orders) from Creator Sales (marketplace_sales)
-- Context: PR10.y Payment Realignment (Model A)

-- 1. Create marketplace_sales table for Creator Product transactions (Direct Charges)
create table public.marketplace_sales (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    
    vendor_id uuid not null references public.vendors(id),
    product_id uuid not null references public.products(id),
    customer_id uuid references auth.users(id), -- Optional
    
    -- Transaction Identifiers
    stripe_session_id text not null,
    stripe_payment_intent_id text, -- nullable if not immediately available
    
    -- Financials
    amount_cents integer not null,
    platform_fee_cents integer not null,
    currency text not null default 'aud',
    
    status text not null default 'pending', -- pending, succeeded, failed
    metadata jsonb,

    constraint marketplace_sales_pkey primary key (id)
);

-- RLS for marketplace_sales
alter table public.marketplace_sales enable row level security;

-- Vendor can view their own sales
create policy "Vendors can view their own sales"
    on public.marketplace_sales
    for select
    using (vendor_id in (select id from public.vendors where user_id = auth.uid()));

-- Admin can view all
-- CORRECTED POLICY: Checks public.users for 'role' or assumes metadata check
-- Assuming we have a public.users table with something indicating admin?
-- If users table has no role column, we might need to check a different way.
-- SAFE FALLBACK: Check if user is in 'vendors' table to at least not error, 
-- but for ADMIN access we normally check `public.users.role`.
-- Let's check `public.users` schema first in next step. For now I will comment this out until verified.
/*
create policy "Admins can view all marketplace sales"
    on public.marketplace_sales
    for select
    using (
        exists (
            select 1 from public.users 
            where id = auth.uid() 
            and role = 'admin'
        )
    );
*/

comment on table public.orders is 'Platform Revenue Only (Subscriptions, Featured Slots). Creator Sales moved to marketplace_sales.';
