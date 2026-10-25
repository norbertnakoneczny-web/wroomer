// WROOMER.PL — cookies: brak opcjonalnych skryptów przed wyborem użytkownika.
(function(){
 'use strict';
 const KEY='wroomer_cookie_choice_2026_10',GA='G-34L1GMG3GK',MAX_AGE=180*24*3600*1000;
 let gaLoaded=false;
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
 window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&Date.now()-x.timestamp<MAX_AGE?x:null;}catch{return null;}}
 function show(){const b=document.getElementById('cookieBanner');if(b)b.style.display='block';}
 function hide(){const b=document.getElementById('cookieBanner');if(b)b.style.display='none';}
 function loadGA(){if(gaLoaded)return;gaLoaded=true;const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA);document.head.appendChild(script);window.gtag('js',new Date());window.gtag('config',GA,{anonymize_ip:true});}
 function apply(c){window.gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied'});if(c.analytics)loadGA();}
 function save(analytics,marketing){const c={analytics:!!analytics,marketing:!!marketing,timestamp:Date.now()};localStorage.setItem(KEY,JSON.stringify(c));apply(c);hide();}
 window.acceptAllCookies=()=>save(true,true);
 window.rejectAllCookies=()=>save(false,false);
 window.saveCustomCookies=()=>save(!!document.getElementById('cAnalytics')?.checked,!!document.getElementById('cMarketing')?.checked);
 window.openCookieSettings=()=>{const c=read();const a=document.getElementById('cAnalytics'),m=document.getElementById('cMarketing');if(a)a.checked=!!c?.analytics;if(m)m.checked=!!c?.marketing;const p=document.getElementById('cookieCustom');if(p)p.style.display='block';const b=document.getElementById('cookieSave');if(b)b.style.display='inline-block';show();};
 document.addEventListener('DOMContentLoaded',()=>{const c=read();if(c)apply(c);else show();});
})();
