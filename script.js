/**
 * DESIREE HERRERA - INTERACCIONES Y ANIMACIONES AL SCROLL
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
  // ==========================================
  const animatedElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
  );

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px', // se activa un poco antes de llegar
      threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Respetar delay personalizado si tiene data-delay
          const delay = el.getAttribute('data-delay');
          if (delay) {
            el.style.transitionDelay = delay;
          }

          // Añadir clase que activa la animación
          el.classList.add('is-visible');

          // Si el elemento contiene contadores numéricos, activarlos
          const counters = el.querySelectorAll('.stat-num[data-count]');
          counters.forEach(counter => animateCounter(counter));

          // Dejar de observar una vez animado
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));
  } else {
    // Fallback para navegadores antiguos: mostrar todo inmediatamente
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  // ==========================================
  // 2. CONTADORES NUMÉRICOS ANIMADOS
  // ==========================================
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // milisegundos
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out cubic para desaceleración suave al final
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * target);

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(updateCount);
  }

  // ==========================================
  // 3. SOMBRA EN HEADER AL HACER SCROLL
  // ==========================================
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ==========================================
  // 4. MOBILE MENU TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en cualquier enlace
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 5. FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Cerrar los demás acordeones
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Si no estaba activo, abrirlo
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================
  // 6. NAVEGACIÓN ACTIVA SEGÚN SECCIÓN VISIBLE
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
