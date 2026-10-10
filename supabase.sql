
-- WROOMER.PL - SUPABASE SQL - WSZYSTKO NIEZBEDNE
-- Uruchom w Supabase SQL Editor

-- 1. Tabela ogloszenia
CREATE TABLE IF NOT EXISTS public.ogloszenia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  title text,
  marka text,
  brand text,
  model text,
  year int,
  mileage int,
  price int,
  cena int,
  location text,
  lokalizacja text,
  fuel text,
  paliwo text,
  gear text,
  skrzynia text,
  phone text,
  telefon text,
  description text,
  opis text,
  images jsonb DEFAULT '[]'::jsonb,
  zdjecia jsonb,
  lat text,
  latitude text,
  lng text,
  longitude text,
  views int DEFAULT 0,
  is_banned boolean DEFAULT false,
  banned_reason text,
  banned_at timestamp,
  user_id uuid
);

-- 2. Tabela views (opcjonalnie)
CREATE TABLE IF NOT EXISTS public.ogloszenia_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ogloszenie_id uuid REFERENCES public.ogloszenia(id) ON DELETE CASCADE,
  viewed_at timestamp DEFAULT now(),
  ip text
);

-- 3. RLS - WLACZ PUBLIC READ (to naprawia blad "Baza blokuje RLS")
ALTER TABLE public.ogloszenia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON public.ogloszenia;
CREATE POLICY "public read" ON public.ogloszenia FOR SELECT USING (true);
DROP POLICY IF EXISTS "public insert" ON public.ogloszenia;
CREATE POLICY "public insert" ON public.ogloszenia FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "public update" ON public.ogloszenia;
CREATE POLICY "public update" ON public.ogloszenia FOR UPDATE USING (true);
DROP POLICY IF EXISTS "public delete" ON public.ogloszenia;
CREATE POLICY "public delete" ON public.ogloszenia FOR DELETE USING (true);

-- 4. Storage dla zdjec (bucket 'ogloszenia')
-- Utworz w Storage > New Bucket > public, potem:
-- INSERT INTO storage.buckets (id,name,public) VALUES ('ogloszenia','ogloszenia',true) ON CONFLICT DO NOTHING;
-- Polityki storage:
-- CREATE POLICY "public read storage" ON storage.objects FOR SELECT USING (bucket_id='ogloszenia');
-- CREATE POLICY "public upload storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id='ogloszenia');
-- CREATE POLICY "public update storage" ON storage.objects FOR UPDATE USING (bucket_id='ogloszenia');
-- CREATE POLICY "public delete storage" ON storage.objects FOR DELETE USING (bucket_id='ogloszenia');
