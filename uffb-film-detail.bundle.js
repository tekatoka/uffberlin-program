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
          <h1 class="uffb-title">${title}</h1>
          ${film.image ? `<figure class="uffb-hero"><img src="${film.image}" alt="${title}"></figure>` : ""}
        </header>

        <section class="uffb-meta">
          ${metaHTML}
        </section>

        ${synopsisHTML}

        ${screeningsBlock}

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
  `;
  const style = document.createElement("style");
  style.textContent = baseCSS;
  document.head.appendChild(style);

  main();
})();
