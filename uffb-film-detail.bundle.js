(function(){
  const DATA_URL = "https://raw.githubusercontent.com/tekatoka/uffberlin-program/refs/heads/master/uffb-program-2025.json";
  const lang = location.pathname.includes("/de/") ? "de" : "en";

  /* ---------- utils ---------- */
  function getFilmId(){
    const params = new URLSearchParams(location.search);
    if (params.get("id")) return params.get("id");
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1];
  }
  function joinLocalized(val){ if (!val) return ""; return Array.isArray(val) ? val.join(", ") : String(val); }
  function localized(obj){ if (!obj) return ""; return obj[lang] ?? obj["en"] ?? obj["de"] ?? ""; }
  function fmtDuration(mins){ if (!mins || isNaN(mins)) return ""; return `${mins} min`; }
  function iso8601Duration(mins){ if (!mins || isNaN(mins)) return null; return `PT${Math.round(mins)}M`; }

  /* --- trailer helpers --- */
  function toEmbedUrl(url){
    if (!url) return null;
    try {
      const u = new URL(url);
      // YouTube
      if (u.hostname.includes("youtube.com")) {
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
      if (u.hostname === "youtu.be") {
        const id = u.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
      // Vimeo
      if (u.hostname.includes("vimeo.com")) {
        const id = u.pathname.split("/").filter(Boolean)[0];
        if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
      }
      // fallback: just use the URL in an iframe
      return url;
    } catch { return null; }
  }

  /* ---------- UI pieces ---------- */
  function buildTopLine(film){
    const title = localized(film.title) || film.original_title || "";
    const cat = film.category ? (film.category[lang] || film.category.en || film.category.de || "") : "";
    const hasTrailer = Boolean(film.trailer);
    const trailerLabel = lang==="de" ? "Trailer ansehen" : "Watch trailer";
    return `
      <div class="uffb-topline">
        <div class="uffb-topline-left">
          <div class="uffb-cat">#${cat}</div>
          <div class="uffb-top-title">${title}</div>
        </div>
        <div class="uffb-topline-right">
          ${hasTrailer ? `<a class="uffb-top-cta uffb-trailer-btn" href="#" data-trailer="${film.trailer}">${trailerLabel}</a>` : ""}
          <a class="uffb-top-cta" href="#screenings">${lang==="de"?"TICKETS":"TICKETS"}</a>
        </div>
      </div>
    `;
  }

  function sectionRow(label, valueHtml){
    if (!valueHtml) return "";
    return `
      <div class="uffb-meta-row">
        <div class="uffb-meta-label">${label}</div>
        <div class="uffb-meta-value">${valueHtml}</div>
      </div>
    `;
  }

  function buildJsonLd(film){
    const ld = {
      "@context": "https://schema.org",
      "@type": "Movie",
      "name": localized(film.title) || film.original_title || "",
      "alternateName": film.original_title || undefined,
      "description": localized(film.detailed_description) || localized(film.description) || "",
      "image": film.image,
      "url": location.href,
      "countryOfOrigin": (film.countries && (film.countries[lang]||film.countries.en||film.countries.de)) || undefined,
      "genre": (film.genre && (film.genre[lang]||film.genre.en||film.genre.de)) || undefined,
      "director": film.director ? [{ "@type":"Person", "name": film.director }] : undefined,
      "actor": film.actors
        ? (Array.isArray(film.actors)
            ? film.actors.map(a => ({ "@type":"Person", "name": a }))
            : String(film.actors).split(",").map(a => ({ "@type":"Person", "name": a.trim() })))
        : undefined,
      "duration": iso8601Duration(film.duration) || undefined,
      "trailer": film.trailer ? {
        "@type": "VideoObject",
        "name": "Trailer",
        "url": film.trailer
      } : undefined
    };
    Object.keys(ld).forEach(k => (ld[k] === undefined) && delete ld[k]);
    return ld;
  }

  function infoRow(label, valueHtml){
    if (!valueHtml) return "";
    return `
      <div class="uffb-info-row">
        <div class="uffb-info-label">${label}</div>
        <div class="uffb-info-value">${valueHtml}</div>
      </div>
    `;
  }

  function buildInfoBlock(film){
    const cat = film.category ? (film.category[lang] || film.category.en || film.category.de || "") : "";
    const original = film.original_title || "";
    const countries = film.countries ? (film.countries[lang] || film.countries.en || film.countries.de || []) : [];
    const countriesTxt = Array.isArray(countries) ? countries.join(", ") : countries;
    const languageTxt = film.language ? (film.language[lang] || film.language.en || film.language.de || "") : "";
    return `
      <section class="uffb-panel">
        <h3 class="uffb-panel-title">${lang==="de"?"Info":"Info"}</h3>
        <div class="uffb-info">
          ${infoRow(lang==="de"?"Kategorie":"Category", cat)}
          ${infoRow(lang==="de"?"Originaltitel":"Original title", original)}
          ${infoRow(lang==="de"?"Länder":"Countries", countriesTxt)}
          ${languageTxt ? infoRow(lang==="de"?"Sprache":"Language", languageTxt) : ""}
        </div>
      </section>
    `;
  }

  function buildCreditsBlock(film){
    const director = film.director || "";
    const cast = Array.isArray(film.actors) ? film.actors.join(", ") : (film.actors || "");
    return `
      <section class="uffb-panel">
        <h3 class="uffb-panel-title">${lang==="de"?"Credits":"Credits"}</h3>
        <div class="uffb-credits">
          ${infoRow(lang==="de"?"Regie":"Director", director)}
          ${cast ? infoRow("Cast", cast) : ""}
        </div>
      </section>
    `;
  }

  function buildSynopsisBlock(film){
    const shortDesc = (film.description && localized(film.description)) || "";
    const longDesc  = (film.detailed_description && localized(film.detailed_description)) || "";
    if (!shortDesc && !longDesc) return "";
    return `
      <section class="uffb-panel">
        <h3 class="uffb-panel-title">${lang==="de"?"Über den Film":"Synopsis"}</h3>
        <div class="uffb-synopsis2">
          ${shortDesc ? `<p class="uffb-lead"><strong>${shortDesc}</strong></p>` : ""}
          ${longDesc ? `<div class="uffb-bodytext">${longDesc}</div>` : ""}
        </div>
      </section>
    `;
  }

  function fmtWhen(isoDate, timeHHMM){
    const d = new Date(isoDate + "T00:00:00");
    const WDAY = { en:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], de:["So","Mo","Di","Mi","Do","Fr","Sa"] }[lang] || ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const MON  = { en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], de:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"] }[lang] || ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const w = WDAY[d.getDay()]; const dd = String(d.getDate()).padStart(2,"0"); const m = MON[d.getMonth()]; const yyyy = d.getFullYear();
    return `${w}, ${dd} ${m} ${yyyy} · ${timeHHMM}`;
  }

  function buildScreeningsSection(film){
    const list = Array.isArray(film.screenings) ? film.screenings : [];
    if (!list.length) return "";
    const titleText = lang==="de" ? "Vorführungen" : "Screenings";
    const btnText   = lang==="de" ? "Tickets kaufen" : "Book tickets";

    const cards = list.map(s => {
      const when = `${fmtWhen(s.date, s.time)}`;
      const venueName = localized(s.venue) || "";
      const addr = s.address || "";
      const mapsUrl = s.maps?.google || null;
      const tixUrl  = s.tickets || "#";
      const addrHtml = addr ? (mapsUrl ? `<a class="uffb-addr" href="${mapsUrl}" target="_blank" rel="noopener">${addr}</a>` : `<span class="uffb-addr">${addr}</span>`) : "";
      return `
        <article class="uffb-screening-card">
          <div class="uffb-whenline">${when}</div>
          ${venueName ? `<div class="uffb-venue-title">${venueName}</div>` : ""}
          ${addrHtml}
          <div class="uffb-card-actions">
            <a class="uffb-book-btn" href="${tixUrl}" target="_blank" rel="noopener">${btnText}</a>
          </div>
        </article>
      `;
    }).join("");

    return `
      <section class="uffb-screenings-block" id="screenings">
        <h2 class="uffb-section-title">${titleText}</h2>
        <div class="uffb-screenings-grid">${cards}</div>
      </section>
    `;
  }

  /* --- hero carousel with trailer as second slide --- */
  function buildMediaCarousel(film){
    const hasTrailer = Boolean(film.trailer);
    const title = localized(film.title) || film.original_title || "";
    // slides: always image; trailer slide if present
    const slides = [
      `<div class="uffb-slide is-image"><img src="${film.image}" alt="${title}"></div>`
    ];
    if (hasTrailer){
      slides.push(`
        <div class="uffb-slide is-trailer" data-trailer="${film.trailer}">
          <img src="${film.image}" alt="${title}">
          <button class="uffb-play-badge" aria-label="${lang==='de'?'Trailer ansehen':'Watch trailer'}">▶</button>
          <div class="uffb-slide-tag">${lang==='de'?'Trailer':'Trailer'}</div>
        </div>
      `);
    }
    return `
      <div class="uffb-media">
        <div class="uffb-slides" data-index="0" style="transform:translateX(0%)">
          ${slides.join("")}
        </div>
        ${slides.length>1 ? `
          <button class="uffb-nav uffb-prev" aria-label="Previous">‹</button>
          <button class="uffb-nav uffb-next" aria-label="Next">›</button>
        ` : ""}
      </div>
    `;
  }

  /* --- lightbox --- */
  function ensureLightbox(){
    if (document.getElementById("uffb-lightbox")) return;
    const box = document.createElement("div");
    box.id = "uffb-lightbox";
    box.innerHTML = `
      <div class="uffb-lb-backdrop" data-close="1"></div>
      <div class="uffb-lb-dialog" role="dialog" aria-modal="true" aria-label="Trailer">
        <button class="uffb-lb-close" aria-label="Close">×</button>
        <div class="uffb-lb-viewport">
          <iframe id="uffb-lb-iframe" src="" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(box);
    box.addEventListener("click", (e)=>{
      if (e.target.dataset.close==="1" || e.target.classList.contains("uffb-lb-close")) closeLightbox();
    });
    document.addEventListener("keydown", (e)=>{ if (e.key==="Escape") closeLightbox(); });
  }
  function openLightbox(trailerUrl){
    ensureLightbox();
    const embed = toEmbedUrl(trailerUrl);
    const lb = document.getElementById("uffb-lightbox");
    const iframe = document.getElementById("uffb-lb-iframe");
    iframe.src = embed || trailerUrl;
    lb.classList.add("open");
    document.documentElement.classList.add("uffb-noscroll");
  }
  function closeLightbox(){
    const lb = document.getElementById("uffb-lightbox");
    if (!lb) return;
    const iframe = document.getElementById("uffb-lb-iframe");
    iframe.src = "";
    lb.classList.remove("open");
    document.documentElement.classList.remove("uffb-noscroll");
  }

  /* --- wire up carousel interactions inside $mount --- */
  function initCarousel($root){
    const $media = $root.querySelector(".uffb-media");
    if (!$media) return;

    const $slides = $media.querySelector(".uffb-slides");
    let index = 0;
    const count = $media.querySelectorAll(".uffb-slide").length;
    const update = ()=>{ $slides.style.transform = `translateX(${-index*100}%)`; $slides.dataset.index = index; };

    const prev = ()=>{ index = (index-1+count)%count; update(); };
    const next = ()=>{ index = (index+1)%count; update(); };

    const $prev = $media.querySelector(".uffb-prev");
    const $next = $media.querySelector(".uffb-next");
    if ($prev) $prev.addEventListener("click", prev);
    if ($next) $next.addEventListener("click", next);

    // swipe
    let startX = null, dx = 0;
    $media.addEventListener("touchstart", e=>{ startX = e.touches[0].clientX; dx=0; }, {passive:true});
    $media.addEventListener("touchmove", e=>{ if(startX!=null) dx = e.touches[0].clientX - startX; }, {passive:true});
    $media.addEventListener("touchend", ()=>{
      if (Math.abs(dx)>40){ if (dx<0) next(); else prev(); }
      startX=null; dx=0;
    });

    // trailer slide click -> lightbox
    $media.addEventListener("click", (e)=>{
      const slide = e.target.closest(".is-trailer");
      if (slide && slide.dataset.trailer){ openLightbox(slide.dataset.trailer); }
    });
  }

  /* ---------- main ---------- */
  async function main(){
    const filmId = getFilmId();
    if (!filmId) return;

    const res = await fetch(DATA_URL);
    const films = await res.json();
    const film = films.find(f => f.id === filmId);
    if (!film) return;

    const $mount = document.getElementById("film-detail");
    if (!$mount) return;

    const title = localized(film.title) || film.original_title || "";
    const screeningsBlock = buildScreeningsSection(film);

    $mount.innerHTML = `
      <article class="uffb-film">
        <header class="uffb-film-header">
          ${buildTopLine(film)}
          <h1 class="uffb-title visually-hidden">${title}</h1>
          ${buildMediaCarousel(film)}
        </header>

        <section class="uffb-two-col">
          <div class="uffb-col-left">
            ${buildInfoBlock(film)}
            ${buildCreditsBlock(film)}
          </div>
          <div class="uffb-col-right">
            ${buildSynopsisBlock(film)}
          </div>
        </section>

        ${screeningsBlock}

        <section class="uffb-actions"></section>
      </article>
    `;

    // topline trailer button -> lightbox
    const trailerBtn = $mount.querySelector(".uffb-trailer-btn");
    if (trailerBtn){
      trailerBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        const url = trailerBtn.getAttribute("data-trailer");
        if (url) openLightbox(url);
      });
    }

    initCarousel($mount);

    // JSON-LD
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify(buildJsonLd(film));
    document.head.appendChild(ld);
  }

  /* ---------- CSS ---------- */
  const baseCSS = `
    .uffb-film{display:grid;gap:24px}
    .uffb-film-header{display:grid;gap:16px}
    .uffb-title{font-size:clamp(28px,4vw,44px);line-height:1.1;margin:0}

    /* MEDIA / CAROUSEL */
    .uffb-media{position:relative; overflow:hidden; border-radius:12px; background:#000}
    .uffb-slides{display:flex; transition:transform .35s ease; width:100%}
    .uffb-slide{min-width:100%; position:relative}
    .uffb-slide img{width:100%; height:auto; display:block}
    .uffb-nav{
      position:absolute; top:50%; transform:translateY(-50%);
      border:none; background:rgba(0,0,0,.45); color:#fff; width:40px; height:40px; border-radius:999px;
      font-size:22px; line-height:40px; text-align:center; cursor:pointer;
    }
    .uffb-prev{left:10px} .uffb-next{right:10px}
    .uffb-play-badge{
      position:absolute; inset:auto auto 16px 16px;
      border:1.5px solid #fff; color:#fff; background:transparent;
      border-radius:999px; padding:8px 12px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; cursor:pointer;
    }
    .uffb-slide-tag{
      position:absolute; left:16px; top:16px; background:rgba(0,0,0,.6); color:#fff; padding:4px 8px; border-radius:6px;
      font-size:12px; letter-spacing:.04em; text-transform:uppercase;
    }

    /* headline bar above hero */
    .uffb-topline{
      display:flex; gap:20px; align-items:flex-end; justify-content:space-between;
      background:#000; color:#fff; border-radius:12px; padding:22px 16px;
    }
    .uffb-topline-left{display:grid; gap:4px}
    .uffb-cat{font-size:14px; letter-spacing:.06em; opacity:.85; text-transform:uppercase}
    .uffb-top-title{font-size:clamp(22px,4.5vw,42px); font-weight:800; line-height:1; text-transform:uppercase}
    .uffb-topline-right{display:flex; align-items:center; gap:10px}
    .uffb-top-cta{
      display:inline-block; padding:10px 18px; border:1.5px solid currentColor; border-radius:6px;
      font-weight:800; text-decoration:none; letter-spacing:.06em; text-transform:uppercase;
    }
    @media (max-width:640px){
      .uffb-topline{flex-direction:column; align-items:flex-start}
      .uffb-topline-right{margin-top:8px}
    }

    /* a11y utility */
    .visually-hidden{
      position:absolute!important; width:1px!important; height:1px!important; padding:0!important; margin:-1px!important;
      overflow:hidden!important; clip:rect(0 0 0 0)!important; white-space:nowrap!important; border:0!important;
    }

    /* panels + headings */
    .uffb-panel{padding:0}
    .uffb-panel + .uffb-panel{margin-top:22px}
    .uffb-panel-title{
      font-size:12px; letter-spacing:.08em; text-transform:uppercase;
      opacity:.6; margin:6px 0 10px 0;
    }

    /* left column: info / credits table style */
    .uffb-info, .uffb-credits{display:grid; gap:6px}
    .uffb-info-row{display:grid; grid-template-columns:minmax(110px,150px) 1fr; gap:8px}
    .uffb-info-label{
      font-weight:700; text-transform:uppercase; letter-spacing:.04em; opacity:.85; font-size:12.5px;
    }
    .uffb-info-value{font-size:15px;}

    /* right column: synopsis */
    .uffb-synopsis2 .uffb-lead{margin:0 0 10px 0; font-size:18px;}
    .uffb-synopsis2 .uffb-bodytext{white-space:pre-wrap;}

    /* two-column responsive grid */
    .uffb-two-col{display:grid; gap:28px; margin-top:32px}
    @media (min-width: 960px){
      .uffb-two-col{grid-template-columns:1fr 2fr; align-items:start}
    }

    /* vertical separator on large screens */
    .uffb-col-left, .uffb-col-right{position:relative}
    @media (min-width: 960px){
      .uffb-col-left{padding-right:20px; border-right:1px solid rgba(0,0,0,.08)}
      .uffb-col-right{padding-left:20px}
    }

    /* Screenings header */
    .uffb-section-title{
      font-size:clamp(22px,4.5vw,42px);
      font-weight:800;
      line-height:1.05;
      margin:14px 0 10px 0;
      text-transform:none;
    }

    /* Grid of cards */
    .uffb-screenings-grid{
    display:grid;
    gap:16px;
    }
    @media (min-width:720px){
    .uffb-screenings-grid{ grid-template-columns:1fr 1fr; }
    }
    @media (min-width:1100px){
    .uffb-screenings-grid{ grid-template-columns:1fr 1fr 1fr; }
    }

    /* Card */
    .uffb-screening-card{
    display:grid;
    gap:8px;
    padding:16px;
    border:1px solid rgba(0,0,0,.12);
    border-radius:12px;
    background:#fff;
    }
    .uffb-screening-card .uffb-whenline,
    .uffb-screening-card .uffb-venue-title{
    color:#333;
    }

    .uffb-whenline{
    font-weight:700;
    }
    .uffb-venue-title{
    font-size:17px;
    font-weight:700;
    }
    .uffb-addr{
    text-decoration:underline;
    opacity:.9;
    color: var(--paragraphLinkColor);
    }

    /* Button: same style as topline CTA */
    .uffb-top-cta, .uffb-book-btn{
    display:inline-block; padding:10px 18px; border:1.5px solid currentColor; border-radius:6px;
    font-weight:800; text-decoration:none; letter-spacing:.06em; text-transform:uppercase;
    }

    .uffb-book-btn{
        color:#333;
        border-color:#333;
    }
    .uffb-card-actions{ margin-top:6px; }
`;

  const style = document.createElement("style");
  style.textContent = baseCSS;
  document.head.appendChild(style);

  main();
})();
