
-- Wklej to w Supabase > SQL Editor

-- 1. Funkcja do bezpiecznego liczenia wyświetleń (omija RLS)
create or replace function increment_view(ad_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update ogloszenia set views = coalesce(views,0) + 1 where id = ad_id;
end;
$$;

-- 2. Pozwól każdemu wywołać tę funkcję
grant execute on function increment_view(uuid) to anon, authenticated;

-- 3. Upewnij się że masz policy na SELECT
drop policy if exists "public can read ogloszenia" on ogloszenia;
create policy "public can read ogloszenia" on ogloszenia for select using (true);

-- 4. (opcjonalnie) włącz RLS jeśli wyłączone
-- alter table ogloszenia enable row level security;
