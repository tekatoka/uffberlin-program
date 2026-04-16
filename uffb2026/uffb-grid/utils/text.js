import { lang } from '../config.js';

export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export const safeTxt = (x) => (x == null ? '' : String(x).trim().toLowerCase());

export function localized(v) {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  return v[lang] || v.de || v.en || v.uk || '';
}

export function joinVals(v) {
  const val = localized(v);
  if (Array.isArray(val)) {
    return val.map(localized).filter(Boolean).join(', ');
  }
  return val;
}

export function langTxt(v) {
  if (!v) return '';
  const val = Array.isArray(v) ? v.map(localized) : [localized(v)];
  const flat = (Array.isArray(val) ? val.flat() : [val]).filter(Boolean);
  return flat.join(' ');
}
