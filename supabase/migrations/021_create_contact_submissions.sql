-- Create contact_submissions table
create table if not exists public.contact_submissions (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    name text not null,
    email text not null,
    subject text not null,
    message text not null,
    status text not null default 'new' check (status in ('new', 'open', 'resolved', 'closed')),
    metadata jsonb null,

    constraint contact_submissions_pkey primary key (id)
);

-- Enable RLS
alter table public.contact_submissions enable row level security;

-- Create policies
-- Only admins can view submissions
create policy "Admins can view all contact submissions"
    on public.contact_submissions
    for select
    using (auth.jwt() ->> 'role' = 'service_role' or exists (
        select 1 from public.users
        where users.id = auth.uid()
        and users.user_type = 'admin'
    ));

-- Anyone can insert (public contact form)
create policy "Anyone can insert contact submissions"
    on public.contact_submissions
    for insert
    with check (true);

-- Grant access
grant select, insert on public.contact_submissions to anon, authenticated, service_role;
