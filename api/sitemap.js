export default async function handler(req, res) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const now = new Date().toISOString()

  let staticUrls = [
    { loc: 'https://www.wroomer.pl/', lastmod: now },
    { loc: 'https://www.wroomer.pl/motocykle', lastmod: now },
  ]

  let dynamicUrls = []
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/ogloszenia?select=id,created_at&order=created_at.desc&limit=5000`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    })
    if(r.ok){
      const data = await r.json()
      dynamicUrls = data.map(i => ({
        loc: `https://www.wroomer.pl/?id=${i.id}`,
        lastmod: new Date(i.created_at || now).toISOString()
      }))
    }
  } catch(e){}

  const all = [...staticUrls, ...dynamicUrls]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.status(200).send(xml)
}