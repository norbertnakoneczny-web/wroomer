WROOMER - SZYBKIE ZDJĘCIA BEZ BASE64

PROBLEM: stare ogłoszenia miały zdjęcia jako data:image/webp;base64,... - bardzo wolne, strona się wiesza

ROZWIĄZANIE:
1. Uruchom USUN-BASE64-WOLNE-ZDJECIA.sql w Supabase SQL Editor - usuwa wolne ogłoszenia
2. Upewnij się że bucket images jest public = true
3. Wgraj nowy index.html na GitHub wroomer-test - ten kod NIGDY nie zapisuje base64, tylko URL https://.../storage/v1/object/public/images/...

Nowe ogłoszenia będą szybkie - 10 zdjęć = 10 URL-i, a nie 10x 500KB base64 w bazie.
