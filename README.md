
WROOMER - FIX NA BUG "2 RAZ NIE WCHODZI NA OGŁOSZENIE"

Co naprawia:
1. params.id musi być await w Next 15
2. dynamic = force-dynamic - brak cache który wywala 2 wejście
3. views nie robimy przez UPDATE (blokuje RLS) tylko przez RPC security definer
4. sessionStorage + useRef żeby nie liczyć 2x przy StrictMode

INSTALACJA:
1. Skopiuj pliki do swojego projektu (nadpisz app/ogloszenie/[id]/)
2. Wklej supabase/fix.sql do Supabase SQL Editor i uruchom
3. Sprawdź .env.local ma NEXT_PUBLIC_SUPABASE_URL i ANON_KEY
4. npm run build -> vercel --prod

Jeśli masz Vercel Protection włączony, wyłącz go w:
vercel.com -> project -> Settings -> Deployment Protection -> OFF
