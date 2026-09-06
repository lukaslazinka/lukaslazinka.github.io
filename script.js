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

document.querySelectorAll('[data-mailto-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = form.dataset.subject || 'Website message — Lukas Lazinka';
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    window.location.href = `mailto:lazinka.music@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
