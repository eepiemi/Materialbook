/* Prefer the best source exposed by Facebook and avoid WebView data-saving behaviour. */
(() => {
  'use strict';
  const mark = 'data-materialbook-video-optimized';
  const score = source => {
    const text = `${source.getAttribute('src') || ''} ${source.getAttribute('data-video-url') || ''} ${source.getAttribute('data-quality') || ''}`;
    const match = text.match(/(?:^|[^0-9])([0-9]{3,4})p(?:[^0-9]|$)/i);
    return match ? Number(match[1]) : 0;
  };
  const optimize = root => {
    if (!(root instanceof Element || root === document)) return;
    root.querySelectorAll('video').forEach(video => {
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = 'auto';
      video.disablePictureInPicture = false;
      video.style.imageRendering = 'auto';
      const sources = [...video.querySelectorAll('source')].sort((a, b) => score(b) - score(a));
      if (sources[0] && score(sources[0]) > 0 && video.src !== sources[0].src) video.src = sources[0].src;
      if (!video.hasAttribute(mark)) {
        video.setAttribute(mark, '1');
        video.addEventListener('loadedmetadata', () => {
          if (video.videoWidth >= 720) video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
        }, { once: true });
      }
    });
  };
  optimize(document);
  const observer = new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(node => node instanceof Element && optimize(node))));
  const start = () => document.body && observer.observe(document.body, { childList: true, subtree: true });
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
