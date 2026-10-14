(() => {
  const files = {
  "garsu-kristalai": [
    "assets/audio/garsu-kristalai-part01.mp3",
    "assets/audio/garsu-kristalai-part02.mp3",
    "assets/audio/garsu-kristalai-part03.mp3"
  ],
  "skylantys-garsai": [
    "assets/audio/skylantys-garsai-part01.mp3",
    "assets/audio/skylantys-garsai-part02.mp3",
    "assets/audio/skylantys-garsai-part03.mp3"
  ],
  "clarinetabuli": [
    "assets/audio/clarinetabuli.mp3"
  ],
  "zuvinto-giesmes": [
    "assets/audio/zuvinto-giesmes-part01.mp3",
    "assets/audio/zuvinto-giesmes-part02.mp3",
    "assets/audio/zuvinto-giesmes-part03.mp3"
  ],
  "grybu-karo-menas": [
    "assets/audio/grybu-karo-menas.mp3"
  ],
  "man-man-man-man-tau": [
    "assets/audio/man-man-man-man-tau-part01.mp3",
    "assets/audio/man-man-man-man-tau-part02.mp3"
  ],
  "pekino-arfa": [
    "assets/audio/pekino-arfa.mp3"
  ],
  "in-memoriam-m-k-c": [
    "assets/audio/in-memoriam-m-k-c-part01.mp3",
    "assets/audio/in-memoriam-m-k-c-part02.mp3",
    "assets/audio/in-memoriam-m-k-c-part03.mp3",
    "assets/audio/in-memoriam-m-k-c-part04.mp3",
    "assets/audio/in-memoriam-m-k-c-part05.mp3",
    "assets/audio/in-memoriam-m-k-c-part06.mp3",
    "assets/audio/in-memoriam-m-k-c-part07.mp3",
    "assets/audio/in-memoriam-m-k-c-part08.mp3",
    "assets/audio/in-memoriam-m-k-c-part09.mp3",
    "assets/audio/in-memoriam-m-k-c-part10.mp3",
    "assets/audio/in-memoriam-m-k-c-part11.mp3"
  ]
};
  const button = document.querySelector('[data-score-audio-button]');
  const audio = document.querySelector('[data-score-audio-player]');
  if (!button || !audio) return;
  const paths = files[button.dataset.scoreAudioButton];
  if (!paths || !paths.length) return;
  let objectUrl = null;
  let loading = false;
  const en = () => document.documentElement.lang === 'en';
  const setState = state => {
    button.classList.toggle('is-playing',state==='playing');
    button.classList.toggle('is-loading',state==='loading');
    button.classList.toggle('is-error',state==='error');
    button.disabled=state==='loading';
    button.setAttribute('aria-pressed',String(state==='playing'));
    button.setAttribute('aria-label',state==='playing'?(en()?'Pause':'Pristabdyti'):state==='loading'?(en()?'Loading':'Įkeliama'):state==='error'?(en()?'Retry playback':'Bandyti dar kartą'):(en()?'Play':'Paleisti'));
  };
  const load=async()=>{
    if(objectUrl)return;
    const buffers=await Promise.all(paths.map(async p=>{
      const res=await fetch(p,{cache:'default'});
      if(!res.ok)throw new Error(p+': HTTP '+res.status);
      return res.arrayBuffer();
    }));
    objectUrl=URL.createObjectURL(new Blob(buffers,{type:'audio/mpeg'}));
    audio.src=objectUrl;
    audio.load();
  };
  button.addEventListener('click',async()=>{
    if(loading)return;
    if(!audio.paused){audio.pause();return;}
    if(!objectUrl){
      loading=true;setState('loading');
      try {await load();}
      catch(err){console.error('Score audio unavailable:',err);setState('error');return;}
      finally{loading=false;}
    }
    try {await audio.play();setState('playing');}
    catch(err){console.error('Playback failed:',err);setState('error');}
  });
  audio.addEventListener('play',()=>setState('playing'));
  audio.addEventListener('pause',()=>setState('idle'));
  audio.addEventListener('ended',()=>setState('idle'));
  audio.addEventListener('error',()=>setState('error'));
  window.addEventListener('pagehide',()=>{if(objectUrl)URL.revokeObjectURL(objectUrl);},{once:true});
  setState('idle');
})();
