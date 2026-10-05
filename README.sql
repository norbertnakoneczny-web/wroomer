-- WROOMER.PL - SCHEMAT SUPABASE - URUCHOM W SQL EDITOR

-- 1. Tabela ustawien
create table if not exists settings (
  id bigint generated always as identity primary key,
  site_title text default 'WROOMER.PL - Najszybsze ogłoszenia',
  contact_email text default 'kontakt@wroomer.pl',
  created_at timestamp default now()
);
insert into settings (site_title) values ('WROOMER.PL - Najszybsze ogłoszenia') on conflict do nothing;

-- 2. Tabela ogłoszeń - bez zdjęć!
create table if not exists listings (
  id bigint generated always as identity primary key,
  title text not null,
  price int not null,
  description text,
  location text,
  user_id uuid references auth.users(id),
  user_email text,
  created_at timestamp default now()
);

-- 3. Tabela zdjęć OSOBNO - klucz do szybkości!
create table if not exists listing_images (
  id bigint generated always as identity primary key,
  listing_id bigint references listings(id) on delete cascade,
  image_url text not null,
  position int default 0,
  created_at timestamp default now()
);

-- 4. Blog - naprawia przycisk Czytaj artykuł
create table if not exists blogs (
  id bigint generated always as identity primary key,
  title text not null,
  excerpt text,
  content text,
  image_url text,
  created_at timestamp default now()
);

-- 5. Bucket na zdjęcia
insert into storage.buckets (id, name, public) values ('ogloszenia','ogloszenia', true) on conflict (id) do nothing;

-- 6. Polityki RLS - OTWÓRZ NA START (potem zabezpieczysz)
alter table listings enable row level security;
alter table listing_images enable row level security;
alter table settings enable row level security;
alter table blogs enable row level security;

drop policy if exists "public read" on listings;
create policy "public read" on listings for select using (true);
drop policy if exists "auth insert" on listings;
create policy "auth insert" on listings for insert with check (auth.role()='authenticated');
drop policy if exists "public read images" on listing_images;
create policy "public read images" on listing_images for select using (true);
drop policy if exists "auth insert images" on listing_images;
create policy "auth insert images" on listing_images for insert with check (auth.role()='authenticated');
drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);
drop policy if exists "public read blogs" on blogs;
create policy "public read blogs" on blogs for select using (true);

-- Storage policy
drop policy if exists "public read storage" on storage.objects;
create policy "public read storage" on storage.objects for select using (bucket_id='ogloszenia');
drop policy if exists "auth upload storage" on storage.objects;
create policy "auth upload storage" on storage.objects for insert with check (bucket_id='ogloszenia' and auth.role()='authenticated');

-- Przykładowe dane
insert into blogs (title, excerpt, content, image_url) values
('Jak przygotować auto do sprzedaży?', '5 trików które podniosą cenę o 15%', '<p>Umyj, posprzątaj, zrób zdjęcia w dzień, opisz historię. Strona jest teraz responsywna - grid 2 kolumny na mobile, lazy loading zdjęć z listing_images.</p>', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800'),
('Czy warto kupić diesla w 2026?', 'Analiza kosztów paliwa', '<p>Diesel nadal się opłaca powyżej 20k km rocznie. Ustawienia pobierane z tabeli settings.</p>', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800')
on conflict do nothing;
