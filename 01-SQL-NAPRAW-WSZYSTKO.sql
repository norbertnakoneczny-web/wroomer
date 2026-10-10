-- KOMPLETNY FIX - DODAJ WSZYSTKIE BRAKUJĄCE KOLUMNY
-- Wklej w Supabase SQL Editor -> Run

-- 1. Dodaj WSZYSTKIE kolumny jakich brakuje
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS marka text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS model text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS year int DEFAULT 0;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS rocznik int DEFAULT 0;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS mileage int DEFAULT 0;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS przebieg int DEFAULT 0;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS price int DEFAULT 0;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS cena int DEFAULT 0;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS lokalizacja text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS fuel text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS paliwo text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS gear text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS skrzynia text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS gearbox text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS telefon text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS opis text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS zdjecia jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS lat text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS lng text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS latitude text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS longitude text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS views int DEFAULT 0;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS owner_email text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS power text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS moc text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS capacity text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS pojemnosc text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS body text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS nadwozie text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS kolor text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS doors text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS drzwi text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS vin text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS first_reg text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS rejestracja text;

-- 2. Polityki RLS - pozwól na wszystko (public)
ALTER TABLE public.ogloszenia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON public.ogloszenia;
CREATE POLICY "public read" ON public.ogloszenia FOR SELECT USING (true);
DROP POLICY IF EXISTS "public insert" ON public.ogloszenia;
CREATE POLICY "public insert" ON public.ogloszenia FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "public update" ON public.ogloszenia;
CREATE POLICY "public update" ON public.ogloszenia FOR UPDATE USING (true);
DROP POLICY IF EXISTS "public delete" ON public.ogloszenia;
CREATE POLICY "public delete" ON public.ogloszenia FOR DELETE USING (true);

-- 3. Bucket na zdjęcia
INSERT INTO storage.buckets (id,name,public) VALUES ('ogloszenia','ogloszenia',true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public read storage" ON storage.objects;
CREATE POLICY "public read storage" ON storage.objects FOR SELECT USING (bucket_id='ogloszenia');
DROP POLICY IF EXISTS "public upload storage" ON storage.objects;
CREATE POLICY "public upload storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id='ogloszenia');
DROP POLICY IF EXISTS "public update storage" ON storage.objects;
CREATE POLICY "public update storage" ON storage.objects FOR UPDATE USING (bucket_id='ogloszenia');
DROP POLICY IF EXISTS "public delete storage" ON storage.objects;
CREATE POLICY "public delete storage" ON storage.objects FOR DELETE USING (bucket_id='ogloszenia');

-- 4. Odśwież cache
NOTIFY pgrst, 'reload schema';

-- 5. Sprawdź co masz
SELECT column_name, data_type FROM information_schema.columns WHERE table_name='ogloszenia' ORDER BY column_name;


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
