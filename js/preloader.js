/* ================= Preloader ================= */
export function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 600);
  });
}
