import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // pobieramy tylko slug - bez updated_at
    const { data, error } = await supabase
      .from('ogloszenia')
      .select('slug')
      .not('slug', 'is', null)
      .limit(5000)

    if (error) throw error

    const now = new Date().toISOString()
    const urls = [
      { loc: 'https://www.wroomer.pl/' },
      ...(data || []).map(o => ({
        loc: `https://www.wroomer.pl/auto/${o.slug}`
      }))
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
    return res.status(500).send(`Error: ${e.message}`)
  }
}
