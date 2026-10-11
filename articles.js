(() => {
  const SITE = 'https://lukaslazinka.wordpress.com';
  const API = SITE + '/wp-json/wp/v2/posts';
  const LAUNCH = '2026-10-11T00:00:00';
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
    return first && (first.source_url || (first.media_details && first.media_details.sizes && first.media_details.sizes.large && first.media_details.sizes.large.source_url)) || '';
  }

  function jsonp(url){
    return new Promise((resolve,reject)=>{
      const callback='wpArticles_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      const script=document.createElement('script');
      const sep=url.includes('?')?'&':'?';
      const timer=setTimeout(()=>{cleanup();reject(new Error('JSONP timeout'))},12000);
      function cleanup(){clearTimeout(timer);delete window[callback];script.remove()}
      window[callback]=(data)=>{cleanup();resolve(data)};
      script.onerror=()=>{cleanup();reject(new Error('JSONP failed'))};
      script.src=url + sep + '_jsonp=' + encodeURIComponent(callback);
      document.head.appendChild(script);
    });
  }

  async function getJson(url){
    try{
      const response=await fetch(url,{headers:{Accept:'application/json'}});
      if(!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json();
    }catch(error){
      return await jsonp(url);
    }
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
    const excerpt=stripHtml(post.excerpt && post.excerpt.rendered || post.content && post.content.rendered || '').slice(0,index===0?260:175);
    const title=decode(post.title && post.title.rendered || '');
    const media=image
      ? '<div class="article-card-media"><img src="' + image.replace(/"/g,'&quot;') + '" alt="" loading="lazy"></div>'
      : '<div class="article-card-media is-placeholder" aria-hidden="true"></div>';
    a.innerHTML=media +
      '<div class="article-card-copy">' +
      '<div class="article-card-meta"><time>' + formatDate(post.date) + '</time><span>·</span><span>' + readingTime(post.content && post.content.rendered || '') + '</span></div>' +
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
    if(!grid) return;
    loading.hidden=false;grid.hidden=true;empty.hidden=true;errorBox.hidden=true;
    try{
      const url=API + '?per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia&after=' + encodeURIComponent(LAUNCH);
      const posts=await getJson(url);
      loading.hidden=true;
      if(!Array.isArray(posts) || !posts.length){empty.hidden=false;localize(empty);return}
      grid.innerHTML='';
      posts.forEach((post,index)=>grid.appendChild(card(post,index)));
      grid.hidden=false;
      if(window.__lukasSiteWideExperience) window.dispatchEvent(new Event('resize'));
    }catch(err){
      console.error('[articles]',err);
      loading.hidden=true;errorBox.hidden=false;localize(errorBox);
    }
  }

  function updateSeo(post,image){
    const title=decode(post.title && post.title.rendered || '');
    const description=stripHtml(post.excerpt && post.excerpt.rendered || post.content && post.content.rendered || '').slice(0,180);
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
      const url=API + '?slug=' + encodeURIComponent(slug) + '&_embed=wp:featuredmedia';
      const posts=await getJson(url);
      const post=Array.isArray(posts)&&posts[0];
      if(!post || new Date(post.date) < new Date(LAUNCH)) throw new Error('not found');
      const title=decode(post.title && post.title.rendered || '');
      const image=imageFor(post);
      detail.querySelector('[data-article-title]').textContent=title;
      detail.querySelector('[data-article-date]').textContent=formatDate(post.date);
      detail.querySelector('[data-article-date]').dateTime=post.date;
      detail.querySelector('[data-article-reading]').textContent=readingTime(post.content && post.content.rendered || '');
      detail.querySelector('[data-article-content]').innerHTML=sanitizeHtml(post.content && post.content.rendered || '');
      const wrap=detail.querySelector('[data-article-image-wrap]');
      const img=detail.querySelector('[data-article-image]');
      if(image){img.src=image;img.alt=title;wrap.hidden=false}
      updateSeo(post,image);
      loading.hidden=true;detail.hidden=false;
      if(window.__lukasSiteWideExperience) window.dispatchEvent(new Event('resize'));
    }catch(err){
      console.error('[article]',err);
      loading.hidden=true;errorBox.hidden=false;localize(errorBox);
    }
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-articles-retry]')) loadList();
  });

  const observer=new MutationObserver(()=>localize());
  if(document.body)observer.observe(document.body,{attributes:true,attributeFilter:['data-current-language']});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{loadList();loadArticle()},{once:true});
  }else{
    loadList();loadArticle();
  }
})();