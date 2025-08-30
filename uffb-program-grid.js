(function () {
  const mount = document.getElementById('uffb2025-program');
  if (!mount) return;

  const jsonUrl = mount.dataset.json;

  // Shell
  mount.innerHTML = `
    <div class="uffb-grid" aria-live="polite" aria-busy="true"></div>
    <div class="uffb-modal" role="dialog" aria-modal="true" aria-label="Video trailer">
      <div class="uffb-modal-box">
        <button class="uffb-modal-close" title="Close">✕</button>
        <iframe allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
    </div>
  `;

  const grid = mount.querySelector('.uffb-grid');
  const modal = mount.querySelector('.uffb-modal');
  const modalIframe = modal.querySelector('iframe');
  const closeBtn = modal.querySelector('.uffb-modal-close');

  // Helpers
  const ytEmbed = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
        return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}?rel=0&autoplay=1`;
      }
      if (u.hostname.includes('youtu.be')) {
        return `https://www.youtube-nocookie.com/embed/${u.pathname.replace('/','')}?rel=0&autoplay=1`;
      }
      return url; // fallback for non-YouTube
    } catch { return url; }
  };

  const fmt = new Intl.DateTimeFormat('de-DE', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });
  const tz = 'Europe/Berlin';

  function screeningLine(s) {
    // Combine date and time to local string
    const dtISO = `${s.date}T${(s.time || '00:00')}:00${offsetFor(tz)}`;
    const d = new Date(dtISO);
    const when = `${fmt.format(d)}${s.time ? `, ${s.time}` : ''}`;
    const venue = s.venue?.de || s.venue?.en || '';
    const ticketHtml = s.tickets ? `<span class="uffb-tickets"><a class="uffb-btn" href="${s.tickets}" target="_blank" rel="noopener">Tickets</a></span>` : '';
    return `
      <li class="uffb-screening">
        <span class="uffb-whenwhere">${when}${venue ? ` — ${venue}` : ''}</span>
        ${ticketHtml}
      </li>
    `;
  }

  // crude offset builder for ISO string (Squarespace pages run in browser; we just want +02:00 format)
  function offsetFor() {
    const m = new Date().getTimezoneOffset(); // minutes behind UTC
    const sign = m <= 0 ? '+' : '-';
    const abs = Math.abs(m);
    const hh = String(Math.floor(abs / 60)).padStart(2,'0');
    const mm = String(abs % 60).padStart(2,'0');
    return `${sign}${hh}:${mm}`;
  }

  function cardHtml(item) {
    const id = item.id;
    const href = `/uffb2025/${encodeURIComponent(id)}`;
    const title = item.title?.de || item.title?.en || 'Untitled';
    const desc  = item.description?.de || item.description?.en || '';
    const img   = item.image || '';
    const teaser = item.teaser;

    const screenings = (item.screenings || [])
      .map(screeningLine)
      .join('');

    return `
      <article class="uffb-card">
        <a class="uffb-media" href="${href}" aria-label="${title}">
          <img src="${img}" alt="${title}">
        </a>
        <div class="uffb-body">
          <h3 class="uffb-title"><a href="${href}">${title}</a></h3>
          <div class="uffb-desc">${escapeHtml(desc)}</div>
          <div class="uffb-actions">
            ${teaser ? `<button class="uffb-btn" data-teaser="${encodeURIComponent(teaser)}">Watch teaser</button>` : ``}
          </div>
          <ul class="uffb-screenings">${screenings}</ul>
        </div>
      </article>
    `;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;');
  }

  // Events
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  function openModal(url) {
    modal.classList.add('is-open');
    modalIframe.src = ytEmbed(url);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modalIframe.src = '';
  }

  // Fetch + render
  fetch(jsonUrl, { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) throw new Error('Cannot load program JSON');
      return r.json();
    })
    .then(items => {
      // optional: sort by title (de -> en)
      items.sort((a,b) => {
        const ta = (a.title?.de || a.title?.en || '').toLocaleLowerCase('de-DE');
        const tb = (b.title?.de || b.title?.en || '').toLocaleLowerCase('de-DE');
        return ta.localeCompare(tb, 'de-DE');
      });
      grid.innerHTML = items.map(cardHtml).join('');
      grid.setAttribute('aria-busy','false');

      // Wire teaser buttons
      grid.querySelectorAll('[data-teaser]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const teaserUrl = decodeURIComponent(e.currentTarget.getAttribute('data-teaser'));
          openModal(teaserUrl);
        });
      });
    })
    .catch(err => {
      grid.innerHTML = `<p>Programm konnte nicht geladen werden.</p>`;
      console.error(err);
    });
})();
