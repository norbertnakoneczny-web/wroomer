// Preview-only server-rendered vehicle page. Do not route public listings here until verified.
const API='https://bdpydgsfowtuvjnkyeeg.supabase.co';
const KEY='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default async function handler(req,res){
  res.setHeader('X-Robots-Tag','noindex, nofollow'); // preview route must not compete with public listings
  const slug=String(req.query.slug||'').trim();
  if(!/^[a-zA-Z0-9_-]{1,150}$/.test(slug)){res.status(400).send('Nieprawidłowy adres');return;}
  try{
    const field=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)?'id':'slug';
    const response=await fetch(API+'/rest/v1/ogloszenia?'+field+'=eq.'+encodeURIComponent(slug)+'&select=*&limit=1',{
      headers:{apikey:KEY,Authorization:'Bearer '+KEY},signal:AbortSignal.timeout(7000)});
    if(!response.ok)throw new Error('Backend response '+response.status);
    const rows=await response.json(), car=Array.isArray(rows)?rows[0]:null;
    if(!car){res.status(404).send('Nie znaleziono ogłoszenia');return;}
    const title=String(car.title||[car.brand,car.model,car.year].filter(Boolean).join(' ')||'Samochód').slice(0,110);
    const url='https://www.wroomer.pl/auto/'+encodeURIComponent(slug);
    const description=[title,car.location,car.price?Number(car.price).toLocaleString('pl-PL')+' zł':'','Oferta na WROOMER.PL'].filter(Boolean).join(' • ').slice(0,160);
    let pictures=Array.isArray(car.images)?car.images:[];
    if(typeof car.images==='string'){try{pictures=JSON.parse(car.images)}catch{pictures=[car.images]}}
    if(!Array.isArray(pictures))pictures=[];
    if(car.image_url)pictures.unshift(car.image_url);
    pictures=[...new Set(pictures.filter(x=>typeof x==='string').map(x=>x.trim()).filter(x=>{try{const u=new URL(x);return u.protocol==='https:';}catch{return false;}}))].slice(0,8);
    const schema={'@context':'https://schema.org','@type':'Car',name:title,url,description:String(car.description||title).slice(0,500),...(car.brand?{brand:{'@type':'Brand',name:car.brand}}:{}),...(car.model?{model:car.model}:{}),...(pictures.length?{image:pictures}:{})};
    const price=Number.isFinite(Number(car.price))&&Number(car.price)>0?Number(car.price).toLocaleString('pl-PL')+' zł':'';
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).send(`<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | WROOMER.PL</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="product"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(url)}">${pictures[0]?`<meta property="og:image" content="${esc(pictures[0])}">`:''}<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script><style>*{box-sizing:border-box}body{margin:0;background:#0c0c0c;color:#fff;font:16px system-ui,Arial}.wrap{max-width:900px;margin:auto;padding:20px}a{color:#ff9a1f}h1{font-size:clamp(24px,5vw,36px)}.photo{width:100%;max-height:550px;object-fit:contain;background:#000;border-radius:14px}.price{font-size:30px;font-weight:bold;color:#ff9a1f}.desc{white-space:pre-wrap;line-height:1.6}</style></head><body><main class="wrap"><a href="/">← WROOMER.PL</a><article><h1>${esc(title)}</h1><p>${esc([car.brand,car.model,car.year,car.location].filter(Boolean).join(' • '))}</p>${pictures[0]?`<img class="photo" src="${esc(pictures[0])}" alt="${esc(title)}">`:''}<p class="price">${esc(price)}</p><p class="desc">${esc(car.description)}</p></article></main></body></html>`);
  }catch(e){res.status(502).send('Błąd odczytu ogłoszenia');}
}
