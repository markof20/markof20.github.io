/* ================= Contact Form (Formspree, FormData) ================= */
export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const messageInput = form.querySelector('#message');
  const status = document.getElementById('form-status');
  const copyBtn = document.getElementById('copyEmail');
  const emailLink = document.getElementById('emailLink');
  const submitBtn = form.querySelector('button[type="submit"]');

  // endpoint e metodo presi dall'HTML (partials/contact.html)
  const endpoint = (form.getAttribute('action') || '').trim();
  const method = (form.getAttribute('method') || 'POST').toUpperCase();

  // Sync opzionale: mantieni _replyto nascosto allineato all'input email
  const replytoHidden = form.querySelector('input[name="_replyto"]');
  if (replytoHidden && emailInput) {
    emailInput.addEventListener('input', () => {
      replytoHidden.value = emailInput.value.trim();
    });
  }

  // Validazioni base
  function validateInput(input, type = 'text') {
    const errorEl = input.parentElement.querySelector('.error');
    let valid = true;
    const val = input.value.trim();

    if (!val) {
      errorEl.textContent = 'Campo obbligatorio';
      valid = false;
    } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      errorEl.textContent = 'Email non valida';
      valid = false;
    } else {
      errorEl.textContent = '';
    }
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const valid =
      validateInput(nameInput) &
      validateInput(emailInput, 'email') &
      validateInput(messageInput);

    if (!valid) return;

    // Costruisci FormData (compatibile con Formspree)
    const fd = new FormData(form);
    fd.set('name', nameInput.value.trim());
    fd.set('email', emailInput.value.trim());
    fd.set('message', messageInput.value.trim());
    fd.set('_replyto', emailInput.value.trim()); // importante per Reply-To
    fd.set('_origin', location.href);
    fd.set('_time', new Date().toISOString());

    // UI stato invio
    const oldBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio...';
    status.textContent = 'Invio in corso...';

    // Se non c'è endpoint, fallback a mailto
    if (!endpoint) {
      const subject = 'Contatto dal portfolio';
      const body = `Nome: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\n${fd.get('message')}`;
      window.location.href = `mailto:marco@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      submitBtn.disabled = false;
      submitBtn.textContent = oldBtnText;
      status.textContent = 'Apertura client email…';
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { Accept: 'application/json' }, // NON impostare Content-Type con FormData
        body: fd
      });

      if (res.ok) {
        status.textContent = 'Messaggio inviato con successo ✅';
        form.reset();
        if (replytoHidden) replytoHidden.value = '';
      } else {
        let errMsg = 'Errore di invio. Riprova più tardi.';
        try {
          const data = await res.json();
          if (data && Array.isArray(data.errors)) {
            errMsg = data.errors.map(e => e.message).join(', ');
          }
        } catch {}
        status.textContent = errMsg;
      }
    } catch (err) {
      const subject = 'Contatto dal portfolio';
      const body = `Nome: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\n${fd.get('message')}`;
      window.location.href = `mailto:marco@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Apertura client email…';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = oldBtnText;
      setTimeout(() => (status.textContent = ''), 4000);
    }
  });

  // Copia email negli appunti
  if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailLink.textContent.trim())
        .then(() => {
          status.textContent = 'Email copiata negli appunti 📋';
          setTimeout(() => (status.textContent = ''), 2000);
        });
    });
  }
}
