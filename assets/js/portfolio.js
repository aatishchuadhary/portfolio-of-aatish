(function(){
'use strict';
var root=document.documentElement,page=document.body.dataset.page;
var PAGES=[['index.html','Home','home'],['about.html','About','about'],['skills.html','Skills','skills'],['experience.html','Experience','experience'],['projects.html','Projects','projects'],['blog.html','Blog','blog'],['resume.html','Résumé','resume'],['contact.html','Contact','contact']];
function store(v){try{if(v)localStorage.setItem('theme',v);else return localStorage.getItem('theme')}catch(e){}}
function theme(){return store()||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}
function apply(t){root.dataset.theme=t;var b=document.getElementById('themeBtn');if(b){b.innerHTML='<i class="fa-solid fa-'+(t==='dark'?'sun':'moon')+'" aria-hidden="true"></i>';b.setAttribute('aria-label','Switch to '+(t==='dark'?'light':'dark')+' theme')}}
// shared header + footer
var links=PAGES.map(function(p){return '<li><a href="'+p[0]+'"'+(p[2]===page?' aria-current="page"':'')+'>'+p[1]+'</a></li>'}).join('');
document.body.insertAdjacentHTML('afterbegin','<a class="skip" href="#main">Skip to content</a><header><div class="container"><nav aria-label="Main"><a class="logo" href="index.html" aria-label="Aatish Chaudhary, home">AC<span>.</span></a><ul class="nav-links" id="navLinks">'+links+'</ul><div class="right"><button class="icon-btn" id="themeBtn" type="button"></button><button class="icon-btn menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><i class="fa-solid fa-bars" aria-hidden="true"></i></button></div></nav></div></header>');
document.body.insertAdjacentHTML('beforeend','<footer><div class="container"><p>© 2026 Aatish Chaudhary. Backend Developer Portfolio.</p><ul>'+links+'</ul></div></footer>');
var main=document.querySelector('main');if(main)main.id='main';
apply(theme());
document.getElementById('themeBtn').addEventListener('click',function(){var t=root.dataset.theme==='dark'?'light':'dark';store(t);apply(t)});
var mb=document.getElementById('menuBtn'),nl=document.getElementById('navLinks');
function menu(o){nl.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')}
mb.addEventListener('click',function(){menu(!nl.classList.contains('open'))});
nl.addEventListener('click',function(e){if(e.target.closest('a'))menu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)});
// typing (static text when reduced motion)
var ty=document.getElementById('typing');
if(ty){var roles=['Backend Developer','.NET Developer','Software Engineer','API Developer'];
if(matchMedia('(prefers-reduced-motion: reduce)').matches){ty.textContent=roles[0]}else{var ri=0,ci=0,del=false;(function tick(){var r=roles[ri];ty.textContent=r.substring(0,ci);if(!del&&ci===r.length){del=true;return setTimeout(tick,1400)}if(del&&ci===0){del=false;ri=(ri+1)%roles.length}ci+=del?-1:1;setTimeout(tick,del?45:100)})()}}
var pb=document.getElementById('printBtn');if(pb)pb.addEventListener('click',function(){window.print()});
// project filters
var fb=document.getElementById('filters');
if(fb){var cards=[].slice.call(document.querySelectorAll('[data-tags]')),em=document.getElementById('noResults');
var tags={};cards.forEach(function(c){c.dataset.tags.split(',').forEach(function(t){tags[t]=1})});
fb.innerHTML='<button type="button" aria-pressed="true" data-f="">All projects</button>'+Object.keys(tags).sort().map(function(t){return '<button type="button" aria-pressed="false" data-f="'+t+'">'+t+'</button>'}).join('');
fb.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
[].forEach.call(fb.children,function(x){x.setAttribute('aria-pressed',x===b)});
var n=0;cards.forEach(function(c){var s=!b.dataset.f||c.dataset.tags.split(',').indexOf(b.dataset.f)>-1;c.hidden=!s;if(s)n++});
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
