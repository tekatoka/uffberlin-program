import { lang } from './config.js';
import { I18N, t } from './i18n.js';
import { timeToMinutes } from './utils/dates.js';
import { localized, safeTxt } from './utils/text.js';

export const MERGED_FOCUS_KEYS = new Set(['film_focus', 'film_fokus']);
export const mergedFocusLabel = () => (lang === 'de' ? 'Film Fokus' : 'Film Focus');

export function getGroupingKeyAndLabel(film) {
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

export const earliestDate = (film) => {
  const ds = (film.screenings || []).map((s) => s.date).filter(Boolean).sort();
  return ds[0] || '9999-12-31';
};

export const getVenueName = (s) =>
  (
    s.venue?.[lang] ||
    s.venue?.de ||
    s.venue?.en ||
    s.venue?.uk ||
    s.venue ||
    ''
  ).toString();

export const isoToLabel = (iso) => I18N[lang].isoDateLabel(iso);

export const CATEGORY_ORDER = [
  'main',
  'uffb_shorts',
  'special',
  'film_focus',
  'ukraine-known-unknown',
  'retrospective',
  'panel_discussion',
];

export function categoryRank(key, label) {
  if (key === 'film_focus_all' || key === 'film_fokus') key = 'film_focus';

  const k = (key || '').toLowerCase();
  const l = (label || '').toLowerCase();

  const idx = CATEGORY_ORDER.indexOf(k);
  if (idx !== -1) return idx;

  if (l.includes('main')) return 0;
  if (/(short|kurz).*?(comp|wettbewerb)/.test(l)) return 1;

  return CATEGORY_ORDER.length;
}

export function getCategoryKeyAndLabel(film) {
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

export function explodeByDate(list, onlyDate = null) {
  const map = new Map();
  list.forEach((f) => {
    (f.screenings || []).forEach((s) => {
      if (!s.date) return;
      if (onlyDate && s.date !== onlyDate) return;
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date).push({
        film: f,
        date: s.date,
        time: s.time || '',
      });
    });
  });

  map.forEach((arr) =>
    arr.sort((a, b) => {
      const ta = timeToMinutes(a.time);
      const tb = timeToMinutes(b.time);
      if (ta !== tb) return ta - tb;

      const ca = getCategoryKeyAndLabel(a.film);
      const cb = getCategoryKeyAndLabel(b.film);
      const ra = categoryRank(ca.key, ca.label);
      const rb = categoryRank(cb.key, cb.label);
      if (ra !== rb) return ra - rb;

      const at = localized(a.film.title) || '';
      const bt = localized(b.film.title) || '';
      return at.localeCompare(bt);
    })
  );
  return map;
}
