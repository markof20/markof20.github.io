/* ================= Typewriter (Hero) ================= */
export function initTypewriter() {
  const el = document.querySelector('.typewriter');
  if (!el) return;

  const words = ['Creatore di Soluzioni', 'Sviluppatore Web', 'UI/UX Designer'];
  const typeSpeed = 70;     // ms per lettera in scrittura
  const deleteSpeed = 45;   // ms per lettera in cancellazione
  const holdTime = 1000;    // pausa a parola completa

  let wordIndex = 0;
  let txt = '';
  let deleting = false;
  let lastTime = 0;

  function step(timestamp) {
    const speed = deleting ? deleteSpeed : typeSpeed;
    if (timestamp - lastTime < speed) {
      requestAnimationFrame(step);
      return;
    }
    lastTime = timestamp;

    const full = words[wordIndex];

    if (!deleting) {
      txt = full.slice(0, txt.length + 1);
      el.textContent = txt;
      if (txt === full) {
        // Pausa alla fine della parola
        setTimeout(() => {
          deleting = true;
          requestAnimationFrame(step);
        }, holdTime);
        return;
      }
    } else {
      txt = full.slice(0, txt.length - 1);
      el.textContent = txt;
      if (txt === '') {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
