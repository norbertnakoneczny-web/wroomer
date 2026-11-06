import '../photo-variants.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
// Server-rendered vehicle detail page for crawlers and visitors.
const API='https://bdpydgsfowtuvjnkyeeg.supabase.co';
const KEY='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';

const WROOMER_PUBLIC_EQUIPMENT={"Komfort":["Klimatyzacja","Klimatyzacja automatyczna","Tempomat","Tempomat adaptacyjny","Podgrzewane fotele","Elektrycznie regulowane fotele","Elektryczne szyby","Elektryczne lusterka","Centralny zamek","Radio","Czujnik parkowania","Wspomaganie kierownicy","Skórzana tapicerka","Komputer pokładowy","Nawigacja GPS","Bluetooth","Apple CarPlay","Android Auto","Czujnik deszczu","Kierownica wielofunkcyjna","Klimatyzacja dwustrefowa","Elektrycznie składane lusterka","Podgrzewana przednia szyba","USB","Tapicerka półskórzana","Ekran dotykowy"],"Bezpieczeństwo":["ABS","ESP","ASR","Autoalarm","Poduszki powietrzne","Immobilizer","Asystent pasa ruchu","Asystent martwego pola","System awaryjnego hamowania","Czujniki parkowania przód","Czujniki parkowania tył","Kamera cofania","Kamera 360°","ISOFIX","Kontrola ciśnienia opon"],"Wygląd i oświetlenie":["Światła LED","Światła przeciwmgielne","Halogeny","Światła do jazdy dziennej","Reflektory ksenonowe","Felgi aluminiowe","Przyciemniane szyby","Dach panoramiczny","Szyberdach","Relingi dachowe","Hak holowniczy"],"Użytkowe":["Drzwi boczne przesuwne","Dwoje drzwi bocznych przesuwnych","Czujniki cofania","Przegroda przestrzeni ładunkowej","Zabudowa ładunkowa","Napęd 4x4","Tryby jazdy","Elektryczna klapa bagażnika"],"Informacje dodatkowe":["Książka serwisowa","Dwa kluczyki","Nowe opony"]};
function wroomerPublicEquipment(description,escape){
 const matches=[...String(description||'').matchAll(/\[\[WROOMER_EQ:([A-Za-z0-9%._~-]+)\]\]/g)];
 if(!matches.length)return '';
 try{
  const selected=JSON.parse(decodeURIComponent(matches.at(-1)[1]));
  if(!selected||typeof selected!=='object'||Array.isArray(selected))return '';
  const sections=[];
  for(const [group,allowed] of Object.entries(WROOMER_PUBLIC_EQUIPMENT)){
   const items=Array.isArray(selected[group])?[...new Set(selected[group].filter(item=>allowed.includes(item)))]:[];
   if(items.length)sections.push('<h4 style="margin:16px 0 9px">'+escape(group)+'</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px">'+items.map(item=>'<span class="wroomer-eq-pill" style="display:flex;align-items:center;gap:7px;font-size:13px"><span aria-hidden="true" style="display:inline-grid;place-items:center;background:#14833d;color:white;width:17px;height:17px;border-radius:50%;flex-shrink:0">✓</span>'+escape(item)+'</span>').join('')+'</div>');
  }
  return sections.length?'<section class="wroomer-eq-display" style="margin:20px 0;padding:17px;border:1px solid #353535;border-radius:12px;background:#191919"><h3 style="color:#ff8b20">Wyposażenie i opcje</h3>'+sections.join('')+'</section>':'';
 }catch(_){return '';}
}
function wroomerVideoLink(html){return html.replaceAll('https://www.youtube.com/@vitoocarsadamwitos','<a href="https://www.youtube.com/@vitoocarsadamwitos" target="_blank" rel="noopener noreferrer" style="color:#ff8b20;text-decoration:underline">https://www.youtube.com/@vitoocarsadamwitos</a>');}

function cleanPublicDescription(value){
 return String(value??'').replace(/\n?\[\[WROOMER_EQ:[^\]\r\n]*\]\]/gi,'').replace(/\[WROOMER_EQ:[^\]\r\n]*\]/gi,'').replace(/\[(?=[^\]\r\n]*\bPrzebieg\s*:)(?=[^\]\r\n]*\bPaliwo\s*:)[^\]\r\n]*\]/gi,'').replace(/\n[ \t]*\n[ \t]*\n/g,'\n\n').trim();
}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
  const slug=String(Array.isArray(req.query.slug)?req.query.slug[0]:(req.query.slug||'')).trim();
  if(!/^[a-zA-Z0-9_-]{1,150}$/.test(slug)){res.setHeader('X-Robots-Tag','noindex, nofollow');res.status(404).send('Nie znaleziono ogłoszenia');return;}
  try{
    const field=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)?'id':'slug';
    const response=await fetch(API+'/rest/v1/ogloszenia?'+field+'=eq.'+encodeURIComponent(slug)+'&is_banned=eq.false&status=eq.active&select=*&limit=1',{
      headers:{apikey:KEY,Authorization:'Bearer '+KEY},signal:AbortSignal.timeout(7000)});
    if(!response.ok)throw new Error('Backend response '+response.status);
    const rows=await response.json(), car=Array.isArray(rows)?rows[0]:null;
    if(!car){res.setHeader('X-Robots-Tag','noindex, nofollow');res.status(404).send('Nie znaleziono ogłoszenia');return;}
    const title=String(car.title||[car.brand||car.marka,car.model,car.year||car.rocznik].filter(Boolean).join(' ')||'Samochód').slice(0,110);
    const url='https://www.wroomer.pl/auto/'+encodeURIComponent(slug);
    const publicDescription=cleanPublicDescription(car.description||car.opis||'');
    const description=[title,car.location||car.lokalizacja||car.miasto,Number.isFinite(Number(car.price??car.cena))&&Number(car.price??car.cena)>0?Number(car.price??car.cena).toLocaleString('pl-PL')+' zł':'',publicDescription.replace(/\s+/g,' ').slice(0,95)].filter(Boolean).join(' • ').slice(0,160);
    let pictures=Array.isArray(car.images)?[...car.images]:[];
    if(typeof car.images==='string'){try{pictures=JSON.parse(car.images)}catch{pictures=[car.images]}}
    if(!Array.isArray(pictures))pictures=[];
    if(!pictures.length&&Array.isArray(car.zdjecia))pictures=[...car.zdjecia];
    if(!pictures.length&&typeof car.zdjecia==='string'){try{pictures=JSON.parse(car.zdjecia)}catch{pictures=[car.zdjecia]}}
    pictures=pictures.map(p=>typeof p==='string'?p:(p&&typeof p==='object'?(p.url||p.src||p.image_url||''):''));
    if(car.image_url||car.image)pictures.unshift(car.image_url||car.image);
    pictures=[...new Set(pictures.filter(x=>typeof x==='string').map(x=>x.trim()).filter(x=>/^https:\/\/[^\s<>"']+$/i.test(x)))].slice(0,30);
    const numericPrice=Number(car.price??car.cena);
    const validPrice=Number.isFinite(numericPrice)&&numericPrice>0;
    const schema={'@context':'https://schema.org','@type':'Car',name:title,url,description:(publicDescription||title).slice(0,500),...((car.brand||car.marka)?{brand:{'@type':'Brand',name:car.brand||car.marka}}:{}),...(car.model?{model:car.model}:{}),...(pictures.length?{image:pictures}:{}),...(validPrice?{offers:{'@type':'Offer',url,price:numericPrice,priceCurrency:'PLN'}}:{})};
    const messengerUrl=/^https:\/\/www\.facebook\.com\/marketplace\/item\/\d+\/$/.test(car.messenger_url||'')?car.messenger_url:'';
    const phone=String(car.phone||car.telefon||'').trim();
    const safePhone=/^\+?[0-9 ()-]{6,24}$/.test(phone)&&phone.replace(/\D/g,'').length>=9&&phone.replace(/\D/g,'').length<=15?phone:'';
    const phoneHref=safePhone.replace(/[^+\d]/g,'');
    const price=Number.isFinite(Number(car.price??car.cena))&&Number(car.price??car.cena)>0?Number(car.price??car.cena).toLocaleString('pl-PL')+' zł':'';
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    // Reuse the original interactive listing page instead of replacing it with a reduced SSR-only view.
    const template=readFileSync(join(process.cwd(),'auto.html'),'utf8');
    const placeholder='<div id="content" class="card">Ładowanie...</div>';
    if(!template.includes(placeholder))throw Error('Listing template mismatch');
    const image=pictures[0]||'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#151515"/><text x="400" y="300" text-anchor="middle" fill="#aaa" font-size="36" font-family="Arial">Brak zdjęcia</text></svg>');
    const responsivePhoto=(url,attrs)=>{
      const mobile=globalThis.WroomerPhotos.variants(url)[0];
      const img='<img src="'+esc(url)+'" '+attrs+(mobile?' data-original="'+esc(url)+'" onerror="WroomerPhotos.retry(this)"':'')+'>';
      return mobile?'<picture><source media="(max-width: 767px)" srcset="'+esc(mobile)+'">'+img+'</picture>':img;
    };
    const gallery='<div class="gallery-main" id="galleryMain">'+responsivePhoto(image,'id="mainImg" alt="'+esc(title)+'" loading="eager"')+
      (car.accepts_trade===true?'<span class="trade-badge">Zamiana</span>':'')+(pictures.length?'<span class="counter" id="mainCounter">1 / '+pictures.length+'</span>':'')+'</div>'+
      (pictures.length?'<div class="thumbs">'+pictures.map((url,index)=>responsivePhoto(url,'class="'+(index===0?'active':'')+'" loading="lazy" alt="'+esc(title)+' — zdjęcie '+(index+1)+'"')).join('')+'</div>':'');
    const details='<div class="info"><h1>'+esc(title)+'</h1><div class="meta">'+esc([car.brand||car.marka,car.model,car.location||car.lokalizacja||car.miasto,car.year||car.rocznik].filter(Boolean).join(' • '))+'</div>'+
      '<div class="price">'+esc(price||'Cena do uzgodnienia')+'</div>'+wroomerPublicEquipment(car.description||car.opis||'',esc)+'<div class="desc">'+wroomerVideoLink(esc(cleanPublicDescription(car.description||car.opis||'')))+'</div>'+
      (safePhone?'<a class="btn" href="tel:'+esc(phoneHref)+'">📞 ZADZWOŃ: '+esc(safePhone)+'</a>':messengerUrl?'':'<div class="meta">Numer telefonu niedostępny</div>')+
      (messengerUrl?'<a class="btn" href="'+esc(messengerUrl)+'" target="_blank" rel="noopener noreferrer">Napisz na Messengerze</a>':'')+
      '<div style="margin-top:20px"><a href="/" style="color:#888">← Wróć do listy</a></div></div>';
    const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Ogłoszenia samochodowe',item:'https://www.wroomer.pl/'},{'@type':'ListItem',position:2,name:title,item:url}]};
    const jsonLd=JSON.stringify(schema).replace(/</g,'\\u003c');
    const breadcrumbLd=JSON.stringify(breadcrumb).replace(/</g,'\\u003c');
    const head='<link rel="canonical" href="'+esc(url)+'">'+
      '<meta property="og:url" content="'+esc(url)+'">'+
      (pictures.length?'<meta property="og:image" content="'+esc(pictures[0])+'">':'')+
      '<meta name="twitter:title" content="'+esc(title)+'">'+
      '<meta name="twitter:description" content="'+esc(description)+'">'+
      (pictures.length?'<meta name="twitter:image" content="'+esc(pictures[0])+'">':'')+
      '<script type="application/ld+json" id="listing-structured-data">'+jsonLd+'</script>'+
      '<script type="application/ld+json" id="listing-breadcrumbs">'+breadcrumbLd+'</script>';
    const html=template
      .replace(/<title>[^<]*<\/title>/i,'<title>'+esc(title)+' | WROOMER.PL</title>')
      .replace(/<meta name="description" content="[^"]*">/i,'<meta name="description" content="'+esc(description)+'">')
      .replace(/<meta property="og:title" content="[^"]*">/i,'<meta property="og:title" content="'+esc(title)+'">')
      .replace(/<meta property="og:description" content="[^"]*">/i,'<meta property="og:description" content="'+esc(description)+'">')
      .replace('</head>',head+'</head>')
      .replace(placeholder,'<div id="content" class="card">'+gallery+details+'</div>');
    res.status(200).send(html);
  }catch(e){res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Cache-Control','no-store');res.status(502).send('Błąd odczytu ogłoszenia');}
}
