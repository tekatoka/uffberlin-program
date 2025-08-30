/* uffb-grid.bundle.js */
(function(){
  const MOUNT = '.uffb-program';
  const CSS = `
  .uffb-grid{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:700px){.uffb-grid{grid-template-columns:repeat(2,1fr)}}
  @media(min-width:1024px){.uffb-grid{grid-template-columns:repeat(3,1fr)}}
  .uffb-card{display:flex;flex-direction:column;background:#fff;border-radius:14px;box-shadow:0 6px 16px rgba(0,0,0,.08);overflow:hidden;height:100%}
  .uffb-media{position:relative;aspect-ratio:16/9;background:#f2f2f2;overflow:hidden}
  .uffb-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s ease}
  .uffb-card:hover .uffb-media img{transform:scale(1.03)}
  .uffb-body{display:flex;flex-direction:column;gap:10px;padding:16px 16px 12px}
  .uffb-title{margin:0;font-size:1.5rem;line-height:1.25}
  .uffb-title a{color:inherit;text-decoration:none}
  .uffb-desc{color:#333;opacity:.9;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;min-height:3.6em}
  .uffb-actions{display:flex;gap:10px;margin-top:4px;flex-wrap:wrap}
  .uffb-btn{display:inline-block;width:auto;height:auto;text-align:center;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;-webkit-font-smoothing:antialiased;line-height:normal;padding:1.2rem 2.004rem;}
  .uffb-screenings{color:#333;margin:8px 0 2px;padding:0;list-style:none;display:grid;gap:25px;row-gap:25px}
  .uffb-screening{display:flex;justify-content:space-between;align-items:start;gap:25px;font-size:.95rem}
  .uffb-whenwhere{color:#222}
  /* modal */
  .uffb-modal{position:fixed;inset:0;display:none;z-index:99999;align-items:center;justify-content:center;background:rgba(0,0,0,.65);padding:20px}
  .uffb-modal.is-open{display:flex}
  .uffb-modal-box{width:min(100%,960px);aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;position:relative}
  .uffb-modal-close{position:absolute;top:8px;right:8px;background:#fff;border:none;border-radius:999px;width:36px;height:36px;cursor:pointer}
  .uffb-modal iframe{width:100%;height:100%;border:0;display:block}
  .uffb-screening{display:grid;grid-template-columns:1fr auto;align-items:start;gap:6px 12px}
  .uffb-category{font-size:.9rem;color:#333;padding:10px 15px 0;letter-spacing:.02em;text-transform:uppercase;opacity:.7;margin-bottom:.4rem}
  .uffb-when{font-weight:700}
  .uffb-venue{margin-top:2px}
  .uffb-address a{font-size:.92rem;text-decoration:underline;color:#444}
  .uffb-tickets a{color:var(--paragraphLinkColor);font-size:1.1rem;font-weight:600;padding:10px}

  /* controls */
  .uffb-controls{display:flex;gap:.5rem;margin:0 0 1rem 0;flex-wrap:wrap}
  .uffb-icon-btn{border:1px solid #ddd;padding:.4rem .6rem;border-radius:.6rem;background:#fff;cursor:pointer}
  .uffb-filters,.uffb-search{display:grid;gap:.6rem;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));padding:.8rem;border:1px solid #eee;border-radius:.8rem;margin:.5rem 0 1rem 0;background:#fafafa}
  .uffb-filters[hidden],.uffb-search[hidden]{display:none}
  .uffb-filter-actions{display:flex;gap:.5rem}
  `;

  function injectCSS(){ if(document.getElementById('uffb-grid-style')) return;
    const s=document.createElement('style'); s.id='uffb-grid-style'; s.textContent=CSS; document.head.appendChild(s);
  }
  function escapeHtml(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
  function ytEmbed(url){ try{const u=new URL(url);
    if(u.hostname.includes('youtube.com') && u.searchParams.get('v')) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}?rel=0&autoplay=1`;
    if(u.hostname.includes('youtu.be')) return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?rel=0&autoplay=1`;
    return url; }catch{return url;}
  }
  function offsetFor(){ const m=new Date().getTimezoneOffset(), sign=m<=0?'+':'-', abs=Math.abs(m);
    const hh=String(Math.floor(abs/60)).padStart(2,'0'), mm=String(abs%60).padStart(2,'0'); return `${sign}${hh}:${mm}`;}
  const fmt = new Intl.DateTimeFormat('de-DE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});

  function screeningLine(s) {
    const dtISO = `${s.date}T${(s.time || '00:00')}:00${offsetFor()}`;
    const d = new Date(dtISO);
    const when = `${fmt.format(d)}${s.time ? `, ${s.time}` : ''}`;

    const venueName = (s.venue?.de || s.venue?.en || s.venue) || '';
    const addressTxt = typeof s.address === 'string'
      ? s.address
      : (s.address?.de || s.address?.en || '');

    let mapsUrl = s.maps?.google || '';
    if (!mapsUrl && (venueName || addressTxt)) {
      const q = [venueName, addressTxt].filter(Boolean).join(', ');
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    }

    const venueLine   = venueName  ? `<div class="uffb-venue">${escapeHtml(venueName)}</div>` : '';
    const addressLine = addressTxt ? `<div class="uffb-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${escapeHtml(addressTxt)}</a></div>` : '';

    const ticketHtml = s.tickets
      ? `<span class="uffb-tickets"><a href="${s.tickets}" target="_blank" rel="noopener">Tickets</a></span>`
      : '';

    return `
      <li class="uffb-screening">
        <div class="uffb-left">
          <div class="uffb-when"><strong>${when}</strong></div>
          ${venueLine}
          ${addressLine}
        </div>
        ${ticketHtml}
      </li>
    `;
  }

  function card(it){
    const href = `https://www.uffberlin.de/uffb2025/${encodeURIComponent(it.id)}`; // absolute
    const title = it.title?.de || it.title?.en || 'Untitled';
    const category = it.category?.de || it.category?.en || 'Untitled';
    const desc  = it.description?.de || it.description?.en || '';
    const img   = it.image || '';
    const trailer= it.trailer;
    const screenings = (it.screenings||[]).map(screeningLine).join('');
    return `<article class="uffb-card" data-id="${it.id}">
      <div class="uffb-category">${category}</div>
      <a class="uffb-media" href="${href}" aria-label="${title}"><img src="${img}" alt="${title}"></a>
      <div class="uffb-body">
        <h3 class="uffb-title"><a href="${href}">${title}</a></h3>
        <div class="uffb-desc">${escapeHtml(desc)}</div>
        <div class="uffb-actions">${trailer?`<button class="uffb-btn" data-trailer="${encodeURIComponent(trailer)}">Watch trailer</button>`:''}</div>
        <ul class="uffb-screenings">${screenings}</ul>
      </div>
    </article>`;
  }

  function mountModal(){
    if(document.getElementById('uffb-modal')) return;
    const m = document.createElement('div');
    m.className='uffb-modal'; m.id='uffb-modal';
    m.innerHTML = `<div class="uffb-modal-box">
      <button class="uffb-modal-close" title="Close">✕</button>
      <iframe allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>`;
    document.body.appendChild(m);
    const iframe=m.querySelector('iframe');
    const close=()=>{ m.classList.remove('is-open'); iframe.src=''; };
    m.addEventListener('click',e=>{ if(e.target===m) close(); });
    m.querySelector('.uffb-modal-close').addEventListener('click', close);
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
    return {open:(url)=>{ m.classList.add('is-open'); iframe.src=ytEmbed(url);} };
  }

  // helpers for sorting/filtering
  const lang = (document.documentElement.lang||'en').startsWith('de') ? 'de' : 'en';
  const safeTxt = (x)=> (x||'').toString().toLowerCase();
  const earliestDate = (film) => {
    const ds = (film.screenings||[]).map(s=>s.date).filter(Boolean).sort();
    return ds[0] || '9999-12-31';
  };
  const getVenueName = (s) => (s.venue?.[lang] || s.venue?.de || s.venue?.en || s.venue || '').toString();

  function buildControls(container){
    // top controls
    const controls = document.createElement('div');
    controls.className = 'uffb-controls';
    controls.innerHTML = `
      <button class="uffb-icon-btn" id="filterToggle" aria-expanded="false" aria-controls="filters">🔎 Filter</button>
      <button class="uffb-icon-btn" id="searchToggle" aria-expanded="false" aria-controls="searchbar">⌕ Search</button>
    `;
    container.appendChild(controls);

    // filters panel
    const filters = document.createElement('form');
    filters.id = 'filters';
    filters.className = 'uffb-filters';
    filters.setAttribute('hidden','');
    filters.innerHTML = `
      <label><span>Category</span>
        <select id="filterCategory"><option value="">All</option></select>
      </label>
      <label><span>Venue</span>
        <select id="filterVenue"><option value="">All</option></select>
      </label>
      <label><span>Date</span>
        <input type="date" id="filterDate"/>
      </label>
      <div class="uffb-filter-actions">
        <button type="button" id="applyFilters" class="uffb-icon-btn">Apply filters</button>
        <button type="button" id="clearFilters" class="uffb-icon-btn">Clear</button>
      </div>
    `;
    container.appendChild(filters);

    // search panel
    const search = document.createElement('form');
    search.id = 'searchbar';
    search.className = 'uffb-search';
    search.setAttribute('hidden','');
    search.innerHTML = `
      <input type="search" id="searchInput" placeholder="Search title, description, venue…" />
      <div class="uffb-filter-actions">
        <button type="button" id="applySearch" class="uffb-icon-btn">Search</button>
        <button type="button" id="clearSearch" class="uffb-icon-btn">Clear</button>
      </div>
    `;
    container.appendChild(search);

    return {
      controls, filters: {
        root: filters,
        cat: filters.querySelector('#filterCategory'),
        venue: filters.querySelector('#filterVenue'),
        date: filters.querySelector('#filterDate'),
        apply: filters.querySelector('#applyFilters'),
        clear: filters.querySelector('#clearFilters'),
      },
      search: {
        root: search,
        input: search.querySelector('#searchInput'),
        apply: search.querySelector('#applySearch'),
        clear: search.querySelector('#clearSearch'),
      },
      toggles: {
        filterBtn: controls.querySelector('#filterToggle'),
        searchBtn: controls.querySelector('#searchToggle'),
      }
    };
  }

  function render(el){
    injectCSS();

    // container that will hold controls + grid
    const wrap = document.createElement('div');
    el.appendChild(wrap);

    // build UI
    const ui = buildControls(wrap);

    const grid = document.createElement('div');
    grid.className='uffb-grid';
    wrap.appendChild(grid);

    const jsonUrl = el.dataset.json;

    // local state
    let items = [];
    let filtered = [];
    const state = { category:'', venue:'', date:'', q:'' };

    function renderGrid(list){
      grid.innerHTML = list.map(card).join('');
      const modal = mountModal();
      grid.querySelectorAll('[data-trailer]').forEach(btn=>{
        btn.addEventListener('click',e=>{
          const u=decodeURIComponent(e.currentTarget.getAttribute('data-trailer')); modal.open(u);
        });
      });
    }

    function applyAll(){
      // filter
      filtered = items.filter(f=>{
        if(state.category){
          const key = (f.category && (f.category.key || f.category.en || f.category.de)) || '';
          const keyNorm = (f.category && f.category.key) ? f.category.key : safeTxt(key);
          const catNorm  = safeTxt(state.category);
          if (keyNorm !== state.category && keyNorm !== catNorm) return false;
        }
        if(state.venue){
          const hasVenue = (f.screenings||[]).some(s => safeTxt(getVenueName(s)) === state.venue);
          if(!hasVenue) return false;
        }
        if(state.date){
          const hasDate = (f.screenings||[]).some(s => s.date === state.date);
          if(!hasDate) return false;
        }
        if(state.q){
          const q = state.q.toLowerCase();
          const text = [
            f.title?.de, f.title?.en,
            f.description?.de, f.description?.en,
            f.category?.de, f.category?.en
          ].filter(Boolean).join(' ').toLowerCase();
          const venuesText = (f.screenings||[]).map(getVenueName).join(' ').toLowerCase();
          if(!text.includes(q) && !venuesText.includes(q)) return false;
        }
        return true;
      });

      // sort by earliest screening date
      filtered.sort((a,b)=> earliestDate(a).localeCompare(earliestDate(b)));

      renderGrid(filtered);
    }

    function toggle(panel, btn){
      const hidden = panel.hasAttribute('hidden');
      if(hidden){ panel.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
      else { panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
    }

    function initFilterOptions(data){
      // categories (from data)
      const catSet = new Map(); // key -> label (current lang)
      data.forEach(f=>{
        const key = (f.category && f.category.key) || null;
        const label = (f.category && (f.category[lang] || f.category.de || f.category.en)) || null;
        if(key && label && !catSet.has(key)) catSet.set(key, label);
      });
      catSet.forEach((label,key)=>{
        const opt=document.createElement('option'); opt.value=key; opt.textContent=label; ui.filters.cat.appendChild(opt);
      });

      // venues (normalize by visible name)
      const venueSet = new Set();
      data.forEach(f=> (f.screenings||[]).forEach(s=>{
        const vName = safeTxt(getVenueName(s));
        if(vName) venueSet.add(vName);
      }));
      Array.from(venueSet).sort().forEach(v=>{
        const opt=document.createElement('option'); opt.value=v; opt.textContent=v.replace(/\b\w/g,c=>c.toUpperCase()); ui.filters.venue.appendChild(opt);
      });

      // nothing to preload for dates (free input)
    }

    // wire up controls
    ui.toggles.filterBtn.addEventListener('click', ()=> toggle(ui.filters.root, ui.toggles.filterBtn));
    ui.toggles.searchBtn.addEventListener('click', ()=> toggle(ui.search.root, ui.toggles.searchBtn));

    ui.filters.apply.addEventListener('click', ()=>{
      state.category = ui.filters.cat.value;
      state.venue    = ui.filters.venue.value;
      state.date     = ui.filters.date.value;
      applyAll();
    });
    ui.filters.clear.addEventListener('click', ()=>{
      ui.filters.cat.value=''; ui.filters.venue.value=''; ui.filters.date.value='';
      state.category=''; state.venue=''; state.date='';
      applyAll();
    });

    ui.search.apply.addEventListener('click', ()=>{
      state.q = ui.search.input.value.trim();
      applyAll();
    });
    ui.search.clear.addEventListener('click', ()=>{
      ui.search.input.value=''; state.q='';
      applyAll();
    });

    // fetch + initial render
    fetch(jsonUrl, {cache:'no-cache'})
      .then(r=>{ if(!r.ok) throw new Error('load fail'); return r.json(); })
      .then(data=>{
        // initial sort by earliest screening date
        items = data.slice().sort((a,b)=> earliestDate(a).localeCompare(earliestDate(b)));
        initFilterOptions(items);
        applyAll(); // renders
      })
      .catch(err=>{
        grid.innerHTML = '<p>Programm konnte nicht geladen werden.</p>';
        console.error('[UFFB] JSON fetch error', err);
      });
  }

  // robust init for Squarespace (DOM + injected content)
  let started=false;
  const tryStart=()=>{ if(started) return;
    const nodes=document.querySelectorAll(MOUNT); if(!nodes.length) return;
    started=true; nodes.forEach(render);
  };
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', tryStart); }
  else { tryStart(); }
  new MutationObserver(tryStart).observe(document.documentElement,{childList:true,subtree:true});
})();
