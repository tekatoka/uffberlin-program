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
  .uffb-btn{
    display: inline-block;
    width: auto;
    height: auto;
    text-align: center;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    line-height: normal;
    padding: 1.2rem 2.004rem;
  }
  .uffb-screenings{margin:8px 0 2px;padding:0;list-style:none;display:grid;gap:8px}
  .uffb-screening{display:flex;justify-content:space-between;align-items:start;gap:10px;font-size:.95rem}
  .uffb-whenwhere{color:#222}
  /* modal */
  .uffb-modal{position:fixed;inset:0;display:none;z-index:99999;align-items:center;justify-content:center;background:rgba(0,0,0,.65);padding:20px}
  .uffb-modal.is-open{display:flex}
  .uffb-modal-box{width:min(100%,960px);aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;position:relative}
  .uffb-modal-close{position:absolute;top:8px;right:8px;background:#fff;border:none;border-radius:999px;width:36px;height:36px;cursor:pointer}
  .uffb-modal iframe{width:100%;height:100%;border:0;display:block}
  .uffb-screenings { margin: 8px 0 2px; padding: 0; list-style: none; display: grid; gap: 10px; }
  .uffb-screening {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 6px 12px;
  }
  
  .uffb-when { font-weight: 700; }
  .uffb-venue { margin-top: 2px; }
  .uffb-address a { font-size: .92rem; text-decoration: underline; color: #444; }`;
  
  function injectCSS(){ if(document.getElementById('uffb-grid-style')) return;
    const s=document.createElement('style'); s.id='uffb-grid-style'; s.textContent=CSS; document.head.appendChild(s);
  }
  function escapeHtml(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
  function ytEmbed(url){ try{const u=new URL(url);
    if(u.hostname.includes('youtube.com') && u.searchParams.get('v')) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}?rel=0&autoplay=1`;
    if(u.hostname.includes('youtu.be')) return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?rel=0&autoplay=1`;
    return url; }catch{return url;}
  }
  function offsetStr(){ const m=new Date().getTimezoneOffset(), sign=m<=0?'+':'-', abs=Math.abs(m);
    const hh=String(Math.floor(abs/60)).padStart(2,'0'), mm=String(abs%60).padStart(2,'0'); return `${sign}${hh}:${mm}`;}
  const fmt = new Intl.DateTimeFormat('de-DE',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});

  function screeningLine(s) {
    // date/time
    const dtISO = `${s.date}T${(s.time || '00:00')}:00${offsetFor()}`;
    const d = new Date(dtISO);
    const when = `${fmt.format(d)}${s.time ? `, ${s.time}` : ''}`;
  
    // i18n helpers
    const venueName = (s.venue && (s.venue.de || s.venue.en)) || s.venue || '';
    const addressTxt = (s.address && (s.address.de || s.address.en)) || s.address || '';
  
    // build Google Maps link (prefer explicit URL, else generate from venue+address)
    let mapsUrl = s.maps?.google || '';
    if (!mapsUrl && (venueName || addressTxt)) {
      const q = [venueName, addressTxt].filter(Boolean).join(', ');
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    }
  
    const venueLine = venueName ? `<div class="uffb-venue">${escapeHtml(venueName)}</div>` : '';
    const addressLine = addressTxt
      ? `<div class="uffb-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${escapeHtml(addressTxt)}</a></div>`
      : '';
  
    const ticketHtml = s.tickets
      ? `<span class="uffb-tickets"><a class="uffb-btn" href="${s.tickets}" target="_blank" rel="noopener">Tickets</a></span>`
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
    const href = `https://www.uffberlin.de/uffb2025/${encodeURIComponent(it.id)}`; // absolute so links leave iframe if ever used
    const title = it.title?.de || it.title?.en || 'Untitled';
    const desc  = it.description?.de || it.description?.en || '';
    const img   = it.image || '';
    const teaser= it.teaser;
    const screenings = (it.screenings||[]).map(screeningLine).join('');
    return `<article class="uffb-card">
      <a class="uffb-media" href="${href}" aria-label="${title}"><img src="${img}" alt="${title}"></a>
      <div class="uffb-body">
        <h3 class="uffb-title"><a href="${href}">${title}</a></h3>
        <div class="uffb-desc">${escapeHtml(desc)}</div>
        <div class="uffb-actions">${teaser?`<button class="uffb-btn" data-teaser="${encodeURIComponent(teaser)}">Watch teaser</button>`:''}</div>
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

  function render(el){
    injectCSS();
    const grid = document.createElement('div');
    grid.className='uffb-grid';
    el.appendChild(grid);

    const jsonUrl = el.dataset.json;
    fetch(jsonUrl, {cache:'no-cache'})
      .then(r=>{ if(!r.ok) throw new Error('load fail'); return r.json(); })
      .then(items=>{
        items.sort((a,b)=> (a.title?.de||a.title?.en||'').localeCompare(b.title?.de||b.title?.en||'','de-DE'));
        grid.innerHTML = items.map(card).join('');
        const modal = mountModal();
        grid.querySelectorAll('[data-teaser]').forEach(btn=>{
          btn.addEventListener('click',e=>{
            const u=decodeURIComponent(e.currentTarget.getAttribute('data-teaser')); modal.open(u);
          });
        });
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
