(() => {
  if (window.__lukasScrollFlow) return;
  window.__lukasScrollFlow = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document.documentElement;

  function mountDecor(){
    if (!document.querySelector('.scroll-flow-progress')) {
      const progress=document.createElement('div');
      progress.className='scroll-flow-progress';
      progress.setAttribute('aria-hidden','true');
      document.body.appendChild(progress);
    }
    if (!reduced && !document.querySelector('.scroll-comet')) {
      const comet=document.createElement('div');
      comet.className='scroll-comet';
      comet.setAttribute('aria-hidden','true');
      const a=document.createElement('div');a.className='scroll-ambient-one';a.setAttribute('aria-hidden','true');
      const b=document.createElement('div');b.className='scroll-ambient-two';b.setAttribute('aria-hidden','true');
      document.body.append(comet,a,b);
    }
  }

  function collect(){
    const selectors=[
      '.page-hero > *',
      '.section-heading > *',
      '.profile-prose',
      '.photo-story-card',
      '.timeline-item',
      '.feature-card',
      '.home-fact',
      '.discover-head > *',
      '.discover-panel',
      '.dna-head > *',
      '.dna-stage',
      '.spotlight-head > *',
      '.spotlight-stage',
      '.home-player-shell',
      '.work-row',
      '.work-index > a',
      '.discog-row',
      '.embed-card',
      '.video-card',
      '.score-copy',
      '.score-edition',
      '.catalogue-stage',
      '.contact-row',
      '.contact-form',
      '.press-photo-card',
      '.legal-prose > *'
    ];
    const seen=new Set();
    return Array.from(document.querySelectorAll(selectors.join(','))).filter(el=>{
      if(seen.has(el))return false;seen.add(el);return true;
    });
  }

  let items=[];
  let lastY=window.scrollY;
  let ticking=false;

  function update(){
    ticking=false;
    const y=window.scrollY;
    const max=Math.max(1,doc.scrollHeight-window.innerHeight);
    const global=Math.max(0,Math.min(1,y/max));
    doc.style.setProperty('--scroll-progress',global.toFixed(4));

    const dir=y>lastY?'down':y<lastY?'up':null;
    if(dir){
      doc.classList.toggle('is-scrolling-down',dir==='down');
      doc.classList.toggle('is-scrolling-up',dir==='up');
    }
    lastY=y;

    if(!reduced){
      const ping=1-Math.abs(global*2-1);
      const cometY=14+ping*70;
      const cometX=Math.sin(global*Math.PI*5)*7;
      doc.style.setProperty('--comet-y',`${cometY}vh`);
      doc.style.setProperty('--comet-x',`${cometX.toFixed(2)}px`);
      doc.style.setProperty('--ambient-y',`${(Math.sin(global*Math.PI*2)*28).toFixed(2)}px`);
      doc.style.setProperty('--ambient-r',`${(global*18-9).toFixed(2)}deg`);

      const vh=window.innerHeight;
      items.forEach((el,index)=>{
        const r=el.getBoundingClientRect();
        if(r.bottom < -120 || r.top > vh+120) return;
        const progress=Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));
        const wave=Math.sin(progress*Math.PI*2);
        const side=index%2===0?1:-1;
        const flowY=wave*14;
        const flowX=wave*side*4;
        const scale=1+Math.sin(progress*Math.PI)*.006;
        el.style.setProperty('--flow-y',`${flowY.toFixed(2)}px`);
        el.style.setProperty('--flow-x',`${flowX.toFixed(2)}px`);
        el.style.setProperty('--flow-scale',scale.toFixed(4));
      });
    }
  }

  function requestUpdate(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(update);
  }

  function init(){
    mountDecor();
    items=collect();
    items.forEach(el=>el.classList.add('scroll-flow-item'));
    update();
    addEventListener('scroll',requestUpdate,{passive:true});
    addEventListener('resize',requestUpdate,{passive:true});

    if('MutationObserver'in window){
      const obs=new MutationObserver(()=>{
        const next=collect();
        if(next.length!==items.length){items=next;items.forEach(el=>el.classList.add('scroll-flow-item'));requestUpdate();}
      });
      obs.observe(document.body,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
