(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.querySelector('link[data-gold-light-expansion]')) {
    const lightStyles = document.createElement('link');
    lightStyles.rel = 'stylesheet';
    lightStyles.href = 'gold-light-expansion.css?v=20260907-1350';
    lightStyles.dataset.goldLightExpansion = 'true';
    document.head.appendChild(lightStyles);
  }

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
    const selector = '.button, .social-button, .text-action, .discover-tab, .release-play, .lang-current, .lang-option, .nav-toggle';
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

  mountCreativeDNA();
  initDiscover();
  addClickFeedback();
})();
