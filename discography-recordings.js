(()=>{'use strict';
 const pieces={
 'garsu-kristalai':[1,2,3],
 'skylantys-garsai':[1,2,3],
 'clarinetabuli':[0],
 'zuvinto-giesmes':[1,2,3],
 'grybu-karo-menas':[0],
 'man-man-man-man-tau':[1,2],
 'pekino-arfa':[0],
 'in-memoriam-m-k-c':[1,2,3,4,5,6,7,8,9,10,11]
 };
 const cards=[...document.querySelectorAll('[data-disco-audio]')];
 if(!cards.length)return;
 const instances=[];
 const friendlyTime=t=>{if(!Number.isFinite(t)||t<0)return '0:00';const s=Math.floor(t);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
 cards.forEach(card=>{
  const slug=card.dataset.discoAudio, parts=pieces[slug], button=card.querySelector('[data-disco-play]'),seek=card.querySelector('[data-disco-seek]'),time=card.querySelector('[data-disco-time]'),error=card.querySelector('[data-disco-error]');
  if(!parts||!button||!seek)return;
  const audio=new Audio();audio.preload='none';let url='',pending=false;
  const getLang=()=>document.documentElement.lang==='en'?'en':'lt';
  const label=()=>{const state=audio.paused?'play':'pause';button.textContent=state==='play'?'▶':'Ⅱ';button.setAttribute('aria-label',(getLang()==='en'?(state==='play'?'Play ':'Pause '):(state==='play'?'Paleisti ':'Pristabdyti '))+card.dataset.discoTitle);button.setAttribute('aria-pressed',String(state==='pause'));card.classList.toggle('is-playing',state==='pause')};
  const paths=parts.map(i=>i===0?'assets/audio/'+slug+'.mp3':'assets/audio/'+slug+'-part'+String(i).padStart(2,'0')+'.mp3');
  const load=async()=>{if(url)return;const buffers=await Promise.all(paths.map(async p=>{const response=await fetch(p);if(!response.ok)throw new Error('HTTP '+response.status+': '+p);return response.arrayBuffer()}));url=URL.createObjectURL(new Blob(buffers,{type:'audio/mpeg'}));audio.src=url;audio.load()};
  const update=()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){seek.value=String(Math.floor(audio.currentTime/audio.duration*1000));time.textContent=friendlyTime(audio.currentTime)+' / '+friendlyTime(audio.duration)}else{time.textContent=friendlyTime(audio.currentTime)}};
  audio.addEventListener('play',label);audio.addEventListener('pause',label);audio.addEventListener('ended',label);audio.addEventListener('timeupdate',update);audio.addEventListener('loadedmetadata',update);
  button.addEventListener('click',async()=>{if(pending)return;if(!audio.paused){audio.pause();return}instances.forEach(other=>{if(other.audio!==audio)other.audio.pause()});if(error)error.textContent='';try{pending=true;button.disabled=true;await load();await audio.play()}catch(e){console.warn('Discography playback:',e);if(error)error.textContent=getLang()==='en'?'Audio unavailable':'Nepavyko įkelti garso'}finally{pending=false;button.disabled=false;label()}});
  seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=audio.duration*Number(seek.value)/1000});
  instances.push({audio,release:()=>{audio.pause();if(url)URL.revokeObjectURL(url)}});label();
 });
 window.addEventListener('pagehide',()=>instances.forEach(x=>x.release()),{once:true});
})();