
console.log('WROOMER FIX ERROR 4s');
function wroomerTab(tab){['pro','stats','edycja','ban'].forEach(t=>{const el=document.getElementById('tab-'+t);const btn=document.getElementById('btn-'+t);if(el)el.style.display=t===tab?'block':'none';if(btn)btn.classList.toggle('active',t===tab);});}
function wroomerEdit(){const id=document.getElementById('wroomerEditInput')?.value;alert('EDYCJA WROOMER ID: '+id);}
function wroomerBan(){const id=document.getElementById('wroomerBanInput')?.value;alert('BAN: '+id);}
function wroomerUnban(){const id=document.getElementById('wroomerBanInput')?.value;alert('UNBAN: '+id);}
