/* uffb-film.bundle.js — program-detail with shorts layout */
(function () {
  const MOUNT = '#film-detail';

  const html = String.raw;
  const css = String.raw;

  // --- language/i18n (keep current logic to avoid breaking) ---
  const SUPPORTED_LANGS = ['en', 'de', 'uk'];
  const DEFAULT_LANG = 'en';

  function detectLang() {
    const htmlLang = (document.documentElement.lang || '')
      .toLowerCase()
      .slice(0, 2);
    const path = location.pathname || '';

    if (path.startsWith('/de/')) return 'de';
    if (path.startsWith('/uk/')) return 'uk';
    if (SUPPORTED_LANGS.includes(htmlLang)) return htmlLang;
    return DEFAULT_LANG;
  }

  const lang = location.pathname.startsWith('/de/')
    ? 'de'
    : location.pathname.startsWith('/uk/')
      ? 'uk'
      : 'en';
  const locale = lang === 'de' ? 'de-DE' : lang === 'uk' ? 'uk-UA' : 'en-GB';

  const I18N = {
    en: {
      home: 'Home',
      programLabel: 'UFFB Program 2025',
      watchTrailer: 'Watch trailer',
      tickets: 'TICKETS',
      screenings: 'Screenings',
      bookTickets: 'Book tickets',
      info: 'Info',
      credits: 'Credits',
      synopsis: 'Synopsis',
      category: 'Category',
      originalTitle: 'Original title',
      countries: 'Countries',
      year: 'Year',
      language: 'Language',
      duration: 'Duration',
      director: 'Director',
      directors: 'Directors',
      cast: 'Cast',
      shortDescLabel: 'Short description:',
      loadError: 'Film data could not be loaded.',
      filmNotFound: 'Film not found.',
      collaboration: 'In collaboration with',
      warning: 'Warning',
      aboutDirector: 'About the director(s)',
    },
    de: {
      home: 'Start',
      programLabel: 'UFFB Programm 2025',
      watchTrailer: 'Trailer ansehen',
      tickets: 'TICKETS',
      screenings: 'Vorführungen',
      bookTickets: 'Tickets kaufen',
      info: 'Info',
      credits: 'Credits',
      synopsis: 'Über den Film',
      category: 'Kategorie',
      originalTitle: 'Originaltitel',
      countries: 'Länder',
      year: 'Jahr',
      language: 'Sprache',
      duration: 'Filmlänge',
      director: 'Regie',
      directors: 'Regie',
      cast: 'Cast',
      shortDescLabel: 'Kurzbeschreibung:',
      loadError: 'Filmdaten konnten nicht geladen werden.',
      filmNotFound: 'Film nicht gefunden.',
      collaboration: 'In Kooperation mit',
      warning: 'Warnung',
      aboutDirector: 'Über die Filmemacher',
    },
    uk: {
      home: 'Головна',
      programLabel: 'Програма UFFB 2025',
      watchTrailer: 'Дивитися трейлер',
      tickets: 'КВИТКИ',
      screenings: 'Покази',
      bookTickets: 'Купити квитки',
      info: 'Інфо',
      credits: 'Знімальна група',
      synopsis: 'Синопсис',
      category: 'Категорія',
      originalTitle: 'Оригінальна назва',
      countries: 'Країни',
      year: 'Рік',
      language: 'Мова',
      duration: 'Тривалість',
      director: 'Режисер',
      directors: 'Режисери',
      cast: 'Акторський склад',
      shortDescLabel: 'Короткий опис:',
      loadError: 'Не вдалося завантажити дані про фільм.',
      filmNotFound: 'Фільм не знайдено.',
      collaboration: 'У співпраці з',
      warning: 'Попередження',
      aboutDirector: 'Про режисера(-ів)',
    },
  };
  const t = (key) => I18N[lang]?.[key] ?? key;

  /* ---------- utils ---------- */
  function getFilmId() {
    const params = new URLSearchParams(location.search);
    if (params.get('id')) return params.get('id');
    const parts = location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }
  function joinLocalized(val) {
    if (!val) return '';
    if (Array.isArray(val)) {
      return val
        .map((v) => (typeof v === 'object' ? localized(v) : String(v)))
        .join(', ');
    }
    return typeof val === 'object' ? localized(val) : String(val);
  }
  function localized(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] ?? obj['en'] ?? obj['de'] ?? Object.values(obj)[0] ?? '';
  }
  function fmtDuration(mins) {
    if (!mins || isNaN(mins)) return '';
    return `${mins} min`;
  }
  function iso8601Duration(mins) {
    if (!mins || isNaN(mins)) return null;
    return `PT${Math.round(mins)}M`;
  }

  function buildBreadcrumb(film) {
    const title = localized(film.title) || film.original_title || '';
    const homeHref = lang === 'de' ? '/de/' : '/';
    const progHref = lang === 'de' ? '/de/uffb2025' : '/uffb2025';
    return html`
      <nav class="uffb-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="${homeHref}">${t('home')}</a></li>
          <li><a href="${progHref}">${t('programLabel')}</a></li>
          <li aria-current="page">${title}</li>
        </ol>
      </nav>
    `;
  }

  /* --- trailer helpers (no autoplay) --- */
  function toEmbedUrl(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
      }
      if (u.hostname === 'youtu.be') {
        const id = u.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
      }
      if (u.hostname.includes('vimeo.com')) {
        const parts = u.pathname.split('/').filter(Boolean);
        const id = parts.pop();
        if (id) return `https://player.vimeo.com/video/${id}`;
      }
      return url;
    } catch {
      return null;
    }
  }

  /* ---------- UI pieces ---------- */
  function buildTopLine(film) {
    const title = localized(film.title) || film.original_title || '';
    const cat = film.category
      ? film.category[lang] || film.category.en || film.category.de || ''
      : '';
    const hasTrailer = Boolean(film.trailer);
    const hasScreenings = Boolean(film.screenings?.length > 0);
    return html`
      <div class="uffb-topline">
        <div class="uffb-topline-left">
          <div class="uffb-cat">#${cat}</div>
          <div class="uffb-top-title">${title}</div>
        </div>
        <div class="uffb-topline-right">
          ${hasTrailer
            ? `<a class="uffb-btn uffb-trailer-btn eventlist-button sqs-editable-button sqs-button-element--primary" href="#" data-trailer="${film.trailer}">${t('watchTrailer')}</a>`
            : ''}
          ${hasScreenings
            ? `<a class="uffb-btn eventlist-button sqs-editable-button sqs-button-element--primary" href="#screenings">${t('tickets')}</a>`
            : ''}
        </div>
      </div>
    `;
  }

  function buildJsonLd(film) {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: localized(film.title) || film.original_title || '',
      alternateName: film.original_title || undefined,
      description:
        localized(film.detailed_description) ||
        localized(film.short_description) ||
        '',
      image: film.image,
      url: location.href,
      countryOfOrigin:
        (film.countries &&
          (film.countries[lang] || film.countries.en || film.countries.de)) ||
        undefined,
      genre:
        (film.genre && (film.genre[lang] || film.genre.en || film.genre.de)) ||
        undefined,
      director: film.director
        ? [{ '@type': 'Person', name: film.director }]
        : undefined,
      actor: film.cast
        ? Array.isArray(film.cast)
          ? film.cast.map((a) => ({ '@type': 'Person', name: a }))
          : String(film.cast)
              .split(',')
              .map((a) => ({ '@type': 'Person', name: a.trim() }))
        : undefined,
      duration: iso8601Duration(film.duration) || undefined,
      trailer: film.trailer
        ? { '@type': 'VideoObject', name: 'Trailer', url: film.trailer }
        : undefined,
    };
    Object.keys(ld).forEach((k) => ld[k] === undefined && delete ld[k]);
    return ld;
  }

  function infoRow(label, valueHtml, additionalClass = '') {
    if (!valueHtml) return '';
    return `
      <div class="uffb-info-row">
        <div class="uffb-info-label">${label}</div>
        <div class="uffb-info-value ${additionalClass}">${valueHtml}</div>
      </div>
    `;
  }

  function buildInfoBlock(film) {
    const cat = film.category
      ? film.category[lang] || film.category.en || film.category.de || ''
      : '';
    const original = film.original_title || '';
    const countries = film.countries
      ? film.countries[lang] || film.countries.en || film.countries.de || []
      : [];
    const countriesTxt = Array.isArray(countries)
      ? countries.join(', ')
      : countries;
    const year = film.year;
    const languageTxt = film.language
      ? film.language[lang] || film.language.en || film.language.de || ''
      : '';
    const duration = film.duration ? film.duration + "'" : '';
    return `
      <section class="uffb-panel">
        <h3 class="uffb-panel-title">${t('info')}</h3>
        <div class="uffb-info">
          ${infoRow(t('category'), cat)}
          ${infoRow(t('originalTitle'), original, 'original-title')}
          ${infoRow(t('countries'), countriesTxt)}
          ${year ? infoRow(t('year'), year) : ''}
          ${languageTxt ? infoRow(t('language'), languageTxt) : ''}
          ${languageTxt ? infoRow(t('duration'), duration) : ''}
        </div>
      </section>
    `;
  }

  function buildSynopsisBlock(film) {
    const shortDesc =
      (film.short_description && localized(film.short_description)) || '';
    const longDesc =
      (film.detailed_description && localized(film.detailed_description)) || '';
    const warning = film.warning ? localized(film.warning) : '';

    if (!shortDesc && !longDesc) return '';
    return html`
      <section class="uffb-panel">
        <h3 class="uffb-panel-title">${t('synopsis')}</h3>
        <div class="uffb-synopsis2">
          ${shortDesc
            ? `<p class="uffb-lead"><strong>${shortDesc}</strong></p>`
            : ''}
          ${longDesc ? `<div class="uffb-bodytext">${longDesc}</div>` : ''}
          ${warning
            ? `<div class="uffb-warning"><strong>${t('warning')}</strong>: ${warning}</div>`
            : ''}
        </div>
      </section>
    `;
  }

  function buildCreditsBlock(film) {
    const director = localized(film.director) || '';
    const cast = Array.isArray(localized(film.cast))
      ? localized(film.cast).join(', ')
      : localized(film.cast) || '';
    return html`
      <section class="uffb-panel">
        <h3 class="uffb-panel-title">${t('credits')}</h3>
        <div class="uffb-credits">
          ${infoRow(t('director'), director)}
          ${cast ? infoRow(t('cast'), cast) : ''}
        </div>
      </section>
    `;
  }

  function collectPartners(film) {
    const out = [];
    const add = (p) => {
      if (!p || !p.name) return;
      // de-dupe by name+url
      const key = (p.name || '') + '|' + (p.url || '');
      if (out.some((x) => (x.name || '') + '|' + (x.url || '') === key)) return;
      out.push({ name: p.name, url: p.url || '', logo: p.logo || '' });
    };

    // film-level
    if (Array.isArray(film.partners)) film.partners.forEach(add);
    // screening-level
    if (Array.isArray(film.screenings)) {
      film.screenings.forEach((s) => {
        if (Array.isArray(s.partners)) s.partners.forEach(add);
      });
    }
    return out;
  }

  function buildPartnersSection(film) {
    const partners = collectPartners(film);
    if (!partners.length) return '';
    const items = partners
      .map((p) => {
        const img = p.logo
          ? html`<img
                loading="lazy"
                src="${p.logo}"
                alt="${p.name}"
                title="${p.name}"
              />`
          : '';
        const logo = html`<div class="uffb-partner-logo">${img}</div>`;
        return p.url
          ? html`<a
                class="uffb-partner"
                href="${p.url}"
                target="_blank"
                rel="noopener"
                aria-label="${p.name}"
                >${logo}</a
              >`
          : html`<div class="uffb-partner" aria-label="${p.name}">
                ${logo}
              </div>`;
      })
      .join('');
    return html`
    <section class="uffb-panel uffb-partners">
        <h3 class="uffb-panel-title">${t('collaboration')}</h3>
        <div class="uffb-partner-grid">${items}</div>
      </section>
  `;
  }

  function fmtWhen(isoDate, timeHHMM) {
    const d = new Date(`${isoDate}T00:00:00`);
    const fmt = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${fmt.format(d)} · ${timeHHMM}`;
  }

  function buildScreeningsSection(film) {
    const list = Array.isArray(film.screenings) ? film.screenings : [];
    if (!list.length) return '';
    const cards = list
      .map((s) => {
        const when = `${fmtWhen(s.date, s.time)}`;
        const venueName = localized(s.venue) || '';
        const addr = s.address || '';
        const mapsUrl = s.maps?.google || null;
        const tixUrl = s.tickets || '#';
        const addrHtml = addr
          ? mapsUrl
            ? `<a class="uffb-addr" href="${mapsUrl}" target="_blank" rel="noopener">${addr}</a>`
            : `<span class="uffb-addr">${addr}</span>`
          : '';
        return html`
          <article class="uffb-screening-card">
            <div class="uffb-whenline">${when}</div>
            ${venueName
              ? `<div class="uffb-venue-title">${venueName}</div>`
              : ''}
            ${addrHtml}
            <div class="uffb-card-actions">
              <a
                class="uffb-btn uffb-book-btn"
                href="${tixUrl}"
                target="_blank"
                rel="noopener"
                >${t('bookTickets')}</a
              >
            </div>
          </article>
        `;
      })
      .join('');

    return html`
      <section class="uffb-screenings-block" id="screenings">
        <h2 class="uffb-section-title">${t('screenings')}</h2>
        <div class="uffb-screenings-grid">${cards}</div>
      </section>
    `;
  }

  /* --- hero carousel (kept for regular films only) --- */
  function buildMediaCarousel(film) {
    const title = localized(film.title) || film.original_title || '';
    const embed = film.trailer ? toEmbedUrl(film.trailer) : null;

    const slides = [
      `<div class="uffb-slide is-image"><img src="${film.image}" alt="${title}"></div>`,
    ];
    if (embed) {
      slides.push(`
        <div class="uffb-slide is-trailer" data-embed="${embed}">
          <div class="uffb-video-ph">
            <img src="${film.image}" alt="${title}">
            <button class="uffb-play-badge" aria-label="${lang === 'de' ? 'Trailer ansehen' : 'Watch trailer'}">▶</button>
            <div class="uffb-slide-tag">${lang === 'de' ? 'Trailer' : 'Trailer'}</div>
          </div>
        </div>
      `);
    }

    return `
      <div class="uffb-media">
        <div class="uffb-slides" data-index="0" style="transform:translateX(0%)">${slides.join('')}</div>
        ${
          slides.length > 1
            ? `<button class="uffb-nav uffb-prev" aria-label="Previous">‹</button>
             <button class="uffb-nav uffb-next" aria-label="Next">›</button>`
            : ''
        }
      </div>
    `;
  }

  /* --- lightbox --- */
  function ensureLightbox() {
    if (document.getElementById('uffb-lightbox')) return;
    const box = document.createElement('div');
    box.id = 'uffb-lightbox';
    box.innerHTML = html`
      <div
        class="uffb-lb-backdrop"
        data-close="1"
      ></div>
      <div
        class="uffb-lb-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Trailer"
      >
        <button class="uffb-lb-close" aria-label="Close">×</button>
        <div class="uffb-lb-viewport">
          <iframe
            id="uffb-lb-iframe"
            src=""
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(box);
    box.addEventListener('click', (e) => {
      if (
        e.target.dataset.close === '1' ||
        e.target.classList.contains('uffb-lb-close')
      )
        closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
  function openLightbox(trailerUrl) {
    ensureLightbox();
    const embed = toEmbedUrl(trailerUrl);
    const lb = document.getElementById('uffb-lightbox');
    const iframe = document.getElementById('uffb-lb-iframe');
    iframe.src = embed || trailerUrl;
    lb.classList.add('open');
    document.documentElement.classList.add('uffb-noscroll');
  }
  function closeLightbox() {
    const lb = document.getElementById('uffb-lightbox');
    if (!lb) return;
    const iframe = document.getElementById('uffb-lb-iframe');
    iframe.src = '';
    lb.classList.remove('open');
    document.documentElement.classList.remove('uffb-noscroll');
  }

  /* --- carousel wiring --- */
  function initCarousel($root) {
    const $media = $root.querySelector('.uffb-media');
    if (!$media) return;

    const $slides = $media.querySelector('.uffb-slides');
    const slides = Array.from($media.querySelectorAll('.uffb-slide'));
    let index = 0;
    const count = slides.length;

    function injectIfVideo(i) {
      const s = slides[i];
      const embed = s && s.getAttribute('data-embed');
      if (embed && !s.querySelector('iframe')) {
        s.innerHTML = `<iframe src="${embed}" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>`;
      }
    }
    function cleanupIfLeaving(i) {
      const s = slides[i];
      if (!s) return;
      const iframe = s.querySelector('iframe');
      if (iframe) iframe.remove();
    }
    function update() {
      $slides.style.transform = `translateX(${-index * 100}%)`;
      $slides.dataset.index = index;
    }
    function go(to) {
      const prevIndex = index;
      index = ((to % count) + count) % count;
      cleanupIfLeaving(prevIndex);
      injectIfVideo(index);
      update();
    }

    const prev = () => go(index - 1);
    const next = () => go(index + 1);
    const $prev = $media.querySelector('.uffb-prev');
    const $next = $media.querySelector('.uffb-next');
    if ($prev) $prev.addEventListener('click', prev);
    if ($next) $next.addEventListener('click', next);

    // swipe
    let startX = null,
      dx = 0;
    $media.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        dx = 0;
      },
      { passive: true }
    );
    $media.addEventListener(
      'touchmove',
      (e) => {
        if (startX != null) dx = e.touches[0].clientX - startX;
      },
      { passive: true }
    );
    $media.addEventListener('touchend', () => {
      if (Math.abs(dx) > 40) {
        if (dx < 0) next();
        else prev();
      }
      startX = null;
      dx = 0;
    });

    $media.addEventListener('click', (e) => {
      const btn = e.target.closest('.uffb-play-badge');
      if (btn) {
        const trailerIndex = slides.findIndex((s) =>
          s.classList.contains('is-trailer')
        );
        if (trailerIndex >= 0) go(trailerIndex);
      }
    });
  }

  // Always scroll to #screenings even if hash is already there
  function enableTicketsJump() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href="#screenings"]');
      if (!a) return;
      const target = document.getElementById('screenings');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(
        null,
        '',
        location.pathname + location.search + '#screenings'
      );
    });
  }

  /* --- SHORTS: centered list with bigger thumbs; screenings on right --- */

  // allows minimal markup in bios; strips everything else
  function sanitizeBio(htmlStr = '') {
    const div = document.createElement('div');
    div.innerHTML = htmlStr;

    const allowed = new Set(['B', 'STRONG', 'EM', 'I', 'BR', 'P', 'A']);
    const walker = document.createTreeWalker(
      div,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );

    const toRemove = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!allowed.has(node.tagName)) {
        // unwrap disallowed tags (keep text content)
        const parent = node.parentNode;
        while (node.firstChild) parent.insertBefore(node.firstChild, node);
        toRemove.push(node);
        continue;
      }
      if (node.tagName === 'A') {
        // keep only safe href
        const href = node.getAttribute('href') || '';
        if (!/^https?:\/\//i.test(href)) {
          node.removeAttribute('href');
        }
        node.removeAttribute('onclick');
        node.removeAttribute('onmouseover');
        node.removeAttribute('style');
      }
    }
    toRemove.forEach((n) => n.remove());
    return div.innerHTML;
  }

  // ensure director(s) is array of strings in current lang
  function toDirectorList(director, localizedFn) {
    if (!director) return [];
    const val = typeof director === 'object' ? localizedFn(director) : director;
    return Array.isArray(val) ? val.filter(Boolean) : val ? [val] : [];
  }

  // Bold director names inside bio (even if user didn’t add <b> in JSON)
  function boldDirectorNamesIn(bioHtml, directors) {
    if (!bioHtml || !directors.length) return bioHtml;
    let out = bioHtml;
    directors.forEach((name) => {
      // escape regex specials in name
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // avoid double-wrapping already-bolded names
      const re = new RegExp(
        `(?!<(?:b|strong)[^>]*>)\\b(${escaped})\\b(?![^<]*</(?:b|strong)>)`,
        'gi'
      );
      out = out.replace(re, '<strong class="uffb-dir-name">$1</strong>');
    });
    return out;
  }

  function buildShortsItemsSection(film) {
    const shorts = Array.isArray(film.films) ? film.films : [];
    if (!shorts.length) return '';

    const items = shorts
      .map((sf) => {
        const title =
          (typeof sf.title === 'object' ? localized(sf.title) : sf.title) || '';
        const director =
          (typeof sf.director === 'object'
            ? localized(sf.director)
            : sf.director) || '';
        const countriesRaw =
          (sf.countries &&
            (sf.countries[lang] || sf.countries.en || sf.countries.de)) ??
          '';
        const countries = Array.isArray(countriesRaw)
          ? countriesRaw.join(', ')
          : countriesRaw || '';
        const year = sf.year ?? '';
        const desc =
          (sf.description &&
            (typeof sf.description === 'object'
              ? localized(sf.description)
              : sf.description)) ||
          '';

        const aboutRaw =
          (sf.about &&
            (typeof sf.about === 'object' ? localized(sf.about) : sf.about)) ||
          '';
        const aboutSanitized = sanitizeBio(aboutRaw);
        const directorList = toDirectorList(sf.director, localized);
        const aboutWithBoldNames = boldDirectorNamesIn(
          aboutSanitized,
          directorList
        );
        const directorLine = directorList.join(', ');
        const aboutBlock = aboutWithBoldNames
          ? `<div class="uffb-short-about">
           <!--div class="ttl">${t('aboutDirector')}</div-->
           <div class="txt">${aboutWithBoldNames}</div>
         </div>`
          : '';

        const img = sf.image || '';
        const trailer = sf.trailer || '';
        //const genreTxt = joinLocalized(sf.genre);
        let durationTxt = sf.duration != null ? sf.duration : '';
        if (typeof durationTxt === 'number') durationTxt = `${durationTxt}'`;
        else if (typeof durationTxt === 'object')
          durationTxt = localized(durationTxt);

        const imgHtml = img
          ? `<div class="uffb-short-img"><img loading="lazy" src="${img}" alt="${title}"></div>`
          : `<div class="uffb-short-img" aria-hidden="true"></div>`;

        const metaBlock = `
        <div class="uffb-short-metas">
          ${[countries, year].filter(Boolean).length ? `<div class="uffb-short-meta1"><em>${[countries, year].filter(Boolean).join(' | ')}</em></div>` : ''}
          ${directorList ? `<div class="uffb-short-meta2"><strong>${directorList.length > 1 ? t('directors') : t('director')}:</strong> ${directorLine}</div>` : ''}
          ${durationTxt ? `<div class="uffb-short-meta3">${durationTxt}</div>` : ''}
        </div>
      `;

        const trailerBtn = trailer
          ? `<div class="uffb-short-actions"><a class="uffb-btn uffb-trailer-btn" href="#" data-trailer="${trailer}">${t('watchTrailer')}</a></div>`
          : '';

        const descBlock = desc
          ? `<div class="uffb-short-desc">${desc}</div>`
          : '';

        return html`
        <li class="uffb-short-item">
            ${imgHtml}
            <div class="right">
              <h2>${title}</h2>
              ${metaBlock}${trailerBtn} ${descBlock} ${aboutBlock}
            </div>
            <!--div class="full-row">${descBlock}</div-->
          </li>
      `;
      })
      .join('');

    return `
      <section class="uffb-panel uffb-shorts-block">
        <ol class="uffb-shorts-list">${items}</ol>
      </section>
    `;
  }

  /* ---------- CSS ---------- */
  const CSS = css`
    .uffb-film {
      display: grid;
      gap: 24px;
    }
    .uffb-film-header {
      display: grid;
      gap: 16px;
    }
    .uffb-title {
      font-size: clamp(28px, 4vw, 44px);
      line-height: 1.1;
      margin: 0;
    }

    .uffb-breadcrumb {
      margin-bottom: 6px;
      font-size: 13px;
      display: block;
      opacity: 1;
    }
    .uffb-breadcrumb ol {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
    .uffb-breadcrumb li {
      display: flex;
      align-items: center;
    }
    .uffb-breadcrumb li + li::before {
      content: '›';
      margin: 0 8px;
      opacity: 0.6;
    }
    .uffb-breadcrumb a {
      text-decoration: underline;
    }

    .uffb-media {
      position: relative;
      overflow: hidden;
      border-radius: 0px;
      background: #000;
      aspect-ratio: 16/9;
    }
    .uffb-slides {
      display: flex;
      transition: transform 0.35s ease;
      width: 100%;
    }
    .uffb-slide {
      min-width: 100%;
      position: relative;
    }
    .uffb-slide img,
    .uffb-slide iframe {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
    .uffb-video-ph {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .uffb-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .uffb-prev {
      left: 10px;
    }
    .uffb-next {
      right: 10px;
    }
    .uffb-play-badge {
      position: absolute;
      inset: auto auto 16px 16px;
      border: 1.5px solid #fff;
      color: #fff;
      background: transparent;
      border-radius: 999px;
      padding: 8px 12px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
    }
    .uffb-slide-tag {
      position: absolute;
      left: 16px;
      top: 16px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 4px 8px;
      border-radius: 0px;
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .uffb-topline {
      display: flex;
      gap: 50px;
      align-items: flex-end;
      justify-content: space-between;
      background: #000;
      color: #fff;
      border-radius: 0px;
    }
    .uffb-topline-left {
      display: grid;
      gap: 4px;
    }
    .uffb-cat {
      font-size: 1rem;
      letter-spacing: 0.06em;
      opacity: 0.85;
      text-transform: uppercase;
    }
    .uffb-top-title {
      font-size: clamp(22px, 4.5vw, 42px);
      font-weight: 800;
      line-height: 1;
      text-transform: uppercase;
    }
    .uffb-topline-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .uffb-btn {
      --btn-fg: #111; /* the color to invert to */
      color: var(--btn-fg);
      display: inline-block;
      padding: 18px;
      border: 1px solid var(--paragraphLinkColor);
      border-radius: 0px;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: var(--paragraphLinkColor);
      transition:
        background-color var(--btn-anim) ease,
        color var(--btn-anim) ease,
        border-color var(--btn-anim) ease,
        transform 0.06s ease;
    }

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

    .uffb-btn:hover {
      background: var(--btn-fg); /* uses stored color, not currentColor */
      color: #fff;
      border-color: #fff;
    }

    .uffb-btn:active,
    .uffb-tickets a:active {
      transform: translateY(1px);
    }
    @media (max-width: 640px) {
      .uffb-topline {
        flex-direction: column;
        align-items: flex-start;
      }
      .uffb-topline-right {
        margin-top: 8px;
      }
    }

    .visually-hidden {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0 0 0 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }

    .uffb-panel {
      padding: 0;
    }
    .uffb-panel + .uffb-panel {
      margin-top: 22px;
    }
    .uffb-panel-title {
      font-size: 1.25rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.6;
      margin: 15px 0 10px 0;
    }

    .uffb-info,
    .uffb-credits {
      display: grid;
      gap: 6px;
    }
    .uffb-info-row {
      display: grid;
      grid-template-columns: minmax(110px, 150px) 1fr;
      gap: 8px;
    }
    .uffb-info-label {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      opacity: 0.85;
      font-size: 0.85rem;
    }
    .uffb-info-value {
      font-size: 1.15rem;
    }

    .uffb-synopsis2 .uffb-lead {
      margin: 0 0 10px 0;
      font-size: 18px;
    }
    .uffb-synopsis2 .uffb-bodytext {
      white-space: pre-wrap;
      font-size: 1.15rem;
    }

    .uffb-warning {
      margin: 15px 0 0;
      font-size: 1.15rem;
    }

    .uffb-two-col {
      display: grid;
      gap: 28px;
      margin-top: 32px;
    }
    @media (min-width: 960px) {
      .uffb-two-col {
        grid-template-columns: 1fr 2fr;
        align-items: start;
      }
    }
    .uffb-col-left,
    .uffb-col-right {
      position: relative;
    }
    @media (min-width: 960px) {
      .uffb-col-left {
        padding-right: 20px;
        border-right: 1px solid rgba(0, 0, 0, 0.08);
      }
      .uffb-col-right {
        padding-left: 20px;
      }
    }

    .uffb-section-title {
      font-size: clamp(22px, 4.5vw, 42px);
      font-weight: 800;
      line-height: 1.05;
      margin: 25px 0;
      text-transform: none;
    }
    .uffb-screenings-block {
      margin-top: 25px;
      scroll-margin-top: 80px;
    }

    .uffb-shorts-layout .uffb-screenings-block,
    .uffb-shorts-layout .uffb-screenings-block .uffb-section-title {
      margin-top: 0;
    }

    .uffb-screenings-grid {
      display: grid;
      gap: 16px;
    }
    @media (min-width: 720px) {
      .uffb-screenings-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (min-width: 1100px) {
      .uffb-screenings-grid {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    .uffb-shorts-right .uffb-screenings-grid {
      grid-template-columns: 1fr !important; /* force single column */
    }

    .uffb-screening-card {
      display: grid;
      gap: 8px;
      padding: 16px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 0px;
      background: #fff;
    }
    .uffb-screening-card .uffb-whenline,
    .uffb-screening-card .uffb-venue-title {
      color: #333;
    }
    .uffb-whenline {
      font-weight: 700;
    }
    .uffb-venue-title {
      font-size: 17px;
      font-weight: 700;
    }
    .uffb-addr {
      text-decoration: underline;
      opacity: 1;
      color: #000;
    }
    .uffb-book-btn {
      display: inline-block;
      padding: 10px 18px;
      border: 1.5px solid var(--paragraphLinkColor);
      border-radius: 0px;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #333;
    }
    .uffb-card-actions {
      margin-top: 6px;
    }

    .uffb-noscroll {
      overflow: hidden;
    }
    #uffb-lightbox {
      position: fixed;
      inset: 0;
      display: none;
      z-index: 9999;
    }
    #uffb-lightbox.open {
      display: block;
    }
    .uffb-lb-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
    }
    .uffb-lb-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(92vw, 960px);
      aspect-ratio: 16/9;
      background: #000;
      border-radius: 0px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }
    .uffb-lb-close {
      position: absolute;
      top: 8px;
      right: 10px;
      z-index: 2;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.9);
      font-size: 22px;
      line-height: 1;
    }
    .uffb-lb-viewport,
    #uffb-lb-iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }

    /* --- Shorts + Screenings two-column layout (desktop) --- */
    .uffb-shorts-layout {
      display: grid;
      gap: 28px;
      margin-top: 32px;
    }
    @media (min-width: 1100px) {
      .uffb-shorts-layout {
        grid-template-columns: 2fr 1fr;
        align-items: start;
      }
    }
    .uffb-shorts-left {
      max-width: 960px;
      margin: 0 auto;
    }
    .uffb-shorts-right {
      position: relative;
    }
    @media (min-width: 1100px) {
      .uffb-shorts-right {
        padding-left: 20px;
      }
    }

    /* --- Shorts list tweaks --- */
    .uffb-shorts-block {
      margin-top: 8px;
    }
    .uffb-shorts-list {
      list-style: decimal;
      padding-left: 0;
      margin: 0;
      display: grid;
      gap: 75px;
    }

    .uffb-short-item {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 16px;
      align-items: start;
    }

    .uffb-short-item {
      display: grid;
      grid-template-columns: 2fr 1fr; /* 2 columns */
      gap: 8px 28px;
    }
    .uffb-short-item h2 {
      margin-top: 0;
      font-size: 1.25rem;
    }

    /* Any child with .full-row will span both columns */
    .uffb-short-item > .full-row {
      grid-column: 1 / -1;
    }

    /* (optional) mobile: collapse to 1 column, the span is harmless */
    @media (max-width: 700px) {
      .uffb-short-item {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 800px) {
      .uffb-short-item {
        grid-template-columns: 200px 1fr;
      }
    }
    @media (max-width: 640px) {
      .uffb-short-item {
        grid-template-columns: 1fr;
      }
      .uffb-short-item h2 {
        margin: 10px 0 15px;
      }
    }

    .uffb-short-img {
      width: 100%;
      aspect-ratio: 16/9;
      background: #f3f3f3;
      border-radius: 0px;
      overflow: hidden;
    }

    .uffb-short-img img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      transition: transform 0.35s ease;
    }

    .uffb-short-item:hover .uffb-short-img img {
      transform: scale(1.03);
    }

    .uffb-short-body {
      display: grid;
      gap: 8px;
    }
    .uffb-short-title {
      font-weight: 800;
      font-size: 1.1rem;
      margin: 0;
    }
    .uffb-short-metas {
      display: grid;
      gap: 4px;
    }
    .uffb-short-meta1 {
      color: #ddd;
    }
    .uffb-short-meta1 em {
      font-style: normal;
      opacity: 0.9;
    }
    .uffb-short-meta2,
    .uffb-short-meta3 {
      color: #fff;
    }
    .uffb-short-meta2 {
      line-height: 1.5rem;
    }
    .uffb-short-desc {
      font-size: 1.03rem;
      line-height: 1.45;
      margin-top: 20px;
    }
    .uffb-short-actions {
      margin-top: 6px;
    }

    /* about directors section */
    .uffb-short-about {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px dotted var(--hairline, #ddd);
      font-size: 0.95em;
      color: lightgray;
      line-height: 1.5rem;
    }
    .uffb-short-about .ttl {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .uffb-short-about p {
      margin: 0.4rem 0;
    }
    .uffb-dir-name {
      font-weight: 700;
    }

    /* Partners */
    .uffb-partners {
      margin-top: 45px !important;
    }
    .uffb-partner-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 18px 24px;
      align-items: center;
    }
    .uffb-partner {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none; /* logo is the link */
    }
    .uffb-partner-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      /* keep logos visually consistent */
      max-width: 350px; /* desktop max width */
      background: white;
    }
    .uffb-partner-logo img {
      max-width: 100%;
      height: auto;
      display: block;
      object-fit: contain;
      /* optional: cap height to keep row tidy; tweak if needed */
      max-height: 120px;
    }
    @media (max-width: 640px) {
      .uffb-partner-logo {
        max-width: 150px;
      } /* phone max width */
      .uffb-partner-logo img {
        max-height: 95px;
      }
    }
  `;

  function injectCSS() {
    if (document.getElementById('uffb-film-style')) return;
    const s = document.createElement('style');
    s.id = 'uffb-film-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- render(el) ---------- */
  async function render(el) {
    injectCSS();

    const wrap = document.createElement('div');
    el.appendChild(wrap);

    const jsonUrl = el.dataset.json;
    if (!jsonUrl) {
      console.error('[UFFB] Missing data-json on', el);
      return;
    }

    let films = [];
    try {
      const res = await fetch(jsonUrl, { cache: 'no-cache' });
      if (!res.ok) throw new Error('load fail');
      films = await res.json();
    } catch (err) {
      wrap.innerHTML = `<p>${t('loadError')}</p>`;
      console.error('[UFFB] JSON fetch error', err);
      return;
    }

    const filmId = getFilmId();
    if (!filmId) return;
    const film = films.find((f) => f.id === filmId);
    if (!film) {
      wrap.innerHTML = `<p>${t('filmNotFound')}</p>`;
      return;
    }

    const isShortsProgram = Array.isArray(film.films) && film.films.length > 0;

    const title = localized(film.title) || film.original_title || '';
    const screeningsBlock = buildScreeningsSection(film);

    wrap.innerHTML = `
      <article class="uffb-film">
        ${buildBreadcrumb(film)}
        <header class="uffb-film-header">
          ${buildTopLine(film)}
          <h1 class="uffb-title visually-hidden">${title}</h1>
          ${isShortsProgram ? '' : buildMediaCarousel(film)}
        </header>

        ${
          isShortsProgram
            ? `
              <section class="uffb-shorts-layout">
                <div class="uffb-shorts-left">
                  ${buildShortsItemsSection(film)}
                  ${buildPartnersSection(film)}
                </div>
                <aside class="uffb-shorts-right">
                  ${screeningsBlock}
                </aside>
              </section>
            `
            : `
              <section class="uffb-two-col">
                <div class="uffb-col-left">
                  ${buildInfoBlock(film)}
                  ${buildCreditsBlock(film)}
                </div>
                <div class="uffb-col-right">
                  ${buildSynopsisBlock(film)}
                  ${buildPartnersSection(film)}
                </div>
              </section>

              ${screeningsBlock}
            `
        }

        <section class="uffb-actions"></section>
      </article>
    `;

    // trailer buttons → lightbox (topline + per-short)
    wrap.querySelectorAll('.uffb-trailer-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('data-trailer');
        if (url) openLightbox(url);
      });
    });

    // carousel (no-op if hero omitted for shorts)
    initCarousel(wrap);

    // tickets anchor behavior
    enableTicketsJump();

    // JSON-LD
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify(buildJsonLd(film));
    document.head.appendChild(ld);
  }

  /* ---------- robust init ---------- */
  let started = false;
  const tryStart = () => {
    const nodes = document.querySelectorAll(MOUNT);
    if (!nodes.length) return;
    if (started) return;
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
