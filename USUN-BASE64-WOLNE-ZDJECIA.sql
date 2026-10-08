-- USUŃ WOLNE OGŁOSZENIA Z BASE64 - są bardzo wolne
-- Uruchom w Supabase SQL Editor

-- 1. Zobacz które ogłoszenia mają base64 (wolne)
SELECT id, title, left(images::text, 100) as preview FROM public.ogloszenia WHERE images::text LIKE '%base64%' OR zdjecia::text LIKE '%base64%';

-- 2. USUŃ tylko te z base64 (zostaw dobre z https://)
DELETE FROM public.ogloszenia WHERE images::text LIKE '%base64%' OR zdjecia::text LIKE '%base64%';

-- 3. Sprawdź czy zostało 0 ogłoszeń - wtedy możesz dodać nowe szybkie
SELECT COUNT(*) FROM public.ogloszenia;

-- 4. Upewnij się że bucket images jest publiczny
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Polityki Storage (jeśli masz błąd 42710 - najpierw DROP)
DROP POLICY IF EXISTS "public read images" ON storage.objects;
DROP POLICY IF EXISTS "auth upload images" ON storage.objects;
DROP POLICY IF EXISTS "auth delete images" ON storage.objects;
DROP POLICY IF EXISTS "auth update images" ON storage.objects;

CREATE POLICY "public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "auth upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "auth delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images');
CREATE POLICY "auth update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');

-- 6. Potwierdź użytkowników
UPDATE auth.users SET email_confirmed_at = now() WHERE email_confirmed_at IS NULL;

-- 7. Sprawdź bucket
SELECT id, name, public FROM storage.buckets WHERE id='images';
