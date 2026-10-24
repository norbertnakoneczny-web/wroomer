export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body style={{margin:0, background:'#0A0A0B'}}>{children}</body>
    </html>
  )
}
