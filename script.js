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