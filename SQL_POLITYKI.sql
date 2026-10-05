
-- WROOMER - tylko właściciel może edytować swoje
-- Uruchom to w SQL Editor w projekcie bdpydgsfowtuvjnkyeeg

alter table listings add column if not exists user_id uuid references auth.users(id);
alter table listings add column if not exists user_email text;

-- Wyczyść stare polityki
drop policy if exists "public read" on listings;
drop policy if exists "public insert" on listings;
drop policy if exists "public delete" on listings;
drop policy if exists "public read img" on listing_images;
drop policy if exists "public insert img" on listing_images;
drop policy if exists "public delete img" on listing_images;
drop policy if exists "allow all" on listings;
drop policy if exists "allow all images" on listing_images;

-- NOWE POLITYKI
-- Każdy może czytać
create policy "public read" on listings for select using (true);
create policy "public read img" on listing_images for select using (true);

-- Tylko zalogowany może dodać, ale user_id musi być jego
create policy "auth insert own" on listings for insert to authenticated with check (auth.uid() = user_id);
create policy "auth insert img" on listing_images for insert to authenticated with check (true);

-- Tylko właściciel może edytować / usuwać swoje
create policy "owner update" on listings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner delete" on listings for delete to authenticated using (auth.uid() = user_id);
create policy "owner delete img" on listing_images for delete to authenticated using (
  exists (select 1 from listings where listings.id = listing_images.listing_id and listings.user_id = auth.uid())
);

-- Pozwól starym anonimowym testom jeszcze działać na chwilę (usuń potem)
create policy "anon insert for migration" on listings for insert to anon with check (true);
create policy "anon delete old" on listings for delete to anon using (user_id is null);
