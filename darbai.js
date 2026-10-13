(() => {
  const SITE_ID='238730654';
  const API_V2='https://public-api.wordpress.com/wp/v2/sites/'+SITE_ID+'/posts';
  const API_V1='https://public-api.wordpress.com/rest/v1.1/sites/'+SITE_ID+'/posts/';
  const JOB_CATEGORY='darbai';
  const PASSWORD_HASH='ce06e5b4630aaaa5c1339fe3e65531ae8e7c04e5e072dc0f81c847052faf9479';
  const SESSION_KEY='lukas-jobs-password';

  const isEnglish=()=>document.body.dataset.currentLanguage==='en'||document.documentElement.lang==='en';

  async function sha256(value){
    const data=new TextEncoder().encode(value);
    const hash=await crypto.subtle.digest('SHA-256',data);
    return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  async function validPassword(value){
    return value && await sha256(value)===PASSWORD_HASH;
  }

  function decode(value){
    const box=document.createElement('textarea');
    box.innerHTML=value||'';
    return box.value;
  }

  function stripHtml(value){
    const div=document.createElement('div');
    div.innerHTML=value||'';
    return (div.textContent||'').replace(/\s+/g,' ').trim();
  }

  function sanitizeHtml(value){
    const doc=new DOMParser().parseFromString(value||'','text/html');
    doc.querySelectorAll('script,style,form,input,button,object,embed').forEach(el=>el.remove());
    doc.querySelectorAll('*').forEach(el=>{
      [...el.attributes].forEach(attr=>{
        const n=attr.name.toLowerCase();
        if(n.startsWith('on'))el.removeAttribute(attr.name);
        if((n==='href'||n==='src')&&/^javascript:/i.test(attr.value))el.removeAttribute(attr.name);
      });
    });
    doc.querySelectorAll('a[href]').forEach(a=>{if(/^https?:/i.test(a.href)){a.target='_blank';a.rel='noopener noreferrer'}});
    doc.querySelectorAll('img').forEach(img=>{img.loading='lazy';img.decoding='async'});
    return doc.body.innerHTML;
  }

  function readingTime(html){
    const words=stripHtml(html).split(/\s+/).filter(Boolean).length;
    const min=Math.max(1,Math.ceil(words/210));
    return isEnglish()?min+' min read':min+' min. skaitymo';
  }

  function formatDate(date){
    return new Intl.DateTimeFormat(isEnglish()?'en-GB':'lt-LT',{year:'numeric',month:'long',day:'numeric'}).format(new Date(date));
  }

  function imageFor(post){
    const media=post._embedded&&post._embedded['wp:featuredmedia'];
    const first=media&&media[0];
    const featured=first&&(first.source_url||(first.media_details&&first.media_details.sizes&&first.media_details.sizes.large&&first.media_details.sizes.large.source_url));
    if(featured)return featured;
    if(post.featured_image)return post.featured_image;
    const html=post.content?.rendered||post.content||'';
    const doc=new DOMParser().parseFromString(html,'text/html');
    const img=doc.querySelector('img');
    return img?(img.getAttribute('src')||img.getAttribute('data-src')||''):'';
  }

  function categorySlugs(post){
    const embedded=post._embedded&&post._embedded['wp:term'];
    const fromEmbedded=Array.isArray(embedded)?embedded.flat().map(t=>t&&t.slug).filter(Boolean):[];
    const fromV1=post.job_category_slugs||[];
    return [...new Set([...fromEmbedded,...fromV1])];
  }

  function isJobPost(post){
    return categorySlugs(post).includes(JOB_CATEGORY);
  }

  function normalizeV1(post){
    const cats=post.categories||{};
    const slugs=Array.isArray(cats)
      ? cats.map(c=>c&&c.slug).filter(Boolean)
      : Object.values(cats).map(c=>c&&c.slug).filter(Boolean);
    return {
      slug:post.slug||String(post.ID||''),
      date:post.date,
      title:{rendered:post.title||''},
      excerpt:{rendered:post.excerpt||''},
      content:{rendered:post.content||''},
      featured_image:post.featured_image||'',
      job_category_slugs:slugs,
      _embedded:post.featured_image?{'wp:featuredmedia':[ {source_url:post.featured_image} ]}:{}
    };
  }

  function jsonp(url){
    return new Promise((resolve,reject)=>{
      const callback='wpJobs_'+Date.now()+'_'+Math.random().toString(36).slice(2);
      const script=document.createElement('script');
      const sep=url.includes('?')?'&':'?';
      const timer=setTimeout(()=>{cleanup();reject(new Error('timeout'))},12000);
      function cleanup(){clearTimeout(timer);try{delete window[callback]}catch{}script.remove()}
      window[callback]=data=>{cleanup();resolve(data)};
      script.onerror=()=>{cleanup();reject(new Error('jsonp failed'))};
      script.src=url+sep+'callback='+encodeURIComponent(callback);
      document.head.appendChild(script);
    });
  }

  async function getPosts(){
    try{
      const response=await fetch(API_V2+'?per_page=100&orderby=date&order=desc&_embed=1',{mode:'cors',cache:'no-store',headers:{Accept:'application/json'}});
      if(response.ok){
        const data=await response.json();
        if(Array.isArray(data))return data;
      }
    }catch(e){}
    const url=API_V1+'?number=100&order_by=date&order=DESC';
    try{
      const response=await fetch(url,{mode:'cors',cache:'no-store',headers:{Accept:'application/json'}});
      if(response.ok){
        const data=await response.json();
        if(Array.isArray(data?.posts))return data.posts.map(normalizeV1);
      }
    }catch(e){}
    const data=await jsonp(url);
    if(!Array.isArray(data?.posts))throw new Error('WordPress unavailable');
    return data.posts.map(normalizeV1);
  }

  async function getProtectedPost(slug,password){
    const url=API_V2+'?slug='+encodeURIComponent(slug)+'&password='+encodeURIComponent(password)+'&_embed=1';
    const response=await fetch(url,{mode:'cors',cache:'no-store',headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Protected post unavailable');
    const posts=await response.json();
    if(!Array.isArray(posts)||!posts.length)throw new Error('not found');
    return posts[0];
  }

  function prepareContent(html,title,heroImage){
    const doc=new DOMParser().parseFromString(html||'','text/html');
    if(heroImage){
      const hero=heroImage.split('#')[0];
      const image=[...doc.querySelectorAll('img')].find(img=>(img.getAttribute('src')||img.getAttribute('data-src')||'').split('#')[0]===hero);
      if(image)(image.closest('figure,.wp-block-image,.wp-block-cover,p')||image).remove();
    }
    const wanted=(title||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('lt');
    if(wanted){
      const duplicate=[...doc.querySelectorAll('h1,h2,h3')].find(el=>(el.textContent||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('lt')===wanted);
      if(duplicate)duplicate.remove();
    }
    return sanitizeHtml(doc.body.innerHTML);
  }

  function card(post){
    const a=document.createElement('a');
    a.className='article-card';
    a.href='darbas.html?slug='+encodeURIComponent(post.slug);
    const image=imageFor(post);
    const title=decode(post.title?.rendered||'');
    a.innerHTML=(image?'<div class="article-card-media"><img src="'+image.replace(/"/g,'&quot;')+'" alt="" loading="lazy"></div>':'<div class="article-card-media is-placeholder" aria-hidden="true"></div>')+
      '<div class="article-card-copy"><div class="article-card-meta"><time>'+formatDate(post.date)+'</time><span>·</span><span>'+readingTime(post.content?.rendered||'')+'</span></div><h2>'+title+'</h2></div>';
    return a;
  }

  async function loadJobs(){
    const loading=document.querySelector('[data-jobs-loading]');
    const grid=document.querySelector('[data-jobs-grid]');
    const empty=document.querySelector('[data-jobs-empty]');
    const error=document.querySelector('[data-jobs-error]');
    if(!grid)return;
    loading.hidden=false;grid.hidden=true;empty.hidden=true;error.hidden=true;
    try{
      const posts=(await getPosts()).filter(isJobPost);
      loading.hidden=true;
      if(!posts.length){empty.hidden=false;return}
      grid.innerHTML='';
      grid.dataset.count=String(posts.length);
      posts.forEach(post=>grid.appendChild(card(post)));
      grid.hidden=false;
      window.dispatchEvent(new Event('resize'));
    }catch(e){
      console.error('[jobs]',e);
      loading.hidden=true;error.hidden=false;
    }
  }

  async function loadJobArticle(password){
    const article=document.querySelector('[data-job-article]');
    if(!article)return;
    const loading=document.querySelector('[data-job-article-loading]');
    const error=document.querySelector('[data-job-article-error]');
    const slug=new URLSearchParams(location.search).get('slug');
    if(!slug){loading.hidden=true;error.hidden=false;return}
    try{
      let posts=await getPosts();
      let post=posts.find(p=>p.slug===slug&&isJobPost(p));
      if(!post)throw new Error('not found');
      const rendered=post.content?.rendered||'';
      const protectedContent=post.content?.protected===true||!stripHtml(rendered);
      if(protectedContent){
        post=await getProtectedPost(slug,password);
        if(!isJobPost(post))throw new Error('not a jobs post');
      }
      const title=decode(post.title?.rendered||'');
      const image=imageFor(post);
      article.querySelector('[data-job-title]').textContent=title;
      article.querySelector('[data-job-date]').textContent=formatDate(post.date);
      article.querySelector('[data-job-date]').dateTime=post.date;
      article.querySelector('[data-job-reading]').textContent=readingTime(post.content?.rendered||'');
      article.querySelector('[data-job-content]').innerHTML=prepareContent(post.content?.rendered||'',title,image);
      const wrap=article.querySelector('[data-job-image-wrap]');
      const img=article.querySelector('[data-job-image]');
      if(image){img.src=image;img.alt=title;wrap.hidden=false}
      document.title=title+' — Lukas Lazinka';
      loading.hidden=true;article.hidden=false;
      window.dispatchEvent(new Event('resize'));
    }catch(e){
      console.error('[job article]',e);
      loading.hidden=true;error.hidden=false;
    }
  }

  async function unlock(password){
    if(!await validPassword(password))return false;
    sessionStorage.setItem(SESSION_KEY,password);
    const lock=document.querySelector('[data-jobs-lock]');
    const privateArea=document.querySelector('[data-jobs-private]');
    if(lock)lock.hidden=true;
    if(privateArea)privateArea.hidden=false;
    await loadJobs();
    await loadJobArticle(password);
    return true;
  }

  document.addEventListener('submit',async event=>{
    const form=event.target.closest('[data-jobs-lock-form]');
    if(!form)return;
    event.preventDefault();
    const field=form.elements.password;
    const error=form.querySelector('[data-jobs-lock-error]');
    error.hidden=true;
    const ok=await unlock(field.value);
    if(!ok){
      error.hidden=false;
      field.select();
      form.classList.remove('is-shake');
      void form.offsetWidth;
      form.classList.add('is-shake');
    }
  });

  async function init(){
    const saved=sessionStorage.getItem(SESSION_KEY)||'';
    if(saved&&await validPassword(saved))await unlock(saved);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();