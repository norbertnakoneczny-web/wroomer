-- WROOMER.PL - PROFESJONALNY SYSTEM RÓL + RLS
-- Uruchom to w Supabase > SQL Editor

-- 1. PROFILES (role)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text check (role in ('admin','moderator','user')) default 'user',
  created_at timestamptz default now()
);

-- 2. LISTINGS (ogłoszenia)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) not null,
  title text not null,
  brand text not null,
  model text not null,
  price int not null,
  year int,
  mileage int,
  fuel text,
  location text,
  status text check (status in ('pending','active','rejected','sold')) default 'pending',
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- 3. WŁĄCZ RLS
alter table public.profiles enable row level security;
alter table public.listings enable row level security;

-- 4. POLITYKI PROFILES
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write" on public.profiles
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin')));

-- 5. POLITYKI LISTINGS - KLUCZOWE
-- Każdy może czytać tylko active (public)
drop policy if exists "listings_public_read" on public.listings;
create policy "listings_public_read" on public.listings
  for select using (status = 'active' or owner_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','moderator')));

-- Właściciel może tworzyć
drop policy if exists "listings_owner_insert" on public.listings;
create policy "listings_owner_insert" on public.listings
  for insert with check (auth.uid() = owner_id);

-- Właściciel może edytować TYLKO SWOJE - admin wszystko
drop policy if exists "listings_owner_update" on public.listings;
create policy "listings_owner_update" on public.listings
  for update using (
    auth.uid() = owner_id 
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','moderator'))
  );

-- Właściciel może usuwać TYLKO SWOJE - admin wszystko
drop policy if exists "listings_owner_delete" on public.listings;
create policy "listings_owner_delete" on public.listings
  for delete using (
    auth.uid() = owner_id 
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 6. AUTO-TWORZENIE PROFILU PO REJESTRACJI
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. USTAW SIEBIE JAKO ADMINA (podmień email)
-- update public.profiles set role='admin' where email='TWOJ_EMAIL@gmail.com';
