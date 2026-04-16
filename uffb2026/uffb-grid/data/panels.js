import { lang, PANEL_IMG_URL } from '../config.js';
import { PANEL_TEXT } from '../i18n.js';
import { pad2 } from '../utils/dates.js';
import { escapeHtml, localized } from '../utils/text.js';

export function parsePerDateLanguageNotes(film) {
  const raw =
    (film.language &&
      (film.language[lang] || film.language.en || film.language.de)) ||
    film.language;
  if (!raw || typeof raw !== 'string') return {};

  const parts = raw
    .split('|')
    .flatMap((p) => String(p).split('\n'))
    .map((s) => s.trim())
    .filter(Boolean);
  const map = {};
  const re = /^\s*(\d{1,2})\.(\d{1,2})\.?\s*:?\s*(.+?)\s*$/;
  for (const p of parts) {
    const m = p.match(re);
    if (!m) continue;
    const dd = pad2(m[1]);
    const mm = pad2(m[2]);
    const note = m[3];
    map[mm + '-' + dd] = note;
  }
  return map;
}

export function extractPanelTitle(descByLang) {
  const OPEN_CLOSE_PAIRS = [
    { open: '“', close: '”' },
    { open: '„', close: '“' },
    { open: '«', close: '»' },
    { open: '‚', close: '’' },
    { open: '‘', close: '’' },
    { open: '"', close: '"' },
  ];

  const STRIP_EDGE_QUOTES_RE = /^[“”„«»‚‘’"]+|[“”„«»‚‘’"]+$/g;

  function findAfterKeyword(text) {
    if (!text) return '';
    const m = text.match(/(panel\s*discussion|podiumsdiskussion)/i);
    if (!m) return '';

    const startIdx = m.index + m[0].length;
    const tail = text.slice(startIdx);

    for (const { open, close } of OPEN_CLOSE_PAIRS) {
      const o = tail.indexOf(open);
      if (o === -1) continue;
      const c = tail.indexOf(close, o + open.length);
      if (c === -1) continue;
      const inner = tail.slice(o + open.length, c).trim();
      return inner.replace(STRIP_EDGE_QUOTES_RE, '').trim();
    }

    return '';
  }

  const enSrc = (descByLang?.en || descByLang?.de || '').trim();
  const deSrc = (descByLang?.de || descByLang?.en || '').trim();

  return {
    en: findAfterKeyword(enSrc),
    de: findAfterKeyword(deSrc),
  };
}

export function cloneScreeningForPanel(s) {
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

export function hasAny(obj, keys) {
  return !!obj && keys.some((k) => obj[k] != null && obj[k] !== '');
}

export function resolvePanelScreenings(film) {
  const pd = film.panel_discussion || {};
  const parentList = Array.isArray(film.screenings) ? film.screenings : [];
  const firstParent = parentList[0] || {};

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

  if (hasAny(pd, ['date', 'time', 'venue', 'address', 'website', 'maps', 'tickets'])) {
    return [{
      date: pd.date || firstParent.date || '',
      time: (pd.time ?? firstParent.time) || '',
      venue: pd.venue || firstParent.venue,
      address: pd.address || firstParent.address,
      website: pd.website || firstParent.website,
      maps: pd.maps || firstParent.maps,
      tickets: pd.tickets || firstParent.tickets || '',
    }];
  }

  return parentList.map((s) => cloneScreeningForPanel(s));
}

export function buildModAndGuestsFromParticipants(pd) {
  const list = Array.isArray(pd?.participants) ? pd.participants : [];

  const fmt = (p) => {
    const name = (p?.name || '').trim();
    const roleTxt = p?.role
      ? (typeof p.role === 'object' ? localized(p.role) : String(p.role)).trim()
      : '';
    if (!name) return '';
    const nameHtml = `<strong>${escapeHtml(name)}</strong>`;
    const roleHtml = roleTxt ? ` (${escapeHtml(roleTxt)})` : '';
    return `${nameHtml}${roleHtml}`;
  };

  const moderators = list.filter((p) => p.isModerator).map(fmt).filter(Boolean).join(', ');
  const guests = list.filter((p) => !p.isModerator).map(fmt).filter(Boolean).join(', ');

  return { moderators, guests };
}

export function buildPartnersHtml(film) {
  const partners = Array.isArray(film.partners) ? film.partners : [];
  if (!partners.length) return '';
  const txt = PANEL_TEXT[lang] || PANEL_TEXT.en;

  const items = partners
    .map((p) => {
      const name = p && p.name ? String(p.name).trim() : '';
      if (!name) return '';
      if (p.url) {
        return `<strong><a href="${p.url}" target="_blank" rel="noopener">${escapeHtml(name)}</a></strong>`;
      }
      return `<strong>${escapeHtml(name)}</strong>`;
    })
    .filter(Boolean)
    .join(', ');

  if (!items) return '';
  return `
    <div class="uffb-panel-extra">
      <div class="uffb-partner-head">
        <strong>${escapeHtml(txt.inPartnershipWith)}:</strong>
        <span class="uffb-partners">${items}</span>
      </div>
    </div>
  `;
}

export function makePanelItemsFromFilm(film) {
  const pd = film.panel_discussion;
  if (!pd) return [];

  const { en: pTitleEn, de: pTitleDe } = extractPanelTitle(pd.description || {});
  const filmTitleEn = film.title?.en || film.title?.de || film.title?.uk || '';
  const filmTitleDe = film.title?.de || film.title?.en || film.title?.uk || filmTitleEn;

  const panel_extra_html = buildPartnersHtml(film);
  const { moderators: mod, guests } = buildModAndGuestsFromParticipants(pd);
  const panelScreenings = resolvePanelScreenings(film);

  return panelScreenings.map((s, idx) => {
    const id = `${pd.id}`;

    const short_description = {
      en: `${PANEL_TEXT.en.after} “${filmTitleEn}”.\n${PANEL_TEXT.en.moderator}: ${mod || PANEL_TEXT.en.tba}.\n${PANEL_TEXT.en.guests}: ${guests || PANEL_TEXT.en.tba}.`,
      de: `${PANEL_TEXT.de.after} „${filmTitleDe}“.\n${PANEL_TEXT.de.moderator}: ${mod || PANEL_TEXT.de.tba}.\n${PANEL_TEXT.de.guests}: ${guests || PANEL_TEXT.de.tba}.`,
      uk: `${PANEL_TEXT.uk?.after || PANEL_TEXT.en.after} “${film.title?.uk || filmTitleEn}”.\n${PANEL_TEXT.uk?.moderator || PANEL_TEXT.en.moderator}: ${mod || PANEL_TEXT.uk?.tba || PANEL_TEXT.en.tba}.\n${PANEL_TEXT.uk?.guests || PANEL_TEXT.en.guests}: ${guests || PANEL_TEXT.uk?.tba || PANEL_TEXT.en.tba}.`,
    };

    const title = {
      en: pTitleEn || PANEL_TEXT.en.label + ` – ${filmTitleEn}`,
      de: pTitleDe || PANEL_TEXT.de.label + ` – ${filmTitleDe}`,
      uk: (PANEL_TEXT.uk?.label || PANEL_TEXT.en.label) + ` – ${film.title?.uk || filmTitleEn}`,
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
      screenings: [{
        date: s.date,
        time: s.time || '',
        venue: s.venue,
        address: s.address,
        website: s.website,
        maps: s.maps,
        tickets: s.tickets || '',
      }],
      panel_extra_html,
      published: true,
      storageId: `${pd.id}::${s.date || ''}::${s.time || idx}`,
    };
  });
}
