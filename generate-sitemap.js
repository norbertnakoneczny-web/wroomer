
// DYNAMICZNY SITEMAP Z SUPABASE - dodaj jako Edge Function lub uruchom lokalnie
// Generuje sitemap.xml z wszystkimi ogłoszeniami dla GSC
const { createClient } = require('@supabase/supabase-js');
const supa = createClient('https://bdpydgsfowtuvjnkyeeg.supabase.co','sb_publishable_...');
(async()=>{
  const {data} = await supa.from('listings').select('id, updated_at').order('updated_at',{ascending:false});
  let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  xml+=`<url><loc>https://www.wroomer.pl/</loc><priority>1.0</priority></url>`;
  data.forEach(l=>{
    xml+=`<url><loc>https://www.wroomer.pl/ogloszenie/${l.id}</loc><lastmod>${new Date(l.updated_at||Date.now()).toISOString()}</lastmod><priority>0.8</priority></url>`;
  });
  xml+=`</urlset>`;
  require('fs').writeFileSync('sitemap-dynamic.xml',xml);
  console.log('Sitemap generated', data.length);
})();
