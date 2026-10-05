
-- DODAJ GPS I LOKALIZACJĘ
alter table listings add column if not exists lat double precision;
alter table listings add column if not exists lng double precision;
alter table listings add column if not exists full_address text;
alter table listings add column if not exists city text;

-- indeks dla wyszukiwania geo
create index if not exists idx_listings_lat_lng on listings (lat, lng);
create index if not exists idx_listings_city on listings (city);
