import { css } from './config.js';

export const CSS = css`
  .uffb-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    box-sizing: border-box !important;
    height: 100% !important;
    padding: 5% 5% 5% 5% !important;
    border-radius: 6px !important;
    background-color: #111111 !important;
    width: 100%;
    color: #fff;
  }

  .uffb-grid .uffb-card {
    background-color: #111;
  }

  @media (min-width: 700px) {
    .uffb-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 42px;
    }
  }
  @media (min-width: 1024px) {
    .uffb-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .uffb-grid.two-cols {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 700px) {
    .uffb-grid.two-cols {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .uffb-grid.two-cols {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .uffb-card {
    display: flex;
    flex-direction: column;
    background: #000;
    border-radius: 0px;
    overflow: hidden;
    height: 100%;
  }
  .uffb-media {
    position: relative;
    aspect-ratio: 16/9;
    background: #f2f2f2;
    overflow: hidden;
  }
  .uffb-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }
  .uffb-card:hover .uffb-media img {
    transform: scale(1.03);
  }
  .uffb-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 25px 0;
  }
  .uffb-title {
    margin: 0;
    font-size: 1.5rem;
    line-height: 1.25;
  }
  .uffb-title a {
    color: var(--paragraphLinkColor, #0bb);
    text-decoration: none;
  }

  .uffb-title a:hover {
    text-decoration: underline !important;
  }

  .uffb-desc {
    color: #fff;
    opacity: 0.9;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 3.6em;
    font-size: 1rem;
    white-space: pre-line;
  }
  .uffb-warning {
    margin: -15px 0 15px;
    font-style: italic;
  }
  .uffb-actions {
    display: flex;
    gap: 10px;
    margin-top: 4px;
    flex-wrap: wrap;
  }
  .uffb-screenings {
    color: #fff;
    margin: 8px 0 2px;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 25px;
    row-gap: 25px;
  }
  .uffb-screening {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 6px 12px;
    font-size: 1rem;
  }
  .uffb-category {
    font-size: 0.9rem;
    color: var(--paragraphLinkColor, #0bb);
    padding: 10px 15px 0;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 0.4rem;
    font-weight: 600;
  }
  .uffb-when {
    font-weight: 700;
  }
  .uffb-venue {
    margin-top: 2px;
    font-weight: 600;
  }
  .uffb-address a {
    text-decoration: none;
    color: var(--paragraphLinkColor, #0bb);
    font-size: 1rem;
  }

  .uffb-address a:hover {
    text-decoration: underline !important;
  }

  .uffb-tickets a {
    color: var(--paragraphLinkColor);
    font-size: 1.1rem;
    font-weight: 600;
    padding: 10px;
    border: 1.5px solid;
    border-radius: 0px;
    text-transform: uppercase;
  }

  .uffb-no-tickets {
    margin-top: 10px;
    font-style: italic;
  }

  .uffb-tickets.is-disabled {
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
  }

  .uffb-icon-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    background: transparent;
    color: #fff;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  .uffb-icon-btn svg {
    width: 26px;
    height: 26px;
    display: block;
  }

  .uffb-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    margin: 15px 0;
  }

  .uffb-groupby {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #fff;
  }
  .uffb-groupby .uffb-groupby-head {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.9rem;
    opacity: 0.95;
  }
  .uffb-groupby .uffb-groupby-head svg {
    width: 26px;
    height: 26px;
    display: block;
  }

  .uffb-groupby .chips {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .uffb-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0px;
    padding: 0.35rem 0.7rem;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    padding: 0 10px;
  }
  .uffb-chip input {
    appearance: none;
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
  }
  .uffb-chip[data-checked='true'] {
    background: #fff;
    color: #000;
    border-color: #fff;
  }
  .uffb-chip:has(input:focus-visible) {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .uffb-chip#groupTodayChip {
    border-color: var(--paragraphLinkColor);
    color: var(--paragraphLinkColor);
  }

  .uffb-chip#groupTodayChip[data-checked='true'] {
    background: var(--paragraphLinkColor);
    color: #000;
  }
  .uffb-chip[hidden] {
    display: none;
  }

  @media (max-width: 699px) {
    .uffb-groupby {
      margin-left: 0;
      width: 100%;
      display: block;
      margin-top: 15px;
    }
  }

  .uffb-group-title {
    margin: 25px 0 !important;
  }

  .uffb-filters,
  .uffb-search {
    display: grid;
    gap: 0.8rem;
    grid-template-columns: 3fr 3fr 3fr 1.5fr;
    align-items: end;
    border-radius: 0;
    margin: 0.5rem 0 1rem 0;
    backdrop-filter: saturate(120%) blur(4px);
  }

  .uffb-filters[hidden],
  .uffb-search[hidden] {
    display: none;
  }

  .uffb-filters label,
  .uffb-filter-actions {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
  }

  #clearFilters {
    width: 100%;
  }

  @media (max-width: 899px) {
    .uffb-filters {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  :root {
    --uffb-control-h: 42px;
    --btn-anim: 0.18s;
  }

  .uffb-filters label {
    position: relative;
  }

  .uffb-clear {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    color: #111;
    font-size: 16px;
    line-height: 1;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .uffb-clear:hover {
    background: rgba(255, 255, 255, 0.28);
  }

  .uffb-filters label.is-filled .uffb-clear {
    display: inline-flex;
  }

  .uffb-field.has-clear {
    padding-right: 2rem;
  }

  .uffb-field {
    height: var(--uffb-control-h);
    padding: 0 0.75rem;
    box-sizing: border-box;
    font: inherit;
  }

  .uffb-search {
    display: grid;
    gap: 0.8rem;
    grid-template-columns: 3fr;
    width: 28.65%;
    margin: 0.5rem 0 1rem 0;
  }

  .uffb-search input {
    margin-right: 0.75rem;
  }

  @media (max-width: 899px) {
    .uffb-search {
      width: 100%;
      grid-template-columns: 1fr;
    }

    .uffb-search input {
      margin-right: 0;
    }
  }

  .uffb-field:focus {
    outline: 2px solid #bbb;
    outline-offset: 1px;
  }
  .uffb-field::placeholder {
    color: #666;
  }

  .uffb-meta {
    margin: 0.35rem 0 0.25rem;
    color: #fff;
    font-size: 1.25rem;
  }
  .uffb-meta1 {
    font-size: 1rem;
  }
  .uffb-meta1 em {
    font-style: normal;
    font-weight: 600;
  }
  .uffb-meta2,
  .uffb-meta3 {
    line-height: 1.4;
  }

  .uffb-modal {
    position: fixed !important;
    inset: 0;
    display: none;
    z-index: 999999;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.65);
    padding: 20px;
  }
  .uffb-modal.is-open {
    display: flex !important;
  }
  .uffb-modal-box {
    width: min(92vw, 960px);
    aspect-ratio: 16/9;
    max-height: 80vh;
    background: #000;
    border-radius: 0px;
    overflow: hidden;
    position: relative;
  }
  .uffb-modal iframe {
    width: 100% !important;
    height: 100% !important;
    border: 0;
    display: block;
  }
  .uffb-modal-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #fff;
    border: none;
    border-radius: 999px;
    width: 36px;
    height: 36px;
    cursor: pointer;
  }

  .uffb-groups,
  .uffb-list {
    display: flex;
    flex-direction: column;
    gap: 64px;
  }

  .uffb-row {
    display: grid;
    grid-template-columns: min(38vw, 420px) 1fr;
    gap: 24px;
    background: transparent;
    border-radius: 0px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }
  @media (max-width: 900px) {
    .uffb-row {
      grid-template-columns: 1fr;
    }
    .uffb-row .uffb-body,
    .uffb-row .uffb-category {
      padding: 0 !important;
    }
  }

  .uffb-row .uffb-media {
    aspect-ratio: 16/9;
    background: #f2f2f2;
  }
  .uffb-row .uffb-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }
  .uffb-row:hover .uffb-media img {
    transform: scale(1.03);
  }

  .uffb-row .uffb-category {
    padding: 0 24px;
    opacity: 0.65;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  .uffb-row .uffb-body {
    padding: 12px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .uffb-row .uffb-title {
    font-size: 2rem;
    line-height: 1.2;
    margin: 2px 0 0;
  }
  .uffb-row .uffb-desc {
    opacity: 0.9;
    -webkit-line-clamp: 5;
    min-height: auto;
    font-size: 1.1rem;
  }
  .uffb-row .uffb-actions {
    margin-top: 6px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .uffb-row .uffb-screenings {
    margin-top: 15px;
  }

  .uffb-row .uffb-body,
  .uffb-row .uffb-category,
  .uffb-row .uffb-desc,
  .uffb-row .uffb-meta,
  .uffb-row .uffb-screening .uffb-left {
    color: #fff;
  }

  .uffb-row a {
    color: var(--paragraphLinkColor);
  }

  .uffb-list .uffb-screenings {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .uffb-list .uffb-screening {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .uffb-list .uffb-screening .uffb-tickets {
    margin-top: 2px;
  }
  .uffb-list .uffb-screening .uffb-tickets a {
    display: inline-block;
    padding: 10px 14px;
  }

  .uffb-list .uffb-venue {
    margin-top: 2px;
    font-weight: 600;
  }
  .uffb-list .uffb-address a {
    margin-top: 0;
  }

  .uffb-btn,
  .uffb-tickets a,
  .uffb-icon-btn,
  .uffb-chip {
    transition:
      background-color 0.18s ease,
      color 0.18s ease,
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.06s ease;
  }

  .uffb-btn {
    --btn-fg: #111;
    color: var(--btn-fg);
    display: inline-block;
    padding: 18px;
    border: 1.5px solid currentColor;
    border-radius: 0px;
    font-weight: 800;
    text-decoration: none;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #fff;
    transition:
      background-color var(--btn-anim) ease,
      color var(--btn-anim) ease,
      border-color var(--btn-anim) ease,
      transform 0.06s ease;
  }
  .uffb-btn:hover {
    background: var(--btn-fg);
    color: #fff;
    border-color: #fff;
  }

  .uffb-tickets a {
    --btn-fg: var(--paragraphLinkColor, #0bb);
    color: var(--btn-fg);
    background: transparent;
    border: 1.5px solid var(--btn-fg);
    transition:
      background-color var(--btn-anim) ease,
      color var(--btn-anim) ease,
      border-color var(--btn-anim) ease,
      transform 0.06s ease;
  }
  .uffb-tickets a:hover {
    background: var(--btn-fg);
    color: #000;
    border-color: var(--btn-fg);
  }

  .uffb-btn:active,
  .uffb-tickets a:active {
    transform: translateY(1px);
  }

  .uffb-chip {
    --chip-fg: #fff;
    color: var(--chip-fg);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.5);
    transition:
      background-color 0.18s ease,
      color 0.18s ease,
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.06s ease;
  }
  .uffb-chip:hover {
    background: rgba(255, 255, 255, 0.16);
    border-color: #fff;
  }
  .uffb-chip:active {
    transform: translateY(1px);
  }

  .uffb-chip[data-checked='true'] {
    --chip-fg: #000;
    background: #fff;
    color: #000;
    border-color: #fff;
    box-shadow: 0 0 0 2px #fff inset;
  }
  .uffb-chip[data-checked='true']:hover {
    background: #f6f6f6;
  }

  .uffb-chip:has(input:focus-visible) {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
  .uffb-filters {
    align-items: end;
  }

  .uffb-filter-actions {
    align-self: end;
  }

  .uffb-chip-btn {
    padding: 0.55rem 0.8rem;
    border-radius: 0px;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    height: 42px;
  }

  .uffb-chip-btn .chip-icon {
    display: inline-block;
    font-weight: 700;
    line-height: 0;
    opacity: 0.8;
    transform: translateY(-0.5px);
  }

  .uffb-chip-btn:hover {
    background: rgba(255, 255, 255, 0.16);
    border-color: #fff;
  }
  .uffb-chip-btn:active {
    transform: translateY(1px);
  }

  .uffb-chip-btn[aria-pressed='true'] {
    background: #fff;
    color: #000;
    border-color: #fff;
  }

  .uffb-empty {
    padding: 28px;
    border: 1px dashed rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.04);
    border-radius: 0;
    color: #fff;
  }
  .uffb-empty h4 {
    margin: 0 0 6px;
    font-size: 1.25rem;
  }
  .uffb-empty p {
    margin: 0 0 14px;
    opacity: 0.9;
  }
  .uffb-empty .uffb-empty-actions {
    margin-top: 8px;
  }

  .uffb-shorts {
    margin: 8px 0 0;
    padding-left: 1.25rem;
    color: #fff;
    font-size: 1.05rem;
    line-height: 1.4;
  }

  .uffb-row .uffb-shorts {
    color: #fff;
  }

  .uffb-shorts li {
    list-style: circle;
    font-size: 1rem;
  }

  .uffb-shorts li + li {
    margin-top: 6px;
  }
  .uffb-loader {
    display: none;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 24px 0;
    color: #fff;
  }
  .uffb-loader.is-active {
    display: flex;
  }

  .uffb-outlet {
    min-height: 140px;
  }

  .uffb-loader .dot {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: #f0e53c;
    animation: uffb-pulse 1.1s infinite;
    box-shadow: 0 0 0 0 rgba(240, 229, 60, 0.8);
  }

  @keyframes uffb-pulse {
    0% {
      transform: scale(0.88);
      box-shadow: 0 0 0 0 rgba(240, 229, 60, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(240, 229, 60, 0);
    }
    100% {
      transform: scale(0.88);
      box-shadow: 0 0 0 0 rgba(240, 229, 60, 0);
    }
  }
  .uffb-panel-extra {
    margin: 14px 0 12px;
  }
  .uffb-panel-extra .uffb-partner-head {
    font-weight: 600;
    margin-bottom: 6px;
  }
  .uffb-panel-extra a {
    color: var(--paragraphLinkColor);
    text-decoration: none;
    font-weight: 700;
  }
  .uffb-panel-extra a:hover {
    text-decoration: underline !important;
  }
  .party-entry {
    font-weight: 600;
    margin-top: 6px;
  }

  .uffb-hidden-force {
    display: none !important;
  }

  .uffb-section-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin: 0 0 20px;
  }

  .uffb-section-btn {
    appearance: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    min-height: 58px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .uffb-section-btn svg {
    width: 22px;
    height: 22px;
    display: block;
  }

  .uffb-section-btn.is-active {
    background: var(--headingLargeColor);
    border-color: var(--headingLargeColor);
  }

  .uffb-section-count {
    opacity: 0.8;
    font-weight: 600;
  }

  .uffb-viewbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin: 24px 0 20px;
  }

  .uffb-viewswitch {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .uffb-view-label {
    font-weight: 700;
  }

  .uffb-view-segment {
    display: inline-flex;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
  }

  .uffb-view-btn {
    appearance: none;
    border: 0;
    background: transparent;
    color: #fff;
    min-height: 42px;
    padding: 0 16px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  .uffb-view-btn.is-active {
    background: #fff;
    color: #111;
  }

  .uffb-view-btn svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  .uffb-results-count {
    font-weight: 700;
    opacity: 0.9;
  }

  .uffb-program-list {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .uffb-program-item {
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    padding-top: 28px;
  }

  .uffb-program-item__top {
    display: grid;
    grid-template-columns: minmax(280px, 40%) 1fr;
    gap: 28px;
    align-items: start;
  }

  .uffb-program-item--compact .uffb-program-item__top {
    grid-template-columns: minmax(180px, 26%) 1fr;
    gap: 22px;
  }

  .uffb-program-item__bottom {
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px dashed rgba(255, 255, 255, 0.16);
  }

  .uffb-program-item__content {
    min-width: 0;
  }

  .uffb-item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .uffb-item-header-main {
    min-width: 0;
    flex: 1;
  }

  .uffb-item-tools {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  .uffb-tool-btn {
    appearance: none;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: transparent;
    color: #fff;
    min-height: 44px;
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    text-decoration: none;
  }

  .uffb-tool-btn svg {
    width: 16px;
    height: 16px;
    display: block;
  }

  .uffb-tool-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .uffb-icon-tool {
    width: 44px;
    min-width: 44px;
    padding: 0;
    justify-content: center;
  }

  .uffb-icon-tool.is-active {
    background: #fff;
    color: #111;
    border-color: #fff;
  }

  .uffb-compact-meta {
    margin-top: 10px;
    line-height: 1.5;
    opacity: 0.92;
  }

  .uffb-program-item--compact .uffb-desc,
  .uffb-program-item--compact .uffb-warning,
  .uffb-program-item--compact .uffb-meta1,
  .uffb-program-item--compact .uffb-meta3 {
    display: none;
  }

  .uffb-program-item--compact .uffb-meta2 {
    margin-top: 6px !important;
  }

  .uffb-screenings--always {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .uffb-screenings--always .uffb-screening {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 12px 18px;
    padding-bottom: 14px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.12);
  }

  .uffb-screenings--always .uffb-screening:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .uffb-screening-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .uffb-planner-btn {
    appearance: none;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: transparent;
    color: #fff;
    min-height: 42px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  .uffb-planner-btn svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  .uffb-planner-btn.is-active {
    background: #fff;
    color: #111;
    border-color: #fff;
  }

  .uffb-planner-btn[disabled] {
    opacity: 0.55;
    pointer-events: none;
  }

  .uffb-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .uffb-card-head .uffb-item-tools {
    margin-left: auto;
  }

  .uffb-planner-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .uffb-planner-entry {
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 16px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px 18px;
    align-items: center;
  }

  .uffb-planner-entry-title {
    margin: 0 0 6px;
    font-size: 1.25rem;
  }

  .uffb-planner-entry-title a {
    color: var(--paragraphLinkColor, #0bb);
    text-decoration: none;
  }

  .uffb-planner-entry-title a:hover {
    text-decoration: underline !important;
  }

  .uffb-planner-entry-meta {
    opacity: 0.9;
    line-height: 1.5;
  }

  @media (max-width: 900px) {
    .uffb-section-tabs {
      grid-template-columns: 1fr;
    }

    .uffb-viewbar {
      flex-direction: column;
      align-items: flex-start;
    }

    .uffb-program-item__top,
    .uffb-program-item--compact .uffb-program-item__top,
    .uffb-screenings--always .uffb-screening,
    .uffb-planner-entry {
      grid-template-columns: 1fr;
    }

    .uffb-item-header {
      flex-direction: column;
    }

    .uffb-item-tools,
    .uffb-screening-actions {
      justify-content: flex-start;
    }
  }
`;

export function injectCSS() {
  if (document.getElementById('uffb-grid-style')) return;
  const s = document.createElement('style');
  s.id = 'uffb-grid-style';
  s.textContent = CSS;
  document.head.appendChild(s);
}
