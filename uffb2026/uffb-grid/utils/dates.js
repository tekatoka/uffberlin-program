import { FESTIVAL_END, FESTIVAL_START } from '../config.js';

export function isoLocalToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isWithinFestival(iso) {
  return iso >= FESTIVAL_START && iso <= FESTIVAL_END;
}

export function isAfterFestival(iso) {
  return iso > FESTIVAL_END;
}

export function timeToMinutes(t) {
  if (!t) return Number.POSITIVE_INFINITY;
  const s = String(t).trim().toLowerCase();
  const cleaned = s.replace(/[^\d:.apm\s]/g, '');
  const isPM = /\bpm\b/.test(cleaned) && !/\bam\b/.test(cleaned);
  const isAM = /\bam\b/.test(cleaned);
  const m = cleaned.match(/(\d{1,2})(?:[:.](\d{2}))?/);
  if (!m) return Number.POSITIVE_INFINITY;

  let hh = parseInt(m[1], 10);
  let mm = m[2] ? parseInt(m[2], 10) : 0;

  if (isPM && hh < 12) hh += 12;
  if (isAM && hh === 12) hh = 0;
  if (hh < 0 || hh > 23) return Number.POSITIVE_INFINITY;
  if (mm < 0 || mm > 59) mm = 0;

  return hh * 60 + mm;
}

export function isPastScreeningDate(isoDate) {
  const today = isoLocalToday();
  return typeof isoDate === 'string' && isoDate < today;
}

export function offsetFor() {
  const m = new Date().getTimezoneOffset();
  const sign = m <= 0 ? '+' : '-';
  const abs = Math.abs(m);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function dateToDM(iso) {
  const d = new Date(iso + 'T00:00:00');
  return pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
