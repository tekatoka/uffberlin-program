(function(){
  const DATA_URL = "https://raw.githubusercontent.com/tekatoka/uffberlin-program/refs/heads/master/uffb-program-2025.json";

  const lang = location.pathname.includes("/de/") ? "de" : "en";

  function getFilmId(){
    const params = new URLSearchParams(location.search);
    if (params.get("id")) return params.get("id");
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1]; // last segment as slug
  }

  function joinLocalized(val){
    // Accept string OR array; return string
    if (!val) return "";
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  }

  function localized(obj){
    if (!obj) return "";
    return obj[lang] ?? obj["en"] ?? obj["de"] ?? "";
  }

  function fmtDuration(mins){
    if (!mins || isNaN(mins)) return "";
    return `${mins} min`;
  }

  function iso8601Duration(mins){
    if (!mins || isNaN(mins)) return null;
    return `PT${Math.round(mins)}M`;
    // If you ever pass hours+mins, extend to PT#H#M
}

 function buildTopLine(film){
  const title = localized(film.title) || film.original_title || "";
  const cat = film.category ? (film.category[lang] || film.category.en || film.category.de || "") : "";
  return `
    <div class="uffb-topline">
      <div class="uffb-topline-left">
        <div class="uffb-cat">#${cat}</div>
        <div class="uffb-top-title">${title}</div>
      </div>
      <div class="uffb-topline-right">
        <a class="uffb-top-cta" href="#screenings">TICKETS</a>
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

  function screeningsList(screenings){
    if (!Array.isArray(screenings) || screenings.length === 0) return "";
    return `
      <ul class="uffb-screenings">
        ${screenings.map(s => {
          const v = localized(s.venue);
          const when = `${s.date} — ${s.time}`;
          const tix = s.tickets ? `<a class="uffb-tickets" href="${s.tickets}" target="_blank" rel="noopener">Tickets</a>` : "";
          return `<li class="uffb-screening"><span class="uffb-when">${when}</span>${v?`<span class="uffb-venue">${v}</span>`:""} ${tix}</li>`;
        }).join("")}
      </ul>
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
      "trailer": film.teaser ? {
        "@type": "VideoObject",
        "name": "Trailer",
        "url": film.teaser
      } : undefined
    };
    // Clean undefined keys
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

  // Optional: languages field (if you later add film.languages = {en:[..], de:[..]})
  const langs = film.languages ? (film.languages[lang] || film.languages.en || film.languages.de || []) : [];
  const langsTxt = Array.isArray(langs) ? langs.join(", ") : langs;

  return `
    <section class="uffb-panel">
      <h3 class="uffb-panel-title">${lang==="de"?"Info":"Info"}</h3>
      <div class="uffb-info">
        ${infoRow(lang==="de"?"Reihe":"Category", cat)}
        ${infoRow(lang==="de"?"ET":"Original title", original)}
        ${infoRow(lang==="de"?"Länder":"Countries", countriesTxt)}
        ${langsTxt ? infoRow(lang==="de"?"Sprache(n)":"Language(s)", langsTxt) : ""}
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
    const teaserBtn = film.teaser ? `<a class="uffb-teaser" href="${film.teaser}" target="_blank" rel="noopener">🎞️ ${lang==="de"?"Trailer":"Trailer"}</a>` : "";

    const metaHTML = `
      ${sectionRow(lang==="de"?"Originaltitel":"Original title", film.original_title || "")}
      ${sectionRow(lang==="de"?"Regie":"Director", film.director || "")}
      ${sectionRow(lang==="de"?"Dauer":"Duration", fmtDuration(film.duration))}
      ${sectionRow(lang==="de"?"Länder":"Countries", joinLocalized(film.countries ? (film.countries[lang]||film.countries.en||film.countries.de) : ""))}
      ${sectionRow(lang==="de"?"Genre":"Genre", joinLocalized(film.genre ? (film.genre[lang]||film.genre.en||film.genre.de) : ""))}
      ${sectionRow(lang==="de"?"Darsteller:innen":"Actors", Array.isArray(film.actors) ? film.actors.join(", ") : (film.actors||""))}
    `;

    const longSynopsis = localized(film.detailed_description) || "";
    const shortBlurb = localized(film.description) || "";
    const synopsisHTML = longSynopsis || shortBlurb ? `
      <div class="uffb-synopsis">
        <h2>${lang==="de"?"Inhalt":"Synopsis"}</h2>
        <div class="uffb-synopsis-text">
          ${longSynopsis ? longSynopsis : shortBlurb}
        </div>
      </div>
    ` : "";

    const screeningsHTML = screeningsList(film.screenings);
    const screeningsBlock = screeningsHTML ? `
      <div class="uffb-screenings-block">
        <h2>${lang==="de"?"Vorstellungen":"Screenings"}</h2>
        ${screeningsHTML}
      </div>
    ` : "";

    $mount.innerHTML = `
        <article class="uffb-film">
            <header class="uffb-film-header">
            ${buildTopLine(film)}
            <h1 class="uffb-title visually-hidden">${title}</h1>
            ${film.image ? `<figure class="uffb-hero"><img src="${film.image}" alt="${title}"></figure>` : ""}
            </header>

            <!-- 2-column responsive layout -->
            <section class="uffb-two-col">
            <div class="uffb-col-left">
                ${buildInfoBlock(film)}
                ${buildCreditsBlock(film)}
            </div>
            <div class="uffb-col-right">
                ${buildSynopsisBlock(film)}
            </div>
            </section>

            ${screeningsHTML ? `
            <div class="uffb-screenings-block" id="screenings">
                <h2>${lang==="de"?"Vorstellungen":"Screenings"}</h2>
                ${screeningsHTML}
            </div>` : ""}

            <section class="uffb-actions">
            ${teaserBtn}
            </section>
        </article>
    `;


    // JSON-LD
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify(buildJsonLd(film));
    document.head.appendChild(ld);
  }

  // Minimal, flexible CSS hooks (style these in your stylesheet)
  const baseCSS = `
    .uffb-film{display:grid;gap:24px}
    .uffb-film-header{display:grid;gap:16px}
    .uffb-title{font-size:clamp(28px,4vw,44px);line-height:1.1;margin:0}
    .uffb-hero{margin:0}
    .uffb-hero img{width:100%;height:auto;display:block;border-radius:12px}
    .uffb-meta{display:grid;gap:10px}
    .uffb-meta-row{display:grid;grid-template-columns:180px 1fr;gap:10px}
    .uffb-meta-label{font-weight:600;opacity:.85}
    .uffb-synopsis h2,.uffb-screenings-block h2{margin:8px 0 6px 0}
    .uffb-synopsis-text{white-space:pre-wrap}
    .uffb-screenings{list-style:none;padding:0;margin:0;display:grid;gap:12px}
    .uffb-screening{display:grid;gap:4px}
    .uffb-when{font-weight:700}
    .uffb-venue{display:block;opacity:.9}
    .uffb-tickets{font-weight:600;text-decoration:underline}
    .uffb-actions{display:flex;gap:12px;align-items:center}
    /* headline bar above hero */
    .uffb-topline{
    display:flex; gap:20px; align-items:flex-end; justify-content:space-between;
    padding:22px 16px; background:#000; color:#fff; border-radius:12px; 
    }
    .uffb-topline-left{display:grid; gap:4px}
    .uffb-cat{font-size:14px; letter-spacing:.06em; opacity:.85; text-transform:uppercase}
    .uffb-top-title{font-size:clamp(22px,4.5vw,42px); font-weight:800; line-height:1; text-transform:uppercase}
    .uffb-topline-right{display:flex; align-items:center}
    .uffb-top-cta{
    display:inline-block; padding:10px 18px; border:1.5px solid currentColor; border-radius:6px;
    font-weight:800; text-decoration:none; letter-spacing:.06em; text-transform:uppercase;
    }
    @media (max-width:640px){
    .uffb-topline{flex-direction:column; align-items:flex-start}
    .uffb-topline-right{margin-top:8px}
    }

    /* a11y utility if you don’t already have it */
    .visually-hidden{
    position:absolute!important; width:1px!important; height:1px!important; padding:0!important; margin:-1px!important;
    overflow:hidden!important; clip:rect(0 0 0 0)!important; white-space:nowrap!important; border:0!important;
    }

    /* panels + headings */
    .uffb-panel{padding:0}
    .uffb-panel + .uffb-panel{margin-top:22px}
    .uffb-panel-title{
    font-size:12px; letter-spacing:.08em; text-transform:uppercase;
    opacity:.6; margin:0 0 10px 0;
    }

    /* left column: info / credits table style */
    .uffb-info, .uffb-credits{display:grid; gap:8px}
    .uffb-info-row{display:grid; grid-template-columns:180px 1fr; gap:10px}
    .uffb-info-label{
    font-weight:700; text-transform:uppercase; letter-spacing:.04em; opacity:.85; font-size:13px;
    }
    .uffb-info-value{font-size:15px; line-height:1.45}

    /* right column: synopsis */
    .uffb-synopsis2 .uffb-lead{margin:0 0 10px 0; font-size:18px; line-height:1.45}
    .uffb-synopsis2 .uffb-bodytext{white-space:pre-wrap; line-height:1.6}

    /* two-column responsive grid */
    .uffb-two-col{display:grid; gap:28px}
    @media (min-width: 960px){
    .uffb-two-col{grid-template-columns:1fr 1fr; align-items:start}
    }

    /* optional: separator like in your reference */
    .uffb-col-left, .uffb-col-right{position:relative}
    @media (min-width: 960px){
    .uffb-col-left{padding-right:24px; border-right:1px solid rgba(0,0,0,.08)}
    .uffb-col-right{padding-left:24px}
    }
  `;
  const style = document.createElement("style");
  style.textContent = baseCSS;
  document.head.appendChild(style);

  main();
})();
