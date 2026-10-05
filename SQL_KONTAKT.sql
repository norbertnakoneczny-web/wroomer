
-- KONTAKT OLX STYLE
alter table listings add column if not exists phone text;

create table if not exists messages (
 id uuid primary key default gen_random_uuid(),
 listing_id uuid references listings(id) on delete cascade,
 from_user uuid,
 from_email text,
 to_email text,
 from_phone text,
 message text,
 created_at timestamptz default now()
);
alter table messages enable row level security;
drop policy if exists "public read messages" on messages;
drop policy if exists "auth insert messages" on messages;
create policy "public read messages" on messages for select using (true);
create policy "auth insert messages" on messages for insert to authenticated with check (true);
NOTIFY pgrst, 'reload schema';
