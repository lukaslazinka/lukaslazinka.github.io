(() => {
  if (window.__lukasSiteWideExperience) return;
  window.__lukasSiteWideExperience = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;
  const doc = document.documentElement;
  const page = () => location.pathname.split('/').pop() || 'index.html';
  const currentLang = () => document.body?.dataset.currentLanguage === 'en' || doc.lang === 'en' ? 'en' : 'lt';
  let lastY = scrollY;
  let ticking = false;
  let flowItems = [];
  let sectionItems = [];
  let wordIndex = -1;

  const wordsByPage = {
    'index.html':['COMPOSITION','SOUND','EMOTION','STRUCTURE','MUSIC'],
    'about.html':['STORY','ACCORDION','COMPOSITION','VILNIUS','SOUND'],
    'compositions.html':['WORKS','SCORES','SOUND','STRUCTURE','MUSIC'],
    'music.html':['LISTEN','RELEASES','SOUND','ECHO','MUSIC'],
    'works.html':['SCORES','NOTATION','PAGES','MUSIC','COMPOSITION'],
    'inquiries.html':['CREATE','PROJECT','MUSIC','COLLABORATE','IDEA'],
    'contact.html':['CONTACT','VILNIUS','MUSIC','HELLO','LUKAS'],
    'press.html':['PRESS','BIOGRAPHY','PHOTOS','MUSIC','LUKAS'],
    'privacy.html':['PRIVACY','LUKAS','MUSIC'],
    'terms.html':['TERMS','LUKAS','MUSIC'],
    'refunds.html':['REFUNDS','LUKAS','MUSIC']
  };

  function burst(x,y){
    if (reduced) return;
    const b=document.createElement('span');b.className='sx-burst';b.style.setProperty('--x',`${x}px`);b.style.setProperty('--y',`${y}px`);document.body.appendChild(b);setTimeout(()=>b.remove(),780);
  }

  function mountDecor(){
    if(!document.querySelector('.sx-progress')){const el=document.createElement('div');el.className='sx-progress';el.setAttribute('aria-hidden','true');document.body.appendChild(el)}
    if(!reduced&&!document.querySelector('.sx-comet')){const el=document.createElement('div');el.className='sx-comet';el.setAttribute('aria-hidden','true');document.body.appendChild(el)}
    if(!document.querySelector('.sx-bg-word-a')){
      const a=document.createElement('div'),b=document.createElement('div');a.className='sx-bg-word sx-bg-word-a';b.className='sx-bg-word sx-bg-word-b';a.setAttribute('aria-hidden','true');b.setAttribute('aria-hidden','true');document.body.append(a,b);
    }
    if(!reduced&&!document.querySelector('.sx-score-ghost')){
      const a=document.createElement('div'),b=document.createElement('div');a.className='sx-score-ghost one';b.className='sx-score-ghost two';a.setAttribute('aria-hidden','true');b.setAttribute('aria-hidden','true');document.body.append(a,b);
    }
    if(!document.querySelector('.sx-ll')){
      const ll=document.createElement('button');ll.className='sx-ll';ll.type='button';ll.textContent='LL';ll.setAttribute('aria-label','Lukas Lazinka interaction');ll.addEventListener('click',e=>{ll.classList.remove('is-burst');void ll.offsetWidth;ll.classList.add('is-burst');burst(e.clientX,e.clientY);cycleWord(true);setTimeout(()=>ll.classList.remove('is-burst'),680)});document.body.appendChild(ll);
    }
  }

  function collectFlow(){
    const selectors=[
      'main > section > *', '.section-heading > *', '.feature-card', '.photo-story-card', '.home-fact',
      '.discover-panel', '.dna-panel', '.spotlight-stage', '.home-player-stage', '.timeline-item', '.work-row',
      '.work-index > a', '.discog-row', '.embed-card', '.video-card', '.score-feature > *', '.score-edition',
      '.contact-row', '.contact-form', '.press-photo-card', '.legal-prose > *', '.about-story-item', '.about-compass-grid > *',
      '.catalogue-stage', '.catalogue-choice'
    ];
    const seen=new Set();
    flowItems=Array.from(document.querySelectorAll(selectors.join(','))).filter(el=>{if(seen.has(el)||el.closest('.site-header')||el.closest('.site-footer'))return false;seen.add(el);return true});
    flowItems.forEach(el=>el.classList.add('sx-flow'));
  }

  function collectSections(){
    sectionItems=Array.from(document.querySelectorAll('main > section, main .section, .home-listen, .home-dna, .home-spotlight, .about-story, .about-compass')).filter((el,i,a)=>a.indexOf(el)===i);
    if(!('IntersectionObserver' in window)) return;
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        sectionItems.forEach(s=>s.classList.toggle('sx-section-active',s===entry.target));
      });
    },{rootMargin:'-34% 0px -38% 0px',threshold:.01});
    sectionItems.forEach(s=>observer.observe(s));
  }

  function pageWords(){
    const p=page();
    if(p.startsWith('composition-'))return ['COMPOSITION','SCORE','STRUCTURE','SOUND','LUKAS'];
    return wordsByPage[p]||['COMPOSITION','SOUND','MUSIC','LUKAS'];
  }

  function cycleWord(force=false){
    const words=pageWords();
    const max=Math.max(1,doc.scrollHeight-innerHeight);
    const p=Math.max(0,Math.min(1,scrollY/max));
    const next=force?(wordIndex+1)%words.length:Math.min(words.length-1,Math.floor(p*words.length));
    if(next===wordIndex&&!force)return;
    wordIndex=next;
    const a=document.querySelector('.sx-bg-word-a'),b=document.querySelector('.sx-bg-word-b');if(!a||!b)return;
    const visible=a.classList.contains('is-visible')?a:b;const hidden=visible===a?b:a;
    hidden.textContent=words[wordIndex];hidden.classList.add('is-visible');visible.classList.remove('is-visible');
  }

  function update(){
    ticking=false;
    const y=scrollY,max=Math.max(1,doc.scrollHeight-innerHeight),global=Math.max(0,Math.min(1,y/max));
    doc.style.setProperty('--sx-progress',global.toFixed(4));
    const ping=1-Math.abs(global*2-1);
    doc.style.setProperty('--sx-comet-y',`${14+ping*70}vh`);
    doc.style.setProperty('--sx-comet-x',`${(Math.sin(global*Math.PI*5)*7).toFixed(2)}px`);
    doc.style.setProperty('--sx-word-x',`${(Math.sin(global*Math.PI*2)*26).toFixed(1)}px`);
    doc.style.setProperty('--sx-word-y',`${(Math.cos(global*Math.PI*2)*18).toFixed(1)}px`);
    doc.style.setProperty('--sx-word-r',`${(global*4-2).toFixed(2)}deg`);
    doc.style.setProperty('--sx-score-y',`${(Math.sin(global*Math.PI*2)*35).toFixed(1)}px`);
    doc.style.setProperty('--sx-score-r',`${(-7+global*6).toFixed(2)}deg`);
    const dir=y>lastY?'down':y<lastY?'up':null;lastY=y;if(dir){doc.classList.toggle('is-scrolling-down',dir==='down');doc.classList.toggle('is-scrolling-up',dir==='up')}
    if(!reduced){
      const vh=innerHeight;
      flowItems.forEach((el,index)=>{
        const r=el.getBoundingClientRect();if(r.bottom<-120||r.top>vh+120)return;
        const p=Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));
        /* entering: down, center: neutral, leaving: up */
        const yMove=(.5-p)*30;
        const side=(index%2?1:-1)*Math.sin(p*Math.PI)*3.5;
        const scale=1+Math.sin(p*Math.PI)*.005;
        el.style.setProperty('--sx-y',`${yMove.toFixed(2)}px`);el.style.setProperty('--sx-x',`${side.toFixed(2)}px`);el.style.setProperty('--sx-scale',scale.toFixed(4));
      });
    }
    cycleWord();
  }
  function requestUpdate(){if(ticking)return;ticking=true;requestAnimationFrame(update)}

  function mountConstellation(){
    if(page()!=='compositions.html'||document.querySelector('.sx-constellation'))return;
    const anchor=document.querySelector('.page-hero');if(!anchor)return;
    const data=[
      {name:'Garsų kristalai',href:'composition-garsu-kristalai.html',x:17,y:27,typeLt:'Partitūra',typeEn:'Score'},
      {name:'Skylantys tonai',href:'composition-skylantys-tonai.html',x:76,y:19,typeLt:'Mikrotonai',typeEn:'Microtones'},
      {name:'Dvylikos garsų variacijos',href:'composition-dvylikos-garsu-variacijos.html',x:82,y:68,typeLt:'2022',typeEn:'2022'},
      {name:'Midnight Chase',href:'music.html',x:23,y:74,typeLt:'2024',typeEn:'2024'},
      {name:'Echostride',href:'music.html',x:51,y:16,typeLt:'2024',typeEn:'2024'},
      {name:'Insomnia',href:'music.html',x:48,y:82,typeLt:'2023',typeEn:'2023'}
    ];
    const section=document.createElement('section');section.className='sx-constellation shell';
    const lines=[[0,4],[4,1],[1,2],[2,5],[5,3],[3,0],[4,5],[0,5]];
    section.innerHTML=`<div class="sx-constellation-head"><div><p class="eyebrow" data-lt="Kūrinių žvaigždynas" data-en="Works constellation">Kūrinių žvaigždynas</p><h2 data-lt="Naršyk kūrinius kaip vieną skambesio lauką." data-en="Explore the works as one field of sound.">Naršyk kūrinius kaip vieną skambesio lauką.</h2></div></div><div class="sx-sky"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines.map(([a,b])=>`<line x1="${data[a].x}" y1="${data[a].y}" x2="${data[b].x}" y2="${data[b].y}"/>`).join('')}</svg><div class="sx-constellation-readout"><small data-sx-readout-type>Kūrinių laukas</small><strong data-sx-readout-title>Lukas Lazinka</strong></div>${data.map((d,i)=>`<a class="sx-star" href="${d.href}" style="--x:${d.x}%;--y:${d.y}%" data-sx-star="${i}">${d.name}</a>`).join('')}</div>`;
    anchor.insertAdjacentElement('afterend',section);
    const sky=section.querySelector('.sx-sky'),stars=[...section.querySelectorAll('.sx-star')],title=section.querySelector('[data-sx-readout-title]'),type=section.querySelector('[data-sx-readout-type]');
    stars.forEach((star,i)=>{const d=data[i];const enter=()=>{stars.forEach(s=>s.classList.toggle('is-active',s===star));sky.classList.add('is-hot');title.textContent=d.name;type.textContent=currentLang()==='en'?d.typeEn:d.typeLt};star.addEventListener('mouseenter',enter);star.addEventListener('focus',enter)});sky.addEventListener('mouseleave',()=>{stars.forEach(s=>s.classList.remove('is-active'));sky.classList.remove('is-hot');title.textContent='Lukas Lazinka';type.textContent=currentLang()==='en'?'Works field':'Kūrinių laukas'});
  }

  function mountWorkPreview(){
    if(page()!=='compositions.html'||!fine||document.querySelector('.sx-work-preview'))return;
    const preview=document.createElement('aside');preview.className='sx-work-preview';preview.setAttribute('aria-hidden','true');preview.innerHTML='<div class="sx-work-preview-media"></div><div class="sx-work-preview-copy"><small></small><strong></strong><p></p></div>';document.body.appendChild(preview);
    const media=preview.querySelector('.sx-work-preview-media'),small=preview.querySelector('small'),strong=preview.querySelector('strong'),p=preview.querySelector('p');
    const details={
      'Garsų kristalai':['Partitūra · PDF','Garsų kristalai','Autorinis partitūrinis kūrinys.','score'],
      'Skylantys tonai':['Dodekafonija · ketvirtatoniai','Skylantys tonai','Dodekafoninė medžiaga ir mikrotoninės matricos natų modifikacijos.',''],
      'Dvylikos garsų variacijos':['2022','Dvylikos garsų variacijos','Publikuotas įrašas ir atskiras kūrinio puslapis.',''],
      'Midnight Chase':['2024','Midnight Chase','Publikuotas leidinys.',''],
      'Echostride':['2024','Echostride','Publikuotas įrašas.',''],
      'Insomnia':['2023','Insomnia','Publikuotas įrašas.','']
    };
    const targets=[...document.querySelectorAll('.work-row,.work-index>a')];
    targets.forEach(el=>{el.addEventListener('mouseenter',()=>{const name=el.querySelector('strong')?.textContent?.trim();const d=details[name];if(!d)return;small.textContent=d[0];strong.textContent=d[1];p.textContent=d[2];media.classList.toggle('has-score',d[3]==='score');preview.classList.add('is-visible')});el.addEventListener('mouseleave',()=>preview.classList.remove('is-visible'))});
  }

  function bindGlobalClicks(){
    document.addEventListener('pointerdown',e=>{if(!e.target.closest('a,button,[role="button"]'))return;burst(e.clientX,e.clientY)});
  }

  function init(){
    mountDecor();collectFlow();collectSections();mountConstellation();mountWorkPreview();bindGlobalClicks();cycleWord(true);update();
    addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',()=>{collectFlow();requestUpdate()},{passive:true});
    if('MutationObserver'in window){let timeout;const obs=new MutationObserver(()=>{clearTimeout(timeout);timeout=setTimeout(()=>{collectFlow();collectSections();mountWorkPreview();requestUpdate()},120)});obs.observe(document.body,{childList:true,subtree:true})}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
