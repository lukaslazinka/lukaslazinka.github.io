(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  initDiscover();
  addClickFeedback();
})();
