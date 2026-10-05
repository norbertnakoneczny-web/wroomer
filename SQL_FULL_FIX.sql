
-- WROOMER FULL - naprawa city + pola OTOMOTO/OLX
-- Uruchom w SQL Editor bdpydgsfowtuvjnkyeeg i kliknij RUN

-- GPS
alter table listings add column if not exists lat double precision;
alter table listings add column if not exists lng double precision;
alter table listings add column if not exists full_address text;
alter table listings add column if not exists city text;
alter table listings add column if not exists user_id uuid references auth.users(id);
alter table listings add column if not exists user_email text;

-- OTOMOTO POLA
alter table listings add column if not exists brand text;
alter table listings add column if not exists model text;
alter table listings add column if not exists year int;
alter table listings add column if not exists mileage int;
alter table listings add column if not exists fuel_type text;
alter table listings add column if not exists transmission text;
alter table listings add column if not exists body_type text;
alter table listings add column if not exists engine_capacity int;
alter table listings add column if not exists power int;
alter table listings add column if not exists color text;
alter table listings add column if not exists vin text;
alter table listings add column if not exists condition text default 'Używany';

-- Indeksy
create index if not exists idx_listings_brand on listings (brand);
create index if not exists idx_listings_model on listings (model);
create index if not exists idx_listings_year on listings (year);
create index if not exists idx_listings_city on listings (city);
create index if not exists idx_listings_lat_lng on listings (lat,lng);

-- Odśwież cache PostgREST (naprawia błąd 'city' column)
NOTIFY pgrst, 'reload schema';
