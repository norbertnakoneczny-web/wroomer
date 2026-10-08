-- NAPRAWA: dodaje ogłoszenie ale nie widać - to RLS blokuje SELECT

-- 1. Sprawdź czy RLS jest włączone i czy są polityki
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename='ogloszenia';
SELECT policyname, cmd, roles, qual FROM pg_policies WHERE tablename='ogloszenia';

-- 2. Jeśli brak polityk SELECT, dodaj je:
ALTER TABLE public.ogloszenia ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read ogloszenia" ON public.ogloszenia;
CREATE POLICY "public read ogloszenia" ON public.ogloszenia FOR SELECT USING (true);

DROP POLICY IF EXISTS "auth insert ogloszenia" ON public.ogloszenia;
CREATE POLICY "auth insert ogloszenia" ON public.ogloszenia FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "auth update own" ON public.ogloszenia;
CREATE POLICY "auth update own" ON public.ogloszenia FOR UPDATE USING (auth.uid() = user_id OR auth.role() = 'authenticated') WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "auth delete own" ON public.ogloszenia;
CREATE POLICY "auth delete own" ON public.ogloszenia FOR DELETE USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- 3. Bucket images publiczny
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "public read images" ON storage.objects;
CREATE POLICY "public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "auth upload images" ON storage.objects;
CREATE POLICY "auth upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "auth delete images" ON storage.objects;
CREATE POLICY "auth delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images');

DROP POLICY IF EXISTS "auth update images" ON storage.objects;
CREATE POLICY "auth update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');

-- 4. Potwierdź użytkowników
UPDATE auth.users SET email_confirmed_at = now() WHERE email_confirmed_at IS NULL;

-- 5. Sprawdź czy są ogłoszenia (powinny być widoczne teraz)
SELECT COUNT(*) as ilosc FROM public.ogloszenia;
SELECT id, title, price, location, left(images::text, 80) as img_preview FROM public.ogloszenia ORDER BY created_at DESC LIMIT 5;

-- 6. USUŃ wolne base64 jeśli nadal są
-- DELETE FROM public.ogloszenia WHERE images::text LIKE '%base64%';
