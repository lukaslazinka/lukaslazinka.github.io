(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const lang = () => document.body.dataset.currentLanguage === 'en' || document.documentElement.lang === 'en' ? 'en' : 'lt';

  const tracks = {
    midnight:{title:'Midnight Chase',year:'2024',kindLt:'albumas',kindEn:'album',src:'https://open.spotify.com/embed/album/52zN9FwtFD4P2bCXSA3CC1?si=Yt_mwR1MRZ-Z0sNXZkACJA'},
    echostride:{title:'Echostride',year:'2024',kindLt:'kūrinys',kindEn:'track',src:'https://open.spotify.com/embed/track/2fAB8ODlRjGhhV0mjcSfIC?si=5133f7c5cbe645d8'},
    proBono:{title:'Pro Bono',year:'2024',kindLt:'kūrinys',kindEn:'track',src:'https://open.spotify.com/embed/track/5dJgNzfzbfEczGyzNZzI6x?si=2f16de948a074a40'},
    insomnia:{title:'Insomnia',year:'2023',kindLt:'kūrinys',kindEn:'track',src:'https://open.spotify.com/embed/track/2KkSTYV8ERMx7l9te2SYDP?si=1fdcd91432ba4a75'},
    variations:{title:'Dvylikos garsų variacijos',year:'2022',kindLt:'kūrinys',kindEn:'track',src:'https://open.spotify.com/embed/track/1EUmFvfmjwlCZjCgoYE6Sr?si=7a2d53769fb242c4'},
    blackWoods:{title:'Black Woods',year:'2022',kindLt:'kūrinys',kindEn:'track',src:'https://open.spotify.com/embed/track/28bLQmNgGEexpRuEkSWSDT?si=a8c559c3c45547b4'}
  };

  function localize(root=document){
    const current = lang();
    root.querySelectorAll?.('[data-lt][data-en]').forEach(el => { el.textContent = el.dataset[current]; });
  }

  function spark(x,y){
    if (reduced) return;
    const s=document.createElement('span');
    s.className='x-click-spark';
    s.style.setProperty('--sx',`${x}px`);s.style.setProperty('--sy',`${y}px`);
    document.body.appendChild(s);setTimeout(()=>s.remove(),700);
  }

  function bindMicroInteractions(root=document){
    root.addEventListener('pointerdown',e=>{
      const hit=e.target.closest('a,button,.selected-release');
      if (!hit) return;
      spark(e.clientX,e.clientY);
    });
  }

  function mountCursor(){
    if (!finePointer || reduced || document.querySelector('.gold-cursor-dot')) return;
    const dot=document.createElement('span');dot.className='gold-cursor-dot';
    const ring=document.createElement('span');ring.className='gold-cursor-ring';
    document.body.append(dot,ring);
    let tx=-100,ty=-100,rx=-100,ry=-100,raf=0;
    const tick=()=>{rx+=(tx-rx)*.18;ry+=(ty-ry)*.18;dot.style.transform=`translate3d(${tx-3}px,${ty-3}px,0)`;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;raf=requestAnimationFrame(tick)};
    document.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;document.documentElement.classList.add('gold-cursor-live')},{passive:true});
    document.addEventListener('pointerover',e=>{document.documentElement.classList.toggle('gold-cursor-hover',!!e.target.closest('a,button,[role="button"]'))});
    document.addEventListener('pointerleave',()=>document.documentElement.classList.remove('gold-cursor-live'));
    raf=requestAnimationFrame(tick);
    window.addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
  }

  function mountPageTransitions(){
    if ('startViewTransition' in document) return;
    document.addEventListener('click',e=>{
      if (e.defaultPrevented || e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a=e.target.closest('a[href]'); if(!a || a.target==='_blank' || a.hasAttribute('download')) return;
      const href=a.getAttribute('href'); if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url=new URL(a.href,location.href); if(url.origin!==location.origin || url.pathname===location.pathname && url.hash) return;
      e.preventDefault();document.body.classList.add('page-leaving');setTimeout(()=>location.href=url.href,170);
    });
  }

  function mountHeroParallax(){
    const hero=document.querySelector('.hero-rich'); if(!hero || reduced || !finePointer) return;
    hero.addEventListener('pointermove',e=>{
      const r=hero.getBoundingClientRect(); const nx=(e.clientX-r.left)/r.width-.5; const ny=(e.clientY-r.top)/r.height-.5;
      hero.style.setProperty('--hero-px',`${nx*8}px`);hero.style.setProperty('--hero-py',`${ny*6}px`);hero.style.setProperty('--hero-rx',`${ny*-1.4}deg`);hero.style.setProperty('--hero-ry',`${nx*1.7}deg`);
    },{passive:true});
    hero.addEventListener('pointerleave',()=>['--hero-px','--hero-py','--hero-rx','--hero-ry'].forEach(p=>hero.style.removeProperty(p)),{passive:true});
  }

  function mountDiscover(){
    const section=document.querySelector('[data-discover-section]'); if(!section) return;
    const tabs=[...section.querySelectorAll('[data-discover-tab]')];
    const panels=[...section.querySelectorAll('[data-discover-panel]')];
    const activate=key=>{
      tabs.forEach(t=>{const on=t.dataset.discoverTab===key;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});
      panels.forEach(p=>{const on=p.dataset.discoverPanel===key;p.hidden=!on;p.classList.toggle('is-active',on)});
    };
    tabs.forEach(t=>t.addEventListener('click',()=>activate(t.dataset.discoverTab)));
  }

  function mountPlayer(){
    const facts=document.querySelector('.home-facts'); if(!facts || document.querySelector('[data-home-listen]')) return;
    const section=document.createElement('section');section.className='home-listen shell';section.dataset.homeListen='';
    section.innerHTML=`<div class="home-listen-head"><p class="eyebrow" data-lt="Klausyti čia" data-en="Listen here">Klausyti čia</p></div><div class="home-listen-layout"><div class="home-track-list" role="tablist">${Object.entries(tracks).map(([key,t],i)=>`<button class="home-track${i===0?' is-active':''}" type="button" role="tab" aria-selected="${i===0}" data-home-track="${key}"><span class="home-track-index">${String(i+1).padStart(2,'0')}</span><span class="home-track-copy"><strong>${t.title}</strong><small>${t.year}</small></span><span class="home-track-mark">▶</span></button>`).join('')}</div><div class="home-player-stage" data-home-player-stage><div class="home-player-top"><div><p class="home-player-kicker" data-lt="Pasirinktas kūrinys" data-en="Selected work">Pasirinktas kūrinys</p><h3 class="home-player-title" data-home-player-title>Midnight Chase</h3><span class="home-player-meta" data-home-player-meta>2024 · albumas</span></div><div class="home-eq" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div></div><div class="home-player-frame"><iframe data-home-player-frame src="${tracks.midnight.src}" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify: Midnight Chase"></iframe></div></div></div>`;
    facts.insertAdjacentElement('afterend',section);localize(section);
    const buttons=[...section.querySelectorAll('[data-home-track]')],frame=section.querySelector('[data-home-player-frame]'),title=section.querySelector('[data-home-player-title]'),meta=section.querySelector('[data-home-player-meta]'),stage=section.querySelector('[data-home-player-stage]');
    const activate=(key,scroll=false)=>{const t=tracks[key];if(!t)return;buttons.forEach(b=>{const on=b.dataset.homeTrack===key;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on))});title.textContent=t.title;meta.textContent=`${t.year} · ${lang()==='en'?t.kindEn:t.kindLt}`;if(frame.getAttribute('src')!==t.src){frame.src=t.src;frame.title=`Spotify: ${t.title}`;}if(scroll)section.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});window.dispatchEvent(new CustomEvent('lukas-track-change',{detail:{key}}));};
    buttons.forEach(b=>b.addEventListener('click',()=>activate(b.dataset.homeTrack)));
    const release=document.querySelector('.selected-release');if(release){release.dataset.inlineListen='true';release.removeAttribute('target');release.removeAttribute('rel');release.href='#listen';const arrow=release.querySelector('.release-arrow');if(arrow)arrow.textContent='↓';const detail=release.querySelector('.release-copy > span');if(detail){detail.dataset.lt='2024 · Klausyti čia';detail.dataset.en='2024 · Listen here';detail.textContent=lang()==='en'?detail.dataset.en:detail.dataset.lt;}release.addEventListener('click',e=>{e.preventDefault();activate('midnight',true)});}
    if(stage && finePointer && !reduced){stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();stage.style.setProperty('--player-x',`${(e.clientX-r.left)/r.width*100}%`);stage.style.setProperty('--player-y',`${(e.clientY-r.top)/r.height*100}%`)},{passive:true});}
    window.homePlayerActivate=activate;
  }

  function mountDNA(){
    const discover=document.querySelector('[data-discover-section]'); if(!discover || document.querySelector('[data-dna-section]')) return;
    const data={
      structure:{lt:['Struktūra','Sistema nėra emocijos priešas.','Kompozicinės sistemos man padeda organizuoti medžiagą, o galutinis tikslas lieka muzikinė išraiška ir skambesys.'],en:['Structure','Structure does not oppose emotion.','Compositional systems help me organise material while expression and sound remain the destination.']},
      emotion:{lt:['Emocija','Skambesys turi veikti ne vien intelektą.','Savo muzikoje siekiu jausmingumo, įvairovės ir nežemiško skambesio.'],en:['Emotion','Sound should reach beyond the intellect.','In my music I seek emotion, variety and an otherworldly sound.']},
      classical:{lt:['Klasika','Harmonija yra viena iš atramų.','Klasikinės harmonijos akordus jungiu su kitų muzikos laukų motyvais.'],en:['Classical','Harmony remains one of the anchors.','I combine classical harmony with motifs from other musical fields.']},
      electronic:{lt:['Elektronika','Elektroninis skambesys yra mano kūrybos dalis.','Mano kūryboje susitinka šiuolaikinė, elektroninė, klasikinė ir populiariosios muzikos kalba.'],en:['Electronic','Electronic sound is part of my work.','My work brings together contemporary, electronic, classical and pop-influenced language.']},
      microtones:{lt:['Mikrotonai','Ketvirtatoniai kaip sistemos dalis.','„Skylančiuose tonuose“ ketvirtatoniai siejami su dodekafonine matrica ir jos natų mikrotoninėmis modifikacijomis.'],en:['Microtones','Quarter-tones as part of a system.','In “Skylantys tonai”, quarter-tones are tied to twelve-tone material and microtonal modifications of matrix notes.']},
      accordion:{lt:['Akordeonas','Instrumentas, nuo kurio viskas prasidėjo.','Akordeono pradėjau mokytis 2009 m.; atlikėjo patirtis ilgą laiką buvo svarbi mano muzikinio kelio dalis.'],en:['Accordion','The instrument where it began.','I began studying accordion in 2009; performance remained an important part of my musical path for years.']}
    };
    const keys=Object.keys(data);const section=document.createElement('section');section.className='home-dna shell';section.dataset.dnaSection='';
    section.innerHTML=`<div class="dna-head"><div><p class="eyebrow" data-lt="Kūrybos DNR" data-en="Creative DNA">Kūrybos DNR</p><h2 data-lt="Iš ko susideda mano skambesys?" data-en="What shapes my sound?">Iš ko susideda mano skambesys?</h2></div></div><div class="dna-layout"><div class="dna-orbit"><div class="dna-core"><span class="dna-core-mark">LL</span><strong data-lt="Kūrybos DNR" data-en="Creative DNA">Kūrybos DNR</strong></div>${keys.map((k,i)=>`<button class="dna-node${i===0?' is-active':''}" type="button" data-dna-node="${k}">${data[k][lang()][0]}</button>`).join('')}</div><div class="dna-panel"><div class="dna-content is-active"><p class="dna-kicker" data-dna-kicker></p><h3 data-dna-title></h3><p data-dna-text></p><div class="dna-links"><a class="button secondary" href="compositions.html" data-lt="Kūriniai" data-en="Works">Kūriniai</a></div><div class="dna-random"><button class="button secondary" type="button" data-dna-random data-lt="✦ Parinkti atsitiktinai" data-en="✦ Pick at random">✦ Parinkti atsitiktinai</button></div></div></div></div>`;
    discover.insertAdjacentElement('afterend',section);localize(section);
    const nodes=[...section.querySelectorAll('[data-dna-node]')],kicker=section.querySelector('[data-dna-kicker]'),title=section.querySelector('[data-dna-title]'),text=section.querySelector('[data-dna-text]');
    const activate=key=>{const d=data[key][lang()];nodes.forEach(n=>n.classList.toggle('is-active',n.dataset.dnaNode===key));kicker.textContent=d[0];title.textContent=d[1];text.textContent=d[2];};activate('structure');nodes.forEach(n=>n.addEventListener('click',()=>activate(n.dataset.dnaNode)));section.querySelector('[data-dna-random]').addEventListener('click',()=>activate(keys[Math.floor(Math.random()*keys.length)]));
  }

  function mountSpotlight(){
    if(document.querySelector('.home-spotlight'))return;const anchor=document.querySelector('[data-dna-section]')||document.querySelector('[data-discover-section]');if(!anchor)return;
    const order=['midnight','echostride','proBono','insomnia','variations','blackWoods'];
    const section=document.createElement('section');section.className='home-spotlight shell';
    section.innerHTML=`<div class="spotlight-head"><div><p class="eyebrow" data-lt="Kūrinio spotlight" data-en="Work spotlight">Kūrinio spotlight</p><h2 data-lt="Pasirink, ką nori išgirsti." data-en="Choose what you want to hear.">Pasirink, ką nori išgirsti.</h2></div></div><div class="spotlight-layout"><div class="spotlight-list">${order.map((k,i)=>`<button class="spotlight-choice${i===0?' is-active':''}" type="button" data-spotlight="${k}"><b>${String(i+1).padStart(2,'0')}</b><strong>${tracks[k].title}</strong><small>${tracks[k].year}</small></button>`).join('')}</div><article class="spotlight-stage" data-spot-stage><span class="spotlight-number" data-spot-number>01</span><p class="spotlight-kicker" data-lt="Pasirinktas kūrinys" data-en="Selected work">Pasirinktas kūrinys</p><h3 class="spotlight-title" data-spot-title>${tracks.midnight.title}</h3><div class="spotlight-meta"><span data-spot-year>${tracks.midnight.year}</span><span data-spot-kind>albumas</span></div><div class="spotlight-wave" aria-hidden="true">${[16,34,22,46,30,52,26,40,18,36,24,48].map(h=>`<i style="--h:${h}px"></i>`).join('')}</div><div class="spotlight-actions"><button class="button primary" type="button" data-spot-listen data-lt="Klausyti čia" data-en="Listen here">Klausyti čia</button><a class="button secondary" href="compositions.html" data-lt="Visi kūriniai" data-en="All works">Visi kūriniai</a></div></article></div>`;
    anchor.insertAdjacentElement('afterend',section);localize(section);
    let current='midnight';const choices=[...section.querySelectorAll('[data-spotlight]')],stage=section.querySelector('[data-spot-stage]');
    const render=key=>{current=key;const t=tracks[key],idx=order.indexOf(key);choices.forEach(c=>c.classList.toggle('is-active',c.dataset.spotlight===key));section.querySelector('[data-spot-number]').textContent=String(idx+1).padStart(2,'0');section.querySelector('[data-spot-title]').textContent=t.title;section.querySelector('[data-spot-year]').textContent=t.year;section.querySelector('[data-spot-kind]').textContent=lang()==='en'?t.kindEn:t.kindLt;};
    choices.forEach(c=>c.addEventListener('click',()=>render(c.dataset.spotlight)));section.querySelector('[data-spot-listen]').addEventListener('click',()=>window.homePlayerActivate?.(current,true));
    if(stage&&finePointer&&!reduced){stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();stage.style.setProperty('--spot-x',`${(e.clientX-r.left)/r.width*100}%`);stage.style.setProperty('--spot-y',`${(e.clientY-r.top)/r.height*100}%`)},{passive:true});}
  }

  function init(){mountCursor();mountPageTransitions();mountHeroParallax();mountDiscover();mountPlayer();mountDNA();mountSpotlight();bindMicroInteractions();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
