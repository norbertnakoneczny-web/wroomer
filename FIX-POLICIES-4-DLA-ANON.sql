
-- USUŃ WSZYSTKIE STARE POLITYKI I STWÓRZ 4 POPRAWNE NA 100%
DROP POLICY IF EXISTS "public read" ON storage.objects;
DROP POLICY IF EXISTS "public insert" ON storage.objects;
DROP POLICY IF EXISTS "public update" ON storage.objects;
DROP POLICY IF EXISTS "public delete" ON storage.objects;
DROP POLICY IF EXISTS "public read all" ON storage.objects;
DROP POLICY IF EXISTS "public insert all" ON storage.objects;
DROP POLICY IF EXISTS "public update all" ON storage.objects;
DROP POLICY IF EXISTS "public delete all" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- TERAZ UTWÓRZ 4 NOWE - DLA ANON I AUTHENTICATED
CREATE POLICY "public read og" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id='ogloszenia');
CREATE POLICY "public insert og" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id='ogloszenia');
CREATE POLICY "public update og" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id='ogloszenia') WITH CHECK (bucket_id='ogloszenia');
CREATE POLICY "public delete og" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id='ogloszenia');

UPDATE storage.buckets SET public=true WHERE id='ogloszenia';
NOTIFY pgrst, 'reload schema';

-- SPRAWDŹ
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename='objects' AND policyname LIKE '%og%';
SELECT id, name, public FROM storage.buckets WHERE id='ogloszenia';
