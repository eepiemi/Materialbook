// Messages in desktop mode, page side:
//  1. Hook the Messages tab so Facebook's "Download Messenger" page never flashes before
//     the app switches to the desktop Messages page.
//  2. While the desktop site is shown, tell the app when it navigates (in-page, through
//     pushState/popstate) to somewhere outside Messages, so the app can switch back to the
//     mobile layout. WebView does not report those navigations as page loads.
(() => {
  if (window.__mbMessagesTabHooked) return;
  window.__mbMessagesTabHooked = true;

  // Locale independent: the tab's icon glyph, or "third of the six tabs". The English
  // label is kept as the first check.
  const MESSAGES_GLYPH = '\u{F0388}';
  const isMessagesTab = (t) => {
    const tab = t && t.closest && t.closest('[role="tab"]');
    if (!tab) return null;
    if (/^messages\b/i.test(tab.getAttribute('aria-label') || '')) return tab;
    if ((tab.textContent || '').indexOf(MESSAGES_GLYPH) !== -1) return tab;
    const list = tab.parentElement;
    if (list && list.getAttribute('role') === 'tablist' && list.children.length === 6 && list.children[2] === tab) return tab;
    return null;
  };

  let last = 0;
  const go = (e) => {
    if (!isMessagesTab(e.target)) return;
    e.stopImmediatePropagation();
    // First of pointerup/click wins; touchend/mouseup are only swallowed.
    if ((e.type === 'pointerup' || e.type === 'click') && Date.now() - last > 1000) {
      last = Date.now();
      window.location.href = 'https://m.facebook.com/messages/';
    }
  };
  ['click', 'touchend', 'pointerup', 'mouseup'].forEach(
    (type) => document.addEventListener(type, go, true)
  );

  // Desktop site only, judged by its markup: the mobile site can be served from www.facebook.com
  // too (right after leaving Messages), so the host name is no use here.
  const notifyLeft = () => {
    try {
      if (!(window.isDesktopMode && window.isDesktopMode())) return;
      if (/^\/(messages|messenger|login|checkpoint)/.test(location.pathname)) return;
      if (window.MessagesBridge) window.MessagesBridge.onLeftMessages();
    } catch (e) {}
  };
  ['pushState', 'replaceState'].forEach((k) => {
    const orig = history[k];
    history[k] = function () {
      const r = orig.apply(this, arguments);
      setTimeout(notifyLeft, 0);
      return r;
    };
  });
  window.addEventListener('popstate', notifyLeft);
})();
