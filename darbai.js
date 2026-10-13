(() => {
  const DATA_URL='darbai-data.json?v=20261013-0945';
  const SESSION_KEY='lukas-jobs-password';

  const isEnglish=()=>document.body?.dataset.currentLanguage==='en'||document.documentElement.lang==='en';

  function b64ToBytes(value){
    const bin=atob(value);
    return Uint8Array.from(bin,c=>c.charCodeAt(0));
  }

  async function readEnvelope(){
    const response=await fetch(DATA_URL,{cache:'no-store'});
    if(!response.ok) throw new Error('private-data-unavailable');
    return response.json();
  }

  async function decryptEnvelope(password,envelope){
    if(!window.crypto?.subtle) throw new Error('webcrypto-unavailable');

    const material=await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key=await crypto.subtle.deriveKey(
      {
        name:'PBKDF2',
        salt:b64ToBytes(envelope.salt),
        iterations:Number(envelope.iterations)||310000,
        hash:'SHA-256'
      },
      material,
      {name:'AES-GCM',length:256},
      false,
      ['decrypt']
    );

    const plain=await crypto.subtle.decrypt(
      {name:'AES-GCM',iv:b64ToBytes(envelope.iv)},
      key,
      b64ToBytes(envelope.ciphertext)
    );

    return JSON.parse(new TextDecoder().decode(new Uint8Array(plain)));
  }

  function escapeHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function sanitizeHtml(value){
    const doc=new DOMParser().parseFromString(value||'','text/html');
    doc.querySelectorAll('script,style,form,input,button,object,embed,iframe').forEach(el=>el.remove());
    doc.querySelectorAll('*').forEach(el=>{
      [...el.attributes].forEach(attr=>{
        const n=attr.name.toLowerCase();
        if(n.startsWith('on')) el.removeAttribute(attr.name);
        if((n==='href'||n==='src')&&/^javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
      });
    });
    doc.querySelectorAll('a[href]').forEach(a=>{
      if(/^https?:/i.test(a.href)){a.target='_blank';a.rel='noopener noreferrer'}
    });
    doc.querySelectorAll('img').forEach(img=>{img.loading='lazy';img.decoding='async'});
    return doc.body.innerHTML;
  }

  function formatDate(date){
    if(!date) return '';
    const d=new Date(date);
    if(Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(isEnglish()?'en-GB':'lt-LT',{
      year:'numeric',month:'long',day:'numeric'
    }).format(d);
  }

  function readingTime(html){
    const div=document.createElement('div');
    div.innerHTML=html||'';
    const words=(div.textContent||'').trim().split(/\s+/).filter(Boolean).length;
    const min=Math.max(1,Math.ceil(words/210));
    return isEnglish()?min+' min read':min+' min. skaitymo';
  }

  function card(article){
    const a=document.createElement('a');
    a.className='article-card';
    a.href='darbas.html?slug='+encodeURIComponent(article.slug);
    const image=article.image
      ? '<div class="article-card-media"><img src="'+escapeHtml(article.image)+'" alt="" loading="lazy"></div>'
      : '<div class="article-card-media is-placeholder" aria-hidden="true"></div>';
    a.innerHTML=image+
      '<div class="article-card-copy">'+
      '<div class="article-card-meta"><time>'+escapeHtml(formatDate(article.date))+'</time><span>·</span><span>'+escapeHtml(readingTime(article.content||''))+'</span></div>'+
      '<h2>'+escapeHtml(article.title)+'</h2>'+
      '</div>';
    return a;
  }

  function revealPrivateArea(){
    const lock=document.querySelector('[data-jobs-lock]');
    const privateArea=document.querySelector('[data-jobs-private]');

    if(lock) lock.remove();

    if(privateArea){
      privateArea.hidden=false;
      privateArea.removeAttribute('hidden');
      privateArea.style.display='block';
      privateArea.classList.add('is-unlocked');
    }

    document.body.classList.add('jobs-unlocked');
    window.scrollTo({top:0,left:0,behavior:'auto'});
  }

  function renderList(data){
    const loading=document.querySelector('[data-jobs-loading]');
    const grid=document.querySelector('[data-jobs-grid]');
    const empty=document.querySelector('[data-jobs-empty]');
    const error=document.querySelector('[data-jobs-error]');
    if(!grid) return;

    if(loading) loading.hidden=true;
    if(error) error.hidden=true;

    const articles=Array.isArray(data.articles)?data.articles:[];
    if(!articles.length){
      grid.hidden=true;
      if(empty) empty.hidden=false;
      return;
    }

    if(empty) empty.hidden=true;
    grid.innerHTML='';
    grid.dataset.count=String(articles.length);
    [...articles]
      .sort((a,b)=>new Date(b.date||0)-new Date(a.date||0))
      .forEach(article=>grid.appendChild(card(article)));
    grid.hidden=false;
    window.dispatchEvent(new Event('resize'));
  }

  function renderArticle(data){
    const articleEl=document.querySelector('[data-job-article]');
    if(!articleEl) return;

    const loading=document.querySelector('[data-job-article-loading]');
    const error=document.querySelector('[data-job-article-error]');
    const slug=new URLSearchParams(location.search).get('slug');
    const item=(data.articles||[]).find(article=>article.slug===slug);

    if(loading) loading.hidden=true;

    if(!item){
      if(error) error.hidden=false;
      return;
    }

    if(error) error.hidden=true;
    articleEl.querySelector('[data-job-title]').textContent=item.title||'';

    const time=articleEl.querySelector('[data-job-date]');
    if(time){
      time.textContent=formatDate(item.date);
      if(item.date) time.dateTime=item.date;
    }

    articleEl.querySelector('[data-job-reading]').textContent=readingTime(item.content||'');
    articleEl.querySelector('[data-job-content]').innerHTML=sanitizeHtml(item.content||'');

    const wrap=articleEl.querySelector('[data-job-image-wrap]');
    const img=articleEl.querySelector('[data-job-image]');
    if(item.image&&wrap&&img){
      img.src=item.image;
      img.alt=item.title||'';
      wrap.hidden=false;
    }else if(wrap){
      wrap.hidden=true;
      if(img) img.removeAttribute('src');
    }

    document.title=(item.title||'Darbai')+' — Lukas Lazinka';
    articleEl.hidden=false;
    window.dispatchEvent(new Event('resize'));
  }

  async function unlock(password,{remember=true}={}){
    const envelope=await readEnvelope();
    const data=await decryptEnvelope(password,envelope);

    if(!data||!Array.isArray(data.articles)) throw new Error('invalid-private-data');

    revealPrivateArea();
    renderList(data);
    renderArticle(data);

    if(remember){
      try{ sessionStorage.setItem(SESSION_KEY,password); }catch(e){}
    }

    return true;
  }

  function setFormBusy(form,busy){
    const button=form.querySelector('button[type="submit"]');
    const field=form.elements.password;
    if(button){
      button.disabled=busy;
      button.textContent=busy?'…':'→';
    }
    if(field) field.disabled=busy;
  }

  function wireForm(){
    const form=document.querySelector('[data-jobs-lock-form]');
    if(!form||form.dataset.bound==='true') return;
    form.dataset.bound='true';

    form.addEventListener('submit',async event=>{
      event.preventDefault();

      const field=form.elements.password;
      const error=form.querySelector('[data-jobs-lock-error]');
      if(error) error.hidden=true;

      setFormBusy(form,true);

      try{
        await unlock(field.value);
      }catch(e){
        console.error('[jobs unlock]',e);
        try{sessionStorage.removeItem(SESSION_KEY)}catch(_){}
        setFormBusy(form,false);
        if(error){
          error.hidden=false;
          error.textContent=isEnglish()
            ? 'Incorrect password or the private section could not be opened.'
            : 'Neteisingas slaptažodis arba nepavyko atidaryti privačios skilties.';
        }
        field.focus();
        field.select();
      }
    });
  }

  async function init(){
    wireForm();

    let saved='';
    try{ saved=sessionStorage.getItem(SESSION_KEY)||''; }catch(e){}

    if(!saved) return;

    try{
      await unlock(saved,{remember:false});
    }catch(e){
      try{sessionStorage.removeItem(SESSION_KEY)}catch(_){}
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();