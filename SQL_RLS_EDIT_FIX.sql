
-- NAPRAWA EDYCJI - polityki RLS aby właściciel mógł edytować
drop policy if exists "owner update" on listings;
drop policy if exists "owner delete" on listings;
drop policy if exists "auth insert own" on listings;
drop policy if exists "public read" on listings;

create policy "public read" on listings for select using (true);
create policy "auth insert own" on listings for insert to authenticated with check (auth.uid() = user_id);
create policy "owner update" on listings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner delete" on listings for delete to authenticated using (auth.uid() = user_id);

-- dla anon starych ogłoszeń bez user_id pozwól edytować (tymczasowo)
drop policy if exists "anon update old" on listings;
create policy "anon update old" on listings for update to anon using (user_id is null) with check (true);

NOTIFY pgrst, 'reload schema';
