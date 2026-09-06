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

document.querySelectorAll('[data-mailto-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = currentLanguage === 'lt'
      ? (form.dataset.subjectLt || 'Žinutė iš svetainės — Lukas Lazinka')
      : (form.dataset.subjectEn || 'Website message — Lukas Lazinka');
    const body = currentLanguage === 'lt'
      ? `Vardas: ${name}\nEl. paštas: ${email}\n\nŽinutė:\n${message}`
      : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    window.location.href = `mailto:lazinka.music@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
