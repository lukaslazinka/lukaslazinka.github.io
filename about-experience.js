(() => {
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=window.matchMedia('(pointer:fine)').matches;
  const lang=()=>document.body.dataset.currentLanguage==='en'||document.documentElement.lang==='en'?'en':'lt';

  function localize(root=document){const l=lang();root.querySelectorAll?.('[data-lt][data-en]').forEach(el=>el.textContent=el.dataset[l]);}
  function spark(x,y){if(reduced)return;const s=document.createElement('span');s.className='x-click-spark';s.style.setProperty('--sx',`${x}px`);s.style.setProperty('--sy',`${y}px`);document.body.appendChild(s);setTimeout(()=>s.remove(),700)}

  function loadScrollFlow(){
    if(!document.querySelector('link[data-scroll-flow-style]')){
      const l=document.createElement('link');l.rel='stylesheet';l.href='scroll-flow.css?v=20260908-0805';l.dataset.scrollFlowStyle='true';document.head.appendChild(l);
    }
    if(!window.__lukasScrollFlow&&!document.querySelector('script[data-scroll-flow-script]')){
      const s=document.createElement('script');s.src='scroll-flow.js?v=20260908-0805';s.defer=true;s.dataset.scrollFlowScript='true';document.head.appendChild(s);
    }
  }

  function cursor(){if(!fine||reduced||document.querySelector('.gold-cursor-dot'))return;const d=document.createElement('span'),r=document.createElement('span');d.className='gold-cursor-dot';r.className='gold-cursor-ring';document.body.append(d,r);let tx=-100,ty=-100,rx=-100,ry=-100,raf;const tick=()=>{rx+=(tx-rx)*.18;ry+=(ty-ry)*.18;d.style.transform=`translate3d(${tx-3}px,${ty-3}px,0)`;r.style.transform=`translate3d(${rx}px,${ry}px,0)`;raf=requestAnimationFrame(tick)};document.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;document.documentElement.classList.add('gold-cursor-live')},{passive:true});document.addEventListener('pointerover',e=>document.documentElement.classList.toggle('gold-cursor-hover',!!e.target.closest('a,button,[role="button"]')));document.addEventListener('pointerleave',()=>document.documentElement.classList.remove('gold-cursor-live'));raf=requestAnimationFrame(tick);window.addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true})}

  function pageTransitions(){if('startViewTransition'in document)return;document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const a=e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;const h=a.getAttribute('href');if(!h||h.startsWith('#')||h.startsWith('mailto:')||h.startsWith('tel:'))return;const u=new URL(a.href,location.href);if(u.origin!==location.origin)return;e.preventDefault();document.body.classList.add('page-leaving');setTimeout(()=>location.href=u.href,170)})}

  function mountStory(){
    const profile=document.querySelector('.profile-layout');if(!profile||document.querySelector('.about-story'))return;
    const section=document.createElement('section');section.className='about-story shell';
    const items=[
      {year:'2002',lt:['Ignalina','Gimiau Ignalinoje, Lietuvoje.'],en:['Ignalina','I was born in Ignalina, Lithuania.']},
      {year:'2009',lt:['Akordeono pradžia','Pradėjau mokytis Ignalinos muzikos mokyklos akordeono klasėje.'],en:['Accordion begins','I began studying accordion at Ignalina music school.']},
      {year:'2016',lt:['Jaunasis talentas','Buvau išrinktas Ignalinos metų jaunuoju talentu.'],en:['Young Talent','I was named Ignalina Young Talent of the Year.']},
      {year:'2017',lt:['Konservatorija','Pradėjau mokytis Vilniaus Juozo Tallat-Kelpšos konservatorijoje, akordeono specialybėje.'],en:['Conservatory','I began studying accordion at the Vilnius Juozas Tallat-Kelpša Conservatory.']},
      {year:'2021',lt:['Kompozicijos studijos','Įstojau į Lietuvos muzikos ir teatro akademijos Kompozicijos katedrą ir tęsiau studijas pas prof. Ričardą Kabelį.'],en:['Composition studies','I entered the Composition Department of the Lithuanian Academy of Music and Theatre and continued studies with Prof. Ričardas Kabelis.']}
    ];
    section.innerHTML=`<div class="about-story-grid"><div class="about-story-sticky"><p class="eyebrow" data-lt="Kelias" data-en="Timeline">Kelias</p><h2 data-lt="Nuo Ignalinos iki kompozicijos." data-en="From Ignalina to composition.">Nuo Ignalinos iki kompozicijos.</h2></div><div class="about-story-list"><span class="about-story-line"><i class="about-story-progress"></i></span>${items.map((it,i)=>`<article class="about-story-item${i===0?' is-active':''}" data-story-item><span class="about-story-year">${it.year}</span><h3 data-lt="${it.lt[0]}" data-en="${it.en[0]}">${it.lt[0]}</h3><p data-lt="${it.lt[1]}" data-en="${it.en[1]}">${it.lt[1]}</p></article>`).join('')}</div></div>`;
    profile.insertAdjacentElement('afterend',section);localize(section);
    const list=section.querySelector('.about-story-list'),itemsEls=[...section.querySelectorAll('[data-story-item]')];
    if('IntersectionObserver'in window&&!reduced){const obs=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){itemsEls.forEach(el=>el.classList.toggle('is-active',el===en.target))}}),{rootMargin:'-35% 0px -45% 0px',threshold:.05});itemsEls.forEach(el=>obs.observe(el));}
    const update=()=>{const r=list.getBoundingClientRect(),vh=innerHeight;const p=Math.max(0,Math.min(1,(vh*.55-r.top)/(Math.max(1,r.height-vh*.25))));list.style.setProperty('--story-progress',`${p*100}%`)};update();addEventListener('scroll',update,{passive:true});
  }

  function portraitInteraction(){const wrap=document.querySelector('.profile-image-wrap');if(!wrap||!fine||reduced)return;wrap.addEventListener('pointermove',e=>{const r=wrap.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100,nx=x/100-.5,ny=y/100-.5;wrap.style.setProperty('--photo-x',`${x}%`);wrap.style.setProperty('--photo-y',`${y}%`);wrap.style.transform=`translateY(-6px) rotateX(${ny*-2}deg) rotateY(${nx*2.5}deg) scale(1.012)`},{passive:true});wrap.addEventListener('pointerleave',()=>{wrap.style.transform='';wrap.style.setProperty('--photo-x','50%');wrap.style.setProperty('--photo-y','50%')},{passive:true})}

  function timelineSpotlight(){const rows=[...document.querySelectorAll('.timeline-item')];rows.forEach(row=>{row.tabIndex=0;row.setAttribute('role','button');const activate=()=>rows.forEach(r=>r.classList.toggle('is-selected',r===row));row.addEventListener('click',activate);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}})})}

  function clickFeedback(){document.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,[role="button"]'))spark(e.clientX,e.clientY)})}

  function init(){loadScrollFlow();cursor();pageTransitions();mountStory();portraitInteraction();timelineSpotlight();clickFeedback()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
