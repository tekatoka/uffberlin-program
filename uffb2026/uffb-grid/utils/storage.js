import { safeTxt } from './text.js';
import { getVenueName } from '../film-helpers.js';

export function createStore(scope) {
  const prefix = `uffb:${scope}:`;

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(prefix + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => {
    try {
      localStorage.setItem(prefix + key, JSON.stringify(value));
    } catch {}
  };

  return {
    read,
    write,
    keys: {
      favourites: 'favourites',
      planner: 'planner',
      view: 'view',
      section: 'section',
    },
  };
}

export function itemStorageId(item) {
  return item.storageId || item.id;
}

export function screeningStorageKey(item, screening) {
  return [
    itemStorageId(item),
    screening.date || '',
    screening.time || '',
    safeTxt(getVenueName(screening)),
  ].join('||');
}
