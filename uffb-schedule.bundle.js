/* uffb-schedule.bundle.js — poster-style table view (multilingual)
   Mount: <div class="uffb-program" data-view="schedule" data-json="..."></div>
*/
(function () {
  const MOUNT = '.uffb-program[data-view="schedule"]';
  const html = String.raw,
    css = String.raw;

  // --------- Language / locale ----------
  const htmlLang = (document.documentElement.lang || '').toLowerCase();
  const lang = location.pathname.startsWith('/de/')
    ? 'de'
    : location.pathname.startsWith('/uk/')
      ? 'uk'
      : htmlLang.startsWith('de')
        ? 'de'
        : htmlLang.startsWith('uk')
          ? 'uk'
          : 'en';

  const basePath = lang === 'de' ? '/de/uffb2025' : '/uffb2025';
  const locale = lang === 'de' ? 'de-DE' : lang === 'uk' ? 'uk-UA' : 'en-GB';
  const filmHref = (id) => `${basePath}/${encodeURIComponent(id)}`;

  const I18N = {
    en: {
      monthShort: 'OCT',
      maps: 'Maps',
      cinema: 'Cinema',
      tickets: 'Tickets',
      legend: {
        main: 'MAIN PROGRAM',
        shorts: 'SHORT FILMS',
        special: 'SPECIAL PROGRAM',
        qa: 'Q&A: FILMMAKER OR FILM TEAM PRESENT',
      },
    },
    de: {
      monthShort: 'OKT',
      maps: 'Karte',
      cinema: 'Kino',
      tickets: 'Tickets',
      legend: {
        main: 'HAUPTPROGRAMM',
        shorts: 'KURZFILME',
        special: 'SPEZIALPROGRAMM',
        qa: 'Q&A: FILMEMACHER:IN ODER FILMTEAM SIND ZU GAST',
      },
    },
    uk: {
      monthShort: 'ЖОВ',
      maps: 'Карти',
      cinema: 'Кіно',
      tickets: 'Квитки',
      legend: {
        main: 'ГОЛОВНА ПРОГРАМА',
        shorts: 'КОРОТКИЙ МЕТР',
        special: 'СПЕЦІАЛЬНА ПРОГРАМА',
        qa: 'Q&A: ПРИСУТНІ РЕЖИСЕР/КА АБО ЗНІМАЛЬНА ГРУПА',
      },
    },
  };
  const t = (k) => (I18N[lang] || I18N.en)[k];

  // --------- Venue order (poster) + aliases ----------
  const VENUE_ORDER = [
    'silent green Kulturquartier',
    'CineStar Kino in der Kulturbrauerei',
    'Kino im Planetarium',
    'ACUD Kino',
    'ACUD Club',
    'Sputnik Kino',
    'IL Kino',
    'Kino in der Königstadt',
    'City Kino Wedding',
    'Filmkunst 66',
  ];
  const VENUE_ALIASES = [
    [
      'silent green Kulturquartier',
      'silent green',
      'silent green kulturquartier',
    ],
    [
      'CineStar Kino in der Kulturbrauerei',
      'cinestar kino in der kulturbrauerei - kino 4',
      'cinestar kino in der kulturbrauerei - cinema 4',
      'cinestar kino in der kulturbrauerei',
    ],
    [
      'Kino im Planetarium',
      'zeiss-großplanetarium kino',
      'zeiss grossplanetarium',
      'planetarium',
    ],
    ['ACUD Kino', 'acud'],
    ['ACUD Club', 'acud club'],
    ['Sputnik Kino', 'sputnik'],
    ['IL Kino', 'il kino'],
    ['Kino in der Königstadt', 'kino in der koenigstadt', 'königstadt'],
    ['City Kino Wedding', 'city kino wedding'],
    ['Filmkunst 66', 'filmkunst66'],
  ];
  function normalizeVenue(name) {
    if (!name) return '';
    const n = String(name).trim().toLowerCase();
    for (const v of VENUE_ORDER) if (n.includes(v.toLowerCase())) return v;
    for (const set of VENUE_ALIASES)
      for (const a of set) if (n.includes(a.toLowerCase())) return set[0];
    return name;
  }

  // --------- Colors per category ----------
  const CATEGORY_COLORS = {
    main: { bg: '#2a0f16', stroke: '#f3a6ba', text: '#ffdbe6' },
    uffb_shorts: { bg: '#27220a', stroke: '#ffe37a', text: '#fff3b5' },
    special: { bg: '#1c1c1f', stroke: '#cfd3da', text: '#e7eaf0' },
    retrospective: { bg: '#1c1c1f', stroke: '#cfd3da', text: '#e7eaf0' },
    film_focus: { bg: '#1c1c1f', stroke: '#cfd3da', text: '#e7eaf0' },
    special: { bg: '#1c1c1f', stroke: '#cfd3da', text: '#e7eaf0' },
    'ukraine-known-unknown': {
      bg: '#1c1c1f',
      stroke: '#cfd3da',
      text: '#e7eaf0',
    },
    panel_discussion: { bg: '#1c1c1f', stroke: '#cfd3da', text: '#e7eaf0' },
  };
  function categoryKey(item) {
    return (item.category && (item.category.key || '').toString()) || 'main';
  }
  function colorFor(item) {
    const c = CATEGORY_COLORS[categoryKey(item)];
    return c || CATEGORY_COLORS.main;
  }

  // --------- Helpers ----------
  const PANEL_LABEL = {
    en: 'Panel discussion',
    de: 'Podiumsdiskussion',
    uk: 'Панельна дискусія',
  };
  const safeTxt = (x) => (x == null ? '' : String(x));
  function localized(v) {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    return v[lang] || v.de || v.en || v.uk || '';
  }
  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
  const getVenueName = (s) =>
    localized(s.venue || '') || localized((s.venue || {}).name || '');

  function offsetFor() {
    const m = new Date().getTimezoneOffset();
    const sign = m <= 0 ? '+' : '-';
    const abs = Math.abs(m);
    const hh = String(Math.floor(abs / 60)).padStart(2, '0');
    const mm = String(abs % 60).padStart(2, '0');
    return `${sign}${hh}:${mm}`;
  }
  const hm = (t) => (t ? String(t).slice(0, 5) : '');

  function groupBy(arr, keyFn) {
    const m = new Map();
    arr.forEach((x) => {
      const k = keyFn(x);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(x);
    });
    return m;
  }

  // Build a small legend under the table (localized)
  function buildLegend(entries) {
    // Show only these three categories, in poster order, if present:
    const ORDER = ['main', 'uffb_shorts', 'special'];

    // Which categories are present in the schedule?
    const present = new Set(
      entries.map((e) => (e.film?.category?.key || 'main').toString())
    );

    // Prepare labels
    const L = (I18N[lang] && I18N[lang].legend) || I18N.en.legend;

    const root = document.createElement('div');
    root.className = 'uffb-legend';

    const list = document.createElement('div');
    list.className = 'legend-list';

    ORDER.filter((k) => present.has(k)).forEach((k) => {
      const item = document.createElement('div');
      item.className = 'legend-item';

      const label = document.createElement('div');
      label.className = 'legend-label';
      label.textContent =
        k === 'main' ? L.main : k === 'uffb_shorts' ? L.shorts : L.special;

      const chip = document.createElement('span');
      chip.className = 'legend-chip';
      const c = CATEGORY_COLORS[k] || CATEGORY_COLORS.main;
      chip.style.background = c.bg;
      chip.style.borderColor = c.stroke;

      item.appendChild(label);
      item.appendChild(chip);
      list.appendChild(item);
    });

    // Add Q&A note if any entry has qanda
    if (entries.some((e) => e.qanda)) {
      const qa = document.createElement('div');
      qa.className = 'legend-note';
      qa.textContent = L.qa;
      list.appendChild(qa);
    }

    root.appendChild(list);
    return root;
  }

  // ------- Per-date language note parsing -------
  function pad2(n) {
    return String(n).padStart(2, '0');
  }
  function dateToDM(iso) {
    const d = new Date(iso + 'T00:00:00');
    return pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function parsePerDateLanguageNotes(film) {
    const raw =
      (film.language &&
        (film.language[lang] || film.language.en || film.language.de)) ||
      film.language;
    if (!raw || typeof raw !== 'string') return {};
    const map = {};
    const parts = raw
      .split('|')
      .flatMap((p) => String(p).split('\n'))
      .map((s) => s.trim())
      .filter(Boolean);
    const re = /^\s*(\d{1,2})\.(\d{1,2})\.?\s*:?\s*(.+?)\s*$/;
    for (const p of parts) {
      const m = p.match(re);
      if (!m) continue;
      map[pad2(m[2]) + '-' + pad2(m[1])] = m[3];
    }
    return map;
  }

  // ------- Panel-screening resolution (match to film screening) -------
  function cloneScreeningForPanel(s) {
    return {
      date: s.date,
      time: s.time || '',
      venue: s.venue,
      address: s.address,
      website: s.website,
      maps: s.maps,
      tickets: s.tickets || '',
    };
  }
  function hasAny(obj, keys) {
    return !!obj && keys.some((k) => obj[k] != null && obj[k] !== '');
  }
  function resolvePanelScreenings(film) {
    const pd = film.panel_discussion || {};
    const parent = Array.isArray(film.screenings) ? film.screenings : [];
    const first = parent[0] || {};
    if (Array.isArray(pd.screenings) && pd.screenings.length > 0) {
      return pd.screenings.map((ps) => ({
        date: ps.date || first.date || '',
        time: (ps.time ?? first.time) || '',
        venue: ps.venue || first.venue,
        address: ps.address || first.address,
        website: ps.website || first.website,
        maps: ps.maps || first.maps,
        tickets: ps.tickets || first.tickets || '',
      }));
    }
    if (
      hasAny(pd, [
        'date',
        'time',
        'venue',
        'address',
        'website',
        'maps',
        'tickets',
      ])
    ) {
      return [
        {
          date: pd.date || first.date || '',
          time: (pd.time ?? first.time) || '',
          venue: pd.venue || first.venue,
          address: pd.address || first.address,
          website: pd.website || first.website,
          maps: pd.maps || first.maps,
          tickets: pd.tickets || first.tickets || '',
        },
      ];
    }
    return parent.map(cloneScreeningForPanel);
  }

  // ------- Build the “ & Panel discussion … ” suffix as HTML -------
  function quoteByLang(txt) {
    if (!txt) return '';
    if (lang === 'de') return ` „${escapeHtml(txt)}“`;
    if (lang === 'uk') return ` «${escapeHtml(txt)}»`;
    return ` “${escapeHtml(txt)}”`;
  }

  function qandaSuffixHTML(entry) {
    return entry.qanda ? ' <span class="qanda-suffix">+ Q&amp;A</span>' : '';
  }

  function panelSuffixForScreeningHTML(film, entryDate, entryVenuePretty) {
    const pd = film.panel_discussion;
    if (!pd) return '';

    // Only show suffix if panel happens at THIS screening (same date+venue)
    const panelScreenings = resolvePanelScreenings(film);
    const matchHere = panelScreenings.some((ps) => {
      const psVenuePretty = normalizeVenue(getVenueName(ps));
      return (
        (ps.date || '') === entryDate && psVenuePretty === entryVenuePretty
      );
    });
    if (!matchHere) return '';

    const label = PANEL_LABEL[lang] || PANEL_LABEL.en;
    const pTitle =
      (pd.title &&
        (pd.title[lang] || pd.title.de || pd.title.en || pd.title.uk)) ||
      '';
    const quoted = pTitle ? quoteByLang(pTitle) : '';

    // NOTE: &amp; will render as “&” because we assign via innerHTML later
    return ` <span class="panel-suffix">&amp; ${escapeHtml(label)}${quoted}</span>`;
  }

  // --------- Build entries from films (no separate panel items) ----------
  function collectEntries(data) {
    const out = [];
    data.forEach((f) => {
      (f.screenings || []).forEach((s) => {
        const venuePretty = normalizeVenue(getVenueName(s));
        out.push({
          kind: 'screening',
          film: f,
          date: s.date,
          time: s.time || '',
          venuePretty,
          links: {
            tickets: s.tickets,
            maps: s.maps?.google || '',
            venue: s.website || '',
          },
          langNoteByDate: parsePerDateLanguageNotes(f),
          specialPrefix: s.special_program_prefix,
          qanda: !!s.qanda,
        });
      });
    });
    return out.filter((e) => !!e.date && !!e.venuePretty);
  }

  // --------- CSS ----------
  const CSS = css`
    .uffb-schedule-wrap {
      font-family:
        Inter,
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Helvetica,
        Arial,
        sans-serif;
      color: #fff;
    }

    /* Fit-first columns: venue shrinks on tablets, day columns divide remaining space */
    .uffb-table {
      display: grid;
      grid-template-columns: clamp(140px, 22vw, 260px) repeat(
          var(--days, 5),
          minmax(0, 1fr)
        );
      gap: 0;
      border: 1px solid #2a2a2a;
      border-right: none;
      background: #000;
    }

    /* Ensure grid/flex children can shrink */
    .uffb-venue,
    .uffb-cell,
    .slot,
    .card,
    .title {
      min-width: 0;
    }

    .uffb-head,
    .uffb-row {
      display: contents;
    }

    .uffb-head .c,
    .uffb-venue,
    .uffb-cell {
      border-right: 1px solid #2a2a2a;
      border-bottom: 1px solid #2a2a2a;
    }

    .uffb-head .month {
      font-size: 22px;
      letter-spacing: 0.12em;
      color: #f0e53c;
    }
    .uffb-head .day {
      text-transform: uppercase;
      font-size: 12px;
      color: #aaa;
      letter-spacing: 0.1em;
    }
    .uffb-head .num {
      font-size: 20px;
    }

    .uffb-venue {
      padding: 14px 12px;
      background: #0a0a0a;
      font-weight: 700;
    }

    .uffb-cell {
      min-height: 96px;
      padding: 10px;
      background: #000;
    }

    .slot {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin-bottom: 10px;
      min-width: 0; /* important */
    }

    .time {
      width: 46px;
      flex: 0 0 auto;
      font-weight: 800;
      color: #fff;
      opacity: 0.95;
      font-size: 15px;
    }

    .card {
      border: 1px solid;
      border-radius: 8px;
      padding: 8px 10px;
      line-height: 1.2;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      flex: 1 1 0; /* ⬅ allows the card to shrink within the slot */
      overflow: hidden; /* safety */
    }

    .title {
      font-weight: 800;
      font-size: 13px;
      position: relative;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* number of lines to show */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .title-link {
      text-decoration: none;
      font-weight: 700;
      font-size: clamp(12px, 1.2vw + 0.25rem, 16px); /* responsive */
      line-height: 1.2;
      display: inline-block;
      max-width: 100%;
      overflow-wrap: break-word;
      word-break: break-word;
      hyphens: manual;
    }
    .title-link:hover {
      text-decoration: underline !important;
    }

    .panel-suffix {
      font-weight: 700;
      white-space: normal;
      font-size: clamp(12px, 1.1vw + 0.2rem, 15px);
      display: inline-block;
    }

    .meta {
      margin-top: 4px;
      font-size: 11px;
      opacity: 0.95;
    }
    .links {
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .chip {
      font-size: 11px;
      text-decoration: none;
      color: #9cf;
      border-bottom: 1px dotted currentColor;
    }
    .note {
      margin-top: 6px;
      font-size: 11px;
      color: #bbb;
    }
    .qanda-suffix {
      font-weight: 700;
    }

    /* Legend */
    .uffb-legend {
      margin: 25px 0;
      color: #fff;
      max-width: 25%;
    }
    .uffb-legend .legend-list {
      display: grid;
      gap: 6px;
    }
    .uffb-legend .legend-item,
    .uffb-legend .legend-note {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0b0b0b;
      border: 1px solid #2a2a2a;
      padding: 8px 10px;
    }
    .uffb-legend .legend-label {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .uffb-legend .legend-chip {
      width: 86px;
      height: 14px;
      border: 1px solid;
      border-radius: 2px;
    }
    .uffb-legend .legend-note {
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    /* Tablet: keep desktop layout, tighten spacing so nothing cuts off */
    @media (min-width: 700px) and (max-width: 1024px) {
      .uffb-head .c {
        padding: 10px 8px;
      }
      .uffb-venue {
        padding: 10px 10px;
      }
      .uffb-cell {
        padding: 8px;
      }
      .slot {
        gap: 8px;
      }
      .time {
        width: 40px;
        font-size: 14px;
      }
      .card {
        padding: 6px 8px;
      }
      .title-link {
        font-size: clamp(13px, 1.7vw, 16px);
      }
      .meta,
      .links .chip,
      .note {
        font-size: 10.5px;
      }
    }

    /* Mobile: stacked list view */
    @media (max-width: 900px) {
      .uffb-table {
        display: block;
        border: none;
      }
      .mobile-day {
        border-top: 2px solid #222;
        padding-top: 12px;
        margin-top: 14px;
      }
      .mobile-day h3 {
        margin: 0 0 8px;
        font-size: 18px;
        letter-spacing: 0.04em;
      }
      .mobile-item {
        border-top: 1px solid #222;
        padding: 12px 0;
      }
      .mobile-when {
        font-size: 12px;
        color: #bbb;
        margin-bottom: 6px;
      }
      .card {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      .title-link {
        font-size: clamp(14px, 4vw, 18px);
      }
      .uffb-legend {
        max-width: 100%;
      }
    }

    /* ---------- SCROLL + STICKY (consolidated) ---------- */

    /* Outer scroll container (wrap your .uffb-table inside this) */
    .uffb-schedule-outer {
      position: relative;
      overflow-x: auto; /* horizontal scroll if needed */
      overflow-y: visible; /* grid grows with page */
      -webkit-overflow-scrolling: touch;
      /* Subtle edge fade hint (optional) */
      --edge-fade: linear-gradient(90deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
      mask-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 1) 10px,
        rgba(0, 0, 0, 1) calc(100% - 10px)
      );
    }

    /* Header cells stick to the top */
    .uffb-head .c {
      position: sticky;
      top: 0;
      z-index: 6; /* above body cells */
      background: #0d0d0d; /* opaque to cover content when stuck */
      box-shadow: 0 1px 0 #2a2a2a; /* divider under header */
    }

    /* Left venue column sticks to the left */
    .uffb-venue {
      position: sticky;
      left: 0;
      z-index: 5; /* under the corner, above body */
      background: #0a0a0a; /* opaque */
      box-shadow: 1px 0 0 #2a2a2a; /* divider to the right */
    }

    /* Top-left corner cell sticks both top & left */
    .uffb-head .c.corner {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 7; /* highest at the intersection */
      background: #0d0d0d;
      box-shadow:
        0 1px 0 #2a2a2a,
        /* bottom divider like header */ 1px 0 0 #2a2a2a; /* right divider like venue */
    }

    /* Ensure body cells don't paint over the stickies */
    .uffb-cell {
      position: relative;
      z-index: 1;
    }
  `;
  function injectCSS() {
    if (document.getElementById('uffb-schedule-style')) return;
    const s = document.createElement('style');
    s.id = 'uffb-schedule-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // --------- Rendering ----------
  function buildDesktop(container, entries) {
    const days = Array.from(new Set(entries.map((e) => e.date))).sort();
    const dayFmt = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    const getNum = (iso) => new Date(iso + 'T00:00:00').getDate();

    // venues: poster order, then extras alpha
    const venueSet = new Set(entries.map((e) => e.venuePretty));
    const venues = [
      ...VENUE_ORDER.filter((v) => venueSet.has(v)),
      ...Array.from(venueSet)
        .filter((v) => !VENUE_ORDER.includes(v))
        .sort(),
    ];

    const byDayVenue = groupBy(entries, (e) => e.date + '||' + e.venuePretty);

    // --- shell
    const root = document.createElement('div');
    root.className = 'uffb-schedule-wrap';

    const scroller = document.createElement('div');
    scroller.className = 'uffb-schedule-outer'; // outer scroller (needed for sticky)

    const table = document.createElement('div');
    table.className = 'uffb-table';
    table.style.setProperty('--days', String(days.length));

    // --- header row (sticky via CSS)
    const headRow = document.createElement('div');
    headRow.className = 'uffb-head';

    const leftHead = document.createElement('div');
    leftHead.className = 'c corner';
    leftHead.innerHTML = `<div class="month">${t('monthShort')}</div>`;
    headRow.appendChild(leftHead);

    days.forEach((d) => {
      const c = document.createElement('div');
      c.className = 'c';
      c.innerHTML = `
      <div class="day">${dayFmt.format(new Date(d + 'T00:00:00'))}</div>
      <div class="num">${getNum(d)}.</div>`;
      headRow.appendChild(c);
    });
    table.appendChild(headRow);

    // --- rows
    venues.forEach((venue) => {
      const vcell = document.createElement('div');
      vcell.className = 'uffb-venue';
      vcell.textContent = venue;
      table.appendChild(vcell);

      days.forEach((d) => {
        const cell = document.createElement('div');
        cell.className = 'uffb-cell';

        const list = (byDayVenue.get(d + '||' + venue) || []).slice();
        list.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

        list.forEach((it) => {
          const slot = document.createElement('div');
          slot.className = 'slot';
          slot.style.minWidth = '0'; // prevent flex overflow in narrow columns

          const time = document.createElement('div');
          time.className = 'time';
          time.textContent = hm(it.time);

          const card = document.createElement('div');
          card.className = 'card';
          card.style.minWidth = '0'; // critical for shrinking inside column

          const c = colorFor(it.film);
          card.style.background = c.bg;
          card.style.borderColor = c.stroke;
          card.style.color = c.text;

          // --- title (DESKTOP) with special prefix + panel + Q&A suffix
          const titleWrap = document.createElement('div');
          titleWrap.className = 'title';
          titleWrap.style.minWidth = '0';

          const a = document.createElement('a');
          a.className = 'title-link';
          a.href = filmHref(it.film.id || it.id);

          const prefix = escapeHtml(localized(it.specialPrefix) || '');
          const filmTitle = escapeHtml(localized(it.film.title) || 'Untitled');
          const baseTitle = [prefix, filmTitle].filter(Boolean).join(': ');

          const panelHTML = panelSuffixForScreeningHTML(
            it.film,
            it.date,
            it.venuePretty
          ); // returns `<span class="panel-suffix">…</span>` or ''
          const qandaHTML = qandaSuffixHTML(it); // returns `<span class="qanda-suffix">…</span>` or ''

          // keep HTML so suffix spans render; base text is already escaped
          a.innerHTML = baseTitle + panelHTML + qandaHTML;
          a.setAttribute(
            'aria-label',
            (prefix ? prefix + ' ' : '') +
              (localized(it.film.title) || 'Untitled')
          );

          titleWrap.replaceChildren(a);

          // --- meta
          const meta = document.createElement('div');
          meta.className = 'meta';
          meta.style.minWidth = '0';

          const cat = it.film.category ? localized(it.film.category) || '' : '';
          const dur =
            it.film.duration != null
              ? typeof it.film.duration === 'number'
                ? `${it.film.duration}′`
                : localized(it.film.duration)
              : '';
          meta.textContent = [cat, dur].filter(Boolean).join(' • ');

          // --- links
          const links = document.createElement('div');
          links.className = 'links';

          if (it.links.tickets) {
            const link = document.createElement('a');
            link.href = it.links.tickets;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = t('tickets');
            link.className = 'chip';
            links.appendChild(link);
          }
          if (it.links.maps) {
            const link = document.createElement('a');
            link.href = it.links.maps;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = t('maps');
            link.className = 'chip';
            links.appendChild(link);
          }
          if (it.links.venue) {
            const link = document.createElement('a');
            link.href = it.links.venue;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = t('cinema');
            link.className = 'chip';
            links.appendChild(link);
          }

          // assemble card
          card.appendChild(titleWrap);
          if (meta.textContent) card.appendChild(meta);
          if (links.children.length) card.appendChild(links);

          // assemble cell
          slot.appendChild(time);
          slot.appendChild(card);
          cell.appendChild(slot);
        });

        table.appendChild(cell);
      });
    });

    // mount
    scroller.appendChild(table); // table inside the scroll container
    root.appendChild(scroller); // scroller into the wrap
    root.appendChild(buildLegend(entries)); // keep your legend

    container.innerHTML = '';
    container.appendChild(root);
  }

  function buildMobile(container, entries) {
    const days = Array.from(new Set(entries.map((e) => e.date))).sort();
    const dayFmt = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
    });
    const root = document.createElement('div');
    root.className = 'uffb-schedule-wrap';

    const byDay = groupBy(entries, (e) => e.date);
    days.forEach((d) => {
      const sec = document.createElement('section');
      sec.className = 'mobile-day';
      const h = document.createElement('h3');
      h.textContent = dayFmt.format(new Date(d + 'T00:00:00'));
      sec.appendChild(h);

      const list = (byDay.get(d) || []).slice().sort((a, b) => {
        const v = a.venuePretty.localeCompare(b.venuePretty);
        if (v !== 0) return v;
        return (a.time || '').localeCompare(b.time || '');
      });

      list.forEach((it) => {
        const row = document.createElement('div');
        row.className = 'mobile-item';

        const when = document.createElement('div');
        when.className = 'mobile-when';
        when.textContent = `${it.venuePretty} • ${hm(it.time)}`;

        const card = document.createElement('div');
        card.className = 'card';
        const c = colorFor(it.film);
        card.style.background = c.bg;
        card.style.borderColor = c.stroke;
        card.style.color = c.text;

        // --- title (MOBILE) with panel suffix (HTML)
        const title = document.createElement('a');
        title.className = 'title title-link';
        title.href = filmHref(it.film.id || it.id);

        const prefix = escapeHtml(localized(it.specialPrefix) || '');
        const filmTitle = escapeHtml(localized(it.film.title) || 'Untitled');
        const baseTitle = [prefix, filmTitle].filter(Boolean).join(': ');

        const suffixHTML = panelSuffixForScreeningHTML(
          it.film,
          it.date,
          it.venuePretty
        );
        title.innerHTML = baseTitle + suffixHTML + qandaSuffixHTML(it);
        title.setAttribute(
          'aria-label',
          (prefix ? prefix + ' ' : '') +
            (localized(it.film.title) || 'Untitled')
        );

        const meta = document.createElement('div');
        meta.className = 'meta';
        const cat = it.film.category ? localized(it.film.category) || '' : '';
        const dur =
          it.film.duration != null
            ? typeof it.film.duration === 'number'
              ? `${it.film.duration}′`
              : localized(it.film.duration)
            : '';
        meta.textContent = [cat, dur].filter(Boolean).join(' • ');

        const links = document.createElement('div');
        links.className = 'links';
        if (it.links.tickets) {
          const a = document.createElement('a');
          a.href = it.links.tickets;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = t('tickets');
          a.className = 'chip';
          links.appendChild(a);
        }
        if (it.links.maps) {
          const a = document.createElement('a');
          a.href = it.links.maps;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = t('maps');
          a.className = 'chip';
          links.appendChild(a);
        }
        if (it.links.venue) {
          const a = document.createElement('a');
          a.href = it.links.venue;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = t('cinema');
          a.className = 'chip';
          links.appendChild(a);
        }

        card.appendChild(title);
        if (meta.textContent) card.appendChild(meta);
        if (links.children.length) card.appendChild(links);

        row.appendChild(when);
        row.appendChild(card);
        sec.appendChild(row);
      });

      root.appendChild(sec);
    });

    container.innerHTML = '';
    container.appendChild(root);
    root.appendChild(buildLegend(entries)); // ⬅️ add this line
  }

  function render(el) {
    injectCSS();

    const jsonUrl = el.dataset.json;
    const outlet = document.createElement('div');
    el.appendChild(outlet);

    fetch(jsonUrl, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('load fail');
        return r.json();
      })
      .then((data) => {
        const films = data.slice().filter((f) => f.published === true);
        const entries = collectEntries(films);

        const isMobile = matchMedia('(max-width: 900px)').matches;
        if (isMobile) buildMobile(outlet, entries);
        else buildDesktop(outlet, entries);

        // re-render on resize threshold flips
        let lastIsMobile = isMobile;
        const mq = matchMedia('(max-width: 900px)');
        mq.addEventListener('change', (e) => {
          const now = e.matches;
          if (now === lastIsMobile) return;
          lastIsMobile = now;
          if (now) buildMobile(outlet, entries);
          else buildDesktop(outlet, entries);
        });
      })
      .catch((err) => {
        outlet.innerHTML = `<p style="padding:12px;color:#fff;opacity:.85">Program could not be loaded.</p>`;
        console.error('[UFFB schedule] JSON fetch error', err);
      });
  }

  // robust init
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
