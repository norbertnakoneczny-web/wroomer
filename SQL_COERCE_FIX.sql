
-- FIX dla błędu "Cannot coerce the result to a single JSON object" przy edycji
-- Problem: stare ogłoszenia mają user_id = null, więc policy owner update blokuje zwrotkę

-- Pozwól aktualizować ogłoszenia bez user_id (stare) lub gdzie email się zgadza
drop policy if exists "owner update" on listings;
drop policy if exists "anon update old" on listings;
drop policy if exists "public read" on listings;

create policy "public read" on listings for select using (true);

create policy "owner update" on listings for update to authenticated 
using (auth.uid() = user_id OR user_id IS NULL OR user_email = auth.email())
with check (auth.uid() = user_id OR user_id IS NULL OR user_email = auth.email());

create policy "owner delete" on listings for delete to authenticated
using (auth.uid() = user_id OR user_id IS NULL OR user_email = auth.email());

create policy "auth insert own" on listings for insert to authenticated
with check (auth.uid() = user_id);

-- Napraw stare ogłoszenia: ustaw user_id na podstawie emaila anianakoneczny@icloud.com
-- Uruchom to raz:
-- update listings set user_id = (select id from auth.users where email = 'anianakoneczny@icloud.com' limit 1) where user_email = 'anianakoneczny@icloud.com' and user_id is null;

NOTIFY pgrst, 'reload schema';
