
WROOMER - INSTRUKCJA SZYBKA

1. W Supabase Authentication -> Providers -> Email
   - Confirm email = OFF (tryb testowy - loguje od razu)
   - Save

2. Authentication -> Email Templates -> Reset Password
   - Subject: WROOMER reset hasła
   - From name: WROOMER.PL
   - Body: użyj {{ .ConfirmationURL }}
   - Save

3. Authentication -> URL Configuration
   - Site URL: https://twoja-domena.vercel.app
   - Redirect URLs: https://twoja-domena.vercel.app/**

4. Jeśli konto lightled@o2.pl nie loguje, uruchom w SQL:
   update auth.users set email_confirmed_at = now(), confirmed_at = now() where email = 'lightled@o2.pl';

5. Wgraj index.html na Vercel

FIX: onAuthStateChange PASSWORD_RECOVERY pokazuje teraz okno Ustaw nowe hasło zamiast auto-logowania.
