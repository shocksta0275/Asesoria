  const menuToggle = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuClose = document.getElementById("menuClose");

  function openMenu() {
    menuOverlay.classList.add("active");
    menuOverlay.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuOverlay.classList.remove("active");
    menuOverlay.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);

  // Cerrar si se toca cualquier link del menú
  menuOverlay.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });
const tabs = document.querySelectorAll('.tab');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // animación solo una vez
    }
  });
}, { threshold: 0.2 }); // 20% visible

// aplicar retraso escalonado
tabs.forEach((tab, i) => {
  tab.style.transitionDelay = `${i * 0.15}s`; // 150ms entre cada día
  observer.observe(tab);
});
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {   // cuando el header ya no se ve
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
const toggle = document.getElementById('contact-toggle');
const panel  = document.getElementById('contact-panel');
const close  = document.querySelector('.close-panel');

toggle.addEventListener('click', () => {
  panel.classList.toggle('active');
});

close.addEventListener('click', () => {
  panel.classList.remove('active');
});

const track = document.querySelector('.carousel-track');
  let slides = Array.from(track.children);
  const dotsContainer = document.querySelector('.carousel-dots');

  let index = 1;
  let startX = 0;
  let currentX = 0;
  let startTime = 0;
  let isDragging = false;
  const slideWidth = () => slides[0].offsetWidth;

  // Clonar extremos para loop infinito
  track.prepend(slides[slides.length - 1].cloneNode(true));
  track.append(slides[0].cloneNode(true));
  slides = Array.from(track.children);

  track.style.transform = `translateX(-${slideWidth()}px)`;

  // Dots (solo slides reales)
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
    const velocity = Math.abs(diff / time); // momentum

    if (Math.abs(diff) > slideWidth() * 0.2 || velocity > 0.6) {
      index += diff < 0 ? 1 : -1;
    }

    goToSlide(index);

    // Ajuste invisible para loop infinito
    track.addEventListener('transitionend', () => {
      if (index === 0) goToSlide(slides.length - 2, false);
      if (index === slides.length - 1) goToSlide(1, false);
    }, { once: true });
  });

  // Click en dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i + 1));
  });
