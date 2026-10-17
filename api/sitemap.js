export default async function handler(req, res) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const now = new Date().toISOString()

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.wroomer.pl/</loc><lastmod>${now}</lastmod></url></urlset>`
    res.setHeader('Content-Type', 'text/xml')
    return res.status(200).send(xml)
  }

  let staticUrls = [
    { loc: 'https://www.wroomer.pl/', lastmod: now },
  ]

  let dynamicUrls = []
  try {
    // Próbujemy pobrać z Supabase - nowa metoda
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/ogloszenia?select=id,created_at&order=created_at.desc&limit=5000`
    const r = await fetch(url, {
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    if (r.ok) {
      const data = await r.json()
      console.log('Sitemap found:', data.length)
      dynamicUrls = data.map(i => ({
        loc: `https://www.wroomer.pl/?id=${i.id}`,
        lastmod: new Date(i.created_at || now).toISOString()
      }))
    } else {
      console.error('Supabase error', await r.text())
    }
  } catch(e){
    console.error('Sitemap error', e)
  }

  const all = [...staticUrls, ...dynamicUrls]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).send(xml)
}
