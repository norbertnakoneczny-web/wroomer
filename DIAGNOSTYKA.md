# AUDYT WROOMER-TEST + SUPABASE

Data: 2026-05-13

## 1. VERCEL.JSON
✅ POPRAWIONY - usunięto `public`, dodano rewrites /admin -> /admin.html
Błąd Build Failed zniknie.

## 2. KLUCZE SUPABASE
- URL: https://bdpydgsfowtuvjnkyeeg.supabase.co ✅
- Publishable: sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd ✅ (nowy format, wymaga fetch do auth)

Problem: stary supa.auth.signInWithPassword nie działa z sb_publishable_ w supabase-js@2 UMD.
Rozwiązanie: logowanie przez fetch(AUTH_URL + '/token?grant_type=password') z header apikey + Authorization Bearer K - działa.

## 3. TABELA ogloszenia
Struktura (z historii):
- id uuid PK
- title text, marka text, model text
- price int, cena int
- location text, lokalizacja text
- description text, opis text
- images jsonb / text[] - TU BYŁY BASE64 (wolne!)
- zdjecia jsonb
- user_id uuid FK auth.users
- phone text, telefon text
- year int, mileage int, fuel text, gear text, body text, color text, capacity int, power int, cond text
- created_at timestamptz

Status: Tabela istnieje, ma 2 rekordy (z base64). Po usunięciu base64 i dodaniu RLS SELECT powinna mieć 0 lub więcej nowych z URL.

## 4. RLS - Row Level Security
To jest powód "dodano a nie widać":

Jeśli:
SELECT * FROM pg_tables WHERE tablename='ogloszenia' AND rowsecurity=true
to RLS włączone i bez polityki SELECT USING (true) -> SELECT zwraca 0 wierszy.

Wymagane polityki:
- FOR SELECT USING (true) - public read
- FOR INSERT WITH CHECK (auth.role()='authenticated')
- FOR UPDATE USING (auth.uid()=user_id)
- FOR DELETE USING (auth.uid()=user_id)

Bez tego loadReal() w index.html dostaje [] i pokazuje "Brak ogłoszeń".

## 5. STORAGE BUCKET images
Wymagane:
- bucket id='images', public=true
- polityki storage.objects FOR SELECT USING (bucket_id='images')
- FOR INSERT/DELETE/UPDATE

Jeśli bucket nie publiczny lub brak polityki, upload z handleAddSubmit rzuca błąd "Bucket not found" lub "row-level security policy".
Fallback base64 był przyczyną wolnego działania.

## 6. ZDJĘCIA - POWIĄZANIE
Stary flow:
comp(file) -> dataURL base64 -> payload.images = [base64, base64] -> tabela ogloszenia.images = [base64] -> 500KB * 10 = 5MB w jednym wierszu -> wolne, nie ładuje się.

Nowy flow (poprawiony):
comp(file) -> {blob: WebP 800px 0.65, data: preview base64 tylko do podglądu w UI} 
-> supa.storage.from('images').upload(user_id/timestamp-i.webp, blob) 
-> getPublicUrl() -> https://bdpydgsfowtuvjnkyeeg.supabase.co/storage/v1/object/public/images/user_id/xxx.webp
-> payload.images = [https://..., https://...]
-> tabela ogloszenia.images = [https://...] -> szybkie, CDN

Walidacja w nowym index.html:
- Blokada data: - if url.startsWith('data:') throw error
- Logowanie każdego uploadu

## 7. AUTH
- Rejestracja: POST /auth/v1/signup + auto login POST /auth/v1/token?grant_type=password
- Logowanie: POST /auth/v1/token?grant_type=password
- Sesja: localStorage wroomer_access_token, wroomer_user_email, wroomer_user_id
- checkSession() sprawdza localStorage przed supa.auth.getSession()

## 8. ADMIN.HTML
Miał błąd składni: `const AUTH_URL = U + '/auth/v1';; const SUPABASE_REST = U + '/rest/v1';, K='...'` - podwójny średnik i przecinek.
Poprawiono.

## 9. CO TRZEBA URUCHOMIĆ W SUPABASE SQL EDITOR

```sql
-- 1. RLS dla ogloszenia - NAPRAWIA "dodano a nie widać"
ALTER TABLE public.ogloszenia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read ogloszenia" ON public.ogloszenia;
CREATE POLICY "public read ogloszenia" ON public.ogloszenia FOR SELECT USING (true);
DROP POLICY IF EXISTS "auth insert ogloszenia" ON public.ogloszenia;
CREATE POLICY "auth insert ogloszenia" ON public.ogloszenia FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "auth update own" ON public.ogloszenia;
CREATE POLICY "auth update own" ON public.ogloszenia FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "auth delete own" ON public.ogloszenia;
CREATE POLICY "auth delete own" ON public.ogloszenia FOR DELETE USING (auth.uid() = user_id);

-- 2. Bucket images publiczny
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO UPDATE SET public = true;
DROP POLICY IF EXISTS "public read images" ON storage.objects;
CREATE POLICY "public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
DROP POLICY IF EXISTS "auth upload images" ON storage.objects;
CREATE POLICY "auth upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
DROP POLICY IF EXISTS "auth delete images" ON storage.objects;
CREATE POLICY "auth delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images');
DROP POLICY IF EXISTS "auth update images" ON storage.objects;
CREATE POLICY "auth update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');

-- 3. Potwierdź użytkowników i usuń wolne base64
UPDATE auth.users SET email_confirmed_at = now() WHERE email_confirmed_at IS NULL;
DELETE FROM public.ogloszenia WHERE images::text LIKE '%base64%' OR zdjecia::text LIKE '%base64%';

-- 4. Sprawdź
SELECT COUNT(*) FROM public.ogloszenia;
SELECT id, name, public FROM storage.buckets WHERE id='images';
SELECT policyname FROM pg_policies WHERE tablename='ogloszenia';
```

Po tym SQL:
- loadReal() zwróci dane
- zdjęcia będą URL https://.../storage/v1/object/public/images/...
- logowanie/rejestracja działa z sb_publishable_...
