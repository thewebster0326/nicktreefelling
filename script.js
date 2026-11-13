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

const slides = [...document.querySelectorAll('.hero-slide')];
const slideTexts = [...document.querySelectorAll('.hero-text')];
const progressItems = [...document.querySelectorAll('.slider-progress span')];
const slideCount = document.querySelector('.slide-count strong');
const hero = document.querySelector('.hero');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide = 0;
let sliderTimer;
let touchStartX = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
  progressItems.forEach((item, i) => item.classList.toggle('active', i === currentSlide));
  slideTexts.forEach((text, i) => {
    const isActive = i === currentSlide;
    text.classList.toggle('active', isActive);
    text.setAttribute('aria-hidden', String(!isActive));
  });
  slideCount.textContent = String(currentSlide + 1).padStart(2, '0');
}

function stopSlider() {
  window.clearInterval(sliderTimer);
}

function startSlider() {
  stopSlider();
  if (!reducedMotion.matches && !document.hidden) {
    sliderTimer = window.setInterval(() => showSlide(currentSlide + 1), 7000);
  }
}

document.querySelector('.slider-prev').addEventListener('click', () => {
  showSlide(currentSlide - 1);
  startSlider();
});
document.querySelector('.slider-next').addEventListener('click', () => {
  showSlide(currentSlide + 1);
  startSlider();
});
hero.addEventListener('mouseenter', stopSlider);
hero.addEventListener('mouseleave', startSlider);
hero.addEventListener('focusin', stopSlider);
hero.addEventListener('focusout', startSlider);
hero.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].clientX;
  stopSlider();
}, { passive: true });
hero.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 50) showSlide(currentSlide + (distance < 0 ? 1 : -1));
  startSlider();
}, { passive: true });
document.addEventListener('visibilitychange', () => document.hidden ? stopSlider() : startSlider());
reducedMotion.addEventListener('change', startSlider);
showSlide(0);
startSlider();

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' }) : null;

document.querySelectorAll('.reveal').forEach(element => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const observedSections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => {
      const isCurrent = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -60%', threshold: [0, 0.2, 0.5] });
  observedSections.forEach(section => sectionObserver.observe(section));
}

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#service-select').value = link.dataset.service;
  });
});

const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let currentImage = 0;
let lastGalleryTrigger;

function showImage(index) {
  currentImage = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentImage];
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.dataset.caption;
  lightboxCaption.textContent = `${item.dataset.caption} — ${currentImage + 1} of ${galleryItems.length}`;
}

function openLightbox(index) {
  lastGalleryTrigger = galleryItems[index];
  showImage(index);
  lightbox.showModal();
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  lightbox.close();
}

galleryItems.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentImage - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentImage + 1));
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
  lastGalleryTrigger?.focus();
});
document.addEventListener('keydown', event => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') showImage(currentImage - 1);
  if (event.key === 'ArrowRight') showImage(currentImage + 1);
});

const quoteForm = document.querySelector('#quote-form');
quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!quoteForm.reportValidity()) return;
  const data = new FormData(quoteForm);
  const message = [
    'Hi Nick Tree Felling, I would like a free quote.',
    '',
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Service: ${data.get('service')}`,
    `Area: ${data.get('area')}`,
    `Job details: ${data.get('message') || 'Not provided'}`
  ].join('\n');
  const whatsappUrl = `https://wa.me/27713376731?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

document.querySelector('#current-year').textContent = new Date().getFullYear();
