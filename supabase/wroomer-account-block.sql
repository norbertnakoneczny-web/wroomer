-- WROOMER.PL: projekt blokowania kont (NIE URUCHAMIAĆ bez zgody).
-- Test i produkcja używają tej samej bazy Supabase.
-- Blokada ogranicza zapis ogłoszeń; NIE blokuje samego logowania Supabase Auth.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;

-- Sprawdzenie blokady omija RLS profili, ale nie ujawnia danych profilu.
CREATE OR REPLACE FUNCTION public.wroomer_account_can_post()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_blocked = false
    );
$$;
REVOKE ALL ON FUNCTION public.wroomer_account_can_post() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.wroomer_account_can_post() TO authenticated;

-- RESTRICTIVE: nie da się ominąć blokady przez inne permissive policies.
-- Istniejące permissive policies nadal muszą przyznawać prawo INSERT/UPDATE.
DROP POLICY IF EXISTS "Wroomer block posting" ON public.ogloszenia;
CREATE POLICY "Wroomer block posting" ON public.ogloszenia
AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (public.wroomer_account_can_post());

DROP POLICY IF EXISTS "Wroomer block editing" ON public.ogloszenia;
CREATE POLICY "Wroomer block editing" ON public.ogloszenia
AS RESTRICTIVE FOR UPDATE TO authenticated
USING (public.wroomer_account_can_post())
WITH CHECK (public.wroomer_account_can_post());

-- Zmiana blokady: tylko właściciel, nie może zablokować siebie.
CREATE OR REPLACE FUNCTION public.wroomer_set_account_block(target_id uuid, blocked boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM 'a3f908b0-71dc-4c55-8f76-79294e167159'::uuid
     OR NOT public.is_wroomer_admin() THEN
    RAISE EXCEPTION 'Brak uprawnień';
  END IF;
  IF target_id IS NULL OR target_id = auth.uid() OR blocked IS NULL THEN
    RAISE EXCEPTION 'Niedozwolona operacja';
  END IF;
  UPDATE public.profiles SET is_blocked = blocked WHERE id = target_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nie znaleziono użytkownika';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.wroomer_set_account_block(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.wroomer_set_account_block(uuid, boolean) TO authenticated;

-- UWAGA: dla pełnej blokady trzeba osobno zabezpieczyć inne zapisy,
-- Storage, ewentualne RPC i logowanie w Supabase Auth.
