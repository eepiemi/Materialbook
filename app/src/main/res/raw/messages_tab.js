// Messages tab: skip Facebook's "Download Messenger" interstitial (it renders for a
// moment before the native side switches to the desktop Messages page). Navigate
// straight to the messages URL, which the app turns into desktop-mode Messages.
(() => {
  if (window.__mbMessagesTabHooked) return;
  window.__mbMessagesTabHooked = true;
  const isMessagesTab = (t) => {
    const tab = t && t.closest && t.closest('[role="tab"]');
    return tab && /^messages\b/i.test(tab.getAttribute('aria-label') || '') ? tab : null;
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
})();
