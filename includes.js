// ----------------------------
// 1️⃣ Módulo de includes dinámicos con inicializadores
// ----------------------------
const includesRegistry = {
  'contact-panel': initContactPanel,
  'menuOverlay': initMenu,
  'carousel-track': initCarousel,
  // agregar más aquí si hay includes con JS propio
};

function loadIncludes(callback) {
  const includes = document.querySelectorAll('[data-include]');
  if (!includes.length) {
    document.dispatchEvent(new Event('includesLoaded'));
    if (callback) callback();
    return;
  }

  let loaded = 0;
  includes.forEach(el => {
    const url = el.dataset.include;
    fetch(url)
      .then(res => res.text())
      .then(html => {
        el.innerHTML = html;

        // Ejecutar initializer si existe
        if (el.id && includesRegistry[el.id]) {
          includesRegistry[el.id]();
        }

        loaded++;
        if (loaded === includes.length) {
          document.dispatchEvent(new Event('includesLoaded'));
          if (callback) callback();
        }
      })
      .catch(err => console.error('Error loading include:', url, err));
  });
}

// ----------------------------
// 2️⃣ Inicializaciones de componentes
// (mismas funciones que antes, sin cambios)
// ----------------------------
function initMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuClose = document.getElementById("menuClose");

  if (!menuToggle || !menuOverlay) return;

  const openMenu = () => {
    menuOverlay.classList.add("active");
    menuOverlay.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menuOverlay.classList.remove("active");
    menuOverlay.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);

  menuOverlay.addEventListener('click', (e) => {
    if (e.target.tagName === "A") closeMenu();
  });
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  if (!tabs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  tabs.forEach((tab, i) => {
    tab.style.transitionDelay = `${i * 0.15}s`;
    observer.observe(tab);
  });
}

function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) scrollBtn.classList.add('show');
    else scrollBtn.classList.remove('show');
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initContactPanel() {
  const panel = document.getElementById('contact-panel');
  if (!panel) return;

  const toggle = document.getElementById('contact-toggle');
  const close  = panel.querySelector('.close-panel');

  if (!toggle || toggle.dataset.ready) return;
  toggle.dataset.ready = "true";

  toggle.addEventListener('click', () => panel.classList.toggle('active'));
  if (close) close.addEventListener('click', () => panel.classList.remove('active'));
}

function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  let slides = Array.from(track.children);
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!dotsContainer) return;

  let index = 1;
  let startX = 0, currentX = 0, startTime = 0, isDragging = false;
  const slideWidth = () => slides[0].offsetWidth;

  // Clonar extremos
  track.prepend(slides[slides.length - 1].cloneNode(true));
  track.append(slides[0].cloneNode(true));
  slides = Array.from(track.children);

  track.style.transform = `translateX(-${slideWidth()}px)`;

  // Dots
  const realSlidesCount = slides.length - 2;
  for (let i = 0; i < realSlidesCount; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('button');

  function updateDots() {
    dots.forEach(d => d.classList.remove('active'));
    dots[(index - 1 + realSlidesCount) % realSlidesCount].classList.add('active');
  }

  function goToSlide(i, animate = true) {
    track.style.transition = animate ? 'transform 0.35s ease-out' : 'none';
    track.style.transform = `translateX(-${i * slideWidth()}px)`;
    index = i;
    updateDots();
  }

  // Swipe
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startTime = Date.now();
    isDragging = true;
    track.style.transition = 'none';
  });

  track.addEventListener('touchmove', e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    track.style.transform = `translateX(${-(index * slideWidth()) + diff}px)`;
  });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    const diff = currentX - startX;
    const time = Date.now() - startTime;
    const velocity = Math.abs(diff / time);

    if (Math.abs(diff) > slideWidth() * 0.2 || velocity > 0.6) {
      index += diff < 0 ? 1 : -1;
    }

    goToSlide(index);

    track.addEventListener('transitionend', () => {
      if (index === 0) goToSlide(slides.length - 2, false);
      if (index === slides.length - 1) goToSlide(1, false);
    }, { once: true });
  });

  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i + 1)));
}

// ----------------------------
// 3️⃣ Inicialización principal
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadIncludes(() => {
    // Otros módulos que no dependen de includes
    initTabs();
    initScrollTop();
  });
});