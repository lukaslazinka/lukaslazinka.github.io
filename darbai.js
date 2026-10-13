(() => {
  const SITE_ID='238730654';
  const API_V2='https://public-api.wordpress.com/wp/v2/sites/'+SITE_ID+'/posts';
  const API_V1='https://public-api.wordpress.com/rest/v1.1/sites/'+SITE_ID+'/posts/';
  const PASSWORD_KEY='lukas-jobs-wp-password';
  const GATE_HASH='f0ba86d8b6df789971c05ff0cc7b58648615c5952d447c064861c81f7ed3d3ec';
  const JOBS_UNLOCK_NOTICE_KEY='lukas-jobs-unlock-notified';
  const NOTIFY_URL='https://formsubmit.co/ajax/lazinka.music@gmail.com';
  const WORK_LANG_KEY='lukas-jobs-language';

  function jobsLanguage(){
    const query=new URLSearchParams(location.search).get('lang');
    if(query==='lt'||query==='en')return query;
    try{
      const saved=sessionStorage.getItem(WORK_LANG_KEY);
      if(saved==='lt'||saved==='en')return saved;
    }catch(e){}
    return '';
  }

  const isEnglish=()=>jobsLanguage()==='en'||document.body?.dataset.currentLanguage==='en'||document.documentElement.lang==='en';

  function saveJobsLanguage(lang){
    if(lang!=='lt'&&lang!=='en')return;
    try{sessionStorage.setItem(WORK_LANG_KEY,lang)}catch(e){}
    try{localStorage.setItem('lukas-site-language',lang)}catch(e){}
  }

  function currentJobsCategory(){
    return jobsLanguage()==='en'?'darbai-en':'darbai';
  }

  function syncJobsLanguage(){
    const lang=jobsLanguage();
    if(!lang)return;
    saveJobsLanguage(lang);
    document.documentElement.lang=lang;
    if(document.body)document.body.dataset.currentLanguage=lang;
  }

  function showLanguageChoice(){
    const chooser=document.querySelector('[data-jobs-language]');
    const lock=document.querySelector('[data-jobs-lock]');
    const privateArea=document.querySelector('[data-jobs-private]');
    if(!chooser)return false;
    chooser.hidden=false;
    if(lock)lock.hidden=true;
    if(privateArea)privateArea.hidden=true;

    chooser.querySelectorAll('[data-jobs-language-choice]').forEach(button=>{
      button.addEventListener('click',()=>{
        const lang=button.dataset.jobsLanguageChoice;
        if(lang!=='lt'&&lang!=='en')return;
        saveJobsLanguage(lang);
        const url=new URL(location.href);
        url.searchParams.set('lang',lang);
        location.href=url.pathname+url.search;
      },{once:true});
    });
    return true;
  }

  function hideLanguageChoice(){
    const chooser=document.querySelector('[data-jobs-language]');
    if(chooser)chooser.hidden=true;
  }

  async function sha256(value){
    const data=new TextEncoder().encode(String(value||''));
    const digest=await crypto.subtle.digest('SHA-256',data);
    return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  function savedPassword(){
    try{return sessionStorage.getItem(PASSWORD_KEY)||''}catch(e){return ''}
  }

  function savePassword(value){
    try{sessionStorage.setItem(PASSWORD_KEY,value)}catch(e){}
  }

  function clearPassword(){
    try{sessionStorage.removeItem(PASSWORD_KEY)}catch(e){}
  }

  async function validGatePassword(value){
    if(!value||!window.crypto?.subtle)return false;
    return (await sha256(value))===GATE_HASH;
  }

  function notifyJobsUnlock(){
    try{
      if(sessionStorage.getItem(JOBS_UNLOCK_NOTICE_KEY)==='1')return;
      sessionStorage.setItem(JOBS_UNLOCK_NOTICE_KEY,'1');
    }catch(e){}

    const payload={
      _subject:'Darbai skiltis atrakinta — Lukas Lazinka',
      _template:'table',
      event:'Darbai skiltis atrakinta',
      page:location.href,
      referrer:document.referrer||'Tiesioginis apsilankymas',
      language:navigator.language||'',
      work_language:jobsLanguage()||'lt',
      time:new Date().toLocaleString('lt-LT',{timeZone:'Europe/Vilnius'})
    };

    fetch(NOTIFY_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(payload),
      keepalive:true
    }).catch(()=>{});
  }

  function revealJobsPrivate(){
    const lock=document.querySelector('[data-jobs-lock]');
    const privateArea=document.querySelector('[data-jobs-private]');
    if(lock)lock.hidden=true;
    if(privateArea){
      privateArea.hidden=false;
      privateArea.classList.add('is-unlocked');
    }
    document.body.classList.add('jobs-unlocked');
  }

  function wireGlobalGate(onUnlock){
    const lock=document.querySelector('[data-jobs-lock]');
    const form=document.querySelector('[data-jobs-lock-form]');
    if(!lock||!form){
      onUnlock();
      return;
    }

    const error=form.querySelector('[data-jobs-lock-error]');
    const field=form.elements.password;
    const button=form.querySelector('button[type="submit"]');

    async function attempt(value){
      if(error)error.hidden=true;
      button.disabled=true;
      field.disabled=true;
      button.textContent='…';
      const ok=await validGatePassword(value);
      if(ok){
        savePassword(value);
        notifyJobsUnlock();
        revealJobsPrivate();
        onUnlock();
        return;
      }
      clearPassword();
      if(error){
        error.hidden=false;
        error.textContent=isEnglish()?'Incorrect password.':'Neteisingas slaptažodis.';
      }
      button.disabled=false;
      field.disabled=false;
      button.textContent='→';
      field.focus();
      field.select();
    }

    form.addEventListener('submit',event=>{
      event.preventDefault();
      attempt(field.value);
    });

    const saved=savedPassword();
    if(saved){
      validGatePassword(saved).then(ok=>{
        if(ok){
          revealJobsPrivate();
          onUnlock();
        }else{
          clearPassword();
          lock.hidden=false;
        }
      });
    }else{
      lock.hidden=false;
    }
  }

  function decode(value){
    const box=document.createElement('textarea');
    box.innerHTML=value||'';
    return box.value;
  }

  function stripProtectedPrefix(value){
    return decode(value||'')
      .replace(/^Protected:\s*/i,'')
      .replace(/^Apsaugota:\s*/i,'')
      .trim();
  }

  function stripHtml(value){
    const div=document.createElement('div');
    div.innerHTML=value||'';
    return (div.textContent||'').replace(/\s+/g,' ').trim();
  }

  function sanitizeHtml(value){
    const doc=new DOMParser().parseFromString(value||'','text/html');
    doc.querySelectorAll('script,style,form,input,button,object,embed,iframe').forEach(el=>el.remove());
    doc.querySelectorAll('*').forEach(el=>{
      [...el.attributes].forEach(attr=>{
        const n=attr.name.toLowerCase();
        if(n.startsWith('on'))el.removeAttribute(attr.name);
        if((n==='href'||n==='src')&&/^javascript:/i.test(attr.value))el.removeAttribute(attr.name);
      });
    });
    doc.querySelectorAll('a[href]').forEach(a=>{
      if(/^https?:/i.test(a.href)){a.target='_blank';a.rel='noopener noreferrer'}
    });
    doc.querySelectorAll('img').forEach(img=>{img.loading='lazy';img.decoding='async'});
    return doc.body.innerHTML;
  }

  function formatDate(date){
    if(!date)return '';
    const d=new Date(date);
    if(Number.isNaN(d.getTime()))return '';
    return new Intl.DateTimeFormat(isEnglish()?'en-GB':'lt-LT',{
      year:'numeric',month:'long',day:'numeric'
    }).format(d);
  }

  function imageFor(post){
    const media=post._embedded&&post._embedded['wp:featuredmedia'];
    const first=media&&media[0];
    const featured=first&&(first.source_url||(first.media_details&&first.media_details.sizes&&first.media_details.sizes.large&&first.media_details.sizes.large.source_url));
    if(featured)return featured;
    if(post.featured_image)return post.featured_image;
    return '';
  }

  function normalizeV1(post){
    const categories=post.categories||{};
    return {
      id:post.ID,
      slug:post.slug||String(post.ID||''),
      date:post.date,
      title:{rendered:post.title||''},
      excerpt:{rendered:post.excerpt||'',protected:Boolean(post.password)},
      content:{rendered:post.content||'',protected:Boolean(post.password)},
      featured_image:post.featured_image||'',
      job_category_slugs:Array.isArray(categories)
        ? categories.map(c=>c&&c.slug).filter(Boolean)
        : Object.values(categories).map(c=>c&&c.slug).filter(Boolean),
      _embedded:post.featured_image?{'wp:featuredmedia':[{source_url:post.featured_image}]}:{}
    };
  }

  function jsonp(url){
    return new Promise((resolve,reject)=>{
      const callback='wpJobs_'+Date.now()+'_'+Math.random().toString(36).slice(2);
      const script=document.createElement('script');
      const sep=url.includes('?')?'&':'?';
      const timer=setTimeout(()=>{cleanup();reject(new Error('JSONP timeout'))},12000);
      function cleanup(){clearTimeout(timer);try{delete window[callback]}catch{}script.remove()}
      window[callback]=(data)=>{cleanup();resolve(data)};
      script.onerror=()=>{cleanup();reject(new Error('JSONP failed'))};
      script.src=url+sep+'callback='+encodeURIComponent(callback);
      document.head.appendChild(script);
    });
  }

  async function fetchV2(){
    const response=await fetch(API_V2+'?per_page=100&orderby=date&order=desc&_embed=1',{
      mode:'cors',cache:'no-store',headers:{Accept:'application/json'}
    });
    if(!response.ok)throw new Error('WordPress v2 HTTP '+response.status);
    const data=await response.json();
    if(!Array.isArray(data))throw new Error('Unexpected WordPress response');
    return data;
  }

  async function fetchV1(){
    const url=API_V1+'?number=100&order_by=date&order=DESC';
    try{
      const response=await fetch(url,{mode:'cors',cache:'no-store',headers:{Accept:'application/json'}});
      if(response.ok){
        const data=await response.json();
        if(Array.isArray(data?.posts))return data.posts.map(normalizeV1);
      }
    }catch(e){}
    const data=await jsonp(url);
    if(!Array.isArray(data?.posts))throw new Error('Unexpected WordPress v1 response');
    return data.posts.map(normalizeV1);
  }

  async function getPosts(){
    try{return await fetchV2()}catch(e){
      console.warn('[jobs] v2 failed, trying v1',e);
      return fetchV1();
    }
  }

  function isJobsPost(post){
    const embedded=post._embedded&&post._embedded['wp:term'];
    const slugs=Array.isArray(embedded)?embedded.flat().map(term=>term&&term.slug).filter(Boolean):[];
    const v1=post.job_category_slugs||[];
    return [...slugs,...v1].includes(currentJobsCategory());
  }

  function localize(root=document){
    const lang=isEnglish()?'en':'lt';
    root.querySelectorAll('[data-lt][data-en]').forEach(el=>{el.textContent=el.dataset[lang]});
    root.querySelectorAll('[data-placeholder-lt][data-placeholder-en]').forEach(el=>{el.placeholder=el.dataset['placeholder'+(lang==='lt'?'Lt':'En')]});
  }

  function card(post){
    const a=document.createElement('a');
    a.className='article-card';
    a.href='darbas.html?slug='+encodeURIComponent(post.slug)+'&lang='+encodeURIComponent(jobsLanguage()||'lt');
    const image=imageFor(post);
    const title=stripProtectedPrefix(post.title?.rendered||'');
    a.innerHTML=(image
      ? '<div class="article-card-media"><img src="'+image.replace(/"/g,'&quot;')+'" alt="" loading="lazy"></div>'
      : '<div class="article-card-media is-placeholder" aria-hidden="true"></div>')+
      '<div class="article-card-copy">'+
      '<div class="article-card-meta"><time>'+formatDate(post.date)+'</time><span>·</span><span>'+(isEnglish()?'Protected':'Apsaugota')+'</span></div>'+
      '<h2>'+title+'</h2>'+
      '</div>';
    return a;
  }

  async function loadList(){
    const loading=document.querySelector('[data-jobs-loading]');
    const grid=document.querySelector('[data-jobs-grid]');
    const empty=document.querySelector('[data-jobs-empty]');
    const error=document.querySelector('[data-jobs-error]');
    if(!grid)return;

    if(loading)loading.hidden=false;
    grid.hidden=true;
    if(empty)empty.hidden=true;
    if(error)error.hidden=true;

    try{
      const posts=(await getPosts()).filter(isJobsPost);
      if(loading)loading.hidden=true;
      if(!posts.length){
        if(empty){empty.hidden=false;localize(empty)}
        return;
      }
      grid.innerHTML='';
      grid.dataset.count=String(posts.length);
      posts.forEach(post=>grid.appendChild(card(post)));
      grid.hidden=false;
      window.dispatchEvent(new Event('resize'));
    }catch(err){
      console.error('[jobs]',err);
      if(loading)loading.hidden=true;
      if(error){error.hidden=false;localize(error)}
    }
  }

  function renderArticleMeta(post){
    const article=document.querySelector('[data-job-article]');
    if(!article)return;
    const title=stripProtectedPrefix(post.title?.rendered||'');
    const image=imageFor(post);

    article.querySelector('[data-job-title]').textContent=title;
    const time=article.querySelector('[data-job-date]');
    if(time){time.textContent=formatDate(post.date);time.dateTime=post.date||''}

    const imgWrap=article.querySelector('[data-job-image-wrap]');
    const img=article.querySelector('[data-job-image]');
    if(image&&imgWrap&&img){img.src=image;img.alt=title;imgWrap.hidden=false}
    else if(imgWrap){imgWrap.hidden=true}

    document.title=title+' — Lukas Lazinka';
    article.hidden=false;
    return {title,image};
  }

  async function fetchProtectedPost(post,password){
    if(!post.id)throw new Error('missing-post-id');
    const url=API_V2+'/'+encodeURIComponent(post.id)+'?password='+encodeURIComponent(password)+'&_embed=1';
    const response=await fetch(url,{mode:'cors',cache:'no-store',headers:{Accept:'application/json'}});
    if(response.status===401||response.status===403)throw new Error('bad-password');
    if(!response.ok)throw new Error('WordPress HTTP '+response.status);
    const data=await response.json();
    if(!data?.content?.rendered)throw new Error('bad-password');
    return data;
  }

  function showUnlock(post){
    const lock=document.querySelector('[data-job-lock]');
    if(!lock)return;
    lock.hidden=false;
    const form=lock.querySelector('[data-job-lock-form]');
    const error=lock.querySelector('[data-job-lock-error]');

    async function attempt(password,{remember=true}={}){
      const button=form.querySelector('button[type="submit"]');
      const field=form.elements.password;
      if(error)error.hidden=true;
      button.disabled=true;
      field.disabled=true;
      button.textContent='…';
      try{
        const full=await fetchProtectedPost(post,password);
        const content=document.querySelector('[data-job-content]');
        content.innerHTML=sanitizeHtml(full.content.rendered||'');
        document.querySelector('[data-job-reading]').textContent=(isEnglish()?'Private article':'Privatus tekstas');
        lock.remove();
        content.hidden=false;
        if(remember){try{sessionStorage.setItem(PASSWORD_KEY,password)}catch(e){}}
        window.dispatchEvent(new Event('resize'));
        return true;
      }catch(err){
        console.error('[jobs unlock]',err);
        if(error){
          error.hidden=false;
          error.textContent=isEnglish()?'Incorrect password.':'Neteisingas slaptažodis.';
        }
        button.disabled=false;
        field.disabled=false;
        button.textContent='→';
        field.focus();
        field.select();
        if(!remember){try{sessionStorage.removeItem(PASSWORD_KEY)}catch(e){}}
        return false;
      }
    }

    form.addEventListener('submit',event=>{
      event.preventDefault();
      attempt(form.elements.password.value);
    });

    let saved='';
    try{saved=sessionStorage.getItem(PASSWORD_KEY)||''}catch(e){}
    if(saved)attempt(saved,{remember:false});
  }

  async function loadArticle(){
    const article=document.querySelector('[data-job-article]');
    document.querySelectorAll('a[href="darbai.html"]').forEach(link=>{
      link.href='darbai.html?lang='+encodeURIComponent(jobsLanguage()||'lt');
    });
    if(!article)return;
    const loading=document.querySelector('[data-job-article-loading]');
    const error=document.querySelector('[data-job-article-error]');
    const slug=new URLSearchParams(location.search).get('slug');

    if(!slug){
      if(loading)loading.hidden=true;
      if(error)error.hidden=false;
      return;
    }

    try{
      const posts=await getPosts();
      const post=posts.find(p=>p.slug===slug&&isJobsPost(p));
      if(!post)throw new Error('not-found');

      renderArticleMeta(post);
      if(loading)loading.hidden=true;

      const isProtected=Boolean(post.content?.protected||post.excerpt?.protected);
      if(isProtected){
        showUnlock(post);
      }else if(post.content?.rendered){
        const content=document.querySelector('[data-job-content]');
        content.innerHTML=sanitizeHtml(post.content.rendered);
        content.hidden=false;
      }else{
        showUnlock(post);
      }
    }catch(err){
      console.error('[job article]',err);
      if(loading)loading.hidden=true;
      if(error)error.hidden=false;
    }
  }

  const observer=new MutationObserver(()=>localize());
  if(document.body)observer.observe(document.body,{attributes:true,attributeFilter:['data-current-language']});

  function init(){
    const pageIsList=document.body?.hasAttribute('data-jobs-page');
    const pageIsArticle=document.body?.hasAttribute('data-job-article-page');
    const explicitLang=new URLSearchParams(location.search).get('lang');

    if((pageIsList||pageIsArticle)&&explicitLang!=='lt'&&explicitLang!=='en'){
      if(showLanguageChoice()){
        localize();
        return;
      }
    }

    syncJobsLanguage();
    hideLanguageChoice();
    localize();

    if(pageIsList){
      wireGlobalGate(()=>loadList());
      return;
    }
    if(pageIsArticle){
      wireGlobalGate(()=>loadArticle());
      return;
    }
    loadList();
    loadArticle();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();