const enhancementStyles = document.createElement('link');
enhancementStyles.rel = 'stylesheet';
enhancementStyles.href = 'enhancements.css';
document.head.appendChild(enhancementStyles);

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
  const service = link.dataset.social;
  const icon = link.querySelector('.social-icon');
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
    el.placeholder = el.dataset[`placeholder${lang === 'lt' ? 'Lt' : 'En'}`];
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

    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) return;

    const button = form.querySelector('.form-submit');
    const previousText = button ? button.textContent : '';

    if (button) {
      button.classList.add('is-loading');
      button.disabled = true;
      button.textContent = currentLanguage === 'lt' ? 'Siunčiama…' : 'Sending…';
    }
    setFormStatus(form, '', '', '');

    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
      if (key !== '_honey') payload[key] = value;
    });

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      const failed = !response.ok || data.success === false || data.success === 'false';
      if (failed) throw new Error(data.message || 'Submission failed');

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
        button.textContent = previousText;
        applyLanguage(currentLanguage);
      }
    }
  });
});

function initMotion() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');

  const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 18);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const selectors = [
    '.page-hero > *',
    '.hero-copy > *',
    '.hero-art',
    '.section-heading > *',
    '.feature-card',
    '.profile-image-wrap',
    '.profile-prose',
    '.timeline-item',
    '.discog-row',
    '.embed-card',
    '.video-card',
    '.score-feature',
    '.contact-row',
    '.contact-form',
    '.social-button',
    '.statement > *'
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

if (enhancementStyles.sheet) {
  initMotion();
} else {
  enhancementStyles.addEventListener('load', initMotion, { once: true });
  enhancementStyles.addEventListener('error', initMotion, { once: true });
}
