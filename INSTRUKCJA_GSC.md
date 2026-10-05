
# GOOGLE SEARCH CONSOLE - WROOMER.PL - INSTRUKCJA KROK PO KROKU

## 1. Dodaj witrynę do Search Console
- Wejdź: https://search.google.com/search-console
- Kliknij "Dodaj usługę" > "Prefiks URL" > wpisz https://www.wroomer.pl/
- Wybierz weryfikację przez "Tag HTML"

## 2. Weryfikacja
- Skopiuj kod np. d_abc123xyz
- W index.html znajdź:
  <meta name="google-site-verification" content="TWOJ_KOD_WERYFIKACJI_Z_SEARCH_CONSOLE">
- Podmień TWOJ_KOD... na swój kod
- Wgraj index.html na GitHub
- W GSC kliknij WERYFIKUJ

## 3. Wgraj pliki SEO
Do głównego katalogu www.wroomer.pl wgraj:
- robots.txt (z tego ZIPa)
- sitemap.xml (z tego ZIPa)
- ads.txt (z poprzedniego ZIPa AdSense)

GitHub: dodaj te 3 pliki obok index.html

## 4. Zgłoś sitemap w GSC
- W Search Console > Indeksowanie > Mapy witryn
- Wpisz: https://www.wroomer.pl/sitemap.xml
- Wyślij

## 5. Co dalej? (48h)
- Google zacznie indeksować ogłoszenia
- Sprawdź w GSC > Wydajność > zapytania "wroomer", "ogłoszenia Gorzyce"
- Dodaj w GSC > Ustawienia > Domeny > powiąż z Google Analytics (jeśli masz)

## 6. SEO dla ogłoszeń (automatyczne w kodzie)
Każde ogłoszenie ma teraz:
- Title z marką/modelem/rokiem/ceną
- Description z lokalizacją i GPS
- Schema.org Vehicle (do dodania w przyszłości)

## 7. Szybkie indeksowanie
Po dodaniu nowego ogłoszenia:
- Wejdź w GSC > Sprawdzanie URL > wklej https://www.wroomer.pl/
- Kliknij "Poproś o zaindeksowanie"

## 8. Błędy z 959.png / 960.png
Jeśli wcześniej miałeś białą stronę (959.png) lub błąd "Cannot coerce..." (960.png) - teraz FIX z ostatniego ZIPa naprawia to.
Załadowano 4 ogłoszenia = działa, teraz Google je zaindeksuje.
