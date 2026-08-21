(() => {
  const isDesktop = window.isDesktopMode && window.isDesktopMode();

  if (isDesktop) {
    const CONTAINER = 'div.x6ikm8r.x10wlt62';
    const CHILD = 'div.x6s0dn4.x78zum5.xnpuxes';

    const handle = node => {
      if (!(node instanceof HTMLElement)) return;
      const targets = node.matches(CONTAINER) ? [node] : node.querySelectorAll(CONTAINER);
      targets.forEach(container => {
        if (container.querySelector(CHILD)) container.style.display = 'none';
      });
    };

    document.querySelectorAll(CONTAINER).forEach(handle);

    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(handle));
    }).observe(document.body, { childList: true, subtree: true });

  } else {
    const ICON = '󲀠';
    const FLAG = 'data-reel-hidden';

    const handle = node => {
      if (!(node instanceof HTMLElement)) return;
      const items = node.matches('.fl.ac .native-text') ? [node] : node.querySelectorAll('.fl.ac .native-text');
      items.forEach(el => {
        if (el.textContent.trim() === ICON) {
          const box = el.closest('[data-tracking-duration-id]');
          if (box && !box.hasAttribute(FLAG)) {
            box.setAttribute(FLAG, '1');
            box.style.display = 'none';
          }
        }
      });
    };

    document.querySelectorAll('.fl.ac .native-text').forEach(handle);

    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(handle));
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
