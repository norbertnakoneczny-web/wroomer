-- WROOMER.PL - SUPABASE SQL - WSZYSTKO NIEZBEDNE
CREATE TABLE IF NOT EXISTS public.ogloszenia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  title text, marka text, brand text, model text, year int, mileage int, price int, cena int,
  location text, lokalizacja text, fuel text, paliwo text, gear text, skrzynia text,
  phone text, telefon text, description text, opis text,
  images jsonb DEFAULT '[]'::jsonb, zdjecia jsonb,
  lat text, latitude text, lng text, longitude text,
  views int DEFAULT 0, is_banned boolean DEFAULT false,
  owner_email text, user_id uuid
);

ALTER TABLE public.ogloszenia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON public.ogloszenia;
CREATE POLICY "public read" ON public.ogloszenia FOR SELECT USING (true);
DROP POLICY IF EXISTS "public insert" ON public.ogloszenia;
CREATE POLICY "public insert" ON public.ogloszenia FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "public update" ON public.ogloszenia;
CREATE POLICY "public update" ON public.ogloszenia FOR UPDATE USING (true);
DROP POLICY IF EXISTS "public delete" ON public.ogloszenia;
CREATE POLICY "public delete" ON public.ogloszenia FOR DELETE USING (true);

-- Storage bucket ogloszenia
INSERT INTO storage.buckets (id,name,public) VALUES ('ogloszenia','ogloszenia',true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public read storage" ON storage.objects;
CREATE POLICY "public read storage" ON storage.objects FOR SELECT USING (bucket_id='ogloszenia');
DROP POLICY IF EXISTS "public upload storage" ON storage.objects;
CREATE POLICY "public upload storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id='ogloszenia');
DROP POLICY IF EXISTS "public update storage" ON storage.objects;
CREATE POLICY "public update storage" ON storage.objects FOR UPDATE USING (bucket_id='ogloszenia');
DROP POLICY IF EXISTS "public delete storage" ON storage.objects;
CREATE POLICY "public delete storage" ON storage.objects FOR DELETE USING (bucket_id='ogloszenia');
