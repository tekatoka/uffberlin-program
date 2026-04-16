import { embedUrl } from '../utils/media.js';

export function mountModal() {
  if (document.getElementById('uffb-modal')) {
    return {
      open: (url) => {
        const iframe = document.querySelector('#uffb-modal iframe');
        document.getElementById('uffb-modal').classList.add('is-open');
        iframe.src = embedUrl(url);
      },
    };
  }

  const m = document.createElement('div');
  m.className = 'uffb-modal';
  m.id = 'uffb-modal';
  m.innerHTML = `<div class="uffb-modal-box">
      <button class="uffb-modal-close" title="Close">✕</button>
      <iframe allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>`;
  document.body.appendChild(m);

  const iframe = m.querySelector('iframe');
  const close = () => {
    m.classList.remove('is-open');
    iframe.src = '';
  };

  m.addEventListener('click', (e) => {
    if (e.target === m) close();
  });
  m.querySelector('.uffb-modal-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  return {
    open: (url) => {
      m.classList.add('is-open');
      iframe.src = embedUrl(url);
    },
  };
}
