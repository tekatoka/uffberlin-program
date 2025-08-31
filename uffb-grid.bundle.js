/* uffb-grid.bundle.js (multilingual) */
(function () {
  const MOUNT = '.uffb-program';

  const html = String.raw;
  const css = String.raw;

  // --- Language & i18n helpers ---
  const urlPath = location.pathname || '';
  const htmlLang = (document.documentElement.lang || '').toLowerCase();
  const lang =
    urlPath.startsWith('/de/') || htmlLang.startsWith('de') ? 'de' : 'en';
  const basePath = lang === 'de' ? '/de/uffb2025' : '/uffb2025';
  const locale = lang === 'de' ? 'de-DE' : 'en-GB';

  const I18N = {
    en: {
      filterBtn: 'Filter',
      searchBtn: 'Search',
      category: 'Category',
      director: 'Director',
      venue: 'Venue',
      date: 'Date',
      all: 'All',
      clearFilters: 'Clear filters',
      searchPh: 'Search title, description, venue…',
      watchTrailer: 'Watch trailer',
      tickets: 'Tickets',
      loadError: 'Program could not be loaded.',
      // date labels
      weekdayDayMonthYear: {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
      isoDateLabel: (iso) => {
        const [y, m, d] = iso.split('-');
        return `${d}.${m}.${y}`;
      }, // “DD.MM.YYYY” for dropdown
    },
    de: {
      filterBtn: 'Filter',
      searchBtn: 'Suche',
      category: 'Kategorie',
      director: 'Regie',
      venue: 'Spielort',
      date: 'Datum',
      all: 'Alle',
      clearFilters: 'Filter zurücksetzen',
      searchPh: 'Suche in Titel, Beschreibung, Ort…',
      watchTrailer: 'Trailer ansehen',
      tickets: 'Tickets',
      loadError: 'Programm konnte nicht geladen werden.',
      weekdayDayMonthYear: {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
      isoDateLabel: (iso) => {
        const [y, m, d] = iso.split('-');
        return `${d}.${m}.${y}`;
      },
    },
  };
  const t = (key) => I18N[lang][key];

  // --- Existing CSS (unchanged) ---
  const CSS = css`
    .uffb-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    @media (min-width: 700px) {
      .uffb-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .uffb-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .uffb-card {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      height: 100%;
    }
    .uffb-media {
      position: relative;
      aspect-ratio: 16/9;
      background: #f2f2f2;
      overflow: hidden;
    }
    .uffb-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.35s ease;
    }
    .uffb-card:hover .uffb-media img {
      transform: scale(1.03);
    }
    .uffb-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 25px;
    }
    .uffb-title {
      margin: 0;
      font-size: 1.5rem;
      line-height: 1.25;
    }
    .uffb-title a {
      color: inherit;
      text-decoration: none;
    }
    .uffb-desc {
      color: #333;
      opacity: 0.9;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 3.6em;
      font-size: 1.25rem;
    }
    .uffb-actions {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      flex-wrap: wrap;
    }
    .uffb-btn {
      display: inline-block;
      padding: 18px;
      border: 1.5px solid currentColor;
      border-radius: 6px;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: white;
    }
    .uffb-screenings {
      color: #333;
      margin: 8px 0 2px;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 25px;
      row-gap: 25px;
    }
    .uffb-screening {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: start;
      gap: 6px 12px;
      font-size: 1.25rem;
    }
    .uffb-category {
      font-size: 0.9rem;
      color: #333;
      padding: 10px 15px 0;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 0.4rem;
    }
    .uffb-when {
      font-weight: 700;
    }
    .uffb-venue {
      margin-top: 2px;
    }
    .uffb-address a {
      font-size: 0.92rem;
      text-decoration: underline;
      color: #444;
      font-size: 1rem;
    }
    .uffb-tickets a {
      color: var(--paragraphLinkColor);
      font-size: 1.1rem;
      font-weight: 600;
      padding: 10px;
      border: 1.5px solid;
      border-radius: 5px;
    }

    /* controls */
    .uffb-controls {
      display: flex;
      gap: 1rem;
      margin: 0 0 1rem 0;
      align-items: center;
    }
    .uffb-icon-btn {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
      border: none;
      background: transparent;
      color: #fff;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
    }
    .uffb-icon-btn svg {
      width: 26px;
      height: 26px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
    }
    .uffb-icon-btn .lbl {
      font-size: 0.9rem;
      letter-spacing: 0.08em;
    }

    /* panels */
    .uffb-filters,
    .uffb-search {
      display: grid;
      gap: 0.8rem;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      padding: 0.8rem;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 6px;
      margin: 0.5rem 0 1rem 0;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: saturate(120%) blur(4px);
    }
    .uffb-filters[hidden],
    .uffb-search[hidden] {
      display: none;
    }
    .uffb-filters label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 0;
    }
    .uffb-filter-actions {
      display: flex;
      gap: 0.5rem;
    }

    /* fields */
    .uffb-field {
      width: 100%;
      font: inherit;
      color: #333;
      background: #fff;
      padding: 0.55rem 0.65rem;
      border: 1px solid #d7d7d7;
      border-radius: 6px;
    }
    .uffb-field:focus {
      outline: 2px solid #bbb;
      outline-offset: 1px;
    }
    .uffb-field::placeholder {
      color: #666;
    }

    .uffb-meta {
      margin: 0.35rem 0 0.25rem;
      color: #333;
      font-size: 1.25rem;
    }
    .uffb-meta1 em {
      font-style: italic;
    }
    .uffb-meta2,
    .uffb-meta3 {
      line-height: 1.4;
    }

    /* modal */
    .uffb-modal {
      position: fixed !important;
      inset: 0;
      display: none;
      z-index: 999999;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.65);
      padding: 20px;
    }
    .uffb-modal.is-open {
      display: flex !important;
    }
    .uffb-modal-box {
      width: min(92vw, 960px);
      aspect-ratio: 16/9;
      max-height: 80vh;
      background: #000;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    }
    .uffb-modal iframe {
      width: 100% !important;
      height: 100% !important;
      border: 0;
      display: block;
    }
    .uffb-modal-close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #fff;
      border: none;
      border-radius: 999px;
      width: 36px;
      height: 36px;
      cursor: pointer;
    }
  `;

  function injectCSS() {
    if (document.getElementById('uffb-grid-style')) return;
    const s = document.createElement('style');
    s.id = 'uffb-grid-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
  function ytEmbed(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') && u.searchParams.get('v'))
        return `https://www.youtube-nocookie.com/embed/${u.searchParams.get(
          'v'
        )}?rel=0&autoplay=1`;
      if (u.hostname.includes('youtu.be'))
        return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(
          1
        )}?rel=0&autoplay=1`;
      return url;
    } catch {
      return url;
    }
  }
  function offsetFor() {
    const m = new Date().getTimezoneOffset(),
      sign = m <= 0 ? '+' : '-',
      abs = Math.abs(m);
    const hh = String(Math.floor(abs / 60)).padStart(2, '0'),
      mm = String(abs % 60).padStart(2, '0');
    return `${sign}${hh}:${mm}`;
  }

  const fmt = new Intl.DateTimeFormat(locale, I18N[lang].weekdayDayMonthYear);

  // --- UI labels / icons ---
  const ICONS = {
    filter: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16M7 12h10M10 18h4"/><circle cx="9" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>
      </svg>`,
    search: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/><path d="M20 20l-4.35-4.35"/>
      </svg>`,
  };

  // --- Rendering pieces (localized) ---
  const safeTxt = (x) => (x || '').toString().toLowerCase();
  const earliestDate = (film) => {
    const ds = (film.screenings || [])
      .map((s) => s.date)
      .filter(Boolean)
      .sort();
    return ds[0] || '9999-12-31';
  };
  const getVenueName = (s) =>
    (s.venue?.[lang] || s.venue?.de || s.venue?.en || s.venue || '').toString();
  const isoToLabel = (iso) => I18N[lang].isoDateLabel(iso);

  function pickLangVal(v) {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    // object with languages
    return v[lang] || v.de || v.en || '';
  }

  function joinVals(v) {
    var val = pickLangVal(v);
    if (Array.isArray(val)) {
      return val.map(pickLangVal).filter(Boolean).join(', ');
    }
    return val;
  }

  function screeningLine(s) {
    const dtISO = `${s.date}T${s.time || '00:00'}:00${offsetFor()}`;
    const d = new Date(dtISO);
    const when = `${fmt.format(d)}${s.time ? `, ${s.time}` : ''}`;

    const venueName = getVenueName(s);
    const addressTxt =
      typeof s.address === 'string'
        ? s.address
        : s.address?.[lang] || s.address?.de || s.address?.en || '';

    let mapsUrl = s.maps?.google || '';
    if (!mapsUrl && (venueName || addressTxt)) {
      const q = [venueName, addressTxt].filter(Boolean).join(', ');
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        q
      )}`;
    }

    const venueLine = venueName
      ? `<div class="uffb-venue">${escapeHtml(venueName)}</div>`
      : '';
    const addressLine = addressTxt
      ? `<div class="uffb-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${escapeHtml(
          addressTxt
        )}</a></div>`
      : '';

    const ticketHtml = s.tickets
      ? `<span class="uffb-tickets"><a href="${
          s.tickets
        }" target="_blank" rel="noopener">${t('tickets')}</a></span>`
      : '';

    return `
      <li class="uffb-screening">
        <div class="uffb-left">
          <div class="uffb-when"><strong>${when}</strong></div>
          ${venueLine}
          ${addressLine}
        </div>
        ${ticketHtml}
      </li>
    `;
  }

  function card(it) {
    const href = `${basePath}/${encodeURIComponent(it.id)}`; // localized film page
    const title =
      it.title?.[lang] || it.title?.de || it.title?.en || 'Untitled';
    const category =
      it.category?.[lang] || it.category?.de || it.category?.en || '—';
    const desc =
      it.description?.[lang] || it.description?.de || it.description?.en || '';
    const img = it.image || '';
    const trailer = it.trailer;

    // --- NEW: meta values ---
    const genreTxt = joinVals(it.genre); // supports "Drama" or {en:"Drama",de:"Drama"} or ["Drama","War"]
    const countriesTxt = joinVals(it.countries); // supports "Ukraine, Germany" or ["Ukraine","Germany"] or i18n objects
    const yearTxt = it.year ? String(it.year) : '';
    const directorTxt = joinVals(it.director); // supports string or i18n object
    let durationTxt = it.duration != null ? it.duration : ''; // number (min) or string
    if (typeof durationTxt === 'number') durationTxt = `${durationTxt}'`;
    else durationTxt = pickLangVal(durationTxt);

    const metaLine1 = genreTxt;
    const metaLine2 = [countriesTxt, yearTxt].filter(Boolean).join(' | ');
    const metaBlock = html`
    <div class="uffb-meta">
        ${metaLine1
          ? `<div class="uffb-meta1"><em>${escapeHtml(metaLine1)}</em></div>`
          : ''}
        ${metaLine2
          ? `<div class="uffb-meta1"><em>${escapeHtml(metaLine2)}</em></div>`
          : ''}
        ${directorTxt
          ? `<div class="uffb-meta2" style="margin-top: 10px">${t('director')}: ${escapeHtml(
              directorTxt
            )}</div>`
          : ''}
        ${durationTxt
          ? `<div class="uffb-meta3">${escapeHtml(durationTxt)}</div>`
          : ''}
      </div>
  `;

    const screenings = (it.screenings || []).map(screeningLine).join('');

    return html`<article class="uffb-card" data-id="${it.id}">
        <div class="uffb-category">#${escapeHtml(category)}</div>
        <a class="uffb-media" href="${href}" aria-label="${escapeHtml(title)}"
          ><img src="${img}" alt="${escapeHtml(title)}"
        /></a>
        <div class="uffb-body">
          <h3 class="uffb-title"><a href="${href}">${escapeHtml(title)}</a></h3>
          ${metaBlock}
          <div class="uffb-desc">${escapeHtml(desc)}</div>
          <div class="uffb-actions">
            ${trailer
              ? `<button class="uffb-btn" data-trailer="${encodeURIComponent(
                  trailer
                )}">${t('watchTrailer')}</button>`
              : ''}
          </div>
          <ul class="uffb-screenings">
            ${screenings}
          </ul>
        </div>
      </article>`;
  }

  function mountModal() {
    if (document.getElementById('uffb-modal'))
      return {
        open: (url) => {
          const iframe = document.querySelector('#uffb-modal iframe');
          document.getElementById('uffb-modal').classList.add('is-open');
          iframe.src = ytEmbed(url);
        },
      };
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
        iframe.src = ytEmbed(url);
      },
    };
  }

  // --- Build controls (localized labels) ---
  function buildControls(container) {
    const controls = document.createElement('div');
    controls.className = 'uffb-controls';
    controls.innerHTML = `
      <button class="uffb-icon-btn" id="filterToggle" aria-expanded="false" aria-controls="filters" title="${t(
        'filterBtn'
      )}">
        ${ICONS.filter}<span class="lbl">${t('filterBtn').toUpperCase()}</span>
      </button>
      <button class="uffb-icon-btn" id="searchToggle" aria-expanded="false" aria-controls="searchbar" title="${t(
        'searchBtn'
      )}">
        ${ICONS.search}<span class="lbl">${t('searchBtn').toUpperCase()}</span>
      </button>
    `;
    container.appendChild(controls);

    const filters = document.createElement('form');
    filters.id = 'filters';
    filters.className = 'uffb-filters';
    filters.setAttribute('hidden', '');
    filters.innerHTML = html`
      <label
        ><span>${t('category')}</span>
        <select id="filterCategory" class="uffb-field">
          <option value="">${t('all')}</option>
        </select>
      </label>
      <label
        ><span>${t('venue')}</span>
        <select id="filterVenue" class="uffb-field">
          <option value="">${t('all')}</option>
        </select>
      </label>
      <label
        ><span>${t('date')}</span>
        <select id="filterDate" class="uffb-field">
          <option value="">${t('all')}</option>
        </select>
      </label>
      <div class="uffb-filter-actions">
        <button type="button" id="clearFilters" class="uffb-icon-btn">
          ${t('clearFilters')}
        </button>
      </div>
    `;
    container.appendChild(filters);

    const search = document.createElement('form');
    search.id = 'searchbar';
    search.className = 'uffb-search';
    search.setAttribute('hidden', '');
    search.innerHTML = `
      <input type="search" id="searchInput" class="uffb-field" placeholder="${t(
        'searchPh'
      )}" />
    `;
    container.appendChild(search);

    return {
      controls,
      filters: {
        root: filters,
        cat: filters.querySelector('#filterCategory'),
        venue: filters.querySelector('#filterVenue'),
        date: filters.querySelector('#filterDate'),
        clear: filters.querySelector('#clearFilters'),
      },
      search: {
        root: search,
        input: search.querySelector('#searchInput'),
      },
      toggles: {
        filterBtn: controls.querySelector('#filterToggle'),
        searchBtn: controls.querySelector('#searchToggle'),
      },
    };
  }

  // --- Main render ---
  function render(el) {
    injectCSS();

    const wrap = document.createElement('div');
    el.appendChild(wrap);

    const ui = buildControls(wrap);

    const grid = document.createElement('div');
    grid.className = 'uffb-grid';
    wrap.appendChild(grid);

    const jsonUrl = el.dataset.json;

    let items = [];
    let filtered = [];
    const state = { category: '', venue: '', date: '', q: '' };

    function renderGrid(list) {
      grid.innerHTML = list.map(card).join('');
      const modal = mountModal();
      grid.querySelectorAll('[data-trailer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const u = decodeURIComponent(
            e.currentTarget.getAttribute('data-trailer')
          );
          modal.open(u);
        });
      });
    }

    function applyAll() {
      filtered = items.filter((f) => {
        if (state.category) {
          const key =
            (f.category &&
              (f.category.key || f.category.en || f.category.de)) ||
            '';
          const keyNorm =
            f.category && f.category.key ? f.category.key : safeTxt(key);
          const catNorm = safeTxt(state.category);
          if (keyNorm !== state.category && keyNorm !== catNorm) return false;
        }
        if (state.venue) {
          const hasVenue = (f.screenings || []).some(
            (s) => safeTxt(getVenueName(s)) === state.venue
          );
          if (!hasVenue) return false;
        }
        if (state.date) {
          const hasDate = (f.screenings || []).some(
            (s) => s.date === state.date
          );
          if (!hasDate) return false;
        }
        if (state.q) {
          const q = state.q.toLowerCase();
          const text = [
            f.title?.de,
            f.title?.en,
            f.description?.de,
            f.description?.en,
            f.category?.de,
            f.category?.en,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          const venuesText = (f.screenings || [])
            .map(getVenueName)
            .join(' ')
            .toLowerCase();
          if (!text.includes(q) && !venuesText.includes(q)) return false;
        }
        return true;
      });

      filtered.sort((a, b) => earliestDate(a).localeCompare(earliestDate(b)));
      renderGrid(filtered);
    }

    function toggle(panel, btn) {
      const hidden = panel.hasAttribute('hidden');
      if (hidden) {
        panel.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        panel.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
      }
    }

    function initFilterOptions(data) {
      // categories
      const catSet = new Map(); // key -> label (current lang)
      data.forEach((f) => {
        const key = (f.category && f.category.key) || null;
        const label =
          (f.category &&
            (f.category[lang] || f.category.de || f.category.en)) ||
          null;
        if (key && label && !catSet.has(key)) catSet.set(key, label);
      });
      catSet.forEach((label, key) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = label;
        ui.filters.cat.appendChild(opt);
      });

      // venues (norm -> pretty)
      const venueMap = new Map();
      data.forEach((f) =>
        (f.screenings || []).forEach((s) => {
          const pretty = getVenueName(s).trim();
          const norm = safeTxt(pretty);
          if (pretty && !venueMap.has(norm)) venueMap.set(norm, pretty);
        })
      );
      Array.from(venueMap.entries())
        .sort((a, b) => a[1].localeCompare(b[1]))
        .forEach(([norm, pretty]) => {
          const opt = document.createElement('option');
          opt.value = norm;
          opt.textContent = pretty;
          ui.filters.venue.appendChild(opt);
        });

      // dates
      const dateSet = new Set();
      data.forEach((f) =>
        (f.screenings || []).forEach((s) => {
          if (s.date) dateSet.add(s.date);
        })
      );
      Array.from(dateSet)
        .sort()
        .forEach((d) => {
          const opt = document.createElement('option');
          opt.value = d; // keep ISO for filtering
          opt.textContent = isoToLabel(d); // localized label
          ui.filters.date.appendChild(opt);
        });
    }

    // toggles
    ui.toggles.filterBtn.addEventListener('click', () =>
      toggle(ui.filters.root, ui.toggles.filterBtn)
    );
    ui.toggles.searchBtn.addEventListener('click', () =>
      toggle(ui.search.root, ui.toggles.searchBtn)
    );

    // instant filtering
    ui.filters.cat.addEventListener('change', () => {
      state.category = ui.filters.cat.value;
      applyAll();
    });
    ui.filters.venue.addEventListener('change', () => {
      state.venue = ui.filters.venue.value;
      applyAll();
    });
    ui.filters.date.addEventListener('change', () => {
      state.date = ui.filters.date.value;
      applyAll();
    });
    ui.filters.clear.addEventListener('click', () => {
      ui.filters.cat.value = '';
      ui.filters.venue.value = '';
      ui.filters.date.value = '';
      state.category = '';
      state.venue = '';
      state.date = '';
      applyAll();
    });

    // instant search (debounced) + native clear
    let searchTimer = null;
    const doSearch = () => {
      state.q = ui.search.input.value.trim();
      applyAll();
    };
    ui.search.input.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(doSearch, 250);
    });
    ui.search.input.addEventListener('search', doSearch);

    // fetch + initial render
    fetch(jsonUrl, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('load fail');
        return r.json();
      })
      .then((data) => {
        items = data
          .slice()
          .sort((a, b) => earliestDate(a).localeCompare(earliestDate(b)));
        initFilterOptions(items);
        applyAll();
      })
      .catch((err) => {
        grid.innerHTML = `<p>${t('loadError')}</p>`;
        console.error('[UFFB] JSON fetch error', err);
      });
  }

  // robust init for Squarespace (DOM + injected content)
  let started = false;
  const tryStart = () => {
    if (started) return;
    const nodes = document.querySelectorAll(MOUNT);
    if (!nodes.length) return;
    started = true;
    nodes.forEach(render);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryStart);
  } else {
    tryStart();
  }
  new MutationObserver(tryStart).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
