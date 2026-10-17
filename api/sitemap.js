import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data } = await supabase.from('ogloszenia').select('slug, updated_at').not('slug','is',null).limit(5000)

  const urls = [
    { loc: 'https://www.wroomer.pl/', lastmod: new Date().toISOString() },
    ...(data || []).map(o => ({
      loc: `https://www.wroomer.pl/auto/${o.slug}`,
      lastmod: o.updated_at ? new Date(o.updated_at).toISOString() : new Date().toISOString()
    }))
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).send(xml)
}
