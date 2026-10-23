(function(){
'use strict';
var root=document.documentElement,page=document.body.dataset.page;
var PAGES=[['index.html','Home','home'],['about.html','About','about'],['skills.html','Skills','skills'],['experience.html','Experience','experience'],['projects.html','Projects','projects'],['resume.html','Résumé','resume'],['contact.html','Contact','contact']];
var FOOT=PAGES.slice(0,6).concat([['blog.html','Blog','blog']],[PAGES[6]]);
function store(v){try{if(v)localStorage.setItem('theme',v);else return localStorage.getItem('theme')}catch(e){}}
function theme(){return store()||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}
function apply(t){root.dataset.theme=t;var b=document.getElementById('themeBtn');if(b){b.innerHTML='<i class="fa-solid fa-'+(t==='dark'?'sun':'moon')+'" aria-hidden="true"></i>';b.setAttribute('aria-label','Switch to '+(t==='dark'?'light':'dark')+' theme')}}
function mk(list){return list.map(function(p){var cur=p[2]===page||(page==='projects'&&p[2]==='projects');return '<li><a href="'+p[0]+'"'+(cur?' aria-current="page"':'')+'>'+p[1]+'</a></li>'}).join('')}
var links=mk(PAGES),flinks=mk(FOOT);
// shared header (with Nepal date/time bar) + footer
document.body.insertAdjacentHTML('afterbegin','<a class="skip" href="#main">Skip to content</a><header>'
+'<div class="infobar"><div class="container infobar-in" role="group" aria-label="Nepal date and time"><div class="ib-left">'
+'<span><span class="ib-k">Nepali Date:</span><strong id="npDate">—</strong></span>'
+'<span><span class="ib-k">Nepal Time:</span><strong id="npTime">—</strong></span></div>'
+'<span class="ib-sub" id="npSub"></span></div></div>'
+'<div class="container"><nav aria-label="Main"><a class="logo" href="index.html" aria-label="Aatish Chaudhary, home">AC<span>.</span></a><ul class="nav-links" id="navLinks">'+links+'</ul><div class="right"><button class="icon-btn" id="themeBtn" type="button"></button><button class="icon-btn menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><i class="fa-solid fa-bars" aria-hidden="true"></i></button></div></nav></div></header>');
document.body.insertAdjacentHTML('beforeend','<footer><div class="container"><p>© 2026 Aatish Chaudhary. Backend Developer Portfolio.</p><ul>'+flinks+'</ul></div></footer>');
var main=document.querySelector('main');if(main)main.id='main';
apply(theme());
document.getElementById('themeBtn').addEventListener('click',function(){var t=root.dataset.theme==='dark'?'light':'dark';root.classList.add('theme-anim');store(t);apply(t);setTimeout(function(){root.classList.remove('theme-anim')},350)});
var mb=document.getElementById('menuBtn'),nl=document.getElementById('navLinks');
function menu(o){nl.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')}
mb.addEventListener('click',function(){menu(!nl.classList.contains('open'))});
nl.addEventListener('click',function(e){if(e.target.closest('a'))menu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)});

// ---- Nepal clock + Bikram Sambat date (no network; data in nepali-date.js) ----
(function(){
var dEl=document.getElementById('npDate'),tEl=document.getElementById('npTime'),sEl=document.getElementById('npSub');
var BS=window.NepaliBS,fmt=null,lastKey='',lastDate='',lastSub='';
try{fmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kathmandu',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric',hourCycle:'h23'})}catch(e){}
function nepalNow(){ // returns Nepal wall-clock parts regardless of the visitor's timezone
 var now=new Date(),p={};
 if(fmt){fmt.formatToParts(now).forEach(function(x){if(x.type!=='literal')p[x.type]=+x.value});return p}
 var n=new Date(now.getTime()+20700000); // fallback: fixed UTC+05:45 (Nepal has no DST)
 return{year:n.getUTCFullYear(),month:n.getUTCMonth()+1,day:n.getUTCDate(),hour:n.getUTCHours(),minute:n.getUTCMinutes(),second:n.getUTCSeconds()}}
function pad(n){return n<10?'0'+n:''+n}
var DAYS_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var EN_M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function tick(){
 var p=nepalNow(),key=p.year+'-'+p.month+'-'+p.day;
 if(key!==lastKey){lastKey=key;
  var dow=new Date(Date.UTC(p.year,p.month-1,p.day)).getUTCDay(),bs=BS?BS.fromAD(p.year,p.month,p.day):null;
  if(bs){lastDate=bs.day+' '+BS.NAMES_EN[bs.month-1]+' '+bs.year+' BS, '+DAYS_EN[dow];
   lastSub=p.day+' '+EN_M[p.month-1]+' '+p.year}
  else{lastDate='Unavailable';lastSub=p.day+' '+EN_M[p.month-1]+' '+p.year+' (BS date unavailable)'}
  dEl.textContent=lastDate}
 var h12=p.hour%12||12,per=p.hour<12?'AM':'PM';
 var s=pad(h12)+':'+pad(p.minute)+':'+pad(p.second)+' '+per;
 tEl.textContent=s;
 var sub=lastSub+' · NPT (UTC+5:45)';if(sEl.textContent!==sub)sEl.textContent=sub}
tick();setInterval(tick,1000);
})();

// typing (static text when reduced motion)
var ty=document.getElementById('typing');
if(ty){var roles=['Backend Developer','.NET Developer','Software Engineer','API Developer'];
if(matchMedia('(prefers-reduced-motion: reduce)').matches){ty.textContent=roles[0]}else{var ri=0,ci=0,del=false;(function tick(){var r=roles[ri];ty.textContent=r.substring(0,ci);if(!del&&ci===r.length){del=true;return setTimeout(tick,1400)}if(del&&ci===0){del=false;ri=(ri+1)%roles.length}ci+=del?-1:1;setTimeout(tick,del?45:100)})()}}
var pb=document.getElementById('printBtn');if(pb)pb.addEventListener('click',function(){window.print()});

// project filters (category + technology)
var fb=document.getElementById('filters');
if(fb){var cards=[].slice.call(document.querySelectorAll('[data-tags]')),em=document.getElementById('noResults');
var keys={};cards.forEach(function(c){(c.dataset.cat?[c.dataset.cat]:[]).concat(c.dataset.tags?c.dataset.tags.split(','):[]).forEach(function(t){keys[t]=1})});
function esc(s){return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
fb.innerHTML='<button type="button" aria-pressed="true" data-f="">All projects</button>'+Object.keys(keys).sort().map(function(t){return '<button type="button" aria-pressed="false" data-f="'+esc(t)+'">'+esc(t)+'</button>'}).join('');
function match(c,f){return !f||c.dataset.cat===f||(c.dataset.tags?c.dataset.tags.split(','):[]).indexOf(f)>-1}
fb.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
[].forEach.call(fb.children,function(x){x.setAttribute('aria-pressed',x===b)});
var n=0;cards.forEach(function(c){var s=match(c,b.dataset.f);c.hidden=!s;if(s)n++});
em.hidden=n>0;document.getElementById('count').textContent=n+(n===1?' project':' projects')+' shown'})}

// contact form: Formspree (original endpoint) via fetch, mailto fallback
var f=document.getElementById('contactForm');
if(f){var st=document.getElementById('status');
function chk(i){var m='';if(i.validity.valueMissing)m='This field is required.';else if(i.validity.typeMismatch)m='Enter a valid email address.';var e=document.getElementById(i.id+'Err');e.textContent=m;i.setAttribute('aria-invalid',!!m);return!m}
f.addEventListener('submit',function(e){e.preventDefault();var ok=[].map.call(f.querySelectorAll('input,textarea'),chk).every(Boolean);if(!ok){f.querySelector('[aria-invalid=true]').focus();return}
st.textContent='Sending…';var btn=f.querySelector('button');btn.disabled=true;
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){if(!r.ok)throw 0;f.reset();st.textContent='Your message was sent to the Formspree form service. Aatish will reply by email.'}).catch(function(){var d=new FormData(f);st.innerHTML='The message could not be sent. <a href="mailto:mailtoaatish6@mail.com?subject='+encodeURIComponent(d.get('subject'))+'&body='+encodeURIComponent(d.get('message'))+'">Open your email app instead</a>.'}).then(function(){btn.disabled=false})});
f.addEventListener('focusout',function(e){if(e.target.matches('input,textarea'))chk(e.target)})}
})();
