(() => {
  const section = document.querySelector('[data-dna-section]');
  if (!section) return;

  const orbit = section.querySelector('.dna-orbit');
  const nodes = Array.from(section.querySelectorAll('[data-dna-node]'));
  const panels = Array.from(section.querySelectorAll('[data-dna-panel]'));
  const randomButton = section.querySelector('[data-dna-random]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeKey = nodes.find((node) => node.classList.contains('is-active'))?.dataset.dnaNode || nodes[0]?.dataset.dnaNode;

  const activate = (key, focusNode = false) => {
    if (!key) return;
    activeKey = key;
    nodes.forEach((node) => {
      const active = node.dataset.dnaNode === key;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-selected', String(active));
      node.tabIndex = active ? 0 : -1;
      if (active && focusNode) node.focus();
    });
    panels.forEach((panel) => {
      const active = panel.dataset.dnaPanel === key;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  };

  const pressFeedback = (control, event) => {
    control.classList.remove('is-pressed');
    void control.offsetWidth;
    control.classList.add('is-pressed');
    window.setTimeout(() => control.classList.remove('is-pressed'), 430);

    if (reducedMotion) return;
    const rect = control.getBoundingClientRect();
    const spark = document.createElement('span');
    spark.className = 'dna-spark';
    spark.setAttribute('aria-hidden', 'true');
    const x = typeof event?.clientX === 'number' && event.clientX ? event.clientX - rect.left : rect.width / 2;
    const y = typeof event?.clientY === 'number' && event.clientY ? event.clientY - rect.top : rect.height / 2;
    spark.style.setProperty('--sx', `${x}px`);
    spark.style.setProperty('--sy', `${y}px`);
    control.appendChild(spark);
    window.setTimeout(() => spark.remove(), 680);
  };

  nodes.forEach((node, index) => {
    node.addEventListener('click', (event) => {
      pressFeedback(node, event);
      activate(node.dataset.dnaNode);
    });
    node.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const delta = (event.key === 'ArrowRight' || event.key === 'ArrowDown') ? 1 : -1;
      const next = nodes[(index + delta + nodes.length) % nodes.length];
      activate(next.dataset.dnaNode, true);
    });
  });

  randomButton?.addEventListener('click', (event) => {
    pressFeedback(randomButton, event);
    const alternatives = nodes.filter((node) => node.dataset.dnaNode !== activeKey);
    const next = alternatives[Math.floor(Math.random() * alternatives.length)] || nodes[0];
    activate(next?.dataset.dnaNode);
  });

  if (orbit && !reducedMotion) {
    orbit.addEventListener('pointermove', (event) => {
      const rect = orbit.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      orbit.style.setProperty('--mx', `${x}%`);
      orbit.style.setProperty('--my', `${y}%`);
    }, { passive: true });
    orbit.addEventListener('pointerleave', () => {
      orbit.style.setProperty('--mx', '50%');
      orbit.style.setProperty('--my', '50%');
    }, { passive: true });
  }
})();
