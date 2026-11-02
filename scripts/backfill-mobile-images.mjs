// Backfill independently stored smartphone images without touching originals.
// Run with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in a trusted environment.
// npm install --no-save @supabase/supabase-js sharp
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
const db=createClient(url,key,{auth:{persistSession:false}});
const bucket='ogloszenia';
let processed=0,skipped=0,failed=0;
async function processFolder(prefix=''){
 let offset=0;
 while(true){
  const {data,error}=await db.storage.from(bucket).list(prefix,{limit:100,offset,sortBy:{column:'name',order:'asc'}});
  if(error)throw error;
  if(!data?.length)break;
  for(const entry of data){
   if(!entry.id){if(entry.name!=='mobile')await processFolder(prefix+entry.name+'/');continue;}
   if(prefix.includes('/mobile/'))continue;
   if(!/\.(jpe?g|png|webp|avif)$/i.test(entry.name))continue;
   const original=prefix+entry.name;
   const target=prefix+'mobile/'+entry.name.replace(/\.[^.]+$/,'')+'.webp';
   try{
    const {data:existing,error:checkError}=await db.storage.from(bucket).info(target);
    if(existing&&!checkError){skipped++;continue;}
    const {data:blob,error:downloadError}=await db.storage.from(bucket).download(original);
    if(downloadError)throw downloadError;
    const resized=await sharp(Buffer.from(await blob.arrayBuffer())).rotate().resize({width:800,height:800,fit:'inside',withoutEnlargement:true}).webp({quality:65}).toBuffer();
    const {error:uploadError}=await db.storage.from(bucket).upload(target,resized,{contentType:'image/webp',upsert:false});
    if(uploadError){if(/already exists|duplicate/i.test(uploadError.message)){skipped++;continue;}throw uploadError;}
    processed++;console.log('CREATED',target,resized.length);
   }catch(e){failed++;console.error('FAILED',original,e.message);}
  }
  if(data.length<100)break;
  offset+=data.length;
 }
}
await processFolder();
console.log(JSON.stringify({processed,skipped,failed}));
if(failed)process.exitCode=1;
