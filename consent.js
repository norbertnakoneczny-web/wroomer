
// WROOMER.PL - Consent Mode v2 + Cookie Banner PRO
(function(){
  const CONSENT_KEY = 'wroomer_consent_v2';
  const GA_ID = 'G-34L1GMG3GK';
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  
  // default denied - musi być PRZED gtag config
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  });
  gtag('js', new Date());
  gtag('config', GA_ID, { 'anonymize_ip': true, 'send_page_view': false });

  function getConsent(){ try{return JSON.parse(localStorage.getItem(CONSENT_KEY))}catch{return null} }
  function saveConsent(c){
    localStorage.setItem(CONSENT_KEY, JSON.stringify({...c, date: new Date().toISOString()}));
    applyConsent(c);
    hideBanner();
  }
  function applyConsent(c){
    const granted = c.analytics ? 'granted' : 'denied';
    const adGranted = c.marketing ? 'granted' : 'denied';
    gtag('consent', 'update', {
      'ad_storage': adGranted,
      'analytics_storage': granted,
      'ad_user_data': adGranted,
      'ad_personalization': adGranted
    });
    if(c.analytics){ gtag('event','page_view'); }
  }
  function hideBanner(){ const b=document.getElementById('cookieBanner'); if(b) b.style.display='none'; }
  function showBanner(){ const b=document.getElementById('cookieBanner'); if(b) b.style.display='flex'; }

  window.acceptAllCookies = function(){
    saveConsent({analytics:true, marketing:true, necessary:true});
  }
  window.rejectAllCookies = function(){
    saveConsent({analytics:false, marketing:false, necessary:true});
  }
  window.saveCustomCookies = function(){
    const a = document.getElementById('cAnalytics')?.checked;
    const m = document.getElementById('cMarketing')?.checked;
    saveConsent({analytics:!!a, marketing:!!m, necessary:true});
  }
  window.openCookieSettings = function(){
    const b=document.getElementById('cookieBanner');
    if(b){ b.style.display='flex'; document.getElementById('cookieCustom').style.display='block'; }
    else { alert('Banner cookies - odśwież stronę'); }
  }

  document.addEventListener('DOMContentLoaded', function(){
    const saved = getConsent();
    if(!saved){ showBanner(); } else { applyConsent(saved); }
  });
})();
