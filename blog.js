document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuIcon = menuButton.querySelector('use');

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 60);
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  menuIcon.setAttribute('href', '#icon-menu');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
  menuIcon.setAttribute('href', willOpen ? '#icon-close' : '#icon-menu');
  mobileMenu.hidden = !willOpen;
  document.body.classList.toggle('menu-open', willOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
const desktopMenu = window.matchMedia('(min-width: 861px)');
desktopMenu.addEventListener('change', event => {
  if (event.matches) closeMenu();
});
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px' }) : null;

document.querySelectorAll('.reveal').forEach(element => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

document.querySelectorAll('[data-current-year]').forEach(element => {
  element.textContent = new Date().getFullYear();
});

const progressBar = document.querySelector('.reading-progress');
const article = document.querySelector('.article-content');
if (progressBar && article) {
  function updateReadingProgress() {
    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(article.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max((window.scrollY - articleTop) / distance, 0), 1);
    progressBar.style.width = `${progress * 100}%`;
  }
  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  window.addEventListener('resize', updateReadingProgress);
  updateReadingProgress();
}

document.querySelectorAll('[data-share-guide]').forEach(link => {
  const shareText = `${document.title} ${window.location.href}`;
  link.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
});
