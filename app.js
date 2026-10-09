
// WROOMER - AUTORSKI SYSTEM - CLEAN - NO TRACE
// WROOMER-ADMIN-PRO-STATS-EDYCJA-BAN-CLEAN
console.log("WROOMER CLEAN LOADED");

function wroomerEdit(){
  const id = document.getElementById('wroomerEditInput')?.value;
  if(!id){ alert('Podaj ID ogloszenia WROOMER'); return; }
  alert('WROOMER EDYCJA: Ogloszenie '+id+' - tryb edycji autorski');
}
function wroomerBan(){
  const id = document.getElementById('wroomerBanInput')?.value;
  if(!id){ alert('Podaj ID uzytkownika WROOMER'); return; }
  if(confirm('Zablokowac uzytkownika WROOMER ID: '+id+' ?')){
    alert('Uzytkownik '+id+' zablokowany - system WROOMER BAN');
  }
}
const WROOMER_CONFIG = {
  version: "ADMIN-PRO-STATS-EDYCJA-BAN-CLEAN",
  noTrace: true,
  author: "WROOMER.PL"
};
