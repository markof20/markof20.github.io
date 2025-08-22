/* ================= Main Init (dopo include.js) ================= */
import { initPreloader } from './preloader.js';
import { initNavbar } from './navbar.js';
import { initScrollspy } from './scrollspy.js';
import { initAnimations } from './animations.js';
import { initCanvas } from './canvas.js';
import { initContactForm } from './contact-form.js';
import { initModal } from './modal.js';
import { getProjectsData } from './projects.js';
import { initTypewriter } from './typewriter.js';

function boot() {
  initPreloader();
  initNavbar();
  initScrollspy();
  initAnimations();
  initTypewriter();
  initCanvas();
  initContactForm();
  initModal(getProjectsData());
}

// Se include.js ha già finito, parte subito; altrimenti aspetta l'evento.
if (window.partialsLoaded) {
  boot();
} else {
  document.addEventListener('partials:loaded', boot, { once: true });

  // Fallback: se include.js non è presente, avvia su DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.partialsLoaded) boot();
  }, { once: true });
}
