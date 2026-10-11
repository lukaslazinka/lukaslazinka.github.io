(() => {
  const SITE_ID = '238730654';
  const API_V2 = 'https://public-api.wordpress.com/wp/v2/sites/' + SITE_ID + '/posts';
  const API_V1 = 'https://public-api.wordpress.com/rest/v1.1/sites/' + SITE_ID + '/posts/';
  const LAUNCH = new Date('2026-10-11T00:00:00+03:00');

  const isEnglish = () => document.body.dataset.currentLanguage === 'en' || document.documentElement.lang === 'en';

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
    const doc=new DOMParser().parseFromString(value||'', 'text/html');
    doc.querySelectorAll('script,style,form,input,button,object,embed').forEach(el=>el.remove());
    doc.querySelectorAll('*').forEach(el=>{
      [...el.attributes].forEach(attr=>{
        const n=attr.name.toLowerCase();
        if(n.startsWith('on')) el.removeAttribute(attr.name);
        if((n==='href'||n==='src') && /^javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
      });
    });
    doc.querySelectorAll('a[href]').forEach(a=>{
      if(/^https?:/i.test(a.href)){a.target='_blank';a.rel='noopener noreferrer'}
    });
    doc.querySelectorAll('img').forEach(img=>{img.loading='lazy';img.decoding='async'});
    return doc.body.innerHTML;
  }

  function formatDate(date){
    return new Intl.DateTimeFormat(isEnglish()?'en-GB':'lt-LT',{year:'numeric',month:'long',day:'numeric'}).format(new Date(date));
  }

  function readingTime(html){
    const words=stripHtml(html).split(/\s+/).filter(Boolean).length;
    const min=Math.max(1,Math.ceil(words/210));
    return isEnglish() ? min + ' min read' : min + ' min. skaitymo';
  }

  function imageFor(post){
    const media=post._embedded && post._embedded['wp:featuredmedia'];
    const first=media && media[0];
    const featured=first && (first.source_url || (first.media_details && first.media_details.sizes && first.media_details.sizes.large && first.media_details.sizes.large.source_url));
    if(featured) return featured;
    if(post.featured_image) return post.featured_image;

    const html=post.content?.rendered || post.content || '';
    if(html){
      const doc=new DOMParser().parseFromString(html,'text/html');
      const img=doc.querySelector('img');
      if(img){
        return img.getAttribute('src') || img.getAttribute('data-src') || '';
      }
    }
    return '';
  }

  function normalizeV1(post){
    return {
      slug: post.slug || String(post.ID || ''),
      date: post.date,
      title: { rendered: post.title || '' },
      excerpt: { rendered: post.excerpt || '' },
      content: { rendered: post.content || '' },
      featured_image: post.featured_image || '',
      _embedded: post.featured_image ? {'wp:featuredmedia':[ { source_url: post.featured_image } ]} : {}
    };
  }

  function jsonp(url){
    return new Promise((resolve,reject)=>{
      const callback='wpArticles_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      const script=document.createElement('script');
      const sep=url.includes('?')?'&':'?';
      const timer=setTimeout(()=>{cleanup();reject(new Error('JSONP timeout'))},12000);
      function cleanup(){clearTimeout(timer);try{delete window[callback]}catch{}script.remove()}
      window[callback]=(data)=>{cleanup();resolve(data)};
      script.onerror=()=>{cleanup();reject(new Error('JSONP failed'))};
      script.src=url + sep + 'callback=' + encodeURIComponent(callback);
      document.head.appendChild(script);
    });
  }

  async function fetchV2(){
    const url=API_V2 + '?per_page=100&orderby=date&order=desc&_embed=1';
    const response=await fetch(url,{mode:'cors',cache:'no-store',headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('WordPress v2 HTTP '+response.status);
    const data=await response.json();
    if(!Array.isArray(data))throw new Error('Unexpected WordPress v2 response');
    return data;
  }

  async function fetchV1(){
    const url=API_V1 + '?number=100&order_by=date&order=DESC';
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
    let lastError;
    try{return await fetchV2()}catch(e){lastError=e;console.warn('[articles] v2 failed, trying v1',e)}
    try{return await fetchV1()}catch(e){lastError=e;console.warn('[articles] v1 failed',e)}
    throw lastError || new Error('WordPress unavailable');
  }

  function isNewEnough(post){
    const d=new Date(post.date);
    return !Number.isNaN(d.getTime()) && d >= LAUNCH;
  }

  function localize(root=document){
    const lang=isEnglish()?'en':'lt';
    root.querySelectorAll('[data-lt][data-en]').forEach(el=>{el.textContent=el.dataset[lang]});
  }

  function card(post,index){
    const a=document.createElement('a');
    a.className='article-card';
    a.href='article.html?slug=' + encodeURIComponent(post.slug);
    const image=imageFor(post);
    const excerpt=stripHtml(post.excerpt?.rendered || post.content?.rendered || '').slice(0,index===0?260:175);
    const title=decode(post.title?.rendered || '');
    const media=image
      ? '<div class="article-card-media"><img src="' + image.replace(/"/g,'&quot;') + '" alt="" loading="lazy"></div>'
      : '<div class="article-card-media is-placeholder" aria-hidden="true"></div>';
    a.innerHTML=media +
      '<div class="article-card-copy">' +
      '<div class="article-card-meta"><time>' + formatDate(post.date) + '</time><span>·</span><span>' + readingTime(post.content?.rendered || '') + '</span></div>' +
      '<h2>' + title + '</h2>' +
      (excerpt?'<p>' + excerpt + (excerpt.length >= (index===0?260:175) ? '…' : '') + '</p>':'') +
      '<span class="article-card-link">' + (isEnglish()?'Read article':'Skaityti straipsnį') + '</span>' +
      '</div>';
    return a;
  }

  async function loadList(){
    const loading=document.querySelector('[data-articles-loading]');
    const grid=document.querySelector('[data-articles-grid]');
    const empty=document.querySelector('[data-articles-empty]');
    const errorBox=document.querySelector('[data-articles-error]');
    if(!grid)return;
    loading.hidden=false;grid.hidden=true;empty.hidden=true;errorBox.hidden=true;
    try{
      const posts=(await getPosts()).filter(isNewEnough);
      loading.hidden=true;
      if(!posts.length){empty.hidden=false;localize(empty);return}
      grid.innerHTML='';
      posts.forEach((post,index)=>grid.appendChild(card(post,index)));
      grid.hidden=false;
      window.dispatchEvent(new Event('resize'));
    }catch(err){
      console.error('[articles]',err);
      loading.hidden=true;errorBox.hidden=false;localize(errorBox);
    }
  }

  function updateSeo(post,image){
    const title=decode(post.title?.rendered || '');
    const description=stripHtml(post.excerpt?.rendered || post.content?.rendered || '').slice(0,180);
    const canonical='https://lukaslazinka.github.io/article.html?slug=' + encodeURIComponent(post.slug);
    document.title=title + ' — Lukas Lazinka';
    const set=(selector,attr,value)=>{const el=document.querySelector(selector);if(el)el.setAttribute(attr,value)};
    set('meta[name="description"]','content',description);
    set('meta[property="og:title"]','content',title + ' — Lukas Lazinka');
    set('meta[property="og:description"]','content',description);
    set('meta[property="og:url"]','content',canonical);
    if(image)set('meta[property="og:image"]','content',image);
    const canonicalEl=document.querySelector('link[rel="canonical"]');if(canonicalEl)canonicalEl.href=canonical;
  }

  async function loadArticle(){
    const detail=document.querySelector('[data-article-detail]');
    if(!detail)return;
    const loading=document.querySelector('[data-article-loading]');
    const errorBox=document.querySelector('[data-article-error]');
    const slug=new URLSearchParams(location.search).get('slug');
    if(!slug){loading.hidden=true;errorBox.hidden=false;localize(errorBox);return}
    try{
      const posts=await getPosts();
      const post=posts.find(p=>p.slug===slug && isNewEnough(p));
      if(!post)throw new Error('not found');
      const title=decode(post.title?.rendered || '');
      const image=imageFor(post);
      detail.querySelector('[data-article-title]').textContent=title;
      detail.querySelector('[data-article-date]').textContent=formatDate(post.date);
      detail.querySelector('[data-article-date]').dateTime=post.date;
      detail.querySelector('[data-article-reading]').textContent=readingTime(post.content?.rendered || '');
      detail.querySelector('[data-article-content]').innerHTML=sanitizeHtml(post.content?.rendered || '');
      const wrap=detail.querySelector('[data-article-image-wrap]');
      const img=detail.querySelector('[data-article-image]');
      if(image){img.src=image;img.alt=title;wrap.hidden=false}
      updateSeo(post,image);
      loading.hidden=true;detail.hidden=false;
      window.dispatchEvent(new Event('resize'));
    }catch(err){
      console.error('[article]',err);
      loading.hidden=true;errorBox.hidden=false;localize(errorBox);
    }
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-articles-retry]'))loadList();
  });

  const observer=new MutationObserver(()=>localize());
  if(document.body)observer.observe(document.body,{attributes:true,attributeFilter:['data-current-language']});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{loadList();loadArticle()},{once:true});
  }else{
    loadList();loadArticle();
  }
})();