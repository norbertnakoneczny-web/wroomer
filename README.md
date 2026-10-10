# WROOMER.PL - GOTOWIEC FINAL

## Co w paczce
- `index.html` - strona główna, mobile-first, superszybka, PageSpeed optimized, wszystkie funkcje:
  - Filtr marka (32 marki zawsze dostępne) -> model (dopasowanie jak OTOMOTO, Inny model)
  - Cena, lokalizacja + 📍 UŻYJ MOJEJ LOKALIZACJI pod lokalizacją
  - Promień 5-500km, paliwo, skrzynia (naprawione), Wyczyść filtrowanie
  - Odległość haversine, sortowanie po odległości
  - Szczegóły: zdjęcie spięte z treścią, przewijanie zdjęć strzałki ‹ › swipe, miniaturki, wszystkie parametry z formularza + GPS + trasa
  - Bez rozmycia poza zdjęciem, zaokrąglone 20px, wycentrowane
  - Mobile-first: 44px przyciski, bottom bar, 1-2 kolumny, WebP 400w lazy, critical CSS

- `admin.html` - panel admina: statystyki, ban, edycja, usuwanie, diagnoza RLS
- `supabase.sql` - SQL do wklejenia w Supabase (tabele + RLS public read - naprawia błąd bazy)

## Deploy
1. Wyrzuć stare repo z GitHuba
2. Wrzuć te 2 pliki (index.html + admin.html) do nowego repo / na hosting
3. W Supabase wklej supabase.sql w SQL Editor
4. Sprawdź .env - w index.html masz:
   const U='https://bdpydgsfowtuvjnkyeeg.supabase.co';
   const K='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
   - jeśli zmieniasz projekt, podmień

## PageSpeed
- preconnect, preload, WebP, lazy, defer, requestIdleCallback, content-visibility:auto

## Kontakt
WROOMER.PL
