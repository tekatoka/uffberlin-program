/* uffb-grid.bundle.js (multilingual) */
(function () {
  const MOUNT = '.uffb-program';

  const html = String.raw;
  const css = String.raw;

  // --- Language & i18n helpers ---
  const urlPath = location.pathname || '';
  const htmlLang = (document.documentElement.lang || '').toLowerCase();
  const lang = location.pathname.startsWith('/de/')
    ? 'de'
    : location.pathname.startsWith('/uk/')
      ? 'uk'
      : 'en';
  const basePath = lang === 'de' ? '/de/uffb2025' : '/uffb2025';
  const locale = lang === 'de' ? 'de-DE' : lang === 'uk' ? 'uk-UA' : 'en-GB';

  const I18N = {
    en: {
      filterBtn: 'Filter',
      searchBtn: 'Search',
      category: 'Category',
      director: 'Directed by',
      curator: 'Curated by',
      venue: 'Venue',
      date: 'Date',
      title: 'Film title',
      all: 'All',
      groupBy: 'Group by',
      none: 'None',
      clearFilters: 'Clear filters',
      searchPh: 'Search title, description…',
      watchTrailer: 'Watch trailer',
      tickets: 'Tickets',
      bookTicketsSoon: 'Tickets will be available soon via the cinema website',
      loadError: 'Program could not be loaded.',
      noDates: 'Screening dates to be updated soon',
      noResultsTitle: 'No films match your filters.',
      noResultsHint: 'Try changing or clearing the filters.',
      resetFiltersBtn: 'Reset filters',
      loading: 'Loading program',
      entry: 'Entry',
      by: 'by',
      soldOut: 'Sold out!',
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
      curator: 'Kuratiert von',
      venue: 'Spielort',
      date: 'Datum',
      title: 'Filmtitel',
      all: 'Alle',
      groupBy: 'Gruppierung',
      none: 'Keine',
      clearFilters: 'Filter zurücksetzen',
      searchPh: 'Suche nach Titel, Beschreibung…',
      watchTrailer: 'Trailer ansehen',
      tickets: 'Tickets',
      bookTicketsSoon:
        'Tickets sind in Kürze über die Website des Kinos erhältlich',
      loadError: 'Programm konnte nicht geladen werden.',
      noDates: 'Vorführtermine folgen in Kürze',
      noResultsTitle: 'Keine Filme entsprechen Ihren Filtern.',
      noResultsHint: 'Versuchen Sie, die Filter zu ändern oder zurückzusetzen.',
      resetFiltersBtn: 'Filter zurücksetzen',
      loading: 'Programm wird geladen',
      entry: 'Eintritt',
      by: 'von',
      soldOut: 'Ausverkauft',
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
    uk: {
      filterBtn: 'Фільтр',
      searchBtn: 'Пошук',
      category: 'Категорія',
      director: 'Режисер',
      curator: 'Куратор',
      venue: 'Майданчик',
      date: 'Дата',
      title: 'Назва фільму',
      all: 'Усі',
      groupBy: 'Групувати',
      none: 'Усі разом',
      clearFilters: 'Скинути фільтри',
      searchPh: 'Пошук за назвою…',
      watchTrailer: 'Дивитися трейлер',
      tickets: 'Квитки',
      bookTicketsSoon: 'Квитки незабаром будуть доступні на сайті кінотеатру',
      loadError: 'Не вдалося завантажити програму фестивалю.',
      noDates: 'Дати показів буде оновлено найближчим часом',
      noResultsTitle: 'Жоден фільм не відповідає фільтрам.',
      noResultsHint: 'Спробуйте змінити або скинути фільтри.',
      resetFiltersBtn: 'Скинути фільтри',
      loading: 'Завантажуємо програму',
      entry: 'Вхід',
      by: 'реж.',
      soldOut: 'Розпродано',
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

  // Put this right after I18N (or near your other constants)
  const PANEL_IMG_URL =
    'https://images.squarespace-cdn.com/content/v1/5f739670761e02764c54e1ca/1727124052218-9HAFIHE8THUC98V48K9K/Logo-600x600.jpg';

  const PANEL_TEXT = {
    en: {
      label: 'Panel discussions',
      labelSingle: 'Panel discussion',
      after: 'Panel discussion after the screening',
      moderator: 'Moderator',
      guests: 'Guests',
      tba: 'tba',
      inPartnershipWith: 'In partnership with',
    },
    de: {
      label: 'Podiumsdiskussionen',
      labelSingle: 'Podiumsdiskussion',
      after: 'Podiumsdiskussion im Anschluss an den Film',
      moderator: 'Moderation',
      guests: 'Gäste',
      tba: 'tba',
      inPartnershipWith: 'In Partnerschaft mit',
    },
    uk: {
      // optional, fallback to EN/DE otherwise
      label: 'Панельна дискусія',
      after: 'Дискусія після показу',
      moderator: 'Модератор',
      guests: 'Гості',
      tba: 'tba',
      inPartnershipWith: 'У співпраці з',
    },
  };

  // --- Existing CSS (unchanged) ---
  const CSS = css`
    .uffb-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;

      box-sizing: border-box !important;
      height: 100% !important;
      padding: 5% 5% 5% 5% !important;
      border-radius: 6px !important;
      background-color: #111111 !important;
      width: 100%;
      color: #fff;
    }

    .uffb-grid .uffb-card {
      background-color: #111;
    }

    @media (min-width: 700px) {
      .uffb-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 42px;
      }
    }
    @media (min-width: 1024px) {
      .uffb-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* add anywhere after your existing grid rules */
    .uffb-grid.two-cols {
      grid-template-columns: repeat(1, 1fr);
    }

    @media (min-width: 700px) {
      .uffb-grid.two-cols {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      /* override the default 3 columns on desktop */
      .uffb-grid.two-cols {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .uffb-card {
      display: flex;
      flex-direction: column;
      background: #000;
      border-radius: 0px;
      // box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
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
      padding: 25px 0;
    }
    .uffb-title {
      margin: 0;
      font-size: 1.5rem;
      line-height: 1.25;
    }
    .uffb-title a {
      color: var(--paragraphLinkColor, #0bb);
      text-decoration: none;
    }

    .uffb-title a:hover {
      text-decoration: underline !important;
    }

    .uffb-desc {
      color: #fff;
      opacity: 0.9;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 3.6em;
      font-size: 1rem;
      white-space: pre-line;
    }
    .uffb-warning {
      margin: -15px 0 15px;
      font-style: italic;
    }
    .uffb-actions {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      flex-wrap: wrap;
    }
    .uffb-screenings {
      color: #fff;
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
      font-size: 1rem;
    }
    .uffb-category {
      font-size: 0.9rem;
      color: var(--paragraphLinkColor, #0bb);
      padding: 10px 15px 0;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 0.4rem;
      font-weight: 600;
    }
    .uffb-when {
      font-weight: 700;
    }
    .uffb-venue {
      margin-top: 2px;
      font-weight: 600;
    }
    .uffb-address a {
      font-size: 0.92rem;
      text-decoration: none;
      color: var(--paragraphLinkColor, #0bb);
      font-size: 1rem;
    }

    .uffb-address a:hover {
      text-decoration: underline !important;
    }

    .uffb-tickets {
      margin-top: 15px;
    }

    .uffb-tickets a {
      color: var(--paragraphLinkColor);
      font-size: 1.1rem;
      font-weight: 600;
      padding: 10px;
      border: 1.5px solid;
      border-radius: 0px;
      text-transform: uppercase;
    }

    .uffb-no-tickets {
      margin-top: 10px;
      font-style: italic;
    }

    .uffb-tickets.is-disabled {
      pointer-events: none;
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Icon buttons */
    .uffb-icon-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
      background: transparent;
      color: #fff;
      cursor: pointer;
      padding: 0;
      line-height: 1; /* prevent tall line box */
    }
    .uffb-icon-btn svg {
      width: 26px;
      height: 26px;
      display: block; /* kill baseline gap */
    }

    .uffb-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
      margin: 15px 0;
    }

    /* Group-by block on the right */
    .uffb-groupby {
      margin-left: auto; /* push to the right */
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #fff;
    }
    .uffb-groupby .uffb-groupby-head {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-size: 0.9rem;
      opacity: 0.95;
    }
    .uffb-groupby .uffb-groupby-head svg {
      width: 26px;
      height: 26px;
      display: block;
    }

    .uffb-groupby .chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* Chip radios */
    .uffb-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0px;
      padding: 0.35rem 0.7rem;
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      padding: 0 10px;
    }
    .uffb-chip input {
      appearance: none;
      width: 0;
      height: 0;
      position: absolute;
      pointer-events: none;
    }
    .uffb-chip[data-checked='true'] {
      background: #fff;
      color: #000;
      border-color: #fff;
    }
    .uffb-chip:has(input:focus-visible) {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }

    /* On small screens: wrap under, left-aligned */
    @media (max-width: 699px) {
      .uffb-groupby {
        margin-left: 0;
        width: 100%;
        display: block;
        margin-top: 15px;
      }
    }

    .uffb-group-title {
      margin: 25px 0 !important;
    }

    /* PANELS (updated) */
    .uffb-filters,
    .uffb-search {
      display: grid;
      gap: 0.8rem;
      /* 30% / 30% / 30% / 10% via fr units */
      grid-template-columns: 3fr 3fr 3fr 1.5fr;
      align-items: end; /* bottoms line up nicely */
      border-radius: 0;
      margin: 0.5rem 0 1rem 0;
      backdrop-filter: saturate(120%) blur(4px);
    }

    .uffb-filters[hidden],
    .uffb-search[hidden] {
      display: none;
    }

    /* Make each grid item stack its label and input neatly */
    .uffb-filters label,
    .uffb-filter-actions {
      /* <-- fixed class name */
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 0; /* prevents overflow in tight spaces */
    }

    /* Make the button fill the 10% column */
    #clearFilters {
      width: 100%;
    }

    /* Optional: keep it usable on small screens by allowing wrap */
    @media (max-width: 899px) {
      .uffb-filters {
        grid-template-columns: repeat(1, 1fr);
      }
    }

    :root {
      --uffb-control-h: 42px;
    }

    /* put this near your filters CSS */
    .uffb-filters label {
      position: relative; /* anchor for the clear button */
    }

    /* the tiny clear (×) button */
    .uffb-clear {
      position: absolute;
      right: 8px;
      bottom: 8px; /* aligns within 42px-high control */
      width: 24px;
      height: 24px;
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.16);
      color: #111;
      font-size: 16px;
      line-height: 1;
      display: none; /* shown only when select has value */
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .uffb-clear:hover {
      background: rgba(255, 255, 255, 0.28);
    }

    /* when the select is non-empty, show its clear button */
    .uffb-filters label.is-filled .uffb-clear {
      display: inline-flex;
    }

    /* give selects a bit of right padding so the × doesn’t overlap text */
    .uffb-field.has-clear {
      padding-right: 2rem;
    }

    /* fields */
    .uffb-field {
      height: var(--uffb-control-h);
      padding: 0 0.75rem;
      box-sizing: border-box;
      font: inherit;
    }

    .uffb-search {
      display: grid;
      gap: 0.8rem;
      grid-template-columns: 3fr; /* same unit as filters' columns */
      width: 28.65%; /* ≈ width of one filter dropdown */
      margin: 0.5rem 0 1rem 0;
    }

    .uffb-search input {
      margin-right: 0.75rem;
    }

    /* Keep it nice on small screens */
    @media (max-width: 899px) {
      .uffb-search {
        width: 100%;
        grid-template-columns: 1fr;
      }

      .uffb-search input {
        margin-right: 0;
      }
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
      color: #fff;
      font-size: 1.25rem;
    }
    .uffb-meta1 {
      font-size: 1rem;
    }
    .uffb-meta1 em {
      font-style: normal;
      font-weight: 600;
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
      border-radius: 0px;
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

    /* --- LIST LAYOUT (row cards) --- */
    .uffb-groups,
    .uffb-list {
      display: flex;
      flex-direction: column;
      gap: 64px;
    }

    .uffb-row {
      display: grid;
      grid-template-columns: min(38vw, 420px) 1fr;
      gap: 24px;
      background: transparent;
      border-radius: 0px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    @media (max-width: 900px) {
      .uffb-row {
        grid-template-columns: 1fr;
      }
      .uffb-row .uffb-body,
      .uffb-row .uffb-category {
        padding: 0 !important;
      }
    }

    .uffb-row .uffb-media {
      aspect-ratio: 16/9;
      background: #f2f2f2;
    }
    .uffb-row .uffb-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.35s ease;
    }
    .uffb-row:hover .uffb-media img {
      transform: scale(1.03);
    }

    .uffb-row .uffb-category {
      padding: 0 24px;
      opacity: 0.65;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .uffb-row .uffb-body {
      padding: 12px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .uffb-row .uffb-title {
      font-size: 2rem;
      line-height: 1.2;
      margin: 2px 0 0;
    }
    .uffb-row .uffb-desc {
      opacity: 0.9;
      -webkit-line-clamp: 5;
      min-height: auto;
      font-size: 1.1rem;
    }
    .uffb-row .uffb-actions {
      margin-top: 6px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .uffb-row .uffb-screenings {
      margin-top: 15px;
    }

    .uffb-row .uffb-body,
    .uffb-row .uffb-category,
    .uffb-row .uffb-desc,
    .uffb-row .uffb-meta,
    .uffb-row .uffb-screening .uffb-left {
      color: #fff;
    }

    /* Links in rows stay brand-colored (you already have this) */
    .uffb-row a {
      color: var(--paragraphLinkColor);
    }

    /* LIST VIEW: stack screenings, tweak spacing */
    .uffb-list .uffb-screenings {
      display: flex; /* no grid here */
      flex-direction: column; /* one under another */
      gap: 36px; /* MORE space between screenings */
    }

    .uffb-list .uffb-screening {
      display: flex; /* stack left + tickets vertically */
      flex-direction: column;
      gap: 4px; /* LESS space between venue/address and Tickets */
    }

    /* optional: make the Tickets button sit tight under the address */
    .uffb-list .uffb-screening .uffb-tickets {
      margin-top: 2px;
    }
    .uffb-list .uffb-screening .uffb-tickets a {
      display: inline-block;
      padding: 10px 14px; /* a bit tighter button in this compact list */
    }

    /* keep inner text spacing tidy (doesn't affect grid view) */
    .uffb-list .uffb-venue {
      margin-top: 2px;
      font-weight: 600;
    }
    .uffb-list .uffb-address a {
      margin-top: 0;
    }

    /* ---------- Universal interaction polish for buttons/links ---------- */

    /* what counts as a "button" in your UI */
    .uffb-btn,
    .uffb-tickets a,
    .uffb-icon-btn,
    .uffb-chip {
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.06s ease;
    }

    /* Base tokens (optional) */
    :root {
      --btn-anim: 0.18s;
    }

    /* Generic festival button */
    .uffb-btn {
      --btn-fg: #111; /* the color to invert to */
      color: var(--btn-fg);
      display: inline-block;
      padding: 18px;
      border: 1.5px solid currentColor;
      border-radius: 0px;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: #fff;
      transition:
        background-color var(--btn-anim) ease,
        color var(--btn-anim) ease,
        border-color var(--btn-anim) ease,
        transform 0.06s ease;
    }
    .uffb-btn:hover {
      background: var(--btn-fg); /* uses stored color, not currentColor */
      color: #fff;
      border-color: #fff;
    }

    /* Tickets link styled as button */
    .uffb-tickets a {
      --btn-fg: var(--paragraphLinkColor, #0bb);
      color: var(--btn-fg);
      background: transparent;
      border: 1.5px solid var(--btn-fg);
      transition:
        background-color var(--btn-anim) ease,
        color var(--btn-anim) ease,
        border-color var(--btn-anim) ease,
        transform 0.06s ease;
    }
    .uffb-tickets a:hover {
      background: var(--btn-fg);
      color: #000;
      border-color: var(--btn-fg);
    }

    /* Tiny press feedback */
    .uffb-btn:active,
    .uffb-tickets a:active {
      transform: translateY(1px);
    }
    /* --- Chip interaction (independent from buttons) --- */
    .uffb-chip {
      --chip-fg: #fff; /* base text/border color on dark bg */
      color: var(--chip-fg);
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.5);
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.06s ease;
    }
    .uffb-chip:hover {
      background: rgba(255, 255, 255, 0.16); /* visible hover */
      border-color: #fff;
    }
    .uffb-chip:active {
      transform: translateY(1px);
    }

    /* Selected chip: invert to white pill, dark text */
    .uffb-chip[data-checked='true'] {
      --chip-fg: #000;
      background: #fff;
      color: #000;
      border-color: #fff;
      box-shadow: 0 0 0 2px #fff inset; /* subtle emphasis */
    }
    .uffb-chip[data-checked='true']:hover {
      background: #f6f6f6;
    }

    /* Focus ring (keyboard) */
    .uffb-chip:has(input:focus-visible) {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
    /* Put all filter cells on the same baseline row */
    .uffb-filters {
      align-items: end;
    }

    /* Make the Clear button align with the bottom of inputs */
    .uffb-filter-actions {
      align-self: end;
    }

    /* Chip-like Clear button, same height as inputs */
    .uffb-chip-btn {
      /* match .uffb-field vertical rhythm */
      padding: 0.55rem 0.8rem; /* same Y padding as .uffb-field */
      border-radius: 0px; /* same radius as inputs */
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      height: 42px;
    }

    /* small icon before label */
    .uffb-chip-btn .chip-icon {
      display: inline-block;
      font-weight: 700;
      line-height: 0;
      opacity: 0.8;
      transform: translateY(-0.5px);
    }

    /* hover/active (reuses your chip interaction feel) */
    .uffb-chip-btn:hover {
      background: rgba(255, 255, 255, 0.16);
      border-color: #fff;
    }
    .uffb-chip-btn:active {
      transform: translateY(1px);
    }

    /* optional: full “selected” look if you ever toggle it */
    .uffb-chip-btn[aria-pressed='true'] {
      background: #fff;
      color: #000;
      border-color: #fff;
    }

    .uffb-empty {
      padding: 28px;
      border: 1px dashed rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.04);
      border-radius: 0;
      color: #fff;
    }
    .uffb-empty h4 {
      margin: 0 0 6px;
      font-size: 1.25rem;
    }
    .uffb-empty p {
      margin: 0 0 14px;
      opacity: 0.9;
    }
    .uffb-empty .uffb-empty-actions {
      margin-top: 8px;
    }

    .uffb-shorts {
      margin: 8px 0 0;
      padding-left: 1.25rem; /* ordered list indent */
      color: #fff;
      font-size: 1.05rem;
      line-height: 1.4;
    }

    .uffb-row .uffb-shorts {
      color: #fff; /* row layout is on dark bg */
    }

    .uffb-shorts li {
      list-style: circle;
      font-size: 1rem;
    }

    .uffb-shorts li + li {
      margin-top: 6px;
    }
    /* Loader */
    .uffb-loader {
      display: none;
      width: 100%;
      align-items: center;
      justify-content: center; /* ⬅️ center horizontally */
      gap: 10px;
      padding: 24px 0;
      color: #fff;
    }
    .uffb-loader.is-active {
      display: flex;
    }

    .uffb-outlet {
      min-height: 140px;
    }

    .uffb-loader .dot {
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: #f0e53c; /* your yellow */
      animation: uffb-pulse 1.1s infinite; /* subtle pulse */
      box-shadow: 0 0 0 0 rgba(240, 229, 60, 0.8);
    }

    @keyframes uffb-pulse {
      0% {
        transform: scale(0.88);
        box-shadow: 0 0 0 0 rgba(240, 229, 60, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(240, 229, 60, 0);
      }
      100% {
        transform: scale(0.88);
        box-shadow: 0 0 0 0 rgba(240, 229, 60, 0);
      }
    }
    /* partners block */
    .uffb-panel-extra {
      margin: 14px 0 12px;
    }
    .uffb-panel-extra .uffb-partner-head {
      font-weight: 600;
      margin-bottom: 6px;
    }
    .uffb-panel-extra a {
      color: var(--paragraphLinkColor);
      text-decoration: none;
      font-weight: 700;
    }
    .uffb-panel-extra a:hover {
      text-decoration: underline !important;
    }
    .party-entry {
      font-weight: 600;
      margin-top: 6px;
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
  function embedUrl(url) {
    try {
      const u = new URL(url);

      // --- YouTube -> privacy embed
      if (
        (u.hostname.includes('youtube.com') && u.searchParams.get('v')) ||
        u.hostname.includes('youtu.be')
      ) {
        const id = u.hostname.includes('youtu.be')
          ? u.pathname.slice(1)
          : u.searchParams.get('v');
        const p = new URLSearchParams({
          rel: '0',
          autoplay: '1',
          modestbranding: '1',
        });
        return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
      }

      // --- Vimeo -> player embed
      if (u.hostname.includes('player.vimeo.com')) {
        // already a player URL – just ensure flags
        u.searchParams.set('autoplay', '1');
        u.searchParams.set('title', '0');
        u.searchParams.set('byline', '0');
        u.searchParams.set('portrait', '0');
        u.searchParams.set('dnt', '1');
        return u.toString();
      }
      if (u.hostname.includes('vimeo.com')) {
        // Accepts forms like:
        //  - vimeo.com/123456789
        //  - vimeo.com/123456789/abcdef   (old private hash)
        //  - vimeo.com/ondemand/.../123456789
        //  - vimeo.com/channels/.../123456789
        const segs = u.pathname.split('/').filter(Boolean);
        const id = segs.find((s) => /^\d+$/.test(s));
        // hash can be in ?h= or as next path segment after the id
        const pathIdx = segs.findIndex((s) => s === id);
        const pathHash =
          pathIdx >= 0 && segs[pathIdx + 1] && !/^\d+$/.test(segs[pathIdx + 1])
            ? segs[pathIdx + 1]
            : '';
        const h = u.searchParams.get('h') || pathHash || '';
        const qs = new URLSearchParams({
          autoplay: '1',
          title: '0',
          byline: '0',
          portrait: '0',
          dnt: '1',
        });
        if (h) qs.set('h', h);
        if (id) return `https://player.vimeo.com/video/${id}?${qs.toString()}`;
      }

      return url; // fallback unchanged
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
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <path d="M4 6h16M7 12h10M10 18h4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>
    </svg>`,
    search: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <circle cx="11" cy="11" r="7"/><path d="M20 20l-4.35-4.35" stroke-linecap="round"/>
    </svg>`,
    group: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <path d="M4 5h16M4 12h10M4 19h6" stroke-linecap="round"/>
    </svg>`,
  };

  // --- Film Focus merge helpers ---
  const MERGED_FOCUS_KEYS = new Set(['film_focus', 'film_fokus']);
  const mergedFocusLabel = () => (lang === 'de' ? 'Film Fokus' : 'Film Focus');

  // For grouping purposes only (not filtering)
  // Returns { key, label } where both film_focus & film_fokus collapse into one group
  function getGroupingKeyAndLabel(film) {
    const rawKey =
      (film.category && film.category.key) ||
      safeTxt(
        film.category?.[lang] ||
          film.category?.de ||
          film.category?.en ||
          film.category?.uk ||
          ''
      );

    const rawLabel =
      (film.category &&
        (film.category[lang] ||
          film.category.de ||
          film.category.en ||
          film.category.uk)) ||
      '';

    if (MERGED_FOCUS_KEYS.has(rawKey)) {
      return { key: 'film_focus_all', label: mergedFocusLabel() };
    }
    return { key: rawKey || '', label: rawLabel || '' };
  }

  // --- Rendering pieces (localized) ---
  const safeTxt = (x) => (x == null ? '' : String(x).trim().toLowerCase());
  const earliestDate = (film) => {
    const ds = (film.screenings || [])
      .map((s) => s.date)
      .filter(Boolean)
      .sort();
    return ds[0] || '9999-12-31';
  };
  const getVenueName = (s) =>
    (
      s.venue?.[lang] ||
      s.venue?.de ||
      s.venue?.en ||
      s.venue?.uk ||
      s.venue ||
      ''
    ).toString();
  const isoToLabel = (iso) => I18N[lang].isoDateLabel(iso);

  function localized(v) {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    // object with languages
    return v[lang] || v.de || v.en || v.uk || '';
  }

  function joinVals(v) {
    var val = localized(v);
    if (Array.isArray(val)) {
      return val.map(localized).filter(Boolean).join(', ');
    }
    return val;
  }

  // Priority: 0 = main, 1 = shorts-competition, 2 = others
  const CATEGORY_ORDER = [
    'main',
    'uffb_shorts',
    'special',
    'film_focus',
    'ukraine-known-unknown',
    'retrospective',
    'panel_discussion',
  ];

  function categoryRank(key, label) {
    // normalize merged focus
    if (key === 'film_focus_all' || key === 'film_fokus') key = 'film_focus';

    const k = (key || '').toLowerCase();
    const l = (label || '').toLowerCase();

    const idx = CATEGORY_ORDER.indexOf(k);
    if (idx !== -1) return idx;

    if (l.includes('main')) return 0;
    if (/(short|kurz).*?(comp|wettbewerb)/.test(l)) return 1;

    return CATEGORY_ORDER.length;
  }

  function getCategoryKeyAndLabel(film) {
    const key =
      (film.category &&
        (film.category.key ||
          safeTxt(
            film.category[lang] ||
              film.category.de ||
              film.category.en ||
              film.category.uk ||
              ''
          ))) ||
      '';
    const label =
      (film.category &&
        (film.category[lang] ||
          film.category.de ||
          film.category.en ||
          film.category.uk)) ||
      '';
    return { key, label };
  }

  // Build a map: ISO date -> array of { film, date }
  function explodeByDate(list, onlyDate = null) {
    const map = new Map();
    list.forEach((f) => {
      (f.screenings || []).forEach((s) => {
        if (!s.date) return;
        if (onlyDate && s.date !== onlyDate) return; // ⬅️ NEW: keep only selected date
        if (!map.has(s.date)) map.set(s.date, []);
        map.get(s.date).push({ film: f, date: s.date });
      });
    });
    // sort each list by earliest film date, then title
    map.forEach((arr) =>
      arr.sort((a, b) => {
        const d = earliestDate(a.film).localeCompare(earliestDate(b.film));
        if (d !== 0) return d;
        const at = localized(a.film.title) || '';
        const bt = localized(b.film.title) || '';
        return at.localeCompare(bt);
      })
    );
    return map;
  }

  function renderLineupList(item) {
    if (!Array.isArray(item.lineup) || item.lineup.length === 0) return '';
    const li = item.lineup
      .map((x) => `<li>${escapeHtml(String(x))}</li>`)
      .join('');
    // Reuse your existing .uffb-shorts styling (same look as shorts list)
    return html`<ol class="uffb-shorts">
        ${li}
      </ol>`;
  }

  function renderEntry(item) {
    return isParty(item) && item.entry
      ? `<div class="party-entry"><strong>${t('entry')}: ${escapeHtml(localized(item.entry))}</strong></div>`
      : '';
  }

  function toShortDirectorList(director, localizedFn) {
    if (!director) return [];
    const val = typeof director === 'object' ? localizedFn(director) : director;
    return Array.isArray(val) ? val.filter(Boolean) : val ? [val] : [];
  }

  function renderShortsList(item) {
    const list = Array.isArray(item.films) ? item.films : null;
    if (!list || !list.length) return '';

    const desc =
      item.description?.[lang] ||
      item.description?.de ||
      item.description?.en ||
      item.description?.uk ||
      '';

    const li = list
      .map((sf) => {
        const title = localized(sf.title) || ''; // supports {en,de,uk} or string
        const directorList = toShortDirectorList(sf.director, localized);
        const directorLine = directorList.join(', ');
        const dir = sf.director
          ? ` ${t('by')} ${escapeHtml(directorLine)}`
          : '';
        let dur = '';
        if (sf.duration != null) {
          const d =
            typeof sf.duration === 'number'
              ? `${sf.duration}’`
              : localized(sf.duration);
          dur = d ? ` | ${escapeHtml(d)}` : '';
        }
        return `<li><strong>${escapeHtml(title?.replace('• ', ''))}</strong>${dir}${dur}</li>`;
      })
      .join('');

    return html`
      <ol class="uffb-shorts">
        ${li}
      </ol>
  `;
  }

  const isParty = (it) =>
    it?.category?.key === 'festival-party' || it?.id === 'festival-party';

  function screeningLine(s, film) {
    const dtISO = `${s.date}T${s.time || '00:00'}:00${offsetFor()}`;
    const d = new Date(dtISO);
    const when = `${fmt.format(d)}${s.time ? `, ${s.time}` : ''}`;

    const perDateNotes = parsePerDateLanguageNotes(film);

    const noteKey = dateToDM(s.date);
    const langNote = perDateNotes[noteKey] || '';

    const noteHtml = `<div class="uffb-lang-note"><em>${langNote ? langNote : localized(film.language)}</em></div>`;

    const venueName = getVenueName(s);
    const addressTxt =
      typeof s.address === 'string'
        ? s.address
        : s.address?.[lang] || s.address?.de || s.address?.en || '';
    const website = s.website || '';
    const isSoldOut = s.isSoldOut;

    let mapsUrl = s.maps?.google || '';
    if (!mapsUrl && (venueName || addressTxt)) {
      const q = [venueName, addressTxt].filter(Boolean).join(', ');
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        q
      )}`;
    }

    const venueLine = venueName
      ? `<div class="uffb-venue"><a href="${website}" target="_blank">${escapeHtml(venueName)}</a></div>`
      : '';
    const addressLine = addressTxt
      ? `<div class="uffb-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${escapeHtml(
          addressTxt
        )}</a></div>`
      : '';

    const ticketHtml = s.isSoldOut
      ? `<span class="uffb-tickets is-disabled"><a href='#'>${t('soldOut')}</a></span>`
      : s.tickets
        ? `<span class="uffb-tickets"><a href="${s.tickets}" target="_blank" rel="noopener">${t('tickets')}</a></span>`
        : ``;

    const rightSideHtml = isParty(film) ? '' : ticketHtml;

    return html`
      <li class="uffb-screening">
        <div class="uffb-left">
          <div class="uffb-when"><strong>${when}</strong></div>
          ${venueLine} ${addressLine} ${noteHtml}
          ${!ticketHtml && !isParty(film)
            ? `<div class="uffb-no-tickets">${t('bookTicketsSoon')}</div>`
            : ''}
        </div>
        ${rightSideHtml}
      </li>
    `;
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }
  function dateToDM(iso) {
    const d = new Date(iso + 'T00:00:00');
    return pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  /** Build map like { "10-24": "German dubbed version with English subtitles", ... } */
  function parsePerDateLanguageNotes(film) {
    const raw =
      (film.language &&
        (film.language[lang] || film.language.en || film.language.de)) ||
      film.language;
    if (!raw || typeof raw !== 'string') return {};

    // Split by pipes and newlines; trim pieces
    const parts = raw
      .split('|')
      .flatMap((p) => String(p).split('\n'))
      .map((s) => s.trim())
      .filter(Boolean);
    const map = {};
    const re = /^\s*(\d{1,2})\.(\d{1,2})\.?\s*:?\s*(.+?)\s*$/; // dd.mm.: note
    for (const p of parts) {
      const m = p.match(re);
      if (!m) continue;
      const dd = pad2(m[1]),
        mm = pad2(m[2]);
      const note = m[3]; // already without date/colon
      map[mm + '-' + dd] = note;
    }
    return map;
  }

  function extractPanelTitle(descByLang) {
    // Return title text that follows "Panel discussion" / "Podiumsdiskussion",
    // without surrounding quotation marks.
    const OPEN_CLOSE_PAIRS = [
      { open: '“', close: '”' },
      { open: '„', close: '“' },
      { open: '«', close: '»' },
      { open: '‚', close: '’' },
      { open: '‘', close: '’' },
      { open: '"', close: '"' }, // ASCII fallback
    ];

    // for extra safety: strip any quotes that might remain at the ends
    const STRIP_EDGE_QUOTES_RE = /^[“”„«»‚‘’"]+|[“”„«»‚‘’"]+$/g;

    function findAfterKeyword(text) {
      if (!text) return '';
      const m = text.match(/(panel\s*discussion|podiumsdiskussion)/i);
      if (!m) return '';

      // Start searching quotes *after* the keyword
      const startIdx = m.index + m[0].length;
      const tail = text.slice(startIdx);

      // Look for first matching quote pair in the tail
      for (const { open, close } of OPEN_CLOSE_PAIRS) {
        const o = tail.indexOf(open);
        if (o === -1) continue;
        const c = tail.indexOf(close, o + open.length);
        if (c === -1) continue;

        // Return the INNER content (no quotes)
        const inner = tail.slice(o + open.length, c).trim();
        return inner.replace(STRIP_EDGE_QUOTES_RE, '').trim();
      }

      // No quote pair found → nothing to extract
      return '';
    }

    const enSrc = (descByLang?.en || descByLang?.de || '').trim();
    const deSrc = (descByLang?.de || descByLang?.en || '').trim();

    return {
      en: findAfterKeyword(enSrc),
      de: findAfterKeyword(deSrc),
    };
  }

  function cloneScreeningForPanel(s) {
    return {
      date: s.date,
      time: s.time || '',
      venue: s.venue,
      address: s.address,
      website: s.website,
      maps: s.maps,
      tickets: s.tickets || '', // ⬅️ keep parent ticket link when used
    };
  }

  function hasAny(obj, keys) {
    return !!obj && keys.some((k) => obj[k] != null && obj[k] !== '');
  }

  /**
   * Decide which screenings a panel should use:
   * 1) If panel_discussion.screenings[] exists → use those (one card per panel screening).
   * 2) Else if panel_discussion has any of date/time/venue/address/website/maps/tickets
   *    → build a single screening from those, falling back to the FIRST film screening for any missing field.
   * 3) Else → one panel per parent film screening (inherit ALL fields incl. tickets).
   */
  function resolvePanelScreenings(film) {
    const pd = film.panel_discussion || {};
    const parentList = Array.isArray(film.screenings) ? film.screenings : [];
    const firstParent = parentList[0] || {};

    // Case 1: explicit array of panel screenings
    if (Array.isArray(pd.screenings) && pd.screenings.length > 0) {
      return pd.screenings.map((ps) => ({
        date: ps.date || firstParent.date || '',
        time: (ps.time ?? firstParent.time) || '',
        venue: ps.venue || firstParent.venue,
        address: ps.address || firstParent.address,
        website: ps.website || firstParent.website,
        maps: ps.maps || firstParent.maps,
        tickets: ps.tickets || firstParent.tickets || '',
      }));
    }

    // Case 2: single panel fields provided on the object
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
          date: pd.date || firstParent.date || '',
          time: (pd.time ?? firstParent.time) || '',
          venue: pd.venue || firstParent.venue,
          address: pd.address || firstParent.address,
          website: pd.website || firstParent.website,
          maps: pd.maps || firstParent.maps,
          tickets: pd.tickets || firstParent.tickets || '',
        },
      ];
    }

    // Case 3: mirror every parent screening (inherit tickets too)
    return parentList.map((s) => cloneScreeningForPanel(s));
  }

  function buildModAndGuestsFromParticipants(pd) {
    const list = Array.isArray(pd?.participants) ? pd.participants : [];

    const fmt = (p) => {
      const name = (p?.name || '').trim();
      const roleTxt = p?.role
        ? (typeof p.role === 'object'
            ? localized(p.role)
            : String(p.role)
          ).trim()
        : '';
      if (!name) return '';
      const nameHtml = `<strong>${escapeHtml(name)}</strong>`;
      const roleHtml = roleTxt ? ` (${escapeHtml(roleTxt)})` : '';
      return `${nameHtml}${roleHtml}`;
    };

    const moderators = list
      .filter((p) => p.isModerator)
      .map(fmt)
      .filter(Boolean)
      .join(', ');
    const guests = list
      .filter((p) => !p.isModerator)
      .map(fmt)
      .filter(Boolean)
      .join(', ');

    return { moderators, guests };
  }

  /**
   * For every film with panel_discussion, create a separate “panel” item per screening.
   * - title: taken from description after "Nach dem Film:" / "After the screening:"
   * - description: "Panel discussion after the screening {FilmTitle}. Moderator: … Guests: …"
   * - date/time/venue: from the parent screening
   * - image: PANEL_IMG_URL (grid/row only)
   * - category: key 'panel_discussion' with localized labels
   */
  function makePanelItemsFromFilm(film) {
    const pd = film.panel_discussion;
    if (!pd) return [];

    const { en: pTitleEn, de: pTitleDe } = extractPanelTitle(
      pd.description || {}
    );
    const filmTitleEn =
      film.title?.en || film.title?.de || film.title?.uk || '';
    const filmTitleDe =
      film.title?.de || film.title?.en || film.title?.uk || filmTitleEn;

    // const mod = pd.moderation || '';
    // const guests = pd.guests || '';
    const txt = PANEL_TEXT[lang] || PANEL_TEXT.en;

    const panel_extra_html = buildPartnersHtml(film);

    const { moderators: mod, guests: guests } =
      buildModAndGuestsFromParticipants(pd);
    // Decide which screenings (and tickets) to use for this panel:
    const panelScreenings = resolvePanelScreenings(film);

    return panelScreenings.map((s, idx) => {
      const timePart = s.time ? '-' + String(s.time).replace(':', '') : '';
      const id = `${pd.id}`;

      const short_description = {
        en: `${PANEL_TEXT.en.after} “${filmTitleEn}”.\n${PANEL_TEXT.en.moderator}: ${mod || PANEL_TEXT.en.tba}.\n${PANEL_TEXT.en.guests}: ${guests || PANEL_TEXT.en.tba}.`,
        de: `${PANEL_TEXT.de.after} „${filmTitleDe}“.\n${PANEL_TEXT.de.moderator}: ${mod || PANEL_TEXT.de.tba}.\n${PANEL_TEXT.de.guests}: ${guests || PANEL_TEXT.de.tba}.`,
        uk: `${PANEL_TEXT.uk?.after || PANEL_TEXT.en.after} “${film.title?.uk || filmTitleEn}”.\n${PANEL_TEXT.uk?.moderator || PANEL_TEXT.en.moderator}: ${mod || PANEL_TEXT.uk?.tba || PANEL_TEXT.en.tba}.\n${PANEL_TEXT.uk?.guests || PANEL_TEXT.en.guests}: ${guests || PANEL_TEXT.uk?.tba || PANEL_TEXT.en.tba}.`,
      };

      const title = {
        en: pTitleEn || PANEL_TEXT.en.label + ` – ${filmTitleEn}`,
        de: pTitleDe || PANEL_TEXT.de.label + ` – ${filmTitleDe}`,
        uk:
          (PANEL_TEXT.uk?.label || PANEL_TEXT.en.label) +
          ` – ${film.title?.uk || filmTitleEn}`,
      };

      return {
        id,
        panel_discussion: pd,
        related_film_id: film.id,

        title,
        short_description,
        image: PANEL_IMG_URL,
        category: {
          key: 'panel_discussion',
          en: PANEL_TEXT.en.label,
          de: PANEL_TEXT.de.label,
          uk: PANEL_TEXT.uk?.label || PANEL_TEXT.en.label,
        },
        screenings: [
          {
            date: s.date,
            time: s.time || '',
            venue: s.venue,
            address: s.address,
            website: s.website,
            maps: s.maps,
            tickets: s.tickets || '', // ⬅️ now shown when present (panel- or parent-provided)
          },
        ],
        panel_extra_html,
        published: true,
      };
    });
  }

  function buildPartnersHtml(film) {
    const partners = Array.isArray(film.partners) ? film.partners : [];
    if (!partners.length) return '';
    const txt = PANEL_TEXT[lang] || PANEL_TEXT.en;

    const items = partners
      .map((p) => {
        const name = p && p.name ? String(p.name).trim() : '';
        if (!name) return '';
        if (p.url) {
          return html`<strong
              ><a href="${p.url}" target="_blank" rel="noopener"
                >${escapeHtml(name)}</a
              ></strong
            >`;
        }
        return html`<strong>${escapeHtml(name)}</strong>`;
      })
      .filter(Boolean)
      .join(', ');

    if (!items) return '';
    return html`
    <div class="uffb-panel-extra">
        <div class="uffb-partner-head">
          <strong>${escapeHtml(txt.inPartnershipWith)}:</strong>
          <span class="uffb-partners">${items}</span>
        </div>
      </div>
  `;
  }

  function card(it, opts = {}) {
    const href = `${basePath}/${encodeURIComponent(it.id)}`; // localized film page
    const title =
      it.title?.[lang] ||
      it.title?.de ||
      it.title?.en ||
      it.title?.uk ||
      'Untitled';
    const category =
      it.category?.[lang] ||
      it.category?.de ||
      it.category?.en ||
      it.category?.uk ||
      '—';
    const desc =
      it.short_description?.[lang] ||
      it.short_description?.de ||
      it.short_description?.en ||
      it.short_description?.uk ||
      '';
    const img = it.image || '';
    const trailer = it.trailer;

    const onlyDate = opts.onlyDate || null;
    const onlyVenue = opts.onlyVenue || null;

    const additional_info = it.additional_info
      ? localized(it.additional_info)
      : '';

    const specificTag =
      (it.category &&
        (it.category[lang] ||
          it.category.de ||
          it.category.en ||
          it.category.uk)) ||
      '';

    const screeningsList = (it.screenings || []).filter((s) => {
      if (onlyDate && s.date !== onlyDate) return false;
      if (onlyVenue && safeTxt(getVenueName(s)) !== onlyVenue) return false;
      return true;
    });
    const screenings = screeningsList.map((s) => screeningLine(s, it)).join('');

    // --- NEW: meta values ---
    const genreTxt = joinVals(it.genre); // supports "Drama" or {en:"Drama",de:"Drama"} or ["Drama","War"]
    const countriesTxt = joinVals(it.countries); // supports "Ukraine, Germany" or ["Ukraine","Germany"] or i18n objects
    const yearTxt = it.year ? String(it.year) : '';
    const directorTxt = joinVals(it.director); // supports string or i18n object
    const curatorTxt = joinVals(it.curator); // supports string or i18n object
    let durationTxt = it.duration != null ? it.duration : ''; // number (min) or string
    if (typeof durationTxt === 'number') durationTxt = `${durationTxt}'`;
    else durationTxt = localized(durationTxt);

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
        ${curatorTxt
          ? `<div class="uffb-meta2" style="margin-top: 10px">${t('curator')}: ${escapeHtml(
              curatorTxt
            )}</div>`
          : ''}
        ${durationTxt
          ? `<div class="uffb-meta3">${escapeHtml(durationTxt)}</div>`
          : ''}
      </div>
  `;

    return html`<article class="uffb-card" data-id="${it.id}">
        <div class="uffb-category">#${escapeHtml(specificTag)}</div>
        <a class="uffb-media" href="${href}" aria-label="${escapeHtml(title)}"
          ><img src="${img}" alt="${escapeHtml(title)}"
        /></a>
        <div class="uffb-body">
          <h3 class="uffb-title"><a href="${href}">${escapeHtml(title)}</a></h3>
          ${metaBlock}
          ${desc?.trim() ? html`<div class="uffb-desc">${desc}</div>` : ''}
          ${additional_info
            ? `<div class="uffb-warning">${additional_info}</div>`
            : ''}
          ${renderLineupList(it)} ${renderEntry(it)}
          ${it.category?.key === 'panel_discussion' && it.panel_extra_html
            ? it.panel_extra_html // trusted snippet we just built (includes link + bold)
            : ''}
          ${renderShortsList(it)}
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

  function filmCard(it, opts = {}) {
    const variant = opts.variant || 'grid'; //grid or row
    const onlyDate = opts.onlyDate || null;
    const onlyVenue = opts.onlyVenue || null;

    const href = `${basePath}/${encodeURIComponent(it.id)}`;
    const title =
      it.title?.[lang] ||
      it.title?.de ||
      it.title?.en ||
      it.title?.uk ||
      'Untitled';
    const category =
      it.category?.[lang] ||
      it.category?.de ||
      it.category?.en ||
      it.category?.uk ||
      '—';
    const desc =
      it.short_description?.[lang] ||
      it.short_description?.de ||
      it.short_description?.en ||
      it.short_description?.uk ||
      '';
    const img = it.image || '';
    const trailer = it.trailer;

    // meta (same as your card)
    const genreTxt = joinVals(it.genre);
    const countriesTxt = joinVals(it.countries);
    const yearTxt = it.year ? String(it.year) : '';
    const directorTxt = joinVals(it.director);
    let durationTxt = it.duration != null ? it.duration : '';
    if (typeof durationTxt === 'number') durationTxt = `${durationTxt}'`;
    else durationTxt = localized(durationTxt);

    const metaBlock = `
    <div class="uffb-meta">
      ${genreTxt ? `<div class="uffb-meta1"><em>${escapeHtml(genreTxt)}</em></div>` : ''}
      ${
        [countriesTxt, yearTxt].filter(Boolean).length
          ? `<div class="uffb-meta1"><em>${escapeHtml([countriesTxt, yearTxt].filter(Boolean).join(' | '))}</em></div>`
          : ''
      }
      ${directorTxt ? `<div class="uffb-meta2" style="margin-top:10px">${t('director')}: ${escapeHtml(directorTxt)}</div>` : ''}
      ${durationTxt ? `<div class="uffb-meta3">${escapeHtml(durationTxt)}</div>` : ''}
    </div>`;

    const screeningsList = (it.screenings || []).filter((s) => {
      if (onlyDate && s.date !== onlyDate) return false;
      if (onlyVenue && safeTxt(getVenueName(s)) !== onlyVenue) return false;
      return true;
    });
    const screenings = screeningsList.map((s) => screeningLine(s, it)).join('');

    if (variant === 'row') {
      return html`
      <article class="uffb-row" data-id="${it.id}">
          <a
            class="uffb-media"
            href="${href}"
            aria-label="${escapeHtml(title)}"
          >
            <img src="${img}" alt="${escapeHtml(title)}" />
          </a>
          <div>
            <div class="uffb-category">#${escapeHtml(category)}</div>
            <div class="uffb-body">
              <h3 class="uffb-title">
                <a href="${href}">${escapeHtml(title)}</a>
              </h3>
              ${metaBlock}
              ${desc?.trim() ? html`<div class="uffb-desc">${desc}</div>` : ''}
              ${renderLineupList(it)} ${renderEntry(it)}
              ${it.category?.key === 'panel_discussion' && it.panel_extra_html
                ? it.panel_extra_html // trusted snippet we just built (includes link + bold)
                : ''}
              ${renderShortsList(it)}
              <div class="uffb-actions">
                ${trailer
                  ? `<button class="uffb-btn" data-trailer="${encodeURIComponent(trailer)}">${t('watchTrailer')}</button>`
                  : ''}
              </div>
              <ul class="uffb-screenings">
                ${screenings}
              </ul>
            </div>
          </div>
        </article>`;
    }

    // fallback: original grid card
    return card(it, { onlyDate, onlyVenue });
  }

  function mountModal() {
    if (document.getElementById('uffb-modal'))
      return {
        open: (url) => {
          const iframe = document.querySelector('#uffb-modal iframe');
          document.getElementById('uffb-modal').classList.add('is-open');
          iframe.src = embedUrl(url);
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
        iframe.src = embedUrl(url);
      },
    };
  }

  function attachClearButton(selectEl) {
    if (!selectEl) return;
    const label = selectEl.closest('label');
    if (!label) return;

    // mark the field so it has extra right padding
    selectEl.classList.add('has-clear');

    // add button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'uffb-clear';
    const labelTxt =
      label.querySelector('span')?.textContent?.trim() || 'filter';
    btn.setAttribute('aria-label', `Clear ${labelTxt}`);
    btn.innerHTML = '×';
    label.appendChild(btn);

    const sync = () => {
      label.classList.toggle('is-filled', !!selectEl.value);
    };

    // clear on click + re-run filtering
    btn.addEventListener('click', () => {
      if (selectEl.value !== '') {
        selectEl.value = '';
        // trigger the same code path as user change
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      sync();
    });

    // keep visibility in sync when user picks from dropdown
    selectEl.addEventListener('change', sync);
    sync();
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
    //filters.setAttribute('hidden', ''); //default: hidden! TODO: change to visible
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
        <button type="button" id="clearFilters" class="uffb-chip uffb-chip-btn">
          <span class="chip-icon" aria-hidden="true">✕</span>
          <span class="chip-label">${t('clearFilters')}</span>
        </button>
      </div>
    `;
    container.appendChild(filters);

    const search = document.createElement('form');
    search.id = 'searchbar';
    search.className = 'uffb-search';
    //search.setAttribute('hidden', ''); //default: hidden!
    search.innerHTML = html`
      <input
        type="search"
        id="searchInput"
        class="uffb-field"
        placeholder="${t('searchPh')}"
      />
    `;
    container.appendChild(search);

    // --- GROUP BY (right side) ---
    const groupWrap = document.createElement('div');
    groupWrap.className = 'uffb-groupby';
    groupWrap.innerHTML = html`
    <div class="uffb-groupby-head">
        ${ICONS.group}
        <span>${I18N[lang].groupBy || 'Group by'}</span>
      </div>
      <div
        class="chips"
        role="radiogroup"
        aria-label="${I18N[lang].groupBy || 'Group by'}"
      >
        <label class="uffb-chip" data-value="">
          <input type="radio" name="groupby" value="" checked />
          <span>${I18N[lang].none || 'None'}</span>
        </label>
        <label class="uffb-chip" data-value="category">
          <input type="radio" name="groupby" value="category" />
          <span>${t('category')}</span>
        </label>
        <label class="uffb-chip" data-value="date">
          <input type="radio" name="groupby" value="date" />
          <span>${t('date')}</span>
        </label>
      </div>
  `;
    controls.appendChild(groupWrap);

    return {
      controls,
      filters: {
        root: filters,
        cat: filters.querySelector('#filterCategory'),
        // title: filters.querySelector('#filterTitle'),
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
      group: {
        root: groupWrap,
        radios: groupWrap.querySelectorAll('input[name="groupby"]'),
      },
    };
  }

  // --- Main render ---
  function render(el) {
    injectCSS();

    const wrap = document.createElement('div');
    el.appendChild(wrap);

    const ui = buildControls(wrap);

    // Neutral outlet: NO grid class here
    const outlet = document.createElement('div');
    outlet.className = 'uffb-outlet';
    wrap.appendChild(outlet);

    // Loader
    const loader = document.createElement('div');
    loader.className = 'uffb-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
    loader.innerHTML = `<span class="dot" aria-hidden="true"></span><span class="sr-only">${t('loading')}…</span>`;
    wrap.insertBefore(loader, outlet); // show above the results

    const showLoader = () => loader.classList.add('is-active');
    const hideLoader = () => loader.classList.remove('is-active');

    // READ PAGE OPTIONS
    const layoutVariant =
      (el.dataset.layout || el.dataset.view || '').toLowerCase() === 'row'
        ? 'row'
        : 'grid';
    const defaultGroup = (el.dataset.defaultGroup || 'category').toLowerCase();

    const jsonUrl = el.dataset.json;

    let items = [];
    let filtered = [];
    const state = {
      category: '',
      venue: '',
      title: '',
      date: '',
      q: '',
      groupBy: defaultGroup,
    };

    ui.group.radios.forEach((r) => {
      r.checked = r.value === state.groupBy;
    });
    const syncChips = () => {
      ui.group.root.querySelectorAll('.uffb-chip').forEach((chip) => {
        const input = chip.querySelector('input[type="radio"]');
        chip.dataset.checked = input.checked ? 'true' : 'false';
      });
    };
    ui.group.radios.forEach((r) =>
      r.addEventListener('change', () => {
        if (r.checked) state.groupBy = r.value;
        applyAll();
        syncChips();
      })
    );
    syncChips();

    function renderUngrouped(list, variant) {
      if (variant === 'row') {
        outlet.innerHTML = `<div class="uffb-list">${list
          .map((f) =>
            filmCard(f, {
              variant,
              onlyDate: state.date || null,
              onlyVenue: state.venue || null,
            })
          )
          .join('')}</div>`;
      } else {
        outlet.innerHTML = `<div class="uffb-grid">${list
          .map((f) =>
            filmCard(f, {
              variant,
              onlyDate: state.date || null,
              onlyVenue: state.venue || null,
            })
          )
          .join('')}</div>`;
      }
      const modal = mountModal();
      outlet.querySelectorAll('[data-trailer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const u = decodeURIComponent(
            e.currentTarget.getAttribute('data-trailer')
          );
          modal.open(u);
        });
      });
    }

    function renderGroupedByCategory(list, variant) {
      // grouping key -> {label, films[]}
      const catMap = new Map();
      list.forEach((f) => {
        // merged Film Focus group for grouping only
        const { key, label } = getGroupingKeyAndLabel(f);
        const k = key || '_uncat';
        const lbl = label || t('category');
        if (!catMap.has(k)) catMap.set(k, { label: lbl, films: [] });
        catMap.get(k).films.push(f);
      });

      const groups = Array.from(catMap.entries())
        .map(([k, v]) => ({
          key: k,
          label: v.label,
          films: v.films.sort((a, b) =>
            earliestDate(a).localeCompare(earliestDate(b))
          ),
          rank: categoryRank(k, v.label),
        }))
        .sort((a, b) => {
          if (a.rank !== b.rank) return a.rank - b.rank;
          return a.label.localeCompare(b.label);
        });

      let htmlStr = `<div class="uffb-groups">`;
      groups.forEach((g) => {
        htmlStr += `
      <section class="uffb-group" data-group="${escapeHtml(g.key)}">
        <h4 class="uffb-group-title">#${escapeHtml(g.label)}</h4>
        ${
          variant === 'row'
            ? `<div class="uffb-list">${g.films
                .map((f) =>
                  filmCard(f, {
                    variant,
                    onlyDate: state.date || null,
                    onlyVenue: state.venue || null,
                  })
                )
                .join('')}</div>`
            : `<div class="uffb-grid two-cols">${g.films
                .map((f) =>
                  filmCard(f, {
                    variant,
                    onlyDate: state.date || null,
                    onlyVenue: state.venue || null,
                  })
                )
                .join('')}</div>`
        }
      </section>`;
      });
      htmlStr += `</div>`;
      outlet.innerHTML = htmlStr;

      const modal = mountModal();
      outlet.querySelectorAll('[data-trailer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const u = decodeURIComponent(
            e.currentTarget.getAttribute('data-trailer')
          );
          modal.open(u);
        });
      });
    }

    function renderGroupedByDate(list, variant) {
      const only = state.date || null;
      const dateMap = explodeByDate(list, only); // ⬅️ pass selected date
      const dates = Array.from(dateMap.keys()).sort();

      // Undated group: only show when NO date filter is active
      const undated = !only
        ? list
            .filter((f) => !(f.screenings || []).some((s) => s.date))
            .sort((a, b) => {
              const at = localized(a.title) || '';
              const bt = localized(b.title) || '';
              return at.localeCompare(bt);
            })
        : [];

      let htmlStr = `<div class="uffb-groups">`;

      // Dated groups (now only the selected date when set)
      dates.forEach((d) => {
        const nice = isoToLabel(d);
        const entries = dateMap.get(d) || [];
        htmlStr += `
      <section class="uffb-group" data-date="${escapeHtml(d)}">
        <h4 class="uffb-group-title">${escapeHtml(nice)}</h4>
        ${
          variant === 'row'
            ? `<div class="uffb-list">${entries
                .map(({ film, date }) =>
                  filmCard(film, {
                    variant,
                    onlyDate: date,
                    onlyVenue: state.venue || null,
                  })
                )
                .join('')}</div>`
            : `<div class="uffb-grid">${entries
                .map(({ film, date }) =>
                  filmCard(film, {
                    variant,
                    onlyDate: date,
                    onlyVenue: state.venue || null,
                  })
                )
                .join('')}</div>`
        }
      </section>`;
      });

      if (undated.length) {
        const undatedLabel = '…' + t('noDates');
        htmlStr += `
      <section class="uffb-group" data-date="undated">
        <h4 class="uffb-group-title">${undatedLabel}</h4>
        ${
          variant === 'row'
            ? `<div class="uffb-list">${undated.map((film) => filmCard(film, { variant })).join('')}</div>`
            : `<div class="uffb-grid">${undated.map((film) => filmCard(film, { variant })).join('')}</div>`
        }
      </section>`;
      }

      htmlStr += `</div>`;
      outlet.innerHTML = htmlStr;

      const modal = mountModal();
      outlet.querySelectorAll('[data-trailer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const u = decodeURIComponent(
            e.currentTarget.getAttribute('data-trailer')
          );
          modal.open(u);
        });
      });
    }

    // normalize i18n/arrays/strings → single lowercase-ready string
    const langTxt = (v) => {
      if (!v) return '';
      // localized can return string OR array (e.g., director: {en: ["Name"]})
      const val = Array.isArray(v) ? v.map(localized) : [localized(v)];
      const flat = (Array.isArray(val) ? val.flat() : [val]).filter(Boolean);
      return flat.join(' ');
    };

    // --- filtering + apply ---
    function applyAll() {
      filtered = items.filter((f) => {
        if (state.title) {
          if (f.id !== state.title) return false;
        }
        if (state.category) {
          const key =
            (f.category &&
              (f.category.key ||
                f.category.en ||
                f.category.de ||
                f.category.uk)) ||
            '';
          const keyNorm =
            f.category && f.category.key ? f.category.key : safeTxt(key);
          const catNorm = safeTxt(state.category);
          if (keyNorm !== state.category && keyNorm !== catNorm) return false;
        }
        if (state.venue && state.date) {
          // require a single screening that matches BOTH
          const hasBoth = (f.screenings || []).some(
            (s) =>
              safeTxt(getVenueName(s)) === state.venue && s.date === state.date
          );
          if (!hasBoth) return false;
        } else {
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
        }
        if (state.q) {
          const q = state.q.toLowerCase();

          const baseText = [
            f.title?.de,
            f.title?.en,
            f.title?.uk,
            f.short_description?.de,
            f.short_description?.en,
            f.short_description?.uk,
            f.description?.de,
            f.description?.en,
            f.description?.uk,
            f.category?.de,
            f.category?.en,
            f.category?.uk,
            langTxt(f.director), // ⬅️ use helper (fixes string/array/i18n)
            f.original_title,
            langTxt(f.cast), // (optional) normalize cast too
          ]
            .filter(Boolean)
            .join(' ');

          // NEW: include shorts program films (title, description, director)
          const shortsText = Array.isArray(f.films)
            ? f.films
                .map((sf) =>
                  [
                    langTxt(sf.title),
                    langTxt(sf.short_description),
                    langTxt(sf.director),
                  ]
                    .filter(Boolean)
                    .join(' ')
                )
                .join(' ')
            : '';

          const text = (baseText + ' ' + shortsText).toLowerCase();

          const venuesText = (f.screenings || [])
            .map(getVenueName)
            .join(' ')
            .toLowerCase();

          if (!text.includes(q) && !venuesText.includes(q)) return false;
        }

        return true;
      });

      // If same earliest date, use category priority
      filtered.sort((a, b) => {
        const da = earliestDate(a);
        const db = earliestDate(b);
        if (da !== db) return 0; // keep earlier date precedence

        const ca = getCategoryKeyAndLabel(a);
        const cb = getCategoryKeyAndLabel(b);
        const ra = categoryRank(ca.key, ca.label);
        const rb = categoryRank(cb.key, cb.label);
        if (ra !== rb) return ra - rb;

        // final tie-breaker by localized title
        const at = localized(a.title) || '';
        const bt = localized(b.title) || '';
        return at.localeCompare(bt);
      });

      if (state.groupBy === 'category') {
        renderGroupedByCategory(filtered, layoutVariant);
      } else if (state.groupBy === 'date') {
        renderGroupedByDate(filtered, layoutVariant);
      } else {
        renderUngrouped(filtered, layoutVariant);
      }

      // --- empty state ---
      if (filtered.length === 0) {
        outlet.innerHTML = html`
          <div class="uffb-empty">
            <h4>${t('noResultsTitle')}</h4>
            <p>${t('noResultsHint')}</p>
            <div class="uffb-empty-actions">
              <button
                type="button"
                class="uffb-chip uffb-chip-btn"
                id="resetAllFilters"
              >
                <span class="chip-icon" aria-hidden="true">✕</span>
                <span class="chip-label">${t('clearFilters')}</span>
              </button>
            </div>
          </div>
        `;
        // wire the reset to your existing Clear Filters logic
        const resetBtn = outlet.querySelector('#resetAllFilters');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            // triggers your UI reset + state reset + applyAll()
            ui.filters.clear.click();
          });
        }
        return; // stop here; don’t render lists/groups
      }
    }

    // --- toggles ---
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

    // --- filter options init ---
    function initFilterOptions(data) {
      // --- CATEGORY OPTIONS ---
      // keep the first "All" option, remove the rest (prevents duplicates on re-init)
      while (ui.filters.cat.options.length > 1) ui.filters.cat.remove(1);

      // collect categories: key -> localized label
      const catSet = new Map();
      data.forEach((f) => {
        const key = (f.category && f.category.key) || null;
        const label =
          (f.category &&
            (f.category[lang] ||
              f.category.de ||
              f.category.en ||
              f.category.uk)) ||
          null;
        if (key && label && !catSet.has(key)) catSet.set(key, label);
      });

      // order by rank, then alphabetically by label
      const catArray = Array.from(catSet.entries()).map(([key, label]) => ({
        key,
        label,
        rank: categoryRank(key, label),
      }));

      catArray
        .sort((a, b) =>
          a.rank !== b.rank ? a.rank - b.rank : a.label.localeCompare(b.label)
        )
        .forEach(({ key, label }) => {
          const opt = document.createElement('option');
          opt.value = key;
          opt.textContent = label;
          ui.filters.cat.appendChild(opt);
        });

      // --- TITLE OPTIONS ---
      while (ui.filters.title?.options.length > 1) ui.filters.title?.remove(1);

      const pairs = [];
      data.forEach((f) => {
        const localized = (f.title && f.title[lang]) || ''; // STRICT: only current language
        if (!localized) return; // skip if no title for this lang
        pairs.push({ id: f.id, label: String(localized).trim() });
      });

      // sort by label with current locale for proper A→Z
      pairs
        .sort((a, b) => a.label.localeCompare(b.label, locale))
        .forEach(({ id, label }) => {
          const opt = document.createElement('option');
          opt.value = id; // filter by film id
          opt.textContent = label; // show localized title
          ui.filters.title?.appendChild(opt);
        });

      // --- VENUE OPTIONS ---
      while (ui.filters.venue.options.length > 1) ui.filters.venue.remove(1);

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

      // --- DATE OPTIONS ---
      while (ui.filters.date.options.length > 1) ui.filters.date.remove(1);

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

    // --- UI events ---
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
    ui.filters.title?.addEventListener('change', () => {
      state.title = ui.filters.title?.value; // film id or ''
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
      state.title = '';
      state.venue = '';
      state.date = '';
      applyAll();
    });

    attachClearButton(ui.filters.cat);
    attachClearButton(ui.filters.title);
    attachClearButton(ui.filters.venue);
    attachClearButton(ui.filters.date);

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

    // --- fetch + initial render ---
    showLoader();
    fetch(jsonUrl, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('load fail');
        return r.json();
      })
      .then((data) => {
        const baseFilms = data.slice().filter((f) => f.published === true);

        // build panel items from each film that has a panel section
        const panelItems = baseFilms.flatMap(makePanelItemsFromFilm);

        // merge + sort by earliest date
        items = [...baseFilms, ...panelItems].sort((a, b) =>
          earliestDate(a).localeCompare(earliestDate(b))
        );

        initFilterOptions(items);
        applyAll();
      })
      .catch((err) => {
        outlet.innerHTML = `<p>${t('loadError')}</p>`;
        console.error('[UFFB] JSON fetch error', err);
      })
      .finally(() => {
        hideLoader();
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
