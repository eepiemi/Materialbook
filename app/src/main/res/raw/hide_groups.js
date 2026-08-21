// Hide group suggestions on search page
(() => {
  const hideLastGroupSuggestion = () => {
    if (window.location.href.includes('facebook.com/search')) {
      const parents = document.querySelectorAll('[data-is-h-scrollable]');
      const lastParent = parents[parents.length - 1]?.closest('.m.bg-s1');
      if (lastParent) lastParent.style.display = 'none';
    }
  };

  hideLastGroupSuggestion();
  new MutationObserver(hideLastGroupSuggestion).observe(document.body, { childList: true, subtree: true });
})();

// Hide on comments
(() => {
  const hideGroupContainer = () => {
    if (!window.location.href.includes('facebook.com/story.php?') && !window.location.href.includes('facebook.com/groups')) return;

    const groupContainer = document.querySelector('h3[data-tti-phase="-1"].m');
    if (groupContainer) {
      const parent = groupContainer.closest('.m.bg-s2');
      if (parent) parent.style.display = 'none';
    }
  };

  hideGroupContainer();

  new MutationObserver(hideGroupContainer).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

// Hide group posts from the main feed (mobile)
(() => {
  const hideGroupPosts = (nodes) => {
    if (window.location.pathname !== '/') return;

    nodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return;

      const containers = node.matches('[data-tracking-duration-id]')
        ? [node]
        : Array.from(node.querySelectorAll?.('[data-tracking-duration-id]') || []);

      containers.forEach(container => {
        // Only match a group link in the post's header/byline (h3), not
        // anywhere in the post body, so posts that merely mention/share a
        // group link aren't hidden along with actual group-origin posts.
        const header = container.querySelector('h3[data-tti-phase="-1"]');
        if (header?.querySelector('a[href*="/groups/"]')) {
          container.style.display = 'none';
        }
      });
    });
  };

  hideGroupPosts([document.body]);

  new MutationObserver(muts =>
    muts.forEach(m => hideGroupPosts([...m.addedNodes]))
  ).observe(document.body, { childList: true, subtree: true });
})();

