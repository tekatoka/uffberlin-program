/* uffb-special.bundle.js — SPECIAL screenings (cards fill 100% width) */
(function () {
  const MOUNT = '.uffb-special';

  const html = String.raw;
  const css = String.raw;

  // Language & basePath consistent with your grid script
  const lang = location.pathname.startsWith('/de/') ? 'de' : 'en';
  const basePath = lang === 'de' ? '/de/uffb2025' : '/uffb2025';
  const locale = lang === 'de' ? 'de-DE' : 'en-GB';

  const I18N = {
    en: {
      director: 'Director',
      tickets: 'Tickets',
      weekdayDayMonthYear: {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
      cooperation: 'In cooperation with',
    },
    de: {
      director: 'Regie',
      tickets: 'Tickets',
      weekdayDayMonthYear: {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
      cooperation: 'In Kooperation mit',
    },
  };
  const t = (k) => I18N[lang][k];

  const CSS = css`
    .uffb-special .uffb-special-list {
      display: flex;
      flex-direction: column;
      gap: 36px;
    }
    .uffb-special .uffb-special-card {
      box-sizing: border-box !important;
      height: 100% !important;
      padding: 6% 6% 6% 6% !important;
      border-radius: 6px !important;
      background-color: #111111 !important;
      width: 100%;
      color: #fff;
    }
    .uffb-special .uffb-special-tag {
      display: inline-block;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      opacity: 0.9;
      margin-bottom: 12px;
    }
    /* Title uses your global .uffb-title; just spacing here */
    .uffb-special .uffb-title {
      margin: 0 0 16px 0;
      font-size: 2.25rem;
      color: var(--tweak-heading-extra-large-color-on-background);
    }

    .uffb-special .uffb-special-media {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      border-radius: 0px;
      padding: 10px 0 35px;
    }
    .uffb-special .uffb-special-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Program lines with top/bottom padding */
    .uffb-special .uffb-special-program {
      padding: 14px 0;
    }
    .uffb-special .uffb-special-program .row {
      display: block;
    }
    .uffb-special .uffb-special-program .tm {
      font-weight: 800;
    }
    .uffb-special .uffb-special-program .sep {
      margin: 0 0.4ch;
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

    .uffb-desc {
      margin: 15px 0 25px;
    }
    /* Partners grid */
    .uffb-special .uffb-partners {
      margin-top: 18px;
      gap: 12px 18px;
      align-items: center;
    }
    .uffb-special .uffb-partner a {
      color: var(--paragraphLinkColor, #0bb);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .uffb-special .uffb-partner a:hover {
      text-decoration: underline !important;
    }
    .uffb-special .uffb-partner-logo {
      object-fit: contain;
      display: block;
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
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      margin-top: 25px;
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
    const id = 'uffb-special-style-v2';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    try {
      s.textContent = CSS;
    } catch {
      s.appendChild(document.createTextNode(CSS));
    }
    (document.head || document.documentElement).appendChild(s);
  }

  // --- utils matching your grid script conventions
  function pickLangVal(v) {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    return v[lang] || v.de || v.en || '';
  }
  function joinVals(v) {
    const val = pickLangVal(v);
    if (Array.isArray(val))
      return val.map(pickLangVal).filter(Boolean).join(', ');
    return val;
  }
  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
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
  function getVenueName(s) {
    return (
      s.venue?.[lang] ||
      s.venue?.de ||
      s.venue?.en ||
      s.venue ||
      ''
    ).toString();
  }
  function mapsUrlFor(venueName, addressTxt) {
    const q = [venueName, addressTxt].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }
  function earliestScreening(film) {
    const list = (film.screenings || []).slice().sort((a, b) => {
      const ax = `${a.date || ''}T${a.time || '00:00'}`,
        bx = `${b.date || ''}T${b.time || '00:00'}`;
      return ax.localeCompare(bx);
    });
    return list[0] || null;
  }

  // --- Screening line + Tickets (same classes as your row/grid view)
  function screeningLine(s) {
    const dtISO = `${s.date}T${s.time || '00:00'}:00${offsetFor()}`;
    const d = new Date(dtISO);
    const when = `${fmt.format(d)}${s.time ? `, ${s.time}` : ''}`;

    const venueName = getVenueName(s);
    const addressTxt =
      typeof s.address === 'string'
        ? s.address
        : s.address?.[lang] || s.address?.de || s.address?.en || '';
    const mapsUrl = s.maps?.google || mapsUrlFor(venueName, addressTxt);

    const venueLine = venueName
      ? `<div class="uffb-venue">${escapeHtml(venueName)}</div>`
      : '';
    const addressLine = addressTxt
      ? `<div class="uffb-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${escapeHtml(addressTxt)}</a></div>`
      : '';

    const ticketHtml = s.tickets
      ? `<span class="uffb-tickets"><a href="${s.tickets}" target="_blank" rel="noopener" class="eventlist-button sqs-editable-button sqs-button-element--primary equal-button">${t('tickets')}</a></span>`
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

  function renderProgramRows(list) {
    if (!Array.isArray(list) || !list.length) return '';
    const rows = list
      .map((item) => {
        // supports { time, text:{en,de} } or plain "18:00 - Doors"
        if (
          item &&
          typeof item === 'object' &&
          ('time' in item || 'text' in item)
        ) {
          const tm = escapeHtml(item.time || '');
          const tx = escapeHtml(pickLangVal(item.text) || '');
          return `<div class="row"><span class="tm">${tm}</span><span class="sep"> - </span><span class="tx">${tx}</span></div>`;
        }
        const str = String(item);
        // as-is if author already provided "18:00 - Doors"
        return `<div class="row">${escapeHtml(str)}</div>`;
      })
      .join('');
    return `<div class="uffb-special-program">${rows}</div>`;
  }

  function buildPartnersSection(it) {
    const partners = Array.isArray(it.partners) ? it.partners : [];
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
        <h3 class="uffb-panel-title">${t('cooperation')}</h3>
        <div class="uffb-partner-grid">${items}</div>
      </section>
  `;
  }

  function specialCard(it) {
    const tag = pickLangVal(it.special_program_tag) || '';
    const title = pickLangVal(it.title) || 'Untitled';
    const href = `${basePath}/${encodeURIComponent(it.id)}`;
    const img = it.image || '';

    // --- META (reuse row view structure/classes) ---
    const countriesTxt = joinVals(it.countries);
    const yearTxt = it.year ? String(it.year) : '';
    const directorTxt = joinVals(it.director);
    let durationTxt = it.duration != null ? it.duration : '';
    durationTxt =
      typeof durationTxt === 'number'
        ? `${durationTxt}’`
        : pickLangVal(durationTxt);

    const metaBlock = `
      <div class="uffb-meta">
        ${
          [countriesTxt, yearTxt].filter(Boolean).length
            ? `<div class="uffb-meta1"><em>${escapeHtml([countriesTxt, yearTxt].filter(Boolean).join(' | '))}</em></div>`
            : ''
        }
        ${directorTxt ? `<div class="uffb-meta2" style="margin-top:10px">${t('director')}: ${escapeHtml(directorTxt)}</div>` : ''}
        ${durationTxt ? `<div class="uffb-meta3">${escapeHtml(durationTxt)}</div>` : ''}
      </div>
    `;

    const prog = renderProgramRows(it.special_program);
    const about = pickLangVal(it.short_description) || '';
    const first = earliestScreening(it);

    return html`
      <article class="uffb-special-card" data-id="${it.id}">
        ${tag ? `<div class="uffb-special-tag">#${escapeHtml(tag)}</div>` : ''}

        <!-- Title: use your global .uffb-title -->
        <h1 class="uffb-title">
          <a href="${href}">${escapeHtml(title)}</a>
        </h1>

        <div class="uffb-special-media">
          <img src="${img}" alt="${escapeHtml(title)}" />
        </div>

        ${metaBlock} ${prog || ''}
        ${about ? `<div class="uffb-desc">${escapeHtml(about)}</div>` : ''}
        ${first
          ? `<ul class="uffb-screenings" style="margin-top:12px">${screeningLine(first)}</ul>`
          : ''}
        ${buildPartnersSection(it)}
      </article>
    `;
  }

  function isSpecial(it) {
    return !!(
      it.special === true ||
      it.special_program_tag ||
      it.special_program
    );
  }

  function render(el) {
    injectCSS();
    const url = el.dataset.json;
    if (!url) {
      el.innerHTML = '<p style="color:#fff;opacity:.85">No JSON provided.</p>';
      return;
    }

    const listWrap = document.createElement('div');
    listWrap.className = 'uffb-special-list';
    el.appendChild(listWrap);

    fetch(url, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('Load failed');
        return r.json();
      })
      .then((data) => {
        const items = (Array.isArray(data) ? data : []).filter(isSpecial);
        items.sort((a, b) => {
          const as = earliestScreening(a),
            bs = earliestScreening(b);
          const ax = as ? `${as.date || ''}T${as.time || '00:00'}` : '9999';
          const bx = bs ? `${bs.date || ''}T${bs.time || '00:00'}` : '9999';
          return ax.localeCompare(bx);
        });
        listWrap.innerHTML =
          items.map(specialCard).join('') ||
          '<p style="color:#fff;opacity:.85">No special screenings.</p>';
      })
      .catch((err) => {
        listWrap.innerHTML =
          '<p style="color:#fff;opacity:.85">Could not load program.</p>';
        console.error('[UFFB special] JSON fetch error', err);
      });
  }

  // init
  let started = false;
  const tryStart = () => {
    const nodes = document.querySelectorAll(MOUNT);
    if (!nodes.length) return;
    if (started) return;
    started = true;
    nodes.forEach(render);
  };
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', tryStart);
  else tryStart();
  new MutationObserver(tryStart).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
