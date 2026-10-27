import { readFileSync } from 'node:fs';
import { join } from 'node:path';
// Server-rendered vehicle detail page for crawlers and visitors.
const API='https://bdpydgsfowtuvjnkyeeg.supabase.co';
const KEY='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
  const slug=String(req.query.slug||'').trim();
  if(!/^[a-zA-Z0-9_-]{1,150}$/.test(slug)){res.status(400).send('Nieprawidłowy adres');return;}
  try{
    const field=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)?'id':'slug';
    const response=await fetch(API+'/rest/v1/ogloszenia?'+field+'=eq.'+encodeURIComponent(slug)+'&is_banned=eq.false&select=*&limit=1',{
      headers:{apikey:KEY,Authorization:'Bearer '+KEY},signal:AbortSignal.timeout(7000)});
    if(!response.ok)throw new Error('Backend response '+response.status);
    const rows=await response.json(), car=Array.isArray(rows)?rows[0]:null;
    if(!car){res.status(404).send('Nie znaleziono ogłoszenia');return;}
    const title=String(car.title||[car.brand,car.model,car.year].filter(Boolean).join(' ')||'Samochód').slice(0,110);
    const url='https://www.wroomer.pl/auto/'+encodeURIComponent(slug);
    const description=[title,car.location,Number.isFinite(Number(car.price))&&Number(car.price)>0?Number(car.price).toLocaleString('pl-PL')+' zł':'','Oferta na WROOMER.PL'].filter(Boolean).join(' • ').slice(0,160);
    let pictures=Array.isArray(car.images)?[...car.images]:[];
    if(typeof car.images==='string'){try{pictures=JSON.parse(car.images)}catch{pictures=[car.images]}}
    if(!Array.isArray(pictures))pictures=[];
    if(car.image_url)pictures.unshift(car.image_url);
    pictures=[...new Set(pictures.filter(x=>typeof x==='string').map(x=>x.trim()).filter(x=>/^https:\/\/[^\s<>"']+$/i.test(x)))].slice(0,20);
    const schema={'@context':'https://schema.org','@type':'Car',name:title,url,description:String(car.description||title).slice(0,500),...(car.brand?{brand:{'@type':'Brand',name:car.brand}}:{}),...(car.model?{model:car.model}:{}),...(pictures.length?{image:pictures}:{})};
    const phone=String(car.phone||'').trim();
    const safePhone=/^\+?[0-9 ()-]{6,24}$/.test(phone)&&phone.replace(/\D/g,'').length>=6?phone:'';
    const phoneHref=safePhone.replace(/[^+\d]/g,'');
    const price=Number.isFinite(Number(car.price))&&Number(car.price)>0?Number(car.price).toLocaleString('pl-PL')+' zł':'';
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    // Reuse the original interactive listing page instead of replacing it with a reduced SSR-only view.
    const template=readFileSync(join(process.cwd(),'auto.html'),'utf8');
    const placeholder='<div id="content" class="card">Ładowanie...</div>';
    if(!template.includes(placeholder))throw Error('Listing template mismatch');
    const image=pictures[0]||'https://placehold.co/800x600/151515/999999?text=Brak+zdjec';
    const gallery='<div class="gallery-main" id="galleryMain"><img id="mainImg" src="'+esc(image)+'" alt="'+esc(title)+'" loading="eager">'+
      (pictures.length?'<span class="counter" id="mainCounter">1 / '+pictures.length+'</span>':'')+'</div>'+
      (pictures.length?'<div class="thumbs">'+pictures.map((p,i)=>'<img src="'+esc(p)+'" class="'+(i===0?'active':'')+'" loading="lazy" alt="'+esc(title)+'">').join('')+'</div>':'');
    const details='<div class="info"><h1>'+esc(title)+'</h1><div class="meta">'+esc([car.brand,car.model,car.location,car.year].filter(Boolean).join(' • '))+'</div>'+
      '<div class="price">'+esc(price||'Cena do uzgodnienia')+'</div><div class="desc">'+esc(car.description||'')+'</div>'+
      (safePhone?'<a class="btn" href="tel:'+esc(phoneHref)+'">📞 ZADZWOŃ: '+esc(safePhone)+'</a>':'<div class="meta">Numer telefonu niedostępny</div>')+
      '<div style="margin-top:20px"><a href="/" style="color:#888">← Wróć do listy</a></div></div>';
    const jsonLd=JSON.stringify(schema).replace(/</g,'\\u003c');
    const head='<link rel="canonical" href="'+esc(url)+'">'+
      '<meta property="og:url" content="'+esc(url)+'">'+
      (pictures.length?'<meta property="og:image" content="'+esc(pictures[0])+'">':'')+
      '<script type="application/ld+json" id="listing-structured-data">'+jsonLd+'</script>';
    const html=template
      .replace(/<title>[^<]*<\/title>/i,'<title>'+esc(title)+' | WROOMER.PL</title>')
      .replace(/<meta name="description" content="[^"]*">/i,'<meta name="description" content="'+esc(description)+'">')
      .replace(/<meta property="og:title" content="[^"]*">/i,'<meta property="og:title" content="'+esc(title)+'">')
      .replace(/<meta property="og:description" content="[^"]*">/i,'<meta property="og:description" content="'+esc(description)+'">')
      .replace('</head>',head+'</head>')
      .replace(placeholder,'<div id="content" class="card">'+gallery+details+'</div>');
    res.status(200).send(html);
  }catch(e){res.status(502).send('Błąd odczytu ogłoszenia');}
}
