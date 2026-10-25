-- WROOMER.PL — diagnostyka PRZED aktywacją blokad (TYLKO ODCZYT)
-- Wspólna baza test/produkcja. To zapytanie niczego nie zmienia.
SELECT 'ogloszenia' AS obiekt, policyname, cmd, permissive, roles::text AS role,
       qual::text AS warunek, with_check::text AS warunek_zapisu
FROM pg_policies
WHERE schemaname='public' AND tablename='ogloszenia'
ORDER BY cmd, policyname;

-- Osobno sprawdź, czy RLS jest włączony na obu tabelach:
SELECT relname AS tabela, relrowsecurity AS rls_wlaczone,
       relforcerowsecurity AS rls_wymuszone
FROM pg_class
WHERE oid IN ('public.ogloszenia'::regclass, 'public.profiles'::regclass)
ORDER BY relname;

-- Ustal kolumny identyfikujące właściciela ogłoszenia:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema='public' AND table_name='ogloszenia'
AND column_name IN ('user_id','id','created_at')
ORDER BY column_name;
