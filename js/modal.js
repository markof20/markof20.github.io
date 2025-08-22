/* ================= Modal Projects ================= */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalList = document.getElementById('modal-list');
const modalLive = document.getElementById('modal-live');

function openModal(project) {
  if (!modal) return;
  modalImg.src = project.image || '';
  modalTitle.textContent = project.title || '';
  modalDesc.textContent = project.description || '';
  modalList.innerHTML = '';
  if (project.tags) {
    project.tags.forEach(tag => {
      const li = document.createElement('li');
      li.textContent = tag;
      modalList.appendChild(li);
    });
  }
  if (project.live) {
    modalLive.href = project.live;
    modalLive.style.display = 'inline-flex';
  } else {
    modalLive.style.display = 'none';
  }
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

export function initModal(projectsData) {
  if (!modal) return;

  // Apri modale
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.project;
      const project = projectsData[id];
      if (project) openModal(project);
    });
  });

  // Chiudi modale su backdrop o pulsante
  modal.addEventListener('click', e => {
    if (e.target.dataset.close === 'true' || e.target.closest('.modal-close')) {
      closeModal();
    }
  });

  // Chiudi con ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });
}
