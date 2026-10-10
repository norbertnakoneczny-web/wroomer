
-- WROOMER - FINALNY SQL - URUCHOM TYLKO RAZ
-- Tabele
CREATE TABLE IF NOT EXISTS ogloszenia (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  marka text,
  model text,
  price numeric,
  cena numeric,
  location text,
  lokalizacja text,
  description text,
  opis text,
  fuel text,
  paliwo text,
  year int,
  rocznik int,
  mileage int,
  przebieg int,
  gear text,
  skrzynia text,
  power int,
  moc int,
  lat double precision,
  lng double precision,
  images jsonb DEFAULT '[]'::jsonb,
  zdjecia jsonb DEFAULT '[]'::jsonb,
  user_id text,
  is_banned boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

ALTER TABLE ogloszenia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read ogloszenia" ON ogloszenia;
DROP POLICY IF EXISTS "public insert ogloszenia" ON ogloszenia;
DROP POLICY IF EXISTS "public update ogloszenia" ON ogloszenia;
DROP POLICY IF EXISTS "public delete ogloszenia" ON ogloszenia;
CREATE POLICY "public read ogloszenia" ON ogloszenia FOR SELECT USING (true);
CREATE POLICY "public insert ogloszenia" ON ogloszenia FOR INSERT WITH CHECK (true);
CREATE POLICY "public update ogloszenia" ON ogloszenia FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public delete ogloszenia" ON ogloszenia FOR DELETE USING (true);

-- BUCKET
INSERT INTO storage.buckets (id,name,public) VALUES ('ogloszenia','ogloszenia',true) ON CONFLICT (id) DO UPDATE SET public=true;

-- STORAGE POLICIES DLA ANON - TO NAPRAWIA ZDJECIA
DROP POLICY IF EXISTS "public read og" ON storage.objects;
DROP POLICY IF EXISTS "public insert og" ON storage.objects;
DROP POLICY IF EXISTS "public update og" ON storage.objects;
DROP POLICY IF EXISTS "public delete og" ON storage.objects;
DROP POLICY IF EXISTS "public read" ON storage.objects;
DROP POLICY IF EXISTS "public insert" ON storage.objects;
DROP POLICY IF EXISTS "public update" ON storage.objects;
DROP POLICY IF EXISTS "public delete" ON storage.objects;

CREATE POLICY "public read og" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id='ogloszenia');
CREATE POLICY "public insert og" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id='ogloszenia');
CREATE POLICY "public update og" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id='ogloszenia') WITH CHECK (bucket_id='ogloszenia');
CREATE POLICY "public delete og" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id='ogloszenia');

NOTIFY pgrst, 'reload schema';
