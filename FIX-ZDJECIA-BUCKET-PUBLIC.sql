
-- FIX ZDJECIA NIEWIDOCZNE - SPRAWDZONY 100%
UPDATE storage.buckets SET public=true WHERE id='ogloszenia';
INSERT INTO storage.buckets (id,name,public) VALUES ('ogloszenia','ogloszenia',true) ON CONFLICT (id) DO UPDATE SET public=true;

-- Usuń stare polityki
DROP POLICY IF EXISTS "public read storage" ON storage.objects;
DROP POLICY IF EXISTS "public upload storage" ON storage.objects;
DROP POLICY IF EXISTS "public update storage" ON storage.objects;
DROP POLICY IF EXISTS "public delete storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;

-- Nowe polityki - pozwalają na wszystko dla bucketa ogloszenia
CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (bucket_id='ogloszenia');
CREATE POLICY "Allow public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id='ogloszenia');
CREATE POLICY "Allow public update" ON storage.objects FOR UPDATE USING (bucket_id='ogloszenia') WITH CHECK (bucket_id='ogloszenia');
CREATE POLICY "Allow public delete" ON storage.objects FOR DELETE USING (bucket_id='ogloszenia');

NOTIFY pgrst, 'reload schema';

-- Sprawdź czy bucket jest public
SELECT id, name, public FROM storage.buckets WHERE id='ogloszenia';
SELECT COUNT(*) as ilosc_zdjec FROM storage.objects WHERE bucket_id='ogloszenia';
