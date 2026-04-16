export const MOUNT = '.uffb-program';

export const html = String.raw;
export const css = String.raw;

export const urlPath = location.pathname || '';
export const htmlLang = (document.documentElement.lang || '').toLowerCase();

export const lang = location.pathname.startsWith('/de/')
  ? 'de'
  : location.pathname.startsWith('/uk/')
    ? 'uk'
    : 'en';

export const festivalSegment =
  (location.pathname.match(/uffb20\d{2}/) || [])[0] || 'uffb2026';

export const basePath =
  lang === 'de'
    ? `/de/${festivalSegment}`
    : lang === 'uk'
      ? `/uk/${festivalSegment}`
      : `/${festivalSegment}`;

export const locale = lang === 'de' ? 'de-DE' : lang === 'uk' ? 'uk-UA' : 'en-GB';

export const PANEL_IMG_URL =
  'https://images.squarespace-cdn.com/content/v1/5f739670761e02764c54e1ca/1727124052218-9HAFIHE8THUC98V48K9K/Logo-600x600.jpg';

// TODO: adjust festival dates each year.
export const FESTIVAL_START = '2026-10-14';
export const FESTIVAL_END = '2026-10-18';
