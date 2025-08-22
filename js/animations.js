/* ================= Animations (AOS + Counters) ================= */

/* ---- AOS con data-aos, data-aos-delay, data-aos-offset ---- */
function initAOS() {
  const elements = document.querySelectorAll('.aos');
  if (!elements.length) return;

  elements.forEach(el => {
    const type  = (el.dataset.aos || 'slide-up').toLowerCase();
    const delay = parseInt(el.dataset.aosDelay || '0', 10);
    const offset = parseInt(el.dataset.aosOffset || '0', 10);

    if (delay) el.style.transitionDelay = `${delay}ms`;

    // stato iniziale in base al tipo
    switch (type) {
      case 'fade-in':   el.style.transform = 'none'; break;
      case 'slide-right': el.style.transform = 'translateX(-14px)'; break;
      case 'slide-left':  el.style.transform = 'translateX(14px)';  break;
      case 'zoom-in':   el.style.transform = 'scale(.96)'; break;
      case 'slide-up':
      default:          el.style.transform ||= 'translateY(14px)'; break;
    }

    // Observer per singolo elemento con rootMargin che tiene conto dell'offset
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        el.classList.add('in');
        el.style.removeProperty('transform');
        el.style.removeProperty('transition-delay');
        observer.unobserve(el);
      });
    }, {
      threshold: 0.01,
      // trigger quando l'elemento entra oltre (viewport bottom - offset)
      rootMargin: `0px 0px -${offset}px 0px`
    });

    io.observe(el);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const offset = parseInt(el.dataset.aosOffset || '0', 10);
      const rect = el.getBoundingClientRect();

      // visibile + rispettato l'offset personalizzato (trigger anticipato)
      const visibleWithOffset = entry.isIntersecting && rect.top <= (window.innerHeight - offset);

      if (visibleWithOffset) {
        el.classList.add('in');
        // una volta animato, possiamo togliere gli stili inline per lasciare solo la classe
        el.style.removeProperty('transform');
        el.style.removeProperty('transition-delay');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.01 });

  elements.forEach(el => io.observe(el));
}

/* ---- Contatori metriche ---- */
function animateCounters() {
  const counters = document.querySelectorAll('.metric-value');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseFloat(el.dataset.target || '0');
      const from = parseFloat(el.dataset.from || '0');
      const duration = parseInt(el.dataset.duration || '1200', 10);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const prefix = el.dataset.prefix || '';

      let start = null;
      const delta = target - from; // <-- basta questo

      function tick(ts) {
        if (!start) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        const value = from + delta * t;
        el.textContent = prefix + value.toFixed(decimals);

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          el.classList.add('pop');
          setTimeout(() => el.classList.remove('pop'), 500);
        }
      }

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

/* ---- Export ---- */
export function initAnimations() {
  initAOS();
  animateCounters();
}
