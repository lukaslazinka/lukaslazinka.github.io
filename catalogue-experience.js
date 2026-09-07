(() => {
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang=()=>document.body.dataset.currentLanguage==='en'||document.documentElement.lang==='en'?'en':'lt';
  const playable={
    'Midnight Chase':'https://open.spotify.com/embed/album/52zN9FwtFD4P2bCXSA3CC1?si=Yt_mwR1MRZ-Z0sNXZkACJA',
    'Echostride':'https://open.spotify.com/embed/track/2fAB8ODlRjGhhV0mjcSfIC?si=5133f7c5cbe645d8',
    'Pro Bono':'https://open.spotify.com/embed/track/5dJgNzfzbfEczGyzNZzI6x?si=2f16de948a074a40',
    'Insomnia':'https://open.spotify.com/embed/track/2KkSTYV8ERMx7l9te2SYDP?si=1fdcd91432ba4a75',
    'Dvylikos garsų variacijos':'https://open.spotify.com/embed/track/1EUmFvfmjwlCZjCgoYE6Sr?si=7a2d53769fb242c4',
    'Black Woods':'https://open.spotify.com/embed/track/28bLQmNgGEexpRuEkSWSDT?si=a8c559c3c45547b4'
  };

  function localize(root=document){const l=lang();root.querySelectorAll?.('[data-lt][data-en]').forEach(el=>el.textContent=el.dataset[l]);}
  function spark(x,y){if(reduced)return;const s=document.createElement('span');s.className='x-click-spark';s.style.setProperty('--sx',`${x}px`);s.style.setProperty('--sy',`${y}px`);document.body.appendChild(s);setTimeout(()=>s.remove(),700)}

  function mountExplorer(){
    const hero=document.querySelector('.page-hero');const rows=[...document.querySelectorAll('.work-row')];if(!hero||!rows.length||document.querySelector('.catalogue-explorer'))return;
    const data=rows.map((row,i)=>({num:row.querySelector('.work-number')?.textContent.trim()||String(i+1).padStart(2,'0'),title:row.querySelector('.work-main strong')?.textContent.trim()||'',metaLt:row.querySelector('.work-main small')?.dataset.lt||row.querySelector('.work-main small')?.textContent.trim()||'',metaEn:row.querySelector('.work-main small')?.dataset.en||row.querySelector('.work-main small')?.textContent.trim()||'',href:row.getAttribute('href')}));
    const section=document.createElement('section');section.className='catalogue-explorer shell';
    section.innerHTML=`<p class="eyebrow" data-lt="Interaktyvus katalogas" data-en="Interactive catalogue">Interaktyvus katalogas</p><div class="catalogue-explorer-shell"><div class="catalogue-choices">${data.map((d,i)=>`<button class="catalogue-choice${i===0?' is-active':''}" type="button" data-catalogue-choice="${i}"><em>${d.num}</em><strong>${d.title}</strong><span>↗</span></button>`).join('')}</div><article class="catalogue-stage"><p class="eyebrow" data-lt="Pasirinktas kūrinys" data-en="Selected work">Pasirinktas kūrinys</p><h3 data-catalogue-title></h3><p data-catalogue-meta></p><div class="actions"><a class="button primary" data-catalogue-open data-lt="Atidaryti kūrinį" data-en="Open work">Atidaryti kūrinį</a></div></article></div>`;
    hero.insertAdjacentElement('afterend',section);localize(section);
    const choices=[...section.querySelectorAll('[data-catalogue-choice]')],title=section.querySelector('[data-catalogue-title]'),meta=section.querySelector('[data-catalogue-meta]'),open=section.querySelector('[data-catalogue-open]');
    const render=i=>{const d=data[i];choices.forEach((c,j)=>c.classList.toggle('is-active',i===j));title.textContent=d.title;meta.textContent=lang()==='en'?d.metaEn:d.metaLt;open.href=d.href;};render(0);choices.forEach((c,i)=>c.addEventListener('click',()=>render(i)));
  }

  function inlineRecordingPreviews(){
    const links=[...document.querySelectorAll('.work-index>a')];links.forEach(a=>{const title=a.querySelector('strong')?.textContent.trim();if(!playable[title])return;a.dataset.playable='true';a.addEventListener('click',e=>{e.preventDefault();let dock=document.querySelector('.catalogue-player-dock');if(!dock){dock=document.createElement('div');dock.className='catalogue-player-dock shell';dock.innerHTML=`<div class="home-player-stage"><div class="home-player-top"><div><p class="home-player-kicker" data-lt="Klausyti čia" data-en="Listen here">Klausyti čia</p><h3 class="home-player-title" data-catalogue-player-title></h3></div><button class="button secondary" type="button" data-catalogue-close aria-label="Close">×</button></div><div class="home-player-frame"><iframe data-catalogue-frame height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div></div>`;a.closest('.section').insertAdjacentElement('afterend',dock);localize(dock);dock.querySelector('[data-catalogue-close]').addEventListener('click',()=>dock.remove());}
      dock.querySelector('[data-catalogue-player-title]').textContent=title;const frame=dock.querySelector('[data-catalogue-frame]');frame.src=playable[title];frame.title=`Spotify: ${title}`;dock.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
    })});
  }

  function pageTransitions(){if('startViewTransition'in document)return;document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const a=e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download')||a.dataset.playable==='true')return;const h=a.getAttribute('href');if(!h||h.startsWith('#')||h.startsWith('mailto:'))return;const u=new URL(a.href,location.href);if(u.origin!==location.origin)return;e.preventDefault();document.body.classList.add('page-leaving');setTimeout(()=>location.href=u.href,170)})}

  function init(){mountExplorer();inlineRecordingPreviews();pageTransitions();document.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))spark(e.clientX,e.clientY)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
