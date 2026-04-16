export const ICONS = {
  filter: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <path d="M4 6h16M7 12h10M10 18h4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>
    </svg>`,
  search: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <circle cx="11" cy="11" r="7"/><path d="M20 20l-4.35-4.35" stroke-linecap="round"/>
    </svg>`,
  group: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <path d="M4 5h16M4 12h10M4 19h6" stroke-linecap="round"/>
    </svg>`,
  program: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <rect x="4" y="5" width="16" height="4" rx="1"></rect>
      <rect x="4" y="11" width="16" height="8" rx="1"></rect>
    </svg>`,
  planner: (active = false) => `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="${active ? 'currentColor' : 'none'}" stroke-width="2">
      <rect x="3" y="5" width="18" height="16" rx="2"></rect>
      <path d="M8 3v4M16 3v4M3 10h18"></path>
      <path d="M8 14l2 2 5-5" ${active ? 'stroke="#111"' : ''}></path>
    </svg>`,
  viewDetails: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <rect x="3" y="5" width="7" height="14"></rect>
      <path d="M13 7h8M13 12h8M13 17h6"></path>
    </svg>`,
  viewCompact: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <rect x="3" y="7" width="5" height="10"></rect>
      <path d="M11 9h10M11 15h8"></path>
    </svg>`,
  viewTiles: `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2">
      <rect x="3" y="3" width="8" height="8"></rect>
      <rect x="13" y="3" width="8" height="8"></rect>
      <rect x="3" y="13" width="8" height="8"></rect>
      <rect x="13" y="13" width="8" height="8"></rect>
    </svg>`,
  star: (active = false) => `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="${active ? 'currentColor' : 'none'}" stroke-width="2">
      <path d="M12 3.7l2.7 5.47 6.03.88-4.36 4.24 1.03 5.98L12 17.44 6.6 20.27l1.03-5.98L3.27 10.05l6.03-.88L12 3.7z"></path>
    </svg>`,
  heart: (active = false) => `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="${active ? 'currentColor' : 'none'}" stroke-width="2">
      <path d="M12 20.5l-1.45-1.32C5.4 14.5 2 11.42 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.92-3.4 7-8.55 11.68L12 20.5z"></path>
    </svg>`,
  play: `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M8 5v14l11-7z"></path>
    </svg>`,
  calendar: (active = false) => `
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="${active ? 'currentColor' : 'none'}" stroke-width="2">
      <rect x="3" y="5" width="18" height="16" rx="2"></rect>
      <path d="M8 3v4M16 3v4M3 10h18"></path>
      ${active ? `<path d="M8 14l2 2 5-5" stroke="#111"></path>` : `<path d="M12 13v5M9.5 15.5h5"></path>`}
    </svg>`,
};
