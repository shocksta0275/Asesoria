const PopupManager = (() => {
  let current = null;

  return {
    open(id) {
      if (current && current !== id) {
        document.getElementById(current)?.classList.remove('active');
      }
      document.getElementById(id)?.classList.add('active');
      current = id;
      document.body.style.overflow = 'hidden';
    },

    close(id) {
      document.getElementById(id)?.classList.remove('active');
      if (current === id) {
        current = null;
        document.body.style.overflow = '';
      }
    },

    closeAll() {
      document.querySelectorAll('.popup.active, .overlay.active')
        .forEach(el => el.classList.remove('active'));
      current = null;
      document.body.style.overflow = '';
    }
  };
})();

function initAll() {
  initMenu();
  initTabs();
  initScrollTop();
  initContactPanel();
  initCarousel();
  initLeadForm();
}

document.addEventListener('DOMContentLoaded', initAll);
document.addEventListener('includesLoaded', initAll);

/* =========================
   MENÚ PRINCIPAL
========================= */
function initMenu() {
  const menuToggle  = document.getElementById('menuToggle');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuClose   = document.getElementById('menuClose');

  if (!menuToggle || !menuOverlay || !menuClose) return;

  function openMenu() {
    PopupManager.open('menuOverlay');

    menuOverlay.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    PopupManager.close('menuOverlay');

    menuOverlay.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  // cerrar al tocar un link del menú
  menuOverlay.addEventListener('click', e => {
    if (e.target.tagName === 'A') closeMenu();
  });

  // cerrar con ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* =========================
   ANIMACIÓN TABS (IO)
========================= */
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  if (!tabs.length) return;

  const observer = new IntersectionObserver(entries => {
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

/* =========================
   SCROLL TO TOP
========================= */
function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScroll) < 50) return;
    lastScroll = window.scrollY;
    scrollBtn.classList.toggle('show', window.scrollY > 300);
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================
   PANEL DE CONTACTO
========================= */
function initContactPanel() {
  const toggle = document.getElementById('contact-toggle');
  const panel  = document.getElementById('contact-panel');
  const close  = panel?.querySelector('.close-panel');

  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    PopupManager.open('contact-panel');
  });

  close?.addEventListener('click', () => {
    PopupManager.close('contact-panel');
  });
}

/* =========================
   CAROUSEL REVIEWS
========================= */
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!track || !dotsContainer) return;
  
   if (track.dataset.ready === 'true') return;
  track.dataset.ready = 'true';

  const realSlides = Array.from(track.children);
  const total = realSlides.length;

  let index = 1;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const slideWidth = () => realSlides[0].offsetWidth;

  /* ===== CLONES ===== */
  track.prepend(realSlides[total - 1].cloneNode(true));
  track.append(realSlides[0].cloneNode(true));

  const slides = Array.from(track.children);

  track.style.transform = `translateX(-${slideWidth()}px)`;

  /* ===== DOTS ===== */
  dotsContainer.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('button');

  function updateDots() {
    dots.forEach(d => d.classList.remove('active'));
    dots[(index - 1 + total) % total].classList.add('active');
  }

  function goToSlide(i, animate = true) {
    track.style.transition = animate ? 'transform .35s ease-out' : 'none';
    track.style.transform = `translateX(-${i * slideWidth()}px)`;
    index = i;
    updateDots();
  }

  /* ===== LOOP REAL ===== */
  track.addEventListener('transitionend', () => {
    if (index === 0) {
      index = total;
      goToSlide(index, false);
    }
    if (index === slides.length - 1) {
      index = 1;
      goToSlide(index, false);
    }
  });

  /* ===== TOUCH ===== */
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
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
    if (Math.abs(diff) > slideWidth() * 0.25) {
      index += diff < 0 ? 1 : -1;
    }
    goToSlide(index);
  });

  /* ===== DOT CLICK ===== */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i + 1));
  });

  window.addEventListener('resize', () => goToSlide(index, false));
}

/* ---------------------
            Form
  --------------------- */
function initLeadForm() {
  const form = document.getElementById('leadForm');
  const status = document.getElementById('form-status'); // div para mensajes generales
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (!form) return;

  const fields = {
    fullName: { required: true, label: 'Nombre completo' },
    birthDate: { required: false, label: 'Fecha de nacimiento' },
    phone: { required: true, label: 'Número de teléfono' },
    email: { required: true, label: 'Correo' },
    workOption: { required: true, label: 'Labora en' },
    workplace: { required: false, label: 'Lugar de trabajo' },
    timeInCompany: { required: false, label: 'Tiempo en la empresa' },
    affectedRefs: { required: true, label: 'Referencias afectadas' },
    files: { required: false, label: 'Subir archivos' },
    comments: { required: false, label: 'Comentarios' }
  };

  // VALIDACIÓN INLINE
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
      const errorEl = input.closest('.form-group')?.querySelector('.error-message');
      if (!errorEl) return;

      errorEl.textContent = '';
      input.classList.remove('invalid');
      input.classList.remove('valid');

      if (fields[input.name]?.required && !input.value.trim()) {
        errorEl.textContent = `${fields[input.name].label} es obligatorio`;
        input.classList.add('invalid');
        return;
      }

      if (input.type === 'email' && input.value.trim()) {
        const regex = /^\S+@\S+\.\S+$/;
        if (!regex.test(input.value.trim())) {
          errorEl.textContent = 'Correo no válido';
          input.classList.add('invalid');
          return;
        }
      }

      input.classList.add('valid');
    });
  });

  // ENVÍO DEL FORMULARIO
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!submitBtn) return;

    let valid = true;

    // VALIDACIÓN FINAL
    form.querySelectorAll('input, select, textarea').forEach(input => {
      const errorEl = input.closest('.form-group')?.querySelector('.error-message');
      if (fields[input.name]?.required && !input.value.trim()) {
        if (errorEl) errorEl.textContent = `${fields[input.name].label} es obligatorio`;
        input.classList.add('invalid');
        valid = false;
      }
    });

    if (!valid) {
      status.textContent = 'Por favor corrige los errores antes de enviar.';
      status.classList.add('error');
      return;
    }

    // BLOQUEAR BOTÓN Y MOSTRAR ESTADO
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    status.textContent = '';
    status.classList.remove('error');

    // CREAR OBJETO DE DATOS
    const data = { source: 'Formulario Web' };
    Object.keys(fields).forEach(key => {
      const el = form.elements[key];
      if (!el) return;
      if (el.type === 'file') {
        data[key] = el.files[0] ? el.files[0].name : '';
      } else {
        data[key] = el.value.trim();
      }
    });

    console.log('Enviando a Make:', data); // puedes quitarlo luego

    try {
      const response = await fetch('https://hook.us2.make.com/tu-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        status.textContent = '¡Formulario enviado correctamente!';
        status.classList.remove('error');
        form.reset();
        form.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('valid'));
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (err) {
      status.textContent = 'No se pudo enviar el formulario. Intenta nuevamente.';
      status.classList.add('error');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar';
    }
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  initLeadForm();
});