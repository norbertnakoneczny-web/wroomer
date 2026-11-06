(function(){
  const storage='https://bdpydgsfowtuvjnkyeeg.supabase.co/storage/v1/object/public/';
  const width='(max-width: 767px)';
  function mobilePath(path,extension='webp'){
    const slash=path.lastIndexOf('/');
    return path.slice(0,slash+1)+'mobile/'+path.slice(slash+1).replace(/\.[^.]+$/,'')+'.'+extension;
  }
  function variants(url){
    if(typeof url!=='string'||!url.startsWith(storage))return [];
    const path=url.slice(storage.length);
    if(path.includes('/mobile/'))return [];
    if(/^images\/[\da-f-]+\/dkimport-(?:4f82945f|f9a1f80d|e113cf9f)\/\d+\.webp$/.test(path))return [storage+mobilePath(path)];
    if(!path.startsWith('ogloszenia/'))return [];
    if(/\/v2_[^/]+\.(?:webp|jpg)$/.test(path))return [storage+mobilePath(path,path.endsWith('.jpg')?'jpg':'webp')];
    const mobile=storage+mobilePath(path);
    const mirror=mobile.replace('/public/ogloszenia/','/public/images/');
    return /\.jpe?g$/i.test(path)?[mirror,mobile]:[mobile,mirror];
  }
  function mobile(){return typeof matchMedia==='function'&&matchMedia(width).matches;}
  function set(img,url,first){
    if(!img)return;
    if(img.dataset.photoUrl===url&&first===undefined)return;
    img.dataset.photoUrl=url;
    const candidates=[...(mobile()?variants(url):[]),url];
    let index=first||0;
    img.onerror=()=>{if(++index<candidates.length)img.src=candidates[index];else img.onerror=null;};
    img.src=candidates[index]||url;
  }
  function retry(img){
    const source=img.parentElement?.querySelector('source');
    if(source)source.remove();
    const url=img.dataset.original;
    if(url)set(img,url,mobile()&&variants(url).length?1:0);
  }
  async function resize(file,max,quality){
    const url=URL.createObjectURL(file);
    try{
      const image=new Image();
      await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Nie można odczytać zdjęcia: '+file.name));image.src=url;});
      const scale=Math.min(1,max/Math.max(image.naturalWidth,image.naturalHeight));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
      canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
      const context=canvas.getContext('2d',{alpha:false});
      if(!context)throw new Error('Brak obsługi kompresji zdjęć.');
      context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);
      context.drawImage(image,0,0,canvas.width,canvas.height);
      const encode=type=>new Promise(resolve=>canvas.toBlob(resolve,type,quality));
      let blob=await encode('image/webp');
      if(blob?.type!=='image/webp')blob=await encode('image/jpeg');
      canvas.width=0;canvas.height=0;
      if(!blob||!['image/webp','image/jpeg'].includes(blob.type))throw new Error('Nie udało się skompresować zdjęcia: '+file.name);
      return {blob,extension:blob.type==='image/webp'?'webp':'jpg'};
    }finally{URL.revokeObjectURL(url);}
  }
  async function upload(bucket,owner,file,index,paths){
    const desktop=await resize(file,1600,0.78);
    const phone=await resize(file,800,0.65);
    const path=owner+'/v2_'+Date.now()+'_'+index+'_'+Math.random().toString(36).slice(2,8)+'.'+desktop.extension;
    const phonePath=mobilePath(path,phone.extension);
    if(phone.extension!==desktop.extension)throw new Error('Przeglądarka nie zapisała obu wersji zdjęcia w tym samym formacie.');
    for(const [target,photo] of [[path,desktop],[phonePath,phone]]){
      const {error}=await bucket.upload(target,photo.blob,{contentType:photo.blob.type,upsert:false});
      if(error)throw new Error('Nie udało się zapisać obu wersji zdjęcia: '+error.message);
      paths.push(target);
    }
    return bucket.getPublicUrl(path).data.publicUrl;
  }
  globalThis.WroomerPhotos={variants,mobile,set,retry,upload};
})();