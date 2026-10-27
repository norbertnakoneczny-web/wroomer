// Server-side admin-only analytics proxy. Never expose Windsor API key in browser code.
const SUPABASE_URL='https://bdpydgsfowtuvjnkyeeg.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_S1qH_mBZaX7-bzmfJ0IVGA_6hxGbJWd';
const SNAPSHOT={"capturedAt":"2026-10-27","period":"Ostatnie 7 pełnych dni (20–26.10.2026)","rows":[{"date":"2026-10-20","source":"vercel.com","sessions":9,"screen_page_views":40},{"date":"2026-10-20","source":"(direct)","sessions":4,"screen_page_views":9},{"date":"2026-10-20","source":"google","sessions":4,"screen_page_views":12},{"date":"2026-10-20","source":"github.com","sessions":1,"screen_page_views":2},{"date":"2026-10-21","source":"vercel.com","sessions":46,"screen_page_views":150},{"date":"2026-10-21","source":"google","sessions":8,"screen_page_views":33},{"date":"2026-10-21","source":"(direct)","sessions":7,"screen_page_views":15},{"date":"2026-10-21","source":"github.com","sessions":4,"screen_page_views":6},{"date":"2026-10-21","source":"l.meta.ai","sessions":1,"screen_page_views":2},{"date":"2026-10-21","source":"m.facebook.com","sessions":1,"screen_page_views":1},{"date":"2026-10-22","source":"vercel.com","sessions":32,"screen_page_views":58},{"date":"2026-10-22","source":"(direct)","sessions":16,"screen_page_views":23},{"date":"2026-10-22","source":"google","sessions":5,"screen_page_views":7},{"date":"2026-10-22","source":"github.com","sessions":2,"screen_page_views":2},{"date":"2026-10-22","source":"m.facebook.com","sessions":1,"screen_page_views":2},{"date":"2026-10-23","source":"(direct)","sessions":7,"screen_page_views":11},{"date":"2026-10-23","source":"vercel.com","sessions":4,"screen_page_views":8},{"date":"2026-10-23","source":"google","sessions":3,"screen_page_views":3},{"date":"2026-10-23","source":"github.com","sessions":2,"screen_page_views":3},{"date":"2026-10-24","source":"(direct)","sessions":13,"screen_page_views":12},{"date":"2026-10-24","source":"google","sessions":4,"screen_page_views":6},{"date":"2026-10-24","source":"vercel.com","sessions":1,"screen_page_views":1},{"date":"2026-10-25","source":"(direct)","sessions":30,"screen_page_views":37},{"date":"2026-10-25","source":"vercel.com","sessions":7,"screen_page_views":8},{"date":"2026-10-25","source":"google","sessions":2,"screen_page_views":2},{"date":"2026-10-25","source":"chatgpt.com","sessions":1,"screen_page_views":1},{"date":"2026-10-26","source":"(direct)","sessions":15,"screen_page_views":21},{"date":"2026-10-26","source":"chatgpt.com","sessions":6,"screen_page_views":16},{"date":"2026-10-26","source":"(not set)","sessions":4,"screen_page_views":5},{"date":"2026-10-26","source":"google","sessions":1,"screen_page_views":2}]};
let cache=null;
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 if(req.method!=='GET')return res.status(405).json({error:'Niedozwolona metoda'});
 const token=(req.headers.authorization||'').match(/^Bearer (.+)$/i)?.[1];
 if(!token)return res.status(401).json({error:'Wymagane logowanie administratora'});
 try{
  const auth=await fetch(SUPABASE_URL+'/rest/v1/rpc/is_wroomer_admin',{method:'POST',headers:{apikey:PUBLISHABLE_KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:'{}'});
  if(!auth.ok||(await auth.json())!==true)return res.status(403).json({error:'Brak uprawnień administratora'});
  const period=req.query.period==='30'?'last_30d':'last_7d';
  const key=process.env.WINDSOR_API_KEY;
  if(!key)return res.status(200).json({...SNAPSHOT,mode:'snapshot',message:'Historyczny odczyt z Windsor.ai. Automatyczna aktualizacja wymaga konfiguracji WINDSOR_API_KEY w Vercel.'});
  const cacheKey=period;
  if(cache?.key===cacheKey&&Date.now()-cache.time<15*60*1000)return res.status(200).json({...cache.value,mode:'live-cache'});
  const u=new URL('https://connectors.windsor.ai/googleanalytics4');
  u.searchParams.set('api_key',key);u.searchParams.set('fields','date,source,sessions,screen_page_views');u.searchParams.set('date_preset',period);u.searchParams.set('_renderer','json');
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
  let response;try{response=await fetch(u,{signal:controller.signal,headers:{Accept:'application/json'}})}finally{clearTimeout(timeout)}
  if(!response.ok)throw new Error('Windsor HTTP '+response.status);
  const payload=await response.json();const raw=Array.isArray(payload)?payload:Array.isArray(payload.data)?payload.data:null;
  if(!raw)throw new Error('Nieoczekiwany format odpowiedzi Windsor');
  const rows=raw.map(x=>({date:String(x.date||''),source:String(x.source||'(not set)'),sessions:Number(x.sessions)||0,screen_page_views:Number(x.screen_page_views)||0}));
  const value={rows,capturedAt:new Date().toISOString(),period:period==='last_30d'?'Ostatnie 30 dni':'Ostatnie 7 dni'};cache={key:cacheKey,time:Date.now(),value};
  return res.status(200).json({...value,mode:'live'});
 }catch(e){return res.status(502).json({error:'Nie można pobrać statystyk Windsor.ai. '+String(e.message||'Błąd serwera').replace(/api_key=[^& ]+/g,'api_key=[redacted]')});}
}
