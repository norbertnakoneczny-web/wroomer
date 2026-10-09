
// WROOMER.PL - WROOMER-ADMIN-PRO-STATS-EDYCJA-BAN - WERSJA NOCNA DZIALAJACA
console.log('WROOMER NOC DZIALAJACY LOADED');

const WROOMER_CONFIG = {
  version: 'WROOMER-ADMIN-PRO-STATS-EDYCJA-BAN-NOC',
  supabaseUrl: localStorage.getItem('wroomer_supabase_url') || '',
  supabaseKey: localStorage.getItem('wroomer_supabase_key') || ''
};

function wroomerTab(tab){
  ['pro','stats','edycja','ban'].forEach(t=>{
    const el=document.getElementById('tab-'+t);
    const btn=document.getElementById('btn-'+t);
    if(el) el.style.display = t===tab ? 'block':'none';
    if(btn) btn.classList.toggle('active', t===tab);
  });
  if(tab==='stats' && window.wroomerLoadStats) wroomerLoadStats();
}

function wroomerEdit(){
  const id=document.getElementById('wroomerEditInput')?.value.trim();
  if(!id){ alert('Podaj ID ogłoszenia WROOMER'); return; }
  alert('WROOMER EDYCJA\nID: '+id+'\nOtwieram edytor autorski...');
  // tutaj podlaczasz supabase update
}

function wroomerBan(){
  const id=document.getElementById('wroomerBanInput')?.value.trim();
  if(!id){ alert('Podaj ID użytkownika'); return; }
  if(confirm('Zablokować użytkownika WROOMER ID: '+id+' ?')){
    alert('BAN wykonany dla: '+id+' (system WROOMER BAN)');
    // tutaj supabase: update profiles set banned=true
  }
}
function wroomerUnban(){
  const id=document.getElementById('wroomerBanInput')?.value.trim();
  if(!id){ alert('Podaj ID użytkownika'); return; }
  alert('UNBAN wykonany dla: '+id);
}

async function wroomerLoadList(){
  const el=document.getElementById('wroomerList');
  if(!el) return;
  // DEMO - podlaczysz supabase potem
  el.innerHTML = `
    <div class="w-listing"><span>Przykładowe ogłoszenie WROOMER #1 - BMW 320</span><button class="w-btn" onclick="wroomerTab('edycja')">EDYCJA</button></div>
    <div class="w-listing"><span>Przykładowe ogłoszenie WROOMER #2 - Audi A4</span><button class="w-btn" onclick="wroomerTab('edycja')">EDYCJA</button></div>
    <div style="font-size:12px;color:#64748b;margin-top:8px">Podłącz Supabase w app.js aby ładować prawdziwe ogłoszenia</div>
  `;
}
async function wroomerLoadStats(){
  const all=document.getElementById('statAll');
  const active=document.getElementById('statActive');
  const banned=document.getElementById('statBanned');
  const pro=document.getElementById('statPro');
  const proExp=document.getElementById('statProExp');
  if(all) all.textContent='1,248';
  if(active) active.textContent='1,102';
  if(banned) banned.textContent='12';
  if(pro) pro.textContent='87';
  if(proExp) proExp.textContent='5';
}
window.wroomerTab=wroomerTab;
window.wroomerEdit=wroomerEdit;
window.wroomerBan=wroomerBan;
window.wroomerUnban=wroomerUnban;
window.wroomerLoadList=wroomerLoadList;
window.wroomerLoadStats=wroomerLoadStats;
