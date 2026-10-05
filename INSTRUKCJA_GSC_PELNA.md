
# GOOGLE SEARCH CONSOLE - PELNA INSTRUKCJA WERYFIKACJI

## CO BRAKUJE NA 970.png?
Na Twoim screenie 970.png Google widzi:
- Rozsypany JS jako tekst (naprawione w FINAL_FIX_970)
- Brak pliku weryfikacyjnego
- Brak robots.txt, sitemap.xml, ads.txt w roocie
- Brak podstron polityka-prywatnosci i regulamin (wymagane dla AdSense i GSC)

## KROK 1: WERYFIKACJA GSC (2 metody - zrob jedna)

### Metoda A - META TAG (szybsza)
1. https://search.google.com/search-console -> Dodaj usluge -> Prefiks URL -> https://www.wroomer.pl/
2. Wybierz "Tag HTML"
3. Skopiuj kod np: dAbC123XyZ456
4. W index.html znajdz:
   <meta name="google-site-verification" content="REPLACE_WITH_YOUR_GSC_CODE">
   Podmien REPLACE... na dAbC123XyZ456
5. Wgraj index.html na GitHub

### Metoda B - PLIK HTML (pewniejsza)
1. W GSC wybierz "Plik HTML" -> Pobierz plik googleABC123.html
2. Wgraj ten plik do roota www.wroomer.pl obok index.html (GitHub -> Upload)
3. Sprawdz czy https://www.wroomer.pl/googleABC123.html dziala
4. W GSC kliknij WERYFIKUJ

## KROK 2: WGRAJ WSZYSTKIE PLIKI DO ROOTa (obok index.html)
Z tego ZIPa wgraj na GitHub (glowny katalog):
- index.html (z Twoim kodem GSC i AdSense)
- robots.txt
- sitemap.xml
- ads.txt (podmien ID)
- polityka-prywatnosci.html
- regulamin.html
- googleXXXXXXXX.html (Twoj plik z GSC, nie template)

## KROK 3: ZGLOS SITEMAP
W GSC -> Indeksowanie -> Mapy witryn -> Wpisz:
https://www.wroomer.pl/sitemap.xml -> Wyslij

## KROK 4: SPRAWDZ W GSC
- GSC -> Sprawdzanie URL -> https://www.wroomer.pl/ -> Popros o zaindeksowanie
- Po 10 minutach powinno byc "URL jest w Google"

## KROK 5: ADSENSE + GSC RAZEM
- AdSense wymaga polityka-prywatnosci.html i regulamin.html - juz sa w ZIPie
- W ads.txt podmien ID na swoje

## CZESTE BLEDY GSC:
❌ "Nie mozna zweryfikowac" -> plik googleXXX.html nie jest w roocie lub meta tag nie ma Twojego kodu
❌ "Sitemap nie mozna pobrac" -> sitemap.xml nie wgrany do roota
❌ "Strona zablokowana przez robots.txt" -> robots.txt ma Disallow: / - u nas jest Allow: /

## PO WERYFIKACJI:
- GSC -> Wydajnosc -> zobaczysz zapytania "wroomer.pl", "ogloszenia Gorzyce"
- Twoje 4 ogloszenia z 960.png (bad 4545 zl itd) beda indeksowane
