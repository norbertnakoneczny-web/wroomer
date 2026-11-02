// Dynamic sitemap. Only public listing identifiers are included.
const API='https://bdpydgsfowtuvjnkyeeg.supabase.co';
const KEY='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
const BASE='https://www.wroomer.pl';
// Static pages are published separately via /sitemap.xml.
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
 try{
  const urls=new Set();
  const categories=new Set();
  const brands={'bmw':'bmw','audi':'audi','opel':'opel','volvo':'volvo','peugeot':'peugeot','fiat':'fiat','ford':'ford','hyundai':'hyundai','volkswagen':'volkswagen','mercedes-benz':'mercedes-benz'};
  const cities={'gorzyce':'gorzyce','katowice':'katowice','rybnik':'rybnik','wodzislaw slaski':'wodzislaw-slaski','raciborz':'raciborz','jastrzebie-zdroj':'jastrzebie-zdroj','gliwice':'gliwice','zory':'zory'};
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  for(let offset=0;offset<10000;offset+=500){
   const response=await fetch(API+'/rest/v1/ogloszenia?select=id,slug,brand,marka,location,lokalizacja,miasto&is_banned=eq.false&order=id.asc&limit=500&offset='+offset,{headers:{apikey:KEY,Authorization:'Bearer '+KEY},signal:AbortSignal.timeout(6500)});
   if(!response.ok)throw Error('API error');
   const rows=await response.json();
   if(!Array.isArray(rows))throw Error('Invalid response');
   for(const car of rows){
    const slug=String(car.slug||car.id||'');
    if(/^[a-zA-Z0-9_-]{1,150}$/.test(slug)){urls.add(BASE+'/auto/'+encodeURIComponent(slug));const brand=brands[norm(car.brand||car.marka)];if(brand){categories.add(BASE+'/samochody/'+brand);const place=norm(car.location||car.lokalizacja||car.miasto);for(const [city,route] of Object.entries(cities))if(place.includes(city))categories.add(BASE+'/samochody/'+brand+'/'+route);}}
   }
   if(rows.length<500)break;
   if(offset===9500)throw Error('Sitemap pagination limit exceeded');
  }
  // An empty marketplace is valid: return an empty sitemap rather than a 503 error.
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...urls,...categories].map(url=>'  <url><loc>'+url.replace(/&/g,'&amp;')+'</loc></url>').join('\n')+'\n</urlset>';
  res.setHeader('Content-Type','application/xml; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=3600');
  return res.status(200).send(xml);
 }catch(e){return res.status(503).send('Mapa strony chwilowo niedostępna');}
}
