// Dynamic XML sitemap for public, unbanned vehicle listings.
// The static editorial and city pages are listed separately in /sitemap.xml.
const API='https://bdpydgsfowtuvjnkyeeg.supabase.co';
const KEY='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
const BASE='https://www.wroomer.pl';
const PAGE_SIZE=500;
const MAX_PAGES=20; // Fail explicitly rather than silently publish an incomplete sitemap.
const brands={'bmw':'bmw','audi':'audi','opel':'opel','volvo':'volvo','peugeot':'peugeot','fiat':'fiat','ford':'ford','hyundai':'hyundai','volkswagen':'volkswagen','mercedes benz':'mercedes-benz','mazda':'mazda','skoda':'skoda','toyota':'toyota','renault':'renault','seat':'seat','kia':'kia','nissan':'nissan','citroen':'citroen','honda':'honda','suzuki':'suzuki','dacia':'dacia'};
const cities={'gorzyce':'gorzyce','katowice':'katowice','rybnik':'rybnik','wodzislaw slaski':'wodzislaw-slaski','raciborz':'raciborz','jastrzebie zdroj':'jastrzebie-zdroj','gliwice':'gliwice','zory':'zory'};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const xmlEscape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const validSlug=s=>/^[a-zA-Z0-9_-]{1,150}$/.test(s);

async function fetchPage(offset){
 const url=API+'/rest/v1/ogloszenia?select=id,slug,brand,marka,location,lokalizacja,miasto&is_banned=eq.false&order=id.asc&limit='+PAGE_SIZE+'&offset='+offset;
 let lastError;
 for(let attempt=0;attempt<2;attempt++){
  try{
   const response=await fetch(url,{headers:{apikey:KEY,Authorization:'Bearer '+KEY},signal:AbortSignal.timeout(8000)});
   if(!response.ok)throw new Error('Sitemap backend HTTP '+response.status);
   const data=await response.json();
   if(!Array.isArray(data))throw new Error('Unexpected sitemap response');
   return data;
  }catch(error){lastError=error;}
 }
 throw lastError;
}
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
 try{
  const urls=new Set(),categories=new Set();
  let finished=false;
  for(let page=0;page<MAX_PAGES;page++){
   const rows=await fetchPage(page*PAGE_SIZE);
   for(const car of rows){
    const slug=String(car.slug||car.id||'').trim();
    if(!validSlug(slug))continue;
    urls.add(BASE+'/auto/'+encodeURIComponent(slug));
    const brand=brands[norm(car.brand||car.marka)];
    if(!brand)continue;
    categories.add(BASE+'/samochody/'+brand);
    const location=norm(car.location||car.lokalizacja||car.miasto);
    for(const [city,route] of Object.entries(cities)){
     if(location===city||location.startsWith(city+' ')||location.endsWith(' '+city)||location.includes(' '+city+' ')){
      categories.add(BASE+'/samochody/'+brand+'/'+route);
     }
    }
   }
   if(rows.length<PAGE_SIZE){finished=true;break;}
  }
  if(!finished)throw new Error('Listing count exceeds sitemap pagination limit');
  const all=[...urls,...categories].sort();
  // Sitemap protocol permits at most 50,000 URLs / 50 MB per file.
  if(all.length>50000)throw new Error('Sitemap URL count limit exceeded');
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+all.map(url=>'  <url><loc>'+xmlEscape(url)+'</loc></url>').join('\n')+'\n</urlset>';
  if(Buffer.byteLength(xml,'utf8')>50*1024*1024)throw new Error('Sitemap XML size limit exceeded');
  res.setHeader('Content-Type','application/xml; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=3600');
  return res.status(200).send(xml);
 }catch(error){
  res.setHeader('Content-Type','text/plain; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  return res.status(503).send('Mapa strony chwilowo niedostępna');
 }
}
