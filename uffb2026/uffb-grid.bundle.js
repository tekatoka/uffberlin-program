import { MOUNT, basePath, locale } from './uffb-grid/config.js';
import {
  explodeByDate,
  categoryRank,
  earliestDate,
  getCategoryKeyAndLabel,
  getGroupingKeyAndLabel,
  getVenueName,
  isoToLabel,
} from './uffb-grid/film-helpers.js';
import { I18N, t, tf } from './uffb-grid/i18n.js';
import { injectCSS } from './uffb-grid/styles.js';
import {
  itemStorageId,
  createStore,
  screeningStorageKey,
} from './uffb-grid/utils/storage.js';
import {
  isoLocalToday,
  isWithinFestival,
  timeToMinutes,
} from './uffb-grid/utils/dates.js';
import { localized, langTxt, safeTxt } from './uffb-grid/utils/text.js';
import { buildControls, attachClearButton } from './uffb-grid/ui/controls.js';
import { mountModal } from './uffb-grid/ui/modal.js';
import { makePanelItemsFromFilm } from './uffb-grid/data/panels.js';
import {
  renderPlannerEntry,
  renderProgramCard,
} from './uffb-grid/render/program.js';

(function () {
  const fmt = new Intl.DateTimeFormat(
    locale,
    I18N[
      location.pathname.startsWith('/de/')
        ? 'de'
        : location.pathname.startsWith('/uk/')
          ? 'uk'
          : 'en'
    ].weekdayDayMonthYear
  );

  function render(el) {
    injectCSS();

    const wrap = document.createElement('div');
    el.appendChild(wrap);

    const ui = buildControls(wrap);

    const todayISO = isoLocalToday();
    const todayRadio = ui.group.root.querySelector(
      'input[name="groupby"][value="today"]'
    );

    const outlet = document.createElement('div');
    outlet.className = 'uffb-outlet';
    wrap.appendChild(outlet);

    const loader = document.createElement('div');
    loader.className = 'uffb-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
    loader.innerHTML = `<span class="dot" aria-hidden="true"></span><span class="sr-only">${t('loading')}…</span>`;
    wrap.insertBefore(loader, outlet);

    const showLoader = () => loader.classList.add('is-active');
    const hideLoader = () => loader.classList.remove('is-active');

    const defaultGroup = (el.dataset.defaultGroup || 'category').toLowerCase();
    const jsonUrl = el.dataset.json;

    const scope = (jsonUrl.match(/20\d{2}/) || [])[0] || 'festival';
    const store = createStore(scope);
    const favourites = new Set(store.read(store.keys.favourites, []));
    const planner = new Set(store.read(store.keys.planner, []));

    const defaultView =
      (el.dataset.layout || el.dataset.view || '').toLowerCase() === 'row'
        ? 'details'
        : 'tiles';

    let items = [];
    let filtered = [];

    const state = {
      category: '',
      venue: '',
      title: '',
      date: '',
      q: '',
      groupBy: defaultGroup,
      section: store.read(store.keys.section, 'program'),
      view: store.read(store.keys.view, defaultView),
    };

    const saveFavourites = () =>
      store.write(store.keys.favourites, Array.from(favourites));
    const savePlanner = () =>
      store.write(store.keys.planner, Array.from(planner));
    const saveView = () => store.write(store.keys.view, state.view);
    const saveSection = () => store.write(store.keys.section, state.section);
    const isFavourite = (item) => favourites.has(itemStorageId(item));

    function syncChips() {
      ui.group.root.querySelectorAll('.uffb-chip').forEach((chip) => {
        const input = chip.querySelector('input[type="radio"]');
        chip.dataset.checked = input.checked ? 'true' : 'false';
      });
    }

    function setGroupBy(val) {
      ui.group.radios.forEach((r) => (r.checked = r.value === val));
      state.groupBy = val;
      syncChips();
    }

    function setDateFilter(iso) {
      if (iso) {
        const has = Array.from(ui.filters.date.options).some(
          (o) => o.value === iso
        );
        if (!has) {
          const opt = document.createElement('option');
          opt.value = iso;
          opt.textContent = isoToLabel(iso);
          ui.filters.date.appendChild(opt);
        }
      }
      ui.filters.date.value = iso || '';
      state.date = iso || '';
    }

    if (isWithinFestival(todayISO)) {
      ui.group.todayChip?.removeAttribute('hidden');
    }

    ui.group.radios.forEach((r) => {
      r.checked = r.value === state.groupBy;
      r.addEventListener('change', () => {
        if (!r.checked) return;
        setGroupBy(r.value);
        if (r.value === 'today') setDateFilter(todayISO);
        applyAll();
      });
    });

    ui.section.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.section = btn.dataset.section;
        saveSection();
        syncTopUi();
        applyAll();
      });
    });

    ui.view.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.view = btn.dataset.view;
        saveView();
        syncTopUi();
        applyAll();
      });
    });

    function syncTopUi() {
      ui.section.buttons.forEach((btn) => {
        btn.classList.toggle(
          'is-active',
          btn.dataset.section === state.section
        );
      });
      ui.view.buttons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.view === state.view);
      });

      const plannerMode = state.section === 'planner';
      ui.controls.classList.toggle('uffb-hidden-force', plannerMode);
      ui.filters.root.classList.toggle('uffb-hidden-force', plannerMode);
      ui.search.root.classList.toggle('uffb-hidden-force', plannerMode);
      ui.view.root.classList.toggle('uffb-hidden-force', plannerMode);
    }

    function getPlannerEntries() {
      return items
        .flatMap((item) =>
          (item.screenings || [])
            .filter((s) => planner.has(screeningStorageKey(item, s)))
            .map((screening) => ({
              item,
              screening,
              key: screeningStorageKey(item, screening),
            }))
        )
        .sort((a, b) => {
          const da = a.screening.date || '';
          const db = b.screening.date || '';
          if (da !== db) return da.localeCompare(db);
          const ta = timeToMinutes(a.screening.time);
          const tb = timeToMinutes(b.screening.time);
          if (ta !== tb) return ta - tb;
          return (localized(a.item.title) || '').localeCompare(
            localized(b.item.title) || '',
            locale
          );
        });
    }

    function refreshCounters() {
      const favCount = items.filter((item) =>
        favourites.has(itemStorageId(item))
      ).length;
      const plannerCount = getPlannerEntries().length;
      ui.section.favouritesCount.textContent = `(${favCount})`;
      ui.section.plannerCount.textContent = `(${plannerCount})`;
    }

    function setResultsCount(n) {
      ui.view.resultsCount.textContent =
        state.section === 'planner'
          ? tf('plannerCount', n)
          : tf('resultsCount', n);
    }

    function bindInteractiveButtons() {
      const modal = mountModal();

      outlet.querySelectorAll('[data-trailer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const u = decodeURIComponent(
            e.currentTarget.getAttribute('data-trailer')
          );
          modal.open(u);
        });
      });

      outlet.querySelectorAll('[data-favourite-key]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = decodeURIComponent(btn.dataset.favouriteKey);
          if (favourites.has(key)) favourites.delete(key);
          else favourites.add(key);
          saveFavourites();
          refreshCounters();
          applyAll();
        });
      });

      outlet.querySelectorAll('[data-planner-key]').forEach((btn) => {
        if (btn.disabled) return;
        btn.addEventListener('click', () => {
          const key = decodeURIComponent(btn.dataset.plannerKey);
          if (planner.has(key)) planner.delete(key);
          else planner.add(key);
          savePlanner();
          refreshCounters();
          applyAll();
        });
      });
    }

    function renderPlannerView() {
      const entries = getPlannerEntries();
      setResultsCount(entries.length);

      if (!entries.length) {
        outlet.innerHTML = `
          <div class="uffb-empty">
            <h4>${t('plannerEmptyTitle')}</h4>
            <p>${t('plannerEmptyHint')}</p>
          </div>
        `;
        return;
      }

      const grouped = new Map();
      entries.forEach((entry) => {
        const date = entry.screening.date || 'undated';
        if (!grouped.has(date)) grouped.set(date, []);
        grouped.get(date).push(entry);
      });

      const sections = Array.from(grouped.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(
          ([date, entriesForDate]) => `
            <section class="uffb-group">
              <h4 class="uffb-group-title">${date === 'undated' ? t('noDates') : isoToLabel(date)}</h4>
              <div class="uffb-planner-list">
                ${entriesForDate.map((entry) => renderPlannerEntry(entry, { fmt })).join('')}
              </div>
            </section>
          `
        )
        .join('');

      outlet.innerHTML = `<div class="uffb-groups">${sections}</div>`;
      bindInteractiveButtons();
    }

    function renderUngrouped(list, onlyDate) {
      const cls = state.view === 'tiles' ? 'uffb-grid' : 'uffb-program-list';
      outlet.innerHTML = `
        <div class="${cls}">
          ${list
            .map((item) =>
              renderProgramCard(item, {
                state,
                isFavourite,
                planner,
                screeningStorageKey,
                fmt,
                onlyDate: onlyDate || null,
                onlyVenue: state.venue || null,
              })
            )
            .join('')}
        </div>
      `;
      setResultsCount(list.length);
      bindInteractiveButtons();
    }

    function renderGroupedByCategory(list, onlyDate) {
      const catMap = new Map();
      list.forEach((item) => {
        const { key, label } = getGroupingKeyAndLabel(item);
        const k = key || '_uncat';
        const lbl = label || t('category');
        if (!catMap.has(k)) catMap.set(k, { label: lbl, films: [] });
        catMap.get(k).films.push(item);
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

      const htmlStr = groups
        .map((g) => {
          const cls =
            state.view === 'tiles' ? 'uffb-grid two-cols' : 'uffb-program-list';
          return `
            <section class="uffb-group" data-group="${g.key}">
              <h4 class="uffb-group-title">${g.label}</h4>
              <div class="${cls}">
                ${g.films
                  .map((item) =>
                    renderProgramCard(item, {
                      state,
                      isFavourite,
                      planner,
                      screeningStorageKey,
                      fmt,
                      onlyDate: onlyDate || null,
                      onlyVenue: state.venue || null,
                    })
                  )
                  .join('')}
              </div>
            </section>
          `;
        })
        .join('');

      outlet.innerHTML = `<div class="uffb-groups">${htmlStr}</div>`;
      setResultsCount(list.length);
      bindInteractiveButtons();
    }

    function renderGroupedByDate(list, onlyDate) {
      const only = onlyDate || null;
      const dateMap = explodeByDate(list, only);
      const dates = Array.from(dateMap.keys()).sort();

      let htmlStr = `<div class="uffb-groups">`;
      dates.forEach((date) => {
        const nice = isoToLabel(date);
        const entries = dateMap.get(date) || [];
        const cls = state.view === 'tiles' ? 'uffb-grid' : 'uffb-program-list';

        htmlStr += `
          <section class="uffb-group" data-date="${date}">
            <h4 class="uffb-group-title">${nice}</h4>
            <div class="${cls}">
              ${entries
                .map(({ film }) =>
                  renderProgramCard(film, {
                    state,
                    isFavourite,
                    planner,
                    screeningStorageKey,
                    fmt,
                    onlyDate: date,
                    onlyVenue: state.venue || null,
                  })
                )
                .join('')}
            </div>
          </section>
        `;
      });
      htmlStr += `</div>`;
      outlet.innerHTML = htmlStr;
      setResultsCount(list.length);
      bindInteractiveButtons();
    }

    function applyAll() {
      const effectiveDate =
        state.groupBy === 'today' ? isoLocalToday() : state.date;
      syncTopUi();

      if (state.section === 'planner') {
        renderPlannerView();
        return;
      }

      const sourceItems =
        state.section === 'favourites'
          ? items.filter((item) => favourites.has(itemStorageId(item)))
          : items;

      filtered = sourceItems.filter((f) => {
        if (state.title && f.id !== state.title) return false;

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

        if (state.venue && effectiveDate) {
          const hasBoth = (f.screenings || []).some(
            (s) =>
              safeTxt(getVenueName(s)) === state.venue &&
              s.date === effectiveDate
          );
          if (!hasBoth) return false;
        } else {
          if (state.venue) {
            const hasVenue = (f.screenings || []).some(
              (s) => safeTxt(getVenueName(s)) === state.venue
            );
            if (!hasVenue) return false;
          }
          if (effectiveDate) {
            const hasDate = (f.screenings || []).some(
              (s) => s.date === effectiveDate
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
            langTxt(f.director),
            f.original_title,
            langTxt(f.cast),
          ]
            .filter(Boolean)
            .join(' ');

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

      filtered.sort((a, b) => {
        const da = earliestDate(a);
        const db = earliestDate(b);
        if (da !== db) return 0;

        const ca = getCategoryKeyAndLabel(a);
        const cb = getCategoryKeyAndLabel(b);
        const ra = categoryRank(ca.key, ca.label);
        const rb = categoryRank(cb.key, cb.label);
        if (ra !== rb) return ra - rb;

        const at = localized(a.title) || '';
        const bt = localized(b.title) || '';
        return at.localeCompare(bt);
      });

      if (filtered.length === 0) {
        const isFavEmpty =
          state.section === 'favourites' &&
          !favourites.size &&
          !state.category &&
          !state.venue &&
          !state.date &&
          !state.q;

        outlet.innerHTML = `
          <div class="uffb-empty">
            <h4>${isFavEmpty ? t('favouritesEmptyTitle') : t('noResultsTitle')}</h4>
            <p>${isFavEmpty ? t('favouritesEmptyHint') : t('noResultsHint')}</p>
            <div class="uffb-empty-actions">
              <button type="button" class="uffb-chip uffb-chip-btn" id="resetAllFilters">
                <span class="chip-icon" aria-hidden="true">✕</span>
                <span class="chip-label">${t('clearFilters')}</span>
              </button>
            </div>
          </div>
        `;
        setResultsCount(0);
        outlet
          .querySelector('#resetAllFilters')
          ?.addEventListener('click', () => ui.filters.clear.click());
        return;
      }

      if (state.groupBy === 'category') {
        renderGroupedByCategory(filtered, effectiveDate);
      } else if (state.groupBy === 'date' || state.groupBy === 'today') {
        renderGroupedByDate(filtered, effectiveDate);
      } else {
        renderUngrouped(filtered, effectiveDate);
      }
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
      while (ui.filters.cat.options.length > 1) ui.filters.cat.remove(1);
      const catSet = new Map();
      data.forEach((f) => {
        const key = (f.category && f.category.key) || null;
        const label =
          (f.category &&
            (f.category[
              location.pathname.startsWith('/de/')
                ? 'de'
                : location.pathname.startsWith('/uk/')
                  ? 'uk'
                  : 'en'
            ] ||
              f.category.de ||
              f.category.en ||
              f.category.uk)) ||
          null;
        if (key && label && !catSet.has(key)) catSet.set(key, label);
      });

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

      while (ui.filters.title?.options.length > 1) ui.filters.title?.remove(1);
      const pairs = [];
      data.forEach((f) => {
        const titleLang = location.pathname.startsWith('/de/')
          ? 'de'
          : location.pathname.startsWith('/uk/')
            ? 'uk'
            : 'en';
        const localTitle = (f.title && f.title[titleLang]) || '';
        if (!localTitle) return;
        pairs.push({ id: f.id, label: String(localTitle).trim() });
      });
      pairs
        .sort((a, b) => a.label.localeCompare(b.label, locale))
        .forEach(({ id, label }) => {
          const opt = document.createElement('option');
          opt.value = id;
          opt.textContent = label;
          ui.filters.title?.appendChild(opt);
        });

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
          opt.value = d;
          opt.textContent = isoToLabel(d);
          ui.filters.date.appendChild(opt);
        });
    }

    ui.toggles.filterBtn.addEventListener('click', () =>
      toggle(ui.filters.root, ui.toggles.filterBtn)
    );
    ui.toggles.searchBtn.addEventListener('click', () =>
      toggle(ui.search.root, ui.toggles.searchBtn)
    );

    ui.filters.cat.addEventListener('change', () => {
      state.category = ui.filters.cat.value;
      applyAll();
    });
    ui.filters.venue.addEventListener('change', () => {
      state.venue = ui.filters.venue.value;
      applyAll();
    });
    ui.filters.title?.addEventListener('change', () => {
      state.title = ui.filters.title?.value;
      applyAll();
    });
    ui.filters.date.addEventListener('change', () => {
      state.date = ui.filters.date.value;
      if (todayRadio?.checked && state.date !== todayISO) setGroupBy('date');
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
      setGroupBy(defaultGroup);
      applyAll();
    });

    attachClearButton(ui.filters.cat);
    attachClearButton(ui.filters.title);
    attachClearButton(ui.filters.venue);
    attachClearButton(ui.filters.date);

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

    syncChips();
    syncTopUi();

    showLoader();
    fetch(jsonUrl, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('load fail');
        return r.json();
      })
      .then((data) => {
        const baseFilms = data.slice().filter((f) => f.published === true);
        const panelItems = baseFilms.flatMap(makePanelItemsFromFilm);
        items = [...baseFilms, ...panelItems].sort((a, b) =>
          earliestDate(a).localeCompare(earliestDate(b))
        );
        refreshCounters();
        syncTopUi();
        initFilterOptions(items);
        applyAll();
      })
      .catch((err) => {
        outlet.innerHTML = `<p>${t('loadError')}</p>`;
        console.error('[UFFB] JSON fetch error', err);
      })
      .finally(() => hideLoader());
  }

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
