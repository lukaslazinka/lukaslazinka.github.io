const SITE_ASSET_VERSION = '20260906-2255';

const enhancementStyles = document.createElement('link');
enhancementStyles.rel = 'stylesheet';
enhancementStyles.href = `enhancements.css?v=${SITE_ASSET_VERSION}`;
document.head.appendChild(enhancementStyles);

const paletteStyles = document.createElement('link');
paletteStyles.rel = 'stylesheet';
paletteStyles.href = `palette.css?v=${SITE_ASSET_VERSION}`;
document.head.appendChild(paletteStyles);

async function loadSitePhotos() {
  const definitions = [
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

  async function readChunk(name) {
    const response = await fetch(`assets/photo-data/${name}?v=${SITE_ASSET_VERSION}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Photo chunk ${name} failed: ${response.status}`);
    return (await response.text()).trim();
  }

  async function loadDefinition(definition) {
    const targets = Array.from(document.querySelectorAll(definition.selector));
    if (!targets.length) return;

    targets.forEach((target) => target.classList.add('photo-hq-loading'));
    const chunks = await Promise.all(definition.parts.map(readChunk));
    const dataUrl = `data:image/webp;base64,${chunks.join('')}`;

    targets.forEach((target) => {
      target.style.setProperty('background-image', `url("${dataUrl}")`, 'important');
      target.classList.remove('photo-hq-loading');
      target.classList.add('photo-hq-ready');
      target.dataset.photoReady = 'true';
      target.dataset.photoSource = dataUrl;
    });
  }

  const results = await Promise.allSettled(definitions.map(loadDefinition));
  results.forEach((result) => {
    if (result.status === 'rejected') console.error('[site photos]', result.reason);
  });
  document.documentElement.classList.add('site-photos-loaded');
}

loadSitePhotos();

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const socialIcons = {
  spotify: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 9.1c3.8-1.15 7.8-.72 11.05.92M7.3 12.2c3.1-.85 6.45-.55 9.15.78M8.1 15.05c2.45-.58 5.05-.35 7.15.63" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 9.2 15.2 12 10 14.8Z" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13.3 18v-5h1.75l.3-2h-2.05V9.7c0-.58.18-.98 1.04-.98h1.12V6.93a15 15 0 0 0-1.63-.09c-1.61 0-2.72.98-2.72 2.8V11H9.3v2h1.81v5h2.19Z" fill="currentColor"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.7" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.25" cy="6.9" r="1" fill="currentColor"/></svg>'
};

document.querySelectorAll('[data-social]').forEach((link) => {
  const icon = link.querySelector('.social-icon');
  const service = link.dataset.social;
  if (icon && socialIcons[service]) icon.innerHTML = socialIcons[service];
});

let currentLanguage = localStorage.getItem('lukas-site-language') || 'lt';
if (!['lt', 'en'].includes(currentLanguage)) currentLanguage = 'lt';

function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('lukas-site-language', lang);
  document.documentElement.lang = lang;
  document.body.dataset.currentLanguage = lang;

  document.querySelectorAll('[data-lt][data-en]').forEach((el) => {
    el.textContent = el.dataset[lang];
  });

  document.querySelectorAll('[data-placeholder-lt][data-placeholder-en]').forEach((el) => {
    el.placeholder = lang === 'lt' ? el.dataset.placeholderLt : el.dataset.placeholderEn;
  });

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    const subjectField = form.querySelector('input[name="_subject"]');
    if (subjectField) {
      subjectField.value = lang === 'lt'
        ? (form.dataset.subjectLt || 'Žinutė iš svetainės — Lukas Lazinka')
        : (form.dataset.subjectEn || 'Website message — Lukas Lazinka');
    }
  });

  const title = lang === 'lt' ? document.body.dataset.titleLt : document.body.dataset.titleEn;
  if (title) document.title = title;
  const description = lang === 'lt' ? document.body.dataset.descriptionLt : document.body.dataset.descriptionEn;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (description && metaDescription) metaDescription.setAttribute('content', description);

  document.querySelectorAll('[data-lang-current]').forEach((button) => {
    button.textContent = lang.toUpperCase();
    button.setAttribute('aria-label', lang === 'lt' ? 'Pasirinkta lietuvių kalba' : 'English selected');
  });
  document.querySelectorAll('[data-lang-option]').forEach((button) => {
    const other = lang === 'lt' ? 'en' : 'lt';
    button.dataset.langOption = other;
    button.textContent = other.toUpperCase();
    button.setAttribute('aria-label', other === 'lt' ? 'Perjungti į lietuvių kalbą' : 'Switch to English');
  });
}

document.querySelectorAll('[data-lang-option]').forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.langOption));
});
applyLanguage(currentLanguage);

function setFormStatus(form, type, ltText, enText) {
  const status = form.querySelector('[data-form-status]');
  if (!status) return;
  status.className = `form-status ${type || ''}`.trim();
  status.textContent = currentLanguage === 'lt' ? ltText : enText;
}

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('.form-submit');
    const originalLt = button?.dataset.lt;
    const originalEn = button?.dataset.en;

    if (button) {
      button.classList.add('is-loading');
      button.disabled = true;
      button.textContent = currentLanguage === 'lt' ? 'Siunčiama…' : 'Sending…';
    }
    setFormStatus(form, '', '', '');

    const payload = {};
    new FormData(form).forEach((value, key) => {
      if (key !== '_honey') payload[key] = value;
    });

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false || data.success === 'false') {
        throw new Error(data.message || 'Submission failed');
      }

      form.reset();
      applyLanguage(currentLanguage);
      setFormStatus(
        form,
        'success',
        'Žinutė išsiųsta. Ačiū — atsakysiu jūsų nurodytu el. paštu.',
        'Message sent. Thank you — I will reply to the email address you provided.'
      );
    } catch (error) {
      console.error(error);
      setFormStatus(
        form,
        'error',
        'Žinutės išsiųsti nepavyko. Pabandykite dar kartą arba parašykite tiesiogiai el. paštu.',
        'The message could not be sent. Please try again or email me directly.'
      );
    } finally {
      if (button) {
        button.classList.remove('is-loading');
        button.disabled = false;
        if (originalLt) button.dataset.lt = originalLt;
        if (originalEn) button.dataset.en = originalEn;
        applyLanguage(currentLanguage);
      }
    }
  });
});

function initPhotoLightbox() {
  const triggers = Array.from(document.querySelectorAll('[data-lightbox-photo]'));
  if (!triggers.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'photo-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="photo-lightbox-backdrop" data-lightbox-close></div>
    <div class="photo-lightbox-panel" role="dialog" aria-modal="true" aria-label="Nuotraukos peržiūra">
      <button type="button" class="photo-lightbox-close" data-lightbox-close aria-label="Uždaryti">×</button>
      <div class="photo-lightbox-image" role="img"></div>
    </div>`;
  document.body.appendChild(lightbox);

  const viewer = lightbox.querySelector('.photo-lightbox-image');
  const closeButton = lightbox.querySelector('.photo-lightbox-close');
  let lastFocused = null;

  function getPhotoBackground(trigger) {
    if (trigger.dataset.photoSource) return `url("${trigger.dataset.photoSource}")`;
    const nested = trigger.querySelector('[data-photo-source]');
    if (nested?.dataset.photoSource) return `url("${nested.dataset.photoSource}")`;
    const background = getComputedStyle(trigger).backgroundImage;
    return background && background !== 'none' ? background : '';
  }

  function openLightbox(trigger) {
    const background = getPhotoBackground(trigger);
    if (!background) return;
    lastFocused = document.activeElement;
    viewer.style.backgroundImage = background;
    viewer.setAttribute('aria-label', trigger.getAttribute('aria-label') || 'Lukas Lazinka');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    viewer.style.backgroundImage = '';
    lastFocused?.focus?.();
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(trigger);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(trigger);
      }
    });
  });
  lightbox.querySelectorAll('[data-lightbox-close]').forEach((element) => {
    element.addEventListener('click', closeLightbox);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}
initPhotoLightbox();

function initMotion() {
  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  const selectors = [
    '.page-hero > *', '.hero-copy > *', '.hero-art', '.section-heading > *',
    '.feature-card', '.photo-story-card', '.profile-image-wrap', '.profile-prose',
    '.timeline-item', '.discog-row', '.embed-card', '.video-card', '.score-feature',
    '.contact-row', '.contact-form', '.social-button', '.statement > *'
  ];
  const items = Array.from(document.querySelectorAll(selectors.join(',')));
  items.forEach((item, index) => {
    item.classList.add('reveal-item');
    if (item.matches('.profile-image-wrap, .section-heading > :first-child')) item.classList.add('reveal-left');
    if (item.matches('.hero-art, .profile-prose, .section-heading > :last-child')) item.classList.add('reveal-right');
    item.style.setProperty('--reveal-delay', `${(index % 5) * 55}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  items.forEach((item) => observer.observe(item));
}

if (enhancementStyles.sheet) initMotion();
else {
  enhancementStyles.addEventListener('load', initMotion, { once: true });
  enhancementStyles.addEventListener('error', initMotion, { once: true });
}
