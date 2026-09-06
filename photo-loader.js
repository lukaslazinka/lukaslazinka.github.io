(() => {
  const VERSION = '20260906-2219';
  const photos = [
    {
      selector: '.photo-portrait',
      parts: ['portrait-0.txt', 'portrait-1.txt', 'portrait-2.txt', 'portrait-3.txt']
    },
    {
      selector: '.photo-school',
      parts: ['school-0.txt', 'school-1.txt', 'school-2.txt']
    },
    {
      selector: '.photo-venice',
      parts: ['venice-0.txt', 'venice-gap-a.txt', 'venice-gap-b.txt', 'venice-1.txt', 'venice-2.txt', 'venice-3a.txt', 'venice-3b.txt']
    }
  ];

  async function readPart(name) {
    const response = await fetch(`assets/photo-data/${name}?v=${VERSION}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load ${name}: ${response.status}`);
    return (await response.text()).trim();
  }

  async function applyPhoto(definition) {
    const targets = Array.from(document.querySelectorAll(definition.selector));
    if (!targets.length) return;

    const chunks = await Promise.all(definition.parts.map(readPart));
    const source = `data:image/webp;base64,${chunks.join('')}`;

    targets.forEach((target) => {
      target.style.setProperty('background-image', `url("${source}")`, 'important');
      target.dataset.photoReady = 'true';
      target.classList.add('photo-hq-ready');
    });
  }

  Promise.allSettled(photos.map(applyPhoto)).then((results) => {
    results.forEach((result) => {
      if (result.status === 'rejected') console.error('[photos]', result.reason);
    });
    document.documentElement.classList.add('photo-loader-finished');
    window.dispatchEvent(new CustomEvent('lukas-photos-loaded'));
  });
})();
