# WROOMER.PL FIX - bez base64

1. W Supabase > SQL Editor > New Query wklej supabase.sql i RUN
2. Storage > bucket ogloszenia > musi być PUBLIC
3. Wgraj index.html i admin.html na Vercel (nadpisz)

Teraz zdjęcia idą TYLKO do Storage jako https://...supabase.co/storage/v1/object/public/ogloszenia/xxx.jpg
Baza trzyma tylko URL-e, nie base64 = szybko.
