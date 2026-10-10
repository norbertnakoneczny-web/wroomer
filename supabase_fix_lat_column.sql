-- FIX: Dodaj brakujące kolumny do istniejącej tabeli ogloszenia
-- Wklej w Supabase SQL Editor -> Run

ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS lat text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS lng text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS latitude text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS longitude text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS owner_email text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS marka text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS model text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS year int;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS mileage int;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS price int;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS cena int;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS lokalizacja text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS fuel text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS paliwo text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS gear text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS skrzynia text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS opis text;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS zdjecia jsonb DEFAULT '[]'::jsonb;

-- Odśwież cache
NOTIFY pgrst, 'reload schema';
