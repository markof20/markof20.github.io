/* ============ include.js — loader dei partials statici ============ */
(function () {
  // Trova tutti i segnaposto dei partials
  const placeholders = Array.from(document.querySelectorAll('[data-include]'));
  if (!placeholders.length) return;

  // Carica un singolo partial e rimpiazza il segnaposto col suo contenuto
  async function loadPartial(el) {
    const url = el.getAttribute('data-include');
    if (!url) return;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status} su ${url}`);
      const html = await res.text();

      // Inserisce il markup e rimuove il wrapper (mantiene solo i nodi figli del partial)
      const tmp = document.createElement('div');
      tmp.innerHTML = html;

      const parent = el.parentNode;
      while (tmp.firstChild) {
        parent.insertBefore(tmp.firstChild, el);
      }
      parent.removeChild(el);
    } catch (err) {
      console.error('[include.js] Errore nel caricamento di', url, err);
      // fallback minimale visibile
      el.outerHTML = `<!-- errore include: ${url} -->`;
    }
  }

  // Carica tutti i partials in parallelo
  const jobs = placeholders.map(loadPartial);

  // Al termine: setta anno nel footer e dispatch evento custom
  Promise.all(jobs).then(() => {
    // aggiorna l'anno nel footer se presente
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // flag globale + evento per chi volesse agganciarsi
    window.partialsLoaded = true;
    document.dispatchEvent(new CustomEvent('partials:loaded'));
  });
})();
