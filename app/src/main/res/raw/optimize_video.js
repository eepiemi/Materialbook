/* Progressive enhancement only: never replace Facebook's adaptive/blob player. */
(() => {
  'use strict';
  if (window.__breeBookVideo) { window.__breeBookVideo.refresh(); return; }
  const options = window.BreeBookVideoOptions || {};
  const tracked = new Set();
  const nearby = new WeakSet();
  const enhanced = new WeakMap();
  const quality = source => {
    const label = `${source.getAttribute('data-quality') || ''} ${source.getAttribute('label') || ''}`;
    return Number(label.match(/(\d{3,4})p?/)?.[1] || 0);
  };
  const preferHD = video => {
    if (!options.highResolution || video.currentSrc.startsWith('blob:') || video.src.startsWith('blob:')) return;
    // Only select an explicitly labelled alternative before playback starts.
    if (video.currentTime > 0 || !video.paused) return;
    const sources = [...video.querySelectorAll('source')].filter(s =>
      /^https?:/.test(s.src) && (!s.type || video.canPlayType(s.type)));
    const best = sources.sort((a, b) => quality(b) - quality(a))[0];
    if (!best || quality(best) < 720 || video.src === best.src || enhanced.get(video) === best.src) return;
    enhanced.set(video, best.src);
    const original = video.getAttribute('src');
    video.addEventListener('error', () => {
      if (original === null) video.removeAttribute('src'); else video.setAttribute('src', original);
      video.load();
    }, { once: true });
    video.src = best.src;
  };
  const configure = video => {
    video.setAttribute('playsinline', '');
    video.preload = options.cache && nearby.has(video) && !document.hidden ? 'auto' : 'metadata';
    preferHD(video);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) nearby.add(target); else nearby.delete(target);
      configure(target);
    });
  }, { rootMargin: '200px 0px' });
  const scan = root => {
    const videos = root instanceof HTMLVideoElement ? [root] : root.querySelectorAll?.('video') || [];
    videos.forEach(video => {
      if (tracked.has(video)) return;
      tracked.add(video);
      configure(video);
      observer.observe(video);
    });
  };
  const cleanup = () => tracked.forEach(video => {
    if (!video.isConnected) { observer.unobserve(video); tracked.delete(video); }
  });
  const mutations = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(scan));
    cleanup();
  });
  const refresh = () => { cleanup(); tracked.forEach(configure); };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) tracked.forEach(video => video.pause());
    refresh();
  });
  scan(document);
  mutations.observe(document.documentElement, { childList: true, subtree: true });
  window.__breeBookVideo = { refresh };
})();
