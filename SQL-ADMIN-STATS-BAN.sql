-- ADMIN STATS - WEJŚCIA, EDYCJA, BANOWANIE
-- Wklej całość w Supabase SQL Editor

-- 1. Kolumny do statystyk i bana
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS banned_reason TEXT;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;
ALTER TABLE public.ogloszenia ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;

-- 2. Tabela do szczegółowych wejść (opcjonalnie, do statystyk)
CREATE TABLE IF NOT EXISTS public.ogloszenia_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ogloszenie_id UUID REFERENCES public.ogloszenia(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  ip TEXT,
  user_agent TEXT
);

-- 3. Polityki dla views
ALTER TABLE public.ogloszenia_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public insert views" ON public.ogloszenia_views;
DROP POLICY IF EXISTS "public read views" ON public.ogloszenia_views;
CREATE POLICY "public insert views" ON public.ogloszenia_views FOR INSERT WITH CHECK (true);
CREATE POLICY "public read views" ON public.ogloszenia_views FOR SELECT USING (true);

-- 4. Funkcja do inkrementacji views bez RLS problemów
CREATE OR REPLACE FUNCTION public.increment_views(ogloszenie_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.ogloszenia SET views = COALESCE(views,0)+1, last_viewed_at = now() WHERE id = ogloszenie_id;
  INSERT INTO public.ogloszenia_views (ogloszenie_id) VALUES (ogloszenie_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Upewnij się że RLS pozwala na update views (admin)
DROP POLICY IF EXISTS "public update views" ON public.ogloszenia;
CREATE POLICY "public update views" ON public.ogloszenia FOR UPDATE USING (true) WITH CHECK (true);

-- 6. Przelicz stare views na 0 gdzie null
UPDATE public.ogloszenia SET views = 0 WHERE views IS NULL;
UPDATE public.ogloszenia SET is_banned = false WHERE is_banned IS NULL;

-- 7. Statystyki
SELECT 'Gotowe - statystyki wejść aktywne' as status, COUNT(*) as total, SUM(views) as total_views FROM public.ogloszenia;
