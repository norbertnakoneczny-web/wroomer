
# WROOMER.PL v12 - Premium + Promień FIXED

## Jak wrzucić na Vercel (nadpisuje wroomer-n6lroecni-norbertnakoneczny-5201.vercel.app)

1. Wejdź na https://vercel.com/norbertnakoneczny-web/wroomer
2. Zrób `git clone` swojego repo lub wgraj ten folder jako nowy projekt
3. `npm install && npm run build`
4. Deploy

Funkcje:
- Zlokalizuj mnie (geolocation API)
- Promień haversine 5-100km
- Sort po odległości
- UPS / Podbij
- 8 ogłoszeń z Gorzyc i okolic

Jeśli chcesz podpiąć prawdziwe dane z bazy, podmień const CARS w app/page.tsx na fetch z API.
