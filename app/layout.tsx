export const metadata = {
  title: 'Wroomer.pl - Skup aut za gotówkę | Sprzedaj auto za darmo',
  description: 'Wroomer.pl - sprzedaj auto szybko i za darmo. Wycena w 15 minut, gotówka od ręki. Skup aut w całej Polsce.',
  verification: { google: 'google-site-verification-code' }
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body style={{margin:0,fontFamily:'Inter, system-ui, sans-serif', background:'#f8fafc'}}>{children}</body>
    </html>
  )
}
