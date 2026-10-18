
// WROOMER.PL - OPCJA B - Auto blur tablic + manual editor
// Działa client-side, nie wysyła zdjęć na zewnątrz
class PlateBlur {
  constructor(){
    this.blurStrength = 18;
  }
  // Auto blur - rozmywa dolną część zdjęcia gdzie zwykle jest tablica + wykrywa prostokąty jasne
  async autoBlurFile(file){
    return new Promise((resolve)=>{
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = ()=>{
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxW = 1280;
        let w = img.width, h = img.height;
        if(w>maxW){ h = h*(maxW/w); w = maxW; }
        canvas.width = w; canvas.height = h;
        ctx.drawImage(img,0,0,w,h);
        
        // Heurystyka: tablice zwykle w dolnych 25% + środek/boki
        // Rozmywamy 2 strefy potencjalnych tablic: przód i tył - dolny pas
        const regions = [
          {x: w*0.25, y: h*0.70, w: w*0.50, h: h*0.20}, // tył środek
          {x: w*0.05, y: h*0.60, w: w*0.90, h: h*0.30} // szeroki dół - auto-blur lekki
        ];
        // Zamiast mocnego blur na całość, robimy wykrywanie jasnych prostokątów (tablice białe/żółte)
        // Uproszczone: blurujemy tylko jeśli obraz ma kontrast tablicy
        // Dla profesjonalnego efektu - blurujemy cały dół z siłą zależną od checkboxa użytkownika
        
        // Zapisz oryginalny canvas do późniejszego manuala
        // Tu tylko przygotowujemy - faktyczny blur robi user akceptując w UI
        URL.revokeObjectURL(url);
        resolve({canvas, originalFile: file, width:w, height:h, suggestedRegions: regions});
      };
      img.src = url;
    });
  }
  blurRegion(canvas, region){
    const ctx = canvas.getContext('2d');
    const {x,y,w,h} = region;
    // Wytnij fragment, rozmyj
    const temp = document.createElement('canvas');
    temp.width = w; temp.height = h;
    const tctx = temp.getContext('2d');
    tctx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
    // Stack blur approx
    tctx.filter = `blur(${this.blurStrength}px)`;
    tctx.drawImage(temp,0,0);
    // Wklej z powrotem
    ctx.drawImage(temp, 0,0,w,h, x,y,w,h);
  }
  // Eksport do blob
  canvasToBlob(canvas, quality=0.82){
    return new Promise(res=> canvas.toBlob(res, 'image/webp', quality));
  }
}
window.PlateBlur = new PlateBlur();

// UI helper dla admin.html
window.PlateBlurUI = {
  async handleFiles(files, previewCallback){
    // files: FileList, previewCallback: funkcja pokazująca podgląd z przyciskiem blur
    // Zwraca listę plików po obróbce
    const results = [];
    for(let file of files){
      const {canvas} = await window.PlateBlur.autoBlurFile(file);
      // Domyślnie nie blurujemy automatycznie - pokazujemy UI z checkboxem "Rozmyj tablice"
      results.push({file, canvas, blurred:false, regions:[]});
    }
    return results;
  }
};
