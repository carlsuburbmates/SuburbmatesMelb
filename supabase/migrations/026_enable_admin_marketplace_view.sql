-- Migration: 026_enable_admin_marketplace_view.sql
-- Goal: Fix the RLS policy for admins on marketplace_sales (missed in 025 due to column mismatch)

-- Previous attempt in 025 tried to check 'role' column which does not exist.
-- The correct column in public.users is 'user_type'.

create policy "Admins can view all marketplace sales"
    on public.marketplace_sales
    for select
    using (
        exists (
            select 1 from public.users 
            where id = auth.uid() 
            and user_type = 'admin'
        )
    );
