const API='https://bdpydgsfowtuvjnkyeeg.supabase.co';
const KEY='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
const BASE='https://www.wroomer.pl';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const brands={bmw:'BMW',audi:'Audi',opel:'Opel',volvo:'Volvo',peugeot:'Peugeot',fiat:'Fiat'};
const cities={gorzyce:'Gorzyce',katowice:'Katowice',wroclaw:'Wrocław'};
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const brand=String(req.query.brand||'').toLowerCase(),city=String(req.query.city||'').toLowerCase();
 if(!brands[brand]||(city&&!cities[city]))return res.status(404).send('Nie znaleziono kategorii');
 try{
  const r=await fetch(API+'/rest/v1/ogloszenia?select=*&is_banned=eq.false&limit=500',{headers:{apikey:KEY,Authorization:'Bearer '+KEY},signal:AbortSignal.timeout(7000)});
  if(!r.ok)throw Error('Database unavailable');
  const data=await r.json();
  const rows=data.filter(x=>norm(x.brand||x.marka)===norm(brands[brand])&&(!city||norm(x.location||x.lokalizacja||x.miasto).includes(norm(cities[city])))).filter(x=>/^[a-zA-Z0-9_-]{1,150}$/.test(String(x.slug||x.id||'')));
  if(!rows.length)return res.status(404).type('text/plain').send('Brak aktualnych ogłoszeń w tej kategorii');
  const title=brands[brand]+' używane'+(city?' – '+cities[city]:'')+' | Ogłoszenia Wroomer.pl';
  const heading='Samochody '+brands[brand]+(city?' w '+cities[city]:' – ogłoszenia');
  const description='Sprawdź aktualne ogłoszenia '+brands[brand]+(city?' z lokalizacji '+cities[city]:'')+'. Kupuj i sprzedawaj samochody bez prowizji na Wroomer.pl.';
  const path='/samochody/'+brand+(city?'/'+city:'');
  const url=BASE+path;
  const links=Object.keys(brands).map(b=>'<a href="/samochody/'+b+'">'+esc(brands[b])+'</a>').join(' · ');
  const entries=rows.map(x=>{const id=encodeURIComponent(x.slug||x.id);const carTitle=String(x.title||[x.brand||x.marka,x.model,x.year||x.rocznik].filter(Boolean).join(' '));const amount=Number(x.price??x.cena);return '<li><a href="/auto/'+id+'">'+esc(carTitle)+'</a>'+(Number.isFinite(amount)&&amount>0?' – '+esc(amount.toLocaleString('pl-PL'))+' zł':'')+'</li>';}).join('');
  const schema=JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:heading,url,description,mainEntity:{'@type':'ItemList',numberOfItems:rows.length,itemListElement:rows.map((x,i)=>({'@type':'ListItem',position:i+1,url:BASE+'/auto/'+encodeURIComponent(x.slug||x.id)}))}}).replace(/</g,'\\u003c');
  res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','public,s-maxage=300,stale-while-revalidate=600');
  return res.status(200).send('<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+esc(url)+'"><meta name="robots" content="index,follow"><script type="application/ld+json">'+schema+'</script><style>body{font-family:system-ui;background:#101010;color:#f5f5f5;max-width:1000px;margin:auto;padding:20px;line-height:1.6}a{color:#facc15}li{padding:12px;border-bottom:1px solid #333}nav{margin:20px 0}h1{font-size:clamp(24px,4vw,38px)}</style></head><body><header><a href="/">WROOMER.PL – strona główna</a></header><main><h1>'+esc(heading)+'</h1><p>'+esc(description)+'</p><p>Aktualnych ofert: '+rows.length+'</p><ul>'+entries+'</ul><nav aria-label="Pozostałe marki">'+links+'</nav></main></body></html>');
 }catch{return res.status(503).send('Oferty chwilowo niedostępne');}
}