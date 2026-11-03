import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Automatically discover published, canonical articles at deployment time.
// New articles appear in this sitemap automatically after the next deployment.
const BASE='https://www.wroomer.pl';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
export default function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
 try{
  const dir=join(process.cwd(),'blog');
  const names=readdirSync(dir).filter(name=>/^[a-z0-9][a-z0-9-]*\.html$/.test(name));
  const urls=new Set();
  for(const name of names){
   const html=readFileSync(join(dir,name),'utf8');
   const robots=html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)/i)?.[1]||'';
   if(/noindex/i.test(robots))continue;
   const canonical=html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1];
   const expected=BASE+'/blog/'+name;
   // Only index a page under its canonical URL; skip redirect or conflicting canonical.
   if(canonical!==expected)continue;
   urls.add(expected);
  }
  const blogIndex=readFileSync(join(dir,'index.html'),'utf8');
  if(/<link\s+rel=["']canonical["']\s+href=["']https:\/\/www\.wroomer\.pl\/blog\/["']/i.test(blogIndex)&&!/name=["']robots["']\s+content=["'][^"']*noindex/i.test(blogIndex))urls.add(BASE+'/blog/');
  if(urls.size>50000)throw Error('sitemap limit exceeded');
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...urls].sort().map(u=>'<url><loc>'+esc(u)+'</loc></url>').join('\n')+'\n</urlset>';
  res.setHeader('Content-Type','application/xml; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=3600');
  return res.status(200).send(xml);
 }catch(e){
  res.setHeader('Cache-Control','no-store');
  return res.status(503).send('Mapa artykułów chwilowo niedostępna');
 }
}
