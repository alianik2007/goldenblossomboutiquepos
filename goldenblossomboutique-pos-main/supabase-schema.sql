-- =========================================================================
-- GOLDEN BLOSSOM BOUTIQUE - POS & INVENTORY CLOUD DATABASE SCHEMA
-- Paste this into Supabase SQL Editor and click RUN.
-- =========================================================================

-- 1. Create table for shared boutique catalog and sales
create table if not exists public.gbb_shared_data (
  id smallint primary key default 1 check (id = 1),
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.gbb_shared_data enable row level security;

-- 3. Grant access to anon and authenticated connections
grant select, insert, update on public.gbb_shared_data to anon, authenticated;

-- 4. Clean up any previous policies
drop policy if exists "Allow POS read access" on public.gbb_shared_data;
drop policy if exists "Allow POS upsert access" on public.gbb_shared_data;
drop policy if exists "Authenticated staff can read boutique data" on public.gbb_shared_data;
drop policy if exists "Owners and managers can initialize boutique data" on public.gbb_shared_data;
drop policy if exists "Owners and managers can update boutique data" on public.gbb_shared_data;

-- 5. Easy & Reliable Policy: Allows your POS (using project Anon Key) to sync seamlessly
create policy "Allow POS read access"
  on public.gbb_shared_data
  for select
  using (true);

create policy "Allow POS upsert access"
  on public.gbb_shared_data
  for all
  using (true)
  with check (true);
