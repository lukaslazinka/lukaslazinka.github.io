(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const profile = document.querySelector('.profile-layout');
  if (!profile || document.querySelector('[data-about-compass]')) return;

  const currentLang = () => document.body.dataset.currentLanguage === 'en' ? 'en' : 'lt';
  const translateNewContent = (root) => {
    const lang = currentLang();
    root.querySelectorAll('[data-lt][data-en]').forEach((el) => {
      el.textContent = el.dataset[lang];
    });
  };

  const template = document.createElement('template');
  template.innerHTML = `
    <section class="about-compass shell" data-about-compass>
      <div class="about-compass-head">
        <div>
          <p class="eyebrow" data-lt="Interaktyviai apie mane" data-en="About me, interactively">Interaktyviai apie mane</p>
          <h2 data-lt="Mano muzikinis kompasas." data-en="My musical compass.">Mano muzikinis kompasas.</h2>
        </div>
        <p class="about-compass-intro" data-lt="Pasirink vieną kryptį. Vietoj dar vienos ilgos biografijos čia galima greitai atsiversti skirtingas mano muzikinio kelio puses — nuo Ignalinos ir akordeono iki kompozicijos, elektronikos ir kūrybinio skambesio." data-en="Choose a direction. Instead of another long biography, this lets you quickly open different sides of my musical path — from Ignalina and accordion to composition, electronic music and my artistic sound.">Pasirink vieną kryptį. Vietoj dar vienos ilgos biografijos čia galima greitai atsiversti skirtingas mano muzikinio kelio puses — nuo Ignalinos ir akordeono iki kompozicijos, elektronikos ir kūrybinio skambesio.</p>
      </div>

      <div class="about-compass-grid">
        <div class="about-compass-nav" role="tablist" aria-label="Apie mane temos">
          <button class="about-choice is-active" type="button" role="tab" aria-selected="true" data-about-choice="origin" data-lt="Ištakos" data-en="Origins">Ištakos</button>
          <button class="about-choice" type="button" role="tab" aria-selected="false" tabindex="-1" data-about-choice="accordion" data-lt="Akordeonas" data-en="Accordion">Akordeonas</button>
          <button class="about-choice" type="button" role="tab" aria-selected="false" tabindex="-1" data-about-choice="performing" data-lt="Atlikimas" data-en="Performance">Atlikimas</button>
          <button class="about-choice" type="button" role="tab" aria-selected="false" tabindex="-1" data-about-choice="composition" data-lt="Kompozicija" data-en="Composition">Kompozicija</button>
          <button class="about-choice" type="button" role="tab" aria-selected="false" tabindex="-1" data-about-choice="sound" data-lt="Skambesys" data-en="Sound">Skambesys</button>
          <button class="about-choice" type="button" role="tab" aria-selected="false" tabindex="-1" data-about-choice="today" data-lt="Dabar" data-en="Now">Dabar</button>
        </div>

        <div class="about-compass-panel" aria-live="polite">
          <article class="about-panel-content is-active" data-about-panel="origin">
            <p class="about-panel-kicker" data-lt="01 · Ištakos" data-en="01 · Origins">01 · Ištakos</p>
            <h3 data-lt="Ignalina — mano muzikinės istorijos pradžia." data-en="Ignalina — where my musical story began.">Ignalina — mano muzikinės istorijos pradžia.</h3>
            <p data-lt="Gimiau 2002 m. Ignalinoje, Lietuvoje. 2009 m. mano kasdienybėje atsirado muzikos mokykla ir akordeonas — nuo čia prasidėjo kelias, kuris vėliau nuvedė į Vilnių, konservatoriją ir kompoziciją." data-en="I was born in 2002 in Ignalina, Lithuania. In 2009 music school and accordion entered my daily life — the beginning of a path that later led to Vilnius, the Conservatory and composition.">Gimiau 2002 m. Ignalinoje, Lietuvoje. 2009 m. mano kasdienybėje atsirado muzikos mokykla ir akordeonas — nuo čia prasidėjo kelias, kuris vėliau nuvedė į Vilnių, konservatoriją ir kompoziciją.</p>
            <div class="about-fact-chips"><span class="about-fact-chip">2002</span><span class="about-fact-chip">Ignalina</span><span class="about-fact-chip">2009</span></div>
          </article>

          <article class="about-panel-content" data-about-panel="accordion" hidden>
            <p class="about-panel-kicker" data-lt="02 · Akordeonas" data-en="02 · Accordion">02 · Akordeonas</p>
            <h3 data-lt="Pirmasis instrumentas liko svarbia mano kelio dalimi." data-en="My first instrument remained an important part of the journey.">Pirmasis instrumentas liko svarbia mano kelio dalimi.</h3>
            <p data-lt="Akordeono pradėjau mokytis 2009 m. Ignalinos muzikos mokykloje. 2017 m. jau pasirinkau akordeono specialybę Vilniaus Juozo Tallat-Kelpšos konservatorijoje, kur toliau gilinau atlikimo įgūdžius." data-en="I began learning accordion in 2009 at Ignalina music school. In 2017 I chose accordion as my specialisation at the Vilnius Juozas Tallat-Kelpša Conservatory, where I continued developing as a performer.">Akordeono pradėjau mokytis 2009 m. Ignalinos muzikos mokykloje. 2017 m. jau pasirinkau akordeono specialybę Vilniaus Juozo Tallat-Kelpšos konservatorijoje, kur toliau gilinau atlikimo įgūdžius.</p>
            <div class="about-fact-chips"><span class="about-fact-chip" data-lt="Pirmas instrumentas" data-en="First instrument">Pirmas instrumentas</span><span class="about-fact-chip">2009</span><span class="about-fact-chip">2017</span></div>
          </article>

          <article class="about-panel-content" data-about-panel="performing" hidden>
            <p class="about-panel-kicker" data-lt="03 · Atlikimas" data-en="03 · Performance">03 · Atlikimas</p>
            <h3 data-lt="Prieš kompoziciją buvo scena, ansambliai ir konkursai." data-en="Before composition came the stage, ensembles and competitions.">Prieš kompoziciją buvo scena, ansambliai ir konkursai.</h3>
            <p data-lt="Mokydamasis grojau mokyklos kolektyvuose, dalyvavau koncertuose Ignalinos rajone ir užsienyje, o konservatorijoje — koncertuose, konkursuose ir festivaliuose Lietuvoje bei užsienyje. Solo ir ansambliniai pasirodymai buvo įvertinti prizais." data-en="During my studies I performed with school ensembles in the Ignalina district and abroad, and at the Conservatory I took part in concerts, competitions and festivals in Lithuania and internationally. My solo and ensemble performances received prizes.">Mokydamasis grojau mokyklos kolektyvuose, dalyvavau koncertuose Ignalinos rajone ir užsienyje, o konservatorijoje — koncertuose, konkursuose ir festivaliuose Lietuvoje bei užsienyje. Solo ir ansambliniai pasirodymai buvo įvertinti prizais.</p>
            <div class="about-fact-chips"><span class="about-fact-chip" data-lt="Koncertai" data-en="Concerts">Koncertai</span><span class="about-fact-chip" data-lt="Konkursai" data-en="Competitions">Konkursai</span><span class="about-fact-chip" data-lt="Ansambliai" data-en="Ensembles">Ansambliai</span></div>
          </article>

          <article class="about-panel-content" data-about-panel="composition" hidden>
            <p class="about-panel-kicker" data-lt="04 · Kompozicija" data-en="04 · Composition">04 · Kompozicija</p>
            <h3 data-lt="Dvyliktoje klasėje atsirado nauja pagrindinė kryptis." data-en="In the twelfth grade, a new central direction appeared.">Dvyliktoje klasėje atsirado nauja pagrindinė kryptis.</h3>
            <p data-lt="Kompoziciją pradėjau studijuoti pas prof. Ričardą Kabelį. 2021 m. įstojau į Lietuvos muzikos ir teatro akademijos Kompozicijos katedrą ir ten tęsiau studijas pas tą patį profesorių." data-en="I began studying composition with Prof. Ričardas Kabelis. In 2021 I entered the Department of Composition at the Lithuanian Academy of Music and Theatre and continued my studies with the same professor.">Kompoziciją pradėjau studijuoti pas prof. Ričardą Kabelį. 2021 m. įstojau į Lietuvos muzikos ir teatro akademijos Kompozicijos katedrą ir ten tęsiau studijas pas tą patį profesorių.</p>
            <div class="about-fact-chips"><span class="about-fact-chip">LMTA</span><span class="about-fact-chip">2021</span><span class="about-fact-chip" data-lt="Prof. Ričardas Kabelis" data-en="Prof. Ričardas Kabelis">Prof. Ričardas Kabelis</span></div>
          </article>

          <article class="about-panel-content" data-about-panel="sound" hidden>
            <p class="about-panel-kicker" data-lt="05 · Skambesys" data-en="05 · Sound">05 · Skambesys</p>
            <h3 data-lt="Tarp struktūros, emocijos ir skirtingų muzikos kalbų." data-en="Between structure, emotion and different musical languages.">Tarp struktūros, emocijos ir skirtingų muzikos kalbų.</h3>
            <p data-lt="Savo muzikoje siekiu įvairovės, jausmingumo ir nežemiško skambesio, kartu remdamasis kompozicinėmis sistemomis. Klasikinės harmonijos akordus jungiu su populiariosios muzikos motyvais, taip pat kuriu elektroninę šokių muziką." data-en="In my music I seek variety, emotion and an otherworldly sound while working with compositional systems. I combine classical harmony with pop-influenced motifs and also create electronic dance music.">Savo muzikoje siekiu įvairovės, jausmingumo ir nežemiško skambesio, kartu remdamasis kompozicinėmis sistemomis. Klasikinės harmonijos akordus jungiu su populiariosios muzikos motyvais, taip pat kuriu elektroninę šokių muziką.</p>
            <div class="about-fact-chips"><span class="about-fact-chip" data-lt="Šiuolaikinė" data-en="Contemporary">Šiuolaikinė</span><span class="about-fact-chip" data-lt="Klasikinė" data-en="Classical">Klasikinė</span><span class="about-fact-chip" data-lt="Elektroninė" data-en="Electronic">Elektroninė</span></div>
          </article>

          <article class="about-panel-content" data-about-panel="today" hidden>
            <p class="about-panel-kicker" data-lt="06 · Dabar" data-en="06 · Now">06 · Dabar</p>
            <h3 data-lt="Partitūros ir skaitmeniniai įrašai egzistuoja greta." data-en="Scores and digital releases live side by side.">Partitūros ir skaitmeniniai įrašai egzistuoja greta.</h3>
            <p data-lt="Savo kūrinius publikuoju YouTube, Spotify, Apple Music ir kitose platformose. Mano muzika taip pat saugoma autorių ir gretutinių teisių asociacijose AGATA ir LATGA." data-en="I publish my work on YouTube, Spotify, Apple Music and other platforms. My music is also protected through the copyright and neighbouring-rights associations AGATA and LATGA.">Savo kūrinius publikuoju YouTube, Spotify, Apple Music ir kitose platformose. Mano muzika taip pat saugoma autorių ir gretutinių teisių asociacijose AGATA ir LATGA.</p>
            <div class="about-fact-chips"><span class="about-fact-chip">Spotify</span><span class="about-fact-chip">YouTube</span><span class="about-fact-chip">AGATA · LATGA</span></div>
          </article>

          <div class="about-random-row">
            <button class="button primary" type="button" data-about-random data-lt="✦ Parodyti kitą mano pusę" data-en="✦ Show another side of me">✦ Parodyti kitą mano pusę</button>
            <span class="about-random-note" data-lt="Mygtukas parinks temą atsitiktinai." data-en="The button chooses a topic at random.">Mygtukas parinks temą atsitiktinai.</span>
          </div>
        </div>
      </div>
    </section>`;

  const section = template.content.firstElementChild;
  profile.insertAdjacentElement('afterend', section);
  translateNewContent(section);

  const choices = Array.from(section.querySelectorAll('[data-about-choice]'));
  const panels = Array.from(section.querySelectorAll('[data-about-panel]'));
  let activeKey = 'origin';

  const sparkle = (control, event) => {
    if (reduced) return;
    const rect = control.getBoundingClientRect();
    const spark = document.createElement('span');
    spark.className = 'about-spark';
    spark.setAttribute('aria-hidden', 'true');
    spark.style.setProperty('--sx', `${event ? event.clientX - rect.left : rect.width * .7}px`);
    spark.style.setProperty('--sy', `${event ? event.clientY - rect.top : rect.height * .45}px`);
    control.appendChild(spark);
    window.setTimeout(() => spark.remove(), 650);
  };

  const press = (control, event) => {
    control.classList.remove('is-pressed');
    void control.offsetWidth;
    control.classList.add('is-pressed');
    window.setTimeout(() => control.classList.remove('is-pressed'), 430);
    sparkle(control, event);
  };

  const activate = (key, control, event) => {
    activeKey = key;
    choices.forEach((choice) => {
      const active = choice.dataset.aboutChoice === key;
      choice.classList.toggle('is-active', active);
      choice.setAttribute('aria-selected', String(active));
      choice.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.dataset.aboutPanel === key;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    if (control) press(control, event);
  };

  choices.forEach((choice, index) => {
    choice.addEventListener('click', (event) => activate(choice.dataset.aboutChoice, choice, event));
    choice.addEventListener('keydown', (event) => {
      if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const delta = (event.key === 'ArrowRight' || event.key === 'ArrowDown') ? 1 : -1;
      const next = choices[(index + delta + choices.length) % choices.length];
      next.focus();
      activate(next.dataset.aboutChoice, next);
    });
  });

  const randomButton = section.querySelector('[data-about-random]');
  randomButton?.addEventListener('click', (event) => {
    const alternatives = choices.filter((choice) => choice.dataset.aboutChoice !== activeKey);
    const next = alternatives[Math.floor(Math.random() * alternatives.length)];
    press(randomButton, event);
    activate(next.dataset.aboutChoice, next);
  });

  const panel = section.querySelector('.about-compass-panel');
  if (panel && !reduced && window.matchMedia('(pointer:fine)').matches) {
    panel.addEventListener('pointermove', (event) => {
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty('--panel-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      panel.style.setProperty('--panel-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    }, { passive:true });
  }

  const portraitWrap = document.querySelector('.profile-image-wrap');
  const portrait = portraitWrap?.querySelector('.profile-image');
  if (portraitWrap && portrait && !reduced && window.matchMedia('(pointer:fine)').matches) {
    portraitWrap.addEventListener('pointermove', (event) => {
      const rect = portraitWrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      portraitWrap.style.setProperty('--portrait-x', `${x * 100}%`);
      portraitWrap.style.setProperty('--portrait-y', `${y * 100}%`);
      portraitWrap.classList.add('about-live');
      const rotateY = (x - .5) * 4.5;
      const rotateX = (.5 - y) * 4.5;
      portrait.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;
    }, { passive:true });
    portraitWrap.addEventListener('pointerleave', () => {
      portraitWrap.classList.remove('about-live');
      portrait.style.transform = '';
    });
  }

  document.querySelectorAll('.timeline-item').forEach((item) => {
    item.tabIndex = 0;
    item.setAttribute('role','button');
    const toggle = () => {
      const active = item.classList.contains('is-focused');
      document.querySelectorAll('.timeline-item.is-focused').forEach((row) => row.classList.remove('is-focused'));
      if (!active) item.classList.add('is-focused');
    };
    item.addEventListener('click', toggle);
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggle();
    });
  });

  const progress = document.createElement('div');
  progress.className = 'about-scroll-progress';
  progress.setAttribute('aria-hidden','true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.setProperty('--about-progress', `${Math.min(100, Math.max(0, (window.scrollY / max) * 100))}%`);
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive:true });
})();
