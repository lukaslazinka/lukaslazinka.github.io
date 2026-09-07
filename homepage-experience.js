(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.querySelector('link[data-gold-light-expansion]')) {
    const lightStyles = document.createElement('link');
    lightStyles.rel = 'stylesheet';
    lightStyles.href = 'gold-light-expansion.css?v=20260907-1350';
    lightStyles.dataset.goldLightExpansion = 'true';
    document.head.appendChild(lightStyles);
  }

  const mountHomePlayer = () => {
    const facts = document.querySelector('.home-facts');
    if (!facts || document.querySelector('[data-home-listen]')) return;

    if (!document.querySelector('link[data-home-player]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'home-player.css?v=20260907-1448';
      link.dataset.homePlayer = 'true';
      document.head.appendChild(link);
    }

    const tracks = {
      midnight: {
        title: 'Midnight Chase',
        year: '2024',
        kind: 'album',
        src: 'https://open.spotify.com/embed/album/52zN9FwtFD4P2bCXSA3CC1?si=Yt_mwR1MRZ-Z0sNXZkACJA'
      },
      echostride: {
        title: 'Echostride',
        year: '2024',
        kind: 'track',
        src: 'https://open.spotify.com/embed/track/2fAB8ODlRjGhhV0mjcSfIC?si=5133f7c5cbe645d8'
      },
      proBono: {
        title: 'Pro Bono',
        year: '2024',
        kind: 'track',
        src: 'https://open.spotify.com/embed/track/5dJgNzfzbfEczGyzNZzI6x?si=2f16de948a074a40'
      },
      insomnia: {
        title: 'Insomnia',
        year: '2023',
        kind: 'track',
        src: 'https://open.spotify.com/embed/track/2KkSTYV8ERMx7l9te2SYDP?si=1fdcd91432ba4a75'
      },
      variations: {
        title: 'Dvylikos garsų variacijos',
        year: '2022',
        kind: 'track',
        src: 'https://open.spotify.com/embed/track/1EUmFvfmjwlCZjCgoYE6Sr?si=7a2d53769fb242c4'
      },
      blackWoods: {
        title: 'Black Woods',
        year: '2022',
        kind: 'track',
        src: 'https://open.spotify.com/embed/track/28bLQmNgGEexpRuEkSWSDT?si=a8c559c3c45547b4'
      }
    };

    const template = document.createElement('template');
    template.innerHTML = `
      <section class="home-listen shell" data-home-listen>
        <div class="home-listen-head">
          <div>
            <p class="eyebrow" data-lt="Klausyti čia" data-en="Listen here">Klausyti čia</p>
            <h2 data-lt="Mano muzika — neišeinant iš puslapio." data-en="My music — without leaving the site.">Mano muzika — neišeinant iš puslapio.</h2>
          </div>
          <p class="home-listen-intro" data-lt="Pasirink kūrinį ir klausyk jo tiesiog čia. Nebereikia atidarinėti atskiro Spotify lango vien tam, kad išgirstum mano muziką." data-en="Choose a work and listen to it directly here. You no longer need to open a separate Spotify window just to hear my music.">Pasirink kūrinį ir klausyk jo tiesiog čia. Nebereikia atidarinėti atskiro Spotify lango vien tam, kad išgirstum mano muziką.</p>
        </div>

        <div class="home-listen-layout">
          <div class="home-track-list" role="tablist" aria-label="Kūriniai klausymui">
            <button class="home-track is-active" type="button" role="tab" aria-selected="true" data-home-track="midnight"><span class="home-track-index">01</span><span class="home-track-copy"><strong>Midnight Chase</strong><small>2024</small></span><span class="home-track-mark">▶</span></button>
            <button class="home-track" type="button" role="tab" aria-selected="false" data-home-track="echostride"><span class="home-track-index">02</span><span class="home-track-copy"><strong>Echostride</strong><small>2024</small></span><span class="home-track-mark">▶</span></button>
            <button class="home-track" type="button" role="tab" aria-selected="false" data-home-track="proBono"><span class="home-track-index">03</span><span class="home-track-copy"><strong>Pro Bono</strong><small>2024</small></span><span class="home-track-mark">▶</span></button>
            <button class="home-track" type="button" role="tab" aria-selected="false" data-home-track="insomnia"><span class="home-track-index">04</span><span class="home-track-copy"><strong>Insomnia</strong><small>2023</small></span><span class="home-track-mark">▶</span></button>
            <button class="home-track" type="button" role="tab" aria-selected="false" data-home-track="variations"><span class="home-track-index">05</span><span class="home-track-copy"><strong>Dvylikos garsų variacijos</strong><small>2022</small></span><span class="home-track-mark">▶</span></button>
            <button class="home-track" type="button" role="tab" aria-selected="false" data-home-track="blackWoods"><span class="home-track-index">06</span><span class="home-track-copy"><strong>Black Woods</strong><small>2022</small></span><span class="home-track-mark">▶</span></button>
          </div>

          <div class="home-player-stage" data-home-player-stage>
            <div class="home-player-top">
              <div>
                <p class="home-player-kicker" data-lt="Pasirinktas kūrinys" data-en="Selected work">Pasirinktas kūrinys</p>
                <h3 class="home-player-title" data-home-player-title>Midnight Chase</h3>
                <span class="home-player-meta" data-home-player-meta>2024 · albumas</span>
              </div>
              <div class="home-eq" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
            </div>
            <div class="home-player-frame">
              <iframe data-home-player-frame src="${tracks.midnight.src}" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify: Midnight Chase"></iframe>
            </div>
            <div class="home-player-note" data-lt="Grotuvas veikia šiame puslapyje — paspausk Play ir klausyk." data-en="The player works inside this page — press Play and listen.">Grotuvas veikia šiame puslapyje — paspausk Play ir klausyk.</div>
          </div>
        </div>
      </section>`;

    const section = template.content.firstElementChild;
    facts.insertAdjacentElement('afterend', section);

    const language = document.body.dataset.currentLanguage === 'en' || document.documentElement.lang === 'en' ? 'en' : 'lt';
    section.querySelectorAll('[data-lt][data-en]').forEach((element) => {
      element.textContent = element.dataset[language];
    });

    const buttons = Array.from(section.querySelectorAll('[data-home-track]'));
    const frame = section.querySelector('[data-home-player-frame]');
    const title = section.querySelector('[data-home-player-title]');
    const meta = section.querySelector('[data-home-player-meta]');
    const stage = section.querySelector('[data-home-player-stage]');

    const activateTrack = (key, scrollIntoView = false) => {
      const track = tracks[key];
      if (!track) return;

      buttons.forEach((button) => {
        const active = button.dataset.homeTrack === key;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', String(active));
      });

      title.textContent = track.title;
      const lang = document.body.dataset.currentLanguage === 'en' ? 'en' : 'lt';
      const kind = track.kind === 'album'
        ? (lang === 'en' ? 'album' : 'albumas')
        : (lang === 'en' ? 'track' : 'kūrinys');
      meta.textContent = `${track.year} · ${kind}`;

      if (frame.src !== track.src) {
        frame.src = track.src;
        frame.title = `Spotify: ${track.title}`;
      }

      if (scrollIntoView) {
        section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => activateTrack(button.dataset.homeTrack));
    });

    const selectedRelease = document.querySelector('.selected-release');
    if (selectedRelease) {
      selectedRelease.dataset.inlineListen = 'true';
      selectedRelease.setAttribute('aria-label', language === 'en' ? 'Listen to Midnight Chase on this page' : 'Klausyti „Midnight Chase“ šiame puslapyje');
      selectedRelease.querySelector('.release-arrow')?.replaceChildren(document.createTextNode('↓'));
      const detail = selectedRelease.querySelector('.release-copy > span');
      if (detail) {
        detail.dataset.lt = '2024 · Klausyti čia';
        detail.dataset.en = '2024 · Listen here';
        detail.textContent = language === 'en' ? detail.dataset.en : detail.dataset.lt;
      }
      selectedRelease.addEventListener('click', (event) => {
        event.preventDefault();
        selectedRelease.classList.remove('is-opening');
        void selectedRelease.offsetWidth;
        selectedRelease.classList.add('is-opening');
        window.setTimeout(() => selectedRelease.classList.remove('is-opening'), 600);
        activateTrack('midnight', true);
      });
    }

    if (!prefersReducedMotion && stage) {
      stage.addEventListener('pointermove', (event) => {
        const rect = stage.getBoundingClientRect();
        stage.style.setProperty('--player-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        stage.style.setProperty('--player-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      }, { passive: true });
      stage.addEventListener('pointerleave', () => {
        stage.style.setProperty('--player-x', '75%');
        stage.style.setProperty('--player-y', '18%');
      }, { passive: true });
    }
  };

  const mountCreativeDNA = () => {
    const discover = document.querySelector('[data-discover-section]');
    if (!discover || document.querySelector('[data-dna-section]')) return;

    if (!document.querySelector('link[data-creative-dna]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'creative-dna.css?v=20260907-1335';
      link.dataset.creativeDna = 'true';
      document.head.appendChild(link);
    }

    const template = document.createElement('template');
    template.innerHTML = `
      <section class="home-dna shell" data-dna-section>
        <div class="dna-head">
          <div>
            <p class="eyebrow" data-lt="Kūrybos DNR" data-en="Creative DNA">Kūrybos DNR</p>
            <h2 data-lt="Iš ko susideda mano skambesys?" data-en="What shapes my sound?">Iš ko susideda mano skambesys?</h2>
          </div>
          <p class="dna-intro" data-lt="Čia ne sausas žanrų sąrašas. Paspausk vieną iš auksinių elementų arba leisk puslapiui parinkti atsitiktinį — kiekvienas jų parodo kitą mano muzikinio mąstymo pusę." data-en="This is not just a list of genres. Choose one of the gold elements or let the page pick one at random — each reveals another side of my musical thinking.">Čia ne sausas žanrų sąrašas. Paspausk vieną iš auksinių elementų arba leisk puslapiui parinkti atsitiktinį — kiekvienas jų parodo kitą mano muzikinio mąstymo pusę.</p>
        </div>

        <div class="dna-layout">
          <div class="dna-orbit" aria-label="Kūrybos DNR elementai">
            <div class="dna-core" aria-hidden="true"><span class="dna-core-mark">LL</span><strong data-lt="Kūrybos DNR" data-en="Creative DNA">Kūrybos DNR</strong></div>
            <button class="dna-node is-active" type="button" role="tab" aria-selected="true" data-dna-node="structure" data-lt="Struktūra" data-en="Structure">Struktūra</button>
            <button class="dna-node" type="button" role="tab" aria-selected="false" tabindex="-1" data-dna-node="emotion" data-lt="Emocija" data-en="Emotion">Emocija</button>
            <button class="dna-node" type="button" role="tab" aria-selected="false" tabindex="-1" data-dna-node="classical" data-lt="Klasika" data-en="Classical">Klasika</button>
            <button class="dna-node" type="button" role="tab" aria-selected="false" tabindex="-1" data-dna-node="electronic" data-lt="Elektronika" data-en="Electronic">Elektronika</button>
            <button class="dna-node" type="button" role="tab" aria-selected="false" tabindex="-1" data-dna-node="microtones" data-lt="Mikrotonai" data-en="Microtones">Mikrotonai</button>
            <button class="dna-node" type="button" role="tab" aria-selected="false" tabindex="-1" data-dna-node="accordion" data-lt="Akordeonas" data-en="Accordion">Akordeonas</button>
          </div>

          <div class="dna-panel" aria-live="polite">
            <article class="dna-content is-active" data-dna-panel="structure">
              <p class="dna-kicker" data-lt="01 · Struktūra" data-en="01 · Structure">01 · Struktūra</p>
              <h3 data-lt="Sistema nėra emocijos priešas." data-en="Structure does not oppose emotion.">Sistema nėra emocijos priešas.</h3>
              <p data-lt="Savo muzikoje remiuosi kompozicinėmis sistemomis, tačiau jų nelaikau tik techniniu pratimu. Struktūra man padeda organizuoti medžiagą, o galutinis tikslas lieka muzikinė išraiška ir skambesys." data-en="I work with compositional systems, but I do not treat them as a purely technical exercise. Structure helps me organise musical material while expression and sound remain the destination.">Savo muzikoje remiuosi kompozicinėmis sistemomis, tačiau jų nelaikau tik techniniu pratimu. Struktūra man padeda organizuoti medžiagą, o galutinis tikslas lieka muzikinė išraiška ir skambesys.</p>
              <div class="dna-links"><a class="button secondary" href="compositions.html" data-lt="Kūriniai" data-en="Works">Kūriniai</a></div>
            </article>

            <article class="dna-content" data-dna-panel="emotion" hidden>
              <p class="dna-kicker" data-lt="02 · Emocija" data-en="02 · Emotion">02 · Emocija</p>
              <h3 data-lt="Jausmingumas ir nežemiškas skambesys." data-en="Emotion and an otherworldly sound.">Jausmingumas ir nežemiškas skambesys.</h3>
              <p data-lt="Savo kūryboje siekiu įvairovės, jausmingumo ir nežemiško skambesio. Dėl to griežtesnės kompozicinės idėjos mano muzikoje gali susitikti su labai tiesiogine emocija ir ryškiais kontrastais." data-en="In my work I seek variety, emotion and an otherworldly sound. That allows stricter compositional ideas to meet direct feeling and pronounced contrasts.">Savo kūryboje siekiu įvairovės, jausmingumo ir nežemiško skambesio. Dėl to griežtesnės kompozicinės idėjos mano muzikoje gali susitikti su labai tiesiogine emocija ir ryškiais kontrastais.</p>
              <div class="dna-links"><a class="button secondary" href="about.html" data-lt="Apie mane" data-en="About me">Apie mane</a></div>
            </article>

            <article class="dna-content" data-dna-panel="classical" hidden>
              <p class="dna-kicker" data-lt="03 · Klasika" data-en="03 · Classical">03 · Klasika</p>
              <h3 data-lt="Klasikinė harmonija susitinka su dabartimi." data-en="Classical harmony meets the present.">Klasikinė harmonija susitinka su dabartimi.</h3>
              <p data-lt="Klasikinės harmonijos akordus jungiu su populiariosios muzikos motyvais. Man įdomi ne viena uždara stilistika, o vieta, kur skirtingos muzikinės kalbos gali susikirsti." data-en="I combine chords from classical harmony with motifs influenced by popular music. I am interested less in one closed style than in the point where different musical languages can intersect.">Klasikinės harmonijos akordus jungiu su populiariosios muzikos motyvais. Man įdomi ne viena uždara stilistika, o vieta, kur skirtingos muzikinės kalbos gali susikirsti.</p>
              <div class="dna-links"><a class="button secondary" href="compositions.html" data-lt="Peržiūrėti kūrinius" data-en="Explore works">Peržiūrėti kūrinius</a></div>
            </article>

            <article class="dna-content" data-dna-panel="electronic" hidden>
              <p class="dna-kicker" data-lt="04 · Elektronika" data-en="04 · Electronic">04 · Elektronika</p>
              <h3 data-lt="Kompozicija nesibaigia natų popieriumi." data-en="Composition does not end on the score page.">Kompozicija nesibaigia natų popieriumi.</h3>
              <p data-lt="Kuriu ir elektroninę šokių muziką, o savo įrašus publikuoju skaitmeninėse platformose. Todėl mano kūrybinėje erdvėje greta partitūros natūraliai atsiranda studijinis įrašas, elektroninis skambesys ir ritmas." data-en="I also create electronic dance music and release recordings on digital platforms. In my creative world, the score naturally sits alongside studio production, electronic sound and rhythm.">Kuriu ir elektroninę šokių muziką, o savo įrašus publikuoju skaitmeninėse platformose. Todėl mano kūrybinėje erdvėje greta partitūros natūraliai atsiranda studijinis įrašas, elektroninis skambesys ir ritmas.</p>
              <div class="dna-links"><a class="button secondary" href="music.html" data-lt="Diskografija" data-en="Discography">Diskografija</a></div>
            </article>

            <article class="dna-content" data-dna-panel="microtones" hidden>
              <p class="dna-kicker" data-lt="05 · Mikrotonai" data-en="05 · Microtones">05 · Mikrotonai</p>
              <h3 data-lt="Ketvirtatoniai dodekafoninėje medžiagoje." data-en="Quarter-tones inside twelve-tone material.">Ketvirtatoniai dodekafoninėje medžiagoje.</h3>
              <p data-lt="Kūrinyje „Skylantys tonai“ dodekafoninę matricą derinu su ketvirtatonių sistema: mikrotonai įvedami modifikuojant pačios matricos natas, todėl lieka susieti su pradine dodekafonine struktūra." data-en="In “Skylantys tonai” I combine a twelve-tone matrix with a quarter-tone system: microtones are introduced by modifying notes from the matrix itself, keeping them connected to the original twelve-tone structure.">Kūrinyje „Skylantys tonai“ dodekafoninę matricą derinu su ketvirtatonių sistema: mikrotonai įvedami modifikuojant pačios matricos natas, todėl lieka susieti su pradine dodekafonine struktūra.</p>
              <div class="dna-links"><a class="button secondary" href="composition-skylantys-tonai.html" data-lt="Apie „Skylančius tonus“" data-en="About “Skylantys tonai”">Apie „Skylančius tonus“</a></div>
            </article>

            <article class="dna-content" data-dna-panel="accordion" hidden>
              <p class="dna-kicker" data-lt="06 · Akordeonas" data-en="06 · Accordion">06 · Akordeonas</p>
              <h3 data-lt="Prieš kompoziciją buvo atlikimas." data-en="Performance came before composition.">Prieš kompoziciją buvo atlikimas.</h3>
              <p data-lt="Akordeoną pradėjau mokytis 2009 m., o 2017 m. pasirinkau akordeono specialybę Vilniaus Juozo Tallat-Kelpšos konservatorijoje. Koncertai, konkursai, festivaliai ir ansamblinis grojimas buvo svarbi mano muzikinio kelio dalis dar prieš kompozicijos studijas." data-en="I began learning accordion in 2009 and in 2017 entered the accordion programme at the Vilnius Juozas Tallat-Kelpša Conservatory. Concerts, competitions, festivals and ensemble playing were an important part of my musical path before composition studies.">Akordeoną pradėjau mokytis 2009 m., o 2017 m. pasirinkau akordeono specialybę Vilniaus Juozo Tallat-Kelpšos konservatorijoje. Koncertai, konkursai, festivaliai ir ansamblinis grojimas buvo svarbi mano muzikinio kelio dalis dar prieš kompozicijos studijas.</p>
              <div class="dna-links"><a class="button secondary" href="about.html" data-lt="Visa biografija" data-en="Full biography">Visa biografija</a></div>
            </article>

            <div class="dna-random"><button class="button primary" type="button" data-dna-random data-lt="✦ Parinkti atsitiktinai" data-en="✦ Pick one at random">✦ Parinkti atsitiktinai</button></div>
          </div>
        </div>
      </section>`;

    const dnaSection = template.content.firstElementChild;
    discover.insertAdjacentElement('afterend', dnaSection);

    const currentLang = document.documentElement.lang === 'en' ? 'en' : 'lt';
    dnaSection.querySelectorAll('[data-lt][data-en]').forEach((element) => {
      element.textContent = element.dataset[currentLang];
    });

    const script = document.createElement('script');
    script.src = 'creative-dna.js?v=20260907-1335';
    script.defer = true;
    document.body.appendChild(script);
  };

  const initDiscover = () => {
    const section = document.querySelector('[data-discover-section]');
    if (!section) return;

    const tabs = Array.from(section.querySelectorAll('[data-discover-tab]'));
    const panels = Array.from(section.querySelectorAll('[data-discover-panel]'));

    const activate = (key) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.discoverTab === key;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        const active = panel.dataset.discoverPanel === key;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset.discoverTab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        const delta = (event.key === 'ArrowRight' || event.key === 'ArrowDown') ? 1 : -1;
        const next = tabs[(index + delta + tabs.length) % tabs.length];
        next.focus();
        activate(next.dataset.discoverTab);
      });
    });
  };

  const addClickFeedback = () => {
    const selector = '.button, .social-button, .text-action, .discover-tab, .home-track, .selected-release[data-inline-listen], .release-play, .lang-current, .lang-option, .nav-toggle';
    document.addEventListener('pointerdown', (event) => {
      const control = event.target.closest(selector);
      if (!control) return;

      control.classList.remove('is-clicked');
      void control.offsetWidth;
      control.classList.add('is-clicked');
      window.setTimeout(() => control.classList.remove('is-clicked'), 460);

      if (prefersReducedMotion) return;

      const rect = control.getBoundingClientRect();
      const burst = document.createElement('span');
      burst.className = 'gold-click-burst';
      burst.setAttribute('aria-hidden', 'true');
      burst.style.setProperty('--click-x', `${event.clientX - rect.left}px`);
      burst.style.setProperty('--click-y', `${event.clientY - rect.top}px`);
      control.appendChild(burst);
      window.setTimeout(() => burst.remove(), 620);
    }, { passive: true });
  };

  mountHomePlayer();
  mountCreativeDNA();
  initDiscover();
  addClickFeedback();
})();
