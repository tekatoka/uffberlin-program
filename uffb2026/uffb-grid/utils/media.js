export function embedUrl(url) {
  try {
    const u = new URL(url);

    if (
      (u.hostname.includes('youtube.com') && u.searchParams.get('v')) ||
      u.hostname.includes('youtu.be')
    ) {
      const id = u.hostname.includes('youtu.be')
        ? u.pathname.slice(1)
        : u.searchParams.get('v');
      const p = new URLSearchParams({
        rel: '0',
        autoplay: '1',
        modestbranding: '1',
      });
      return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
    }

    if (u.hostname.includes('player.vimeo.com')) {
      u.searchParams.set('autoplay', '1');
      u.searchParams.set('title', '0');
      u.searchParams.set('byline', '0');
      u.searchParams.set('portrait', '0');
      u.searchParams.set('dnt', '1');
      return u.toString();
    }

    if (u.hostname.includes('vimeo.com')) {
      const segs = u.pathname.split('/').filter(Boolean);
      const id = segs.find((s) => /^\d+$/.test(s));
      const pathIdx = segs.findIndex((s) => s === id);
      const pathHash =
        pathIdx >= 0 && segs[pathIdx + 1] && !/^\d+$/.test(segs[pathIdx + 1])
          ? segs[pathIdx + 1]
          : '';
      const h = u.searchParams.get('h') || pathHash || '';
      const qs = new URLSearchParams({
        autoplay: '1',
        title: '0',
        byline: '0',
        portrait: '0',
        dnt: '1',
      });
      if (h) qs.set('h', h);
      if (id) return `https://player.vimeo.com/video/${id}?${qs.toString()}`;
    }

    return url;
  } catch {
    return url;
  }
}
