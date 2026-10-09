WROOMER.PL - WERSJA PROFESJONALISTA BEZ BŁĘDÓW - 2026-05-13
====================================================================

CAŁY PORTAL ŻÓŁTO-CZARNY OTOMOTO PRO

PORTAL (index.html):
- Header czarny #000 + żółty pasek 3px #ffcc00 jak OTOMOTO
- Logo WROOMER.PL - PL żółte
- Przycisk + Dodaj żółty #ffcc00 900 weight - główny CTA
- Zaloguj/Wyloguj + Dodaj widoczne na smartfonie 360px (oba przyciski 32px)
- Bez zielonego emaila norbert.nakoneczny@gmail.com - ukryty
- Bez oka 👁️ na portalu - tylko admin widzi views (profesjonalnie)
- Duże zdjęcie 62vh od razu po kliknięciu ogłoszenia - jak OTOMOTO
- Galeria: swipe, thumbnails, dots, zoom
- GPS: 2 przyciski - Pobierz GPS z miejscowości (Nominatim) + Użyj mojej lokalizacji (highAccuracy 15s)
- Duży przycisk Zapisz 58px sticky bottom jak w OLX/OTOMOTO
- Klikanie ogłoszeń działa - cały card klikalny
- 6 aut DEMO profesjonalnych z Gorzyce/Wodzisław/Rybnik/Żory/Pszów - zawsze widoczne
- Jeśli Supabase ma Twoje ogłoszenia - pokazuje Twoje zamiast DEMO
- Błąd bazy obsłużony: pokazuje DEMO zamiast białej strony
- Filtry: marka, model, cena, lokalizacja, GPS promień, paliwo, skrzynia
- Sort: najnowsze, cena, rok

ADMIN (admin.html) - /admin.html:
- Login: norbert.nakoneczny@gmail.com / WROOMER-MASTER-2024
- Żółto-czarny OTOMOTO PRO
- Dashboard PRO: 11 KPI + 6 wykresów Chart.js (30 dni, views, marki, ceny, paliwo, lokalizacje)
- Wszystkie ogłoszenia PRO: checkboxy, bulk ban/unban/delete/bump, search, filtry, sort, 25/50/100/500 na stronę
- Każde ogłoszenie: Edytuj wszystkie pola (marka, model, rok, przebieg, cena, miejscowość, telefon, moc, opis, views, status ban, GPS lat/lng, zdjęcia URL)
- Przyciski: Edytuj, Ban/Odbanuj z powodem, Usuń, Podbij na górę, Link, Zobacz na portalu
- Moderacja, Użytkownicy (top wg telefonu), Finanse, System (diagnoza, CSV, czyszczenie)

ROLLBACK (rollback.html) - /rollback.html - przywracanie wersji

VERCEL:
- CleanUrls true, rewrites /admin i /rollback
- Deploy: wrzuć 5 plików na GitHub -> Commit -> Vercel auto-deploy

BEZ BŁĘDÓW - PROFESJONALISTA:
- Sprawdzone: brak duplicate listeners, brak console errors, DEMO fallback, GPS highAccuracy, big image 62vh
- Testowane na 360px, 768px, 1920px
- Supabase: https://bdpydgsfowtuvjnkyeeg.supabase.co - tabela ogloszenia
- Storage: images bucket

AUTOR: WROOMER.PL PRO MAX
