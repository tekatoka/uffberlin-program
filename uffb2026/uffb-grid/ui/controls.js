import { html, lang } from '../config.js';
import { ICONS } from '../icons.js';
import { I18N, t } from '../i18n.js';

export function attachClearButton(selectEl) {
  if (!selectEl) return;
  const label = selectEl.closest('label');
  if (!label) return;

  selectEl.classList.add('has-clear');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'uffb-clear';
  const labelTxt = label.querySelector('span')?.textContent?.trim() || 'filter';
  btn.setAttribute('aria-label', `Clear ${labelTxt}`);
  btn.innerHTML = '×';
  label.appendChild(btn);

  const sync = () => {
    label.classList.toggle('is-filled', !!selectEl.value);
  };

  btn.addEventListener('click', () => {
    if (selectEl.value !== '') {
      selectEl.value = '';
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    }
    sync();
  });

  selectEl.addEventListener('change', sync);
  sync();
}

export function buildControls(container) {
  const sectionTabs = document.createElement('div');
  sectionTabs.className = 'uffb-section-tabs';
  sectionTabs.innerHTML = `
      <button type="button" class="uffb-section-btn" data-section="program">
        ${ICONS.program}
        <span>${t('program')}</span>
      </button>
      <button type="button" class="uffb-section-btn" data-section="favourites">
        ${ICONS.heart(false)}
        <span>${t('myFavourites')}</span>
        <span class="uffb-section-count" data-count-for="favourites"></span>
      </button>
      <button type="button" class="uffb-section-btn" data-section="planner">
        ${ICONS.planner(false)}
        <span>${t('festivalPlanner')}</span>
        <span class="uffb-section-count" data-count-for="planner"></span>
      </button>
    `;
  container.appendChild(sectionTabs);

  const controls = document.createElement('div');
  controls.className = 'uffb-controls';
  controls.innerHTML = `
      <button class="uffb-icon-btn" id="filterToggle" aria-expanded="false" aria-controls="filters" title="${t('filterBtn')}">
        ${ICONS.filter}<span class="lbl">${t('filterBtn').toUpperCase()}</span>
      </button>
      <button class="uffb-icon-btn" id="searchToggle" aria-expanded="false" aria-controls="searchbar" title="${t('searchBtn')}">
        ${ICONS.search}<span class="lbl">${t('searchBtn').toUpperCase()}</span>
      </button>
    `;
  container.appendChild(controls);

  const filters = document.createElement('form');
  filters.id = 'filters';
  filters.className = 'uffb-filters';
  filters.setAttribute('hidden', '');
  filters.innerHTML = html`
      <label>
      <span>${t('category')}</span>
      <select id="filterCategory" class="uffb-field">
        <option value="">${t('all')}</option>
      </select>
    </label>
    <label>
      <span>${t('venue')}</span>
      <select id="filterVenue" class="uffb-field">
        <option value="">${t('all')}</option>
      </select>
    </label>
    <label>
      <span>${t('date')}</span>
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
  search.setAttribute('hidden', '');
  search.innerHTML = html`
      <input
      type="search"
      id="searchInput"
      class="uffb-field"
      placeholder="${t('searchPh')}"
    />
    `;
  container.appendChild(search);

  const groupWrap = document.createElement('div');
  groupWrap.className = 'uffb-groupby';
  groupWrap.innerHTML = html`
      <div class="uffb-groupby-head">
      ${ICONS.group}
      <span>${I18N[lang].groupBy}</span>
    </div>
    <div class="chips" role="radiogroup" aria-label="${I18N[lang].groupBy}">
      <label class="uffb-chip" data-value="">
        <input type="radio" name="groupby" value="" checked />
        <span>${I18N[lang].none}</span>
      </label>
      <label class="uffb-chip" data-value="category">
        <input type="radio" name="groupby" value="category" />
        <span>${t('category')}</span>
      </label>
      <label class="uffb-chip" data-value="date">
        <input type="radio" name="groupby" value="date" />
        <span>${t('date')}</span>
      </label>
      <label class="uffb-chip" data-value="today" id="groupTodayChip" hidden>
        <input type="radio" name="groupby" value="today" />
        <span>${t('today')}</span>
      </label>
    </div>
    `;
  controls.appendChild(groupWrap);

  const viewBar = document.createElement('div');
  viewBar.className = 'uffb-viewbar';
  viewBar.innerHTML = `
      <div class="uffb-viewswitch">
        <span class="uffb-view-label">${t('view')}</span>
        <div class="uffb-view-segment" role="tablist" aria-label="${t('view')}">
          <button type="button" class="uffb-view-btn" data-view="details">${ICONS.viewDetails}<span>${t('detailsView')}</span></button>
          <button type="button" class="uffb-view-btn" data-view="compact">${ICONS.viewCompact}<span>${t('compactView')}</span></button>
          <button type="button" class="uffb-view-btn" data-view="tiles">${ICONS.viewTiles}<span>${t('tilesView')}</span></button>
        </div>
      </div>
      <div class="uffb-results-count"></div>
    `;
  container.appendChild(viewBar);

  return {
    section: {
      root: sectionTabs,
      buttons: sectionTabs.querySelectorAll('[data-section]'),
      favouritesCount: sectionTabs.querySelector(
        '[data-count-for="favourites"]'
      ),
      plannerCount: sectionTabs.querySelector('[data-count-for="planner"]'),
    },
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
    group: {
      root: groupWrap,
      radios: groupWrap.querySelectorAll('input[name="groupby"]'),
      todayChip: groupWrap.querySelector('#groupTodayChip'),
    },
    view: {
      root: viewBar,
      buttons: viewBar.querySelectorAll('[data-view]'),
      resultsCount: viewBar.querySelector('.uffb-results-count'),
    },
  };
}
