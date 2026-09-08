(() => {
  const V = '20260908-0830';
  const core = document.createElement('script');
  core.src = `script-core.js?v=${V}`;
  core.async = false;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;

    const enhancement = document.createElement('link');
    enhancement.rel = 'stylesheet';
    enhancement.href = `enhancements.css?v=${V}`;
    document.head.appendChild(enhancement);

    const palette = document.createElement('link');
    palette.rel = 'stylesheet';
    palette.href = `palette.css?v=${V}`;
    document.head.appendChild(palette);

    const experience = document.createElement('link');
    experience.rel = 'stylesheet';
    experience.href = `site-wide-experience.css?v=${V}`;
    document.head.appendChild(experience);

    const hero = document.createElement('link');
    hero.rel = 'stylesheet';
    hero.href = `site-wide-hero.css?v=${V}`;
    document.head.appendChild(hero);

    const script = document.createElement('script');
    script.src = `site-wide-experience.js?v=${V}`;
    script.async = false;
    document.body.appendChild(script);
  };

  core.addEventListener('load', finish, { once: true });
  core.addEventListener('error', finish, { once: true });
  document.head.appendChild(core);
})();
