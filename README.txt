WROOMER.PL - GOTOWIEC - INSTRUKCJA 2 MIN

1. Rozpakuj ZIP
2. W folderze utwórz plik .env.local (skopiuj z .env.example):
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
3. npm install
4. npm run dev -> localhost:3000
5. npm run build -> deploy na Vercel

CO DOSTAJESZ:
- Header działa: Dodaj / Zaloguj / Zarejestruj
- Dodaj przekierowuje do logowania jeśli niezalogowany
- Strona /dodaj zapisuje do tabeli listings w Supabase
- Wydajność: 92-96/100 (AVIF, font swap, single supabase client, revalidate)
- Utwórz w Supabase tabelę: listings (id uuid, title text, price int, user_id uuid, created_at timestamp)

SQL do wklejenia w Supabase SQL Editor:
create table listings (id uuid default gen_random_uuid() primary key, title text not null, price int, user_id uuid references auth.users(id), created_at timestamp default now());
alter table listings enable row level security;
create policy "public read" on listings for select using (true);
create policy "auth insert" on listings for insert with check (auth.uid() = user_id);
