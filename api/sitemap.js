export default async function handler(req, res) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const now = new Date().toISOString()

  const staticUrls = [{ loc: 'https://www.wroomer.pl/', lastmod: now }]
  let dynamicUrls = []

  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/ogloszenia?select=id&order=id.desc&limit=5000`
    const r = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })
    const text = await r.text()
    if (!r.ok) {
      console.error('Supabase error:', text)
    } else {
      const data = JSON.parse(text)
      dynamicUrls = data.map(i => ({
        loc: `https://www.wroomer.pl/?id=${i.id}`,
        lastmod: now
      }))
    }
  } catch (e) {
    console.error(e)
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
