
-- KROK 1: NAPRAW BUCKET - 4 POLITYKI
DROP POLICY IF EXISTS "public read storage" ON storage.objects;
DROP POLICY IF EXISTS "public upload storage" ON storage.objects;
DROP POLICY IF EXISTS "public update storage" ON storage.objects;
DROP POLICY IF EXISTS "public delete storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "public read all" ON storage.objects;
DROP POLICY IF EXISTS "public insert all" ON storage.objects;

CREATE POLICY "public read" ON storage.objects FOR SELECT USING (bucket_id='ogloszenia');
CREATE POLICY "public insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id='ogloszenia');
CREATE POLICY "public update" ON storage.objects FOR UPDATE USING (bucket_id='ogloszenia');
CREATE POLICY "public delete" ON storage.objects FOR DELETE USING (bucket_id='ogloszenia');
UPDATE storage.buckets SET public=true WHERE id='ogloszenia';
NOTIFY pgrst, 'reload schema';
