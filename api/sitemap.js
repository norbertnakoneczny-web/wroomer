export default async function handler(req, res) {
  try {
    // dane z Twojego Supabase - bierzemy bezpośrednio z env Vercela
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Brak SUPABASE_URL lub KEY w Vercel ENV')
    }

    // pobieramy slugi przez zwykły fetch, bez biblioteki
    const r = await fetch(`${SUPABASE_URL}/rest/v1/ogloszenia?select=slug&slug=not.is.null&limit=5000`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })

    if (!r.ok) throw new Error(`Supabase error ${r.status}`)

    const data = await r.json()

    const now = new Date().toISOString()
    const urls = [
      { loc: 'https://www.wroomer.pl/' },
      ...data.map(o => ({ loc: `https://www.wroomer.pl/auto/${o.slug}` }))
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${now}</lastmod></url>`).join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).send(xml)

  } catch (e) {
    console.error(e)
    return res.status(200).send(`<?xml version="1.0"?><error>${e.message}</error>`)
  }
}
