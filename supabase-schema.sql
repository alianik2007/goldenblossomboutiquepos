create table if not exists public.gbb_shared_data (
  id smallint primary key default 1 check (id = 1),
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.gbb_shared_data enable row level security;

-- Enable Supabase Realtime so all connected devices update in real-time
alter publication supabase_realtime add table public.gbb_shared_data;

-- ==============================================================================
-- OPTION A: DIRECT DEVICE SYNC (RECOMMENDED for Store Tablets, Phones & PCs)
-- Allows any boutique device with the Supabase URL & Anon Key to sync products,
-- stock, and sales automatically without needing email logins on each cashier.
-- ==============================================================================
grant select, insert, update on public.gbb_shared_data to anon, authenticated;

drop policy if exists "Allow boutique devices read and write" on public.gbb_shared_data;
create policy "Allow boutique devices read and write"
  on public.gbb_shared_data
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- ==============================================================================
-- OPTION B: STRICT STAFF EMAIL LOGIN (Optional)
-- If you prefer strict staff email logins instead of Direct Sync, comment out
-- Option A above and uncomment the policies below:
-- ==============================================================================
-- drop policy if exists "Authenticated staff can read boutique data" on public.gbb_shared_data;
-- create policy "Authenticated staff can read boutique data"
--   on public.gbb_shared_data for select to authenticated using (true);
--
-- drop policy if exists "Owners and managers can initialize boutique data" on public.gbb_shared_data;
-- create policy "Owners and managers can initialize boutique data"
--   on public.gbb_shared_data for insert to authenticated
--   with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('owner', 'manager'));
--
-- drop policy if exists "Owners and managers can update boutique data" on public.gbb_shared_data;
-- create policy "Owners and managers can update boutique data"
--   on public.gbb_shared_data for update to authenticated
--   using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('owner', 'manager'))
--   with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('owner', 'manager'));