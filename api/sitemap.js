// Dynamic sitemap. Only public listing identifiers are included.
const API='https://bdpydgsfowtuvjnkyeeg.supabase.co';
const KEY='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
const BASE='https://www.wroomer.pl';
// Static pages are published separately via /sitemap.xml.\nconst pages=['/','/blog/','/blog/najmniejsze-spalanie-auta-benzynowe-2026.html','/blog/samochody-do-20-tysiecy-dla-rodziny.html','/blog/jak-nie-kupic-auta-z-cofnietym-licznikiem.html','/blog/ile-kosztuje-przerejestrowanie-auta-2026.html','/blog/rejestracja-auta-z-niemiec-krok-po-kroku.html','/blog/oc-na-miesiac-czy-warto-krotkoterminowe.html','/blog/jak-szybko-sprzedac-samochod-24h.html','/blog/umowa-kupna-sprzedazy-samochodu-wzor-2026.html','/polityka-prywatnosci.html','/regulamin.html'];
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
 try{
  const urls=new Set();
  for(let offset=0;offset<10000;offset+=500){
   const response=await fetch(API+'/rest/v1/ogloszenia?select=id,slug&order=id.asc&limit=500&offset='+offset,{headers:{apikey:KEY,Authorization:'Bearer '+KEY},signal:AbortSignal.timeout(6500)});
   if(!response.ok)throw Error('API error');
   const rows=await response.json();
   if(!Array.isArray(rows))throw Error('Invalid response');
   for(const car of rows){
    const slug=String(car.slug||car.id||'');
    if(/^[a-zA-Z0-9_-]{1,150}$/.test(slug))urls.add(BASE+'/auto/'+encodeURIComponent(slug));
   }
   if(rows.length<500)break;
   if(offset===9500)throw Error('Sitemap pagination limit exceeded');
  }
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...urls].map(url=>'  <url><loc>'+url.replace(/&/g,'&amp;')+'</loc></url>').join('\n')+'\n</urlset>';
  res.setHeader('Content-Type','application/xml; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=3600');
  return res.status(200).send(xml);
 }catch(e){return res.status(503).send('Mapa strony chwilowo niedostępna');}
}
