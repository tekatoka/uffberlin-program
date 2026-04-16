import { basePath, lang } from '../config.js';
import { ICONS } from '../icons.js';
import { t } from '../i18n.js';
import { getVenueName } from '../film-helpers.js';
import { parsePerDateLanguageNotes } from '../data/panels.js';
import {
  dateToDM,
  isAfterFestival,
  isPastScreeningDate,
  isoLocalToday,
  offsetFor,
  timeToMinutes,
} from '../utils/dates.js';
import { escapeHtml, joinVals, localized, safeTxt } from '../utils/text.js';

export const isParty = (it) =>
  it?.category?.key === 'festival-party' || it?.id === 'festival-party';

export function renderLineupList(item) {
  if (!Array.isArray(item.lineup) || item.lineup.length === 0) return '';
  const li = item.lineup
    .map((x) => `<li>${escapeHtml(String(x))}</li>`)
    .join('');
  return `<ol class="uffb-shorts">${li}</ol>`;
}

export function renderEntry(item) {
  return isParty(item) && item.entry
    ? `<div class="party-entry"><strong>${t('entry')}: ${escapeHtml(localized(item.entry))}</strong></div>`
    : '';
}

function toShortDirectorList(director) {
  if (!director) return [];
  const val = typeof director === 'object' ? localized(director) : director;
  return Array.isArray(val) ? val.filter(Boolean) : val ? [val] : [];
}

export function renderShortsList(item) {
  const list = Array.isArray(item.films) ? item.films : null;
  if (!list || !list.length) return '';

  const li = list
    .map((sf) => {
      const title = localized(sf.title) || '';
      const directorList = toShortDirectorList(sf.director);
      const directorLine = directorList.join(', ');
      const dir = sf.director ? ` ${t('by')} ${escapeHtml(directorLine)}` : '';
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

  return `<ol class="uffb-shorts">${li}</ol>`;
}

export function screeningsFor(item, opts = {}) {
  const onlyDate = opts.onlyDate || null;
  const onlyVenue = opts.onlyVenue || null;

  return (item.screenings || []).filter((s) => {
    if (onlyDate && s.date !== onlyDate) return false;
    if (onlyVenue && safeTxt(getVenueName(s)) !== onlyVenue) return false;
    return true;
  });
}

export function renderTopTools(item, isFavourite) {
  const favActive = isFavourite(item);
  return `
    <div class="uffb-item-tools">
      ${
        item.trailer
          ? `<button type="button" class="uffb-tool-btn" data-trailer="${encodeURIComponent(item.trailer)}">
              ${ICONS.play}
              <span>${t('watchTrailer')}</span>
            </button>`
          : ''
      }
      <button
        type="button"
        class="uffb-tool-btn uffb-icon-tool ${favActive ? 'is-active' : ''}"
        data-favourite-key="${encodeURIComponent(item.storageId || item.id)}"
        aria-pressed="${favActive ? 'true' : 'false'}"
        aria-label="${favActive ? t('removeFromFavourites') : t('saveToFavourites')}"
        title="${favActive ? t('removeFromFavourites') : t('saveToFavourites')}"
      >
        ${ICONS.heart(favActive)}
      </button>
    </div>
  `;
}

export function renderScreeningLine(
  item,
  s,
  { planner, screeningStorageKey, fmt }
) {
  const dtISO = `${s.date}T${s.time || '00:00'}:00${offsetFor()}`;
  const d = new Date(dtISO);
  const when = `${fmt.format(d)}${s.time ? `, ${s.time}` : ''}`;

  const perDateNotes = parsePerDateLanguageNotes(item);
  const noteKey = dateToDM(s.date);
  const langNote = perDateNotes[noteKey] || '';

  const venueName = getVenueName(s);
  const addressTxt =
    typeof s.address === 'string'
      ? s.address
      : s.address?.[lang] || s.address?.de || s.address?.en || '';

  const website = s.website || '';
  const isSoldOut = s.isSoldOut;
  const isPast = isPastScreeningDate(s.date);

  let mapsUrl = s.maps?.google || '';
  if (!mapsUrl && (venueName || addressTxt)) {
    const q = [venueName, addressTxt].filter(Boolean).join(', ');
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }

  const key = screeningStorageKey(item, s);
  const planned = planner.has(key);

  const plannerBtn = isPast
    ? `<button type="button" class="uffb-planner-btn" disabled>${t('datePassed')}</button>`
    : `<button
        type="button"
        class="uffb-planner-btn ${planned ? 'is-active' : ''}"
        data-planner-key="${encodeURIComponent(key)}"
        aria-pressed="${planned ? 'true' : 'false'}"
      >
        ${ICONS.calendar(planned)}
        <span>${planned ? t('removeFromPlanner') : t('addToPlanner')}</span>
      </button>`;

  const ticketHtml =
    isSoldOut || isPast
      ? `<span class="uffb-tickets is-disabled"><a href="#">${isSoldOut ? t('soldOut') : t('tickets')}</a></span>`
      : s.tickets
        ? `<span class="uffb-tickets"><a href="${s.tickets}" target="_blank" rel="noopener">${t('tickets')}</a></span>`
        : '';

  return `
    <li class="uffb-screening">
      <div class="uffb-left">
        <div class="uffb-when"><strong>${when}</strong></div>
        ${venueName ? `<div class="uffb-venue"><a href="${website}" target="_blank">${escapeHtml(venueName)}</a></div>` : ''}
        ${addressTxt ? `<div class="uffb-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${escapeHtml(addressTxt)}</a></div>` : ''}
        ${langNote ? `<div class="uffb-lang-note"><em>${escapeHtml(langNote)}</em></div>` : ''}
        ${!ticketHtml && !isParty(item) ? `<div class="uffb-no-tickets">${t('bookTicketsSoon')}</div>` : ''}
      </div>
      <div class="uffb-screening-actions">
        ${plannerBtn}
        ${!isAfterFestival(isoLocalToday()) ? ticketHtml : ''}
      </div>
    </li>
  `;
}

export function renderMeta(item, compact = false) {
  const genreTxt = joinVals(item.genre);
  const countriesTxt = joinVals(item.countries);
  const yearTxt = item.year ? String(item.year) : '';
  const directorTxt = joinVals(item.director);
  const curatorTxt = joinVals(item.curator);
  let durationTxt = item.duration != null ? item.duration : '';
  if (typeof durationTxt === 'number') durationTxt = `${durationTxt}'`;
  else durationTxt = localized(durationTxt);

  if (compact) {
    return `
      <div class="uffb-compact-meta">
        ${[countriesTxt, yearTxt].filter(Boolean).join(' • ')}
        ${directorTxt ? `<div>${t('director')}: ${escapeHtml(directorTxt)}</div>` : ''}
      </div>
    `;
  }

  return `
    <div class="uffb-meta">
      ${genreTxt ? `<div class="uffb-meta1"><em>${escapeHtml(genreTxt)}</em></div>` : ''}
      ${
        [countriesTxt, yearTxt].filter(Boolean).length
          ? `<div class="uffb-meta1"><em>${escapeHtml([countriesTxt, yearTxt].filter(Boolean).join(' | '))}</em></div>`
          : ''
      }
      ${directorTxt ? `<div class="uffb-meta2" style="margin-top:10px">${t('director')}: ${escapeHtml(directorTxt)}</div>` : ''}
      ${curatorTxt ? `<div class="uffb-meta2" style="margin-top:10px">${t('curator')}: ${escapeHtml(curatorTxt)}</div>` : ''}
      ${durationTxt ? `<div class="uffb-meta3">${escapeHtml(durationTxt)}</div>` : ''}
    </div>
  `;
}

export function renderProgramCard(item, opts) {
  const { state, isFavourite, planner, screeningStorageKey, fmt } = opts;
  const onlyDate = opts.onlyDate || null;
  const onlyVenue = opts.onlyVenue || null;
  const view = state.view;

  const href = `${basePath}/${encodeURIComponent(item.id)}`;
  const title =
    item.title?.[lang] ||
    item.title?.de ||
    item.title?.en ||
    item.title?.uk ||
    'Untitled';
  const category =
    item.category?.[lang] ||
    item.category?.de ||
    item.category?.en ||
    item.category?.uk ||
    '—';
  const desc =
    item.short_description?.[lang] ||
    item.short_description?.de ||
    item.short_description?.en ||
    item.short_description?.uk ||
    '';
  const img = item.image || '';
  const additionalInfo = item.additional_info
    ? localized(item.additional_info)
    : '';

  const screenings = screeningsFor(item, { onlyDate, onlyVenue })
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
    .map((s) =>
      renderScreeningLine(item, s, { planner, screeningStorageKey, fmt })
    )
    .join('');

  if (view === 'tiles') {
    return `
      <article class="uffb-card" data-id="${item.id}">
        <a class="uffb-media" href="${href}" aria-label="${escapeHtml(title)}">
          <img src="${img}" alt="${escapeHtml(title)}" />
        </a>
        <div class="uffb-body">
          <div class="uffb-card-head">
            <div>
              <div class="uffb-category">${escapeHtml(category)}</div>
              <h3 class="uffb-title"><a href="${href}">${escapeHtml(title)}</a></h3>
            </div>
            ${renderTopTools(item, isFavourite)}
          </div>
          ${renderMeta(item, false)}
          ${desc?.trim() ? `<div class="uffb-desc">${desc}</div>` : ''}
          ${additionalInfo ? `<div class="uffb-warning">${additionalInfo}</div>` : ''}
          ${renderLineupList(item)}
          ${renderEntry(item)}
          ${item.category?.key === 'panel_discussion' && item.panel_extra_html ? item.panel_extra_html : ''}
          ${renderShortsList(item)}
          <div class="uffb-program-item__bottom">
            <ul class="uffb-screenings uffb-screenings--always">${screenings}</ul>
          </div>
        </div>
      </article>
    `;
  }

  const compact = view === 'compact';

  return `
    <article class="uffb-program-item uffb-program-item--${compact ? 'compact' : 'details'}" data-id="${item.id}">
      <div class="uffb-program-item__top">
        <a class="uffb-media" href="${href}" aria-label="${escapeHtml(title)}">
          <img src="${img}" alt="${escapeHtml(title)}" />
        </a>

        <div class="uffb-program-item__content">
          <div class="uffb-item-header">
            <div class="uffb-item-header-main">
              <div class="uffb-category">${escapeHtml(category)}</div>
              <h3 class="uffb-title"><a href="${href}">${escapeHtml(title)}</a></h3>
              ${renderMeta(item, compact)}
              ${!compact && desc?.trim() ? `<div class="uffb-desc">${desc}</div>` : ''}
              ${!compact && additionalInfo ? `<div class="uffb-warning">${additionalInfo}</div>` : ''}
              ${!compact ? renderLineupList(item) : ''}
              ${!compact ? renderEntry(item) : ''}
              ${!compact && item.category?.key === 'panel_discussion' && item.panel_extra_html ? item.panel_extra_html : ''}
              ${!compact ? renderShortsList(item) : ''}
            </div>
            ${renderTopTools(item, isFavourite)}
          </div>
        </div>
      </div>

      <div class="uffb-program-item__bottom">
        <ul class="uffb-screenings uffb-screenings--always">
          ${screenings || `<li class="uffb-screening"><div class="uffb-left">${t('noDates')}</div></li>`}
        </ul>
      </div>
    </article>
  `;
}

export function renderPlannerEntry(entry, { fmt }) {
  const item = entry.item;
  const screening = entry.screening;
  const href = `${basePath}/${encodeURIComponent(item.id)}`;
  const title =
    item.title?.[lang] ||
    item.title?.de ||
    item.title?.en ||
    item.title?.uk ||
    'Untitled';

  const dtISO = `${screening.date}T${screening.time || '00:00'}:00${offsetFor()}`;
  const d = new Date(dtISO);
  const when = `${fmt.format(d)}${screening.time ? `, ${screening.time}` : ''}`;

  return `
    <article class="uffb-planner-entry">
      <div>
        <h4 class="uffb-planner-entry-title">
          <a href="${href}">${escapeHtml(title)}</a>
        </h4>
        <div class="uffb-planner-entry-meta">${escapeHtml(when)}</div>
        <div class="uffb-planner-entry-meta">${escapeHtml(getVenueName(screening))}</div>
      </div>
      <div>
        <button
          type="button"
          class="uffb-planner-btn is-active"
          data-planner-key="${encodeURIComponent(entry.key)}"
        >
          ${ICONS.calendar(true)}
          <span>${t('remove')}</span>
        </button>
      </div>
    </article>
  `;
}
