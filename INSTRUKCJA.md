
# WROOMER.PL - CHECKLIST NAPRAWY PAGESPEED

## PROBLEMY Z SCREENÓW:

### 1. Używaj efektywnego czasu przechowywania w pamięci podręcznej — 1489 KiB
ROZWIĄZANIE:
- Dodano next.config.js headers + vercel.json
- Wszystkie statyki dostają Cache-Control: 31536000
- Sprawdź czy nie serwujesz obrazów z /public bez hashowania - użyj next/image

### 2. Ulepsz dostarczanie obrazów — 1671 KiB
ROZWIĄZANIE:
- next/image automatycznie konwertuje do AVIF/WebP
- Zamień wszystkie <img src="...jpg"> na <OptimizedImage />
- Uruchom: npm install sharp (Vercel potrzebuje do konwersji)
- Dla dużych banerów dodaj: quality={75}

### 3. Przyczyny problemów związanych z przesunięciem układu (CLS)
ROZWIĄZANIE:
- KAŻDY obraz MUSI mieć width i height
- Jeśli używasz <img> -> dodaj style={{aspectRatio: '16/9'}}
- Unikaj ładowania fontów bez font-display: swap
- Dodaj do globals.css: * { font-display: swap }

### 4. Wykrywanie żądań LCP
ROZWIĄZANIE:
- Znajdź największy obraz na hero (ten wroomer screenshot)
- Dodaj do niego priority + preload:
  <Image src="/hero.jpg" priority fetchPriority="high" />

### 5. Ogranicz nieużywany JavaScript — 44 KiB
ROZWIĄZANIE:
- W next.config.js dodano optimizePackageImports
- Sprawdź bundle: npm run build -> zobacz co waży
- Jeśli używasz lodash, moment.js - zamień na date-fns

### 6. Ułatwienia dostępu 63/100
- Elementy graficzne nie mają [alt] -> dodaj alt do WSZYSTKICH Image
- Elementy do wybrania nie mają label -> każdy <input> musi mieć <label htmlFor="">
  Przykład:
  <label htmlFor="search">Szukaj auta</label>
  <input id="search" ... />

- Brak <title> -> dodaj metadata.title w layout.tsx (plik powyżej)

### 7. Błędy w konsoli
- Otwórz wroomer-test.vercel.app, F12 -> Console
- Napraw wszystkie czerwone błędy - one zaniżają Best Practices

## JAK PODMIENIĆ NA TESTOWEJ:

1. Skopiuj next.config.js do głównego katalogu (nadpisz)
2. Skopiuj vercel.json do głównego katalogu
3. npm install sharp
4. W components stwórz OptimizedImage.jsx i używaj go
5. Podmień layout
6. npm run build && vercel --prod

Po deployu przetestuj ponownie pagespeed.web.dev - powinieneś mieć:
Wydajność: 79 -> 92-95+
Dostępność: 63 -> 90+
Cache i Obrazy: 0 KiB do zaoszczędzenia
