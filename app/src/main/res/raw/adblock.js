/*
 * Feed ad filtering. Facebook's generated class names change frequently, so
 * this uses stable semantics, ad attributes and conservative fallbacks.
 * Regional coverage follows maintained EasyList/AdGuard language filters.
 */
(() => {
  'use strict';
  const AD_TEXT = /^(ad|ads|advertisement|advertising|sponsored|sponsor(ed)?|publicidad|anuncio|anuncios|patrocinado|patrocinada|patrocinados|patrocinadas|contenido patrocinado|contenido promocionado|impulsionado|pubblicit[aà]|sponsorizzato|gesponsert|werbung|annonce|sponsorisé|reklama|реклама|спонсируемое|广告|贊助內容|広告|スポンサー|광고|ممول|إعلان|محتوى مدفوع)$/i;
  const AD_ATTR = /(^|[-_:])(ad|ads|advert|advertisement|sponsored|sponsor|promoted|publicidad|anuncio|patrocinad|реклам|广告|広告|광고|ممول)([-_:]|$)/i;
  const AD_URL = /(^|[./_-])(doubleclick|googlesyndication|googleadservices|adnxs|adsrvr|taboola|outbrain|amazon-adsystem|criteo|zedo|moat|adsafeprotected)([./_-]|$)/i;
  const HIDDEN = 'data-materialbook-ad-hidden';
  const FEED_ROOTS = ['[role="feed"]', '[data-pagelet*="Feed"]', '[data-pagelet*="feed"]', 'main', 'body'];
  const normalise = value => (value || '').replace(/\s+/g, ' ').trim();
  const isVisible = element => {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  };
  const isAdMarker = element => {
    if (!(element instanceof Element)) return false;
    const values = [element.textContent, element.getAttribute('aria-label'), element.getAttribute('title')].map(normalise);
    if (values.some(value => AD_TEXT.test(value))) return true;
    for (const attr of ['data-ad-preview', 'data-ad-comet-preview', 'data-testid', 'data-pagelet', 'class', 'id']) {
      if (AD_ATTR.test(element.getAttribute(attr) || '')) return true;
    }
    return AD_URL.test(element.getAttribute('href') || '');
  };
  const candidatePost = element => element.closest('[data-pagelet^="FeedUnit"], [data-pagelet*="FeedUnit"], [data-ad-comet-preview], [data-ad-preview], [role="article"], [data-tracking-duration-id], div[role="article"]');
  const hide = post => {
    if (!(post instanceof HTMLElement) || post.hasAttribute(HIDDEN)) return;
    post.setAttribute(HIDDEN, '1');
    post.style.setProperty('display', 'none', 'important');
    const previous = post.previousElementSibling;
    if (previous instanceof HTMLElement && previous.getBoundingClientRect().height < 80) previous.style.setProperty('display', 'none', 'important');
  };
  const scan = root => {
    if (!(root instanceof Element)) return;
    const nodes = [root, ...root.querySelectorAll('*')];
    for (const node of nodes) {
      if (isVisible(node) && isAdMarker(node)) {
        const post = candidatePost(node);
        if (post && isVisible(post)) hide(post);
      }
    }
    root.querySelectorAll('span, a, div[role="link"], div[role="heading"]').forEach(marker => {
      const value = normalise(marker.textContent || marker.getAttribute('aria-label'));
      if (!AD_TEXT.test(value)) return;
      let parent = marker;
      for (let i = 0; i < 7 && parent; i += 1, parent = parent.parentElement) {
        if (parent instanceof HTMLElement && parent.children.length > 2 && parent.getBoundingClientRect().height > 120) { hide(parent); break; }
      }
    });
  };
  const style = document.createElement('style');
  style.id = 'materialbook-adblock-style';
  style.textContent = `[${HIDDEN}], [data-ad-preview], [data-ad-comet-preview] { display: none !important; }`;
  (document.head || document.documentElement).appendChild(style);
  const run = () => FEED_ROOTS.forEach(selector => document.querySelectorAll(selector).forEach(scan));
  run();
  const observer = new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(node => node instanceof Element && scan(node))));
  const start = () => document.body && observer.observe(document.body, { childList: true, subtree: true });
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
  setInterval(run, 2500);
})();
window.__materialbookAdblockVersion = '2026.09';
window.__materialbookAdblockLanguages = ['es', 'pt', 'en', 'fr', 'de', 'it', 'nl', 'tr', 'pl', 'ru', 'uk', 'zh', 'ja', 'ko', 'ar'];
// Sources: https://easylist.to/ and https://adguard.com/kb/general/ad-filtering/adguard-filters/
