(function() {
  const backgroundColorRegex = /background-color\s*:\s*(#242526|rgba\s*\(\s*36\s*,\s*37\s*,\s*38\s*,\s*1\.?0*\s*\)|rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*1\.?0*\s*\)|rgb\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;
  const backgroundRegex = /background\s*:\s*(rgba\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d*\.?\d+\s*\)|rgb\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;
  const colorRegex = /color\s*:\s*(rgba\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d*\.?\d+\s*\)|rgb\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;
  const borderRegex = /border-color\s*:\s*(rgba\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d*\.?\d+\s*\))\s*;/gi;

  function isLightGray(r, g, b) {
    return r >= 50 && r <= 150 && g >= 50 && g <= 150 && b >= 50 && b <= 150 &&
           Math.abs(r - g) <= 20 && Math.abs(g - b) <= 20 && Math.abs(r - b) <= 20;
  }

  const processedStyles = new WeakSet();

  function processStyles() {
    document.querySelectorAll('style').forEach(style => {
      if (processedStyles.has(style)) return;
      processedStyles.add(style);

      if (style.sheet?.cssRules) {
        try {
          Array.from(style.sheet.cssRules).forEach(rule => {
            const bg = rule.style?.backgroundColor.replace(/\s+/g, '').toLowerCase();
            if (bg === '#242526' || bg === 'rgba(36,37,38,1)' || bg === 'rgba(36,37,38,1.0)') {
              rule.style.backgroundColor = '#000000';
            } else if (bg.startsWith('rgba(')) {
              const match = bg.match(/rgba\((\d+),(\d+),(\d+),1\.?0*\)/);
              if (match && isLightGray(...match.slice(1).map(Number))) {
                rule.style.backgroundColor = '#121212';
              }
            } else if (bg.startsWith('#') && bg.length === 7) {
              const [r, g, b] = [1, 3, 5].map(i => parseInt(bg.slice(i, i + 2), 16));
              if (isLightGray(r, g, b)) rule.style.backgroundColor = '#121212';
            }
          });
        } catch (e) {}
      }

      if (style.innerHTML) {
        style.innerHTML = style.innerHTML?.replace(backgroundColorRegex, (m, g, r, g2, b, hex) => {
          if (['#242526', '#242527', 'rgba(16,16,17,1.0)', 'rgba(24,25,26,1.0)', 'rgba(28,28,29,1.0)', 'rgba(36,37,38,1.0)', 'rgba(37,39,40,1.0)', 'rgba(38,38,38,1.0)'].includes(g)) return 'background-color:#000000;';
          if (((r && g2 && b && isLightGray(+r, +g2, +b))) || g === 'rgba(51,51,52,1.0)') return 'background-color:#121212;';
          if (hex && isLightGray(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)))) {
            return 'background-color:#121212;';
          }
          return m;
        });
        style.innerHTML = style.innerHTML?.replace(borderRegex, (m, g) => {
           if (g === 'rgba(37,39,40,1.0)') return 'border-color:#000000;';
           return m;
        });
      }
    });

    document.querySelectorAll('[style*="background-color"]').forEach(el => {
      const style = el.getAttribute('style')?.replace(backgroundColorRegex, (m, g, r, g2, b, hex) => {
        if (['#18191a', '#242526', 'rgba(36,37,38,1.0)'].includes(g)) return 'background-color:#000000;';
        if (r && g2 && b && isLightGray(+r, +g2, +b) || g === 'rgb(37, 39, 40)') return 'background-color:#121212;';
        if (hex && isLightGray(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)))) {
          return 'background-color:#121212;';
        }
        return m;
      });
      if (style !== el.getAttribute('style')) el.setAttribute('style', style);
    });

    // Login-specific AB
    document.querySelectorAll('[data-bloks-name="bk.components.TextSpan"][style*="color"], [class*="wbloks"][style*="color"]').forEach(el => {
      const style = el.getAttribute('style')?.replace(colorRegex, (m, g, hex) => {
        if (g === 'rgb(17, 17, 18)') return 'color:#dfdfdf; caret-color:#dfdfdf;';
        if (hex === '111112') return 'color:#dfdfdf;'; // hacky communication between material_you.js and this file
        return m;
      });
      if (style !== el.getAttribute('style')) el.setAttribute('style', style);
    });

    document.querySelectorAll('[class*="wbloks"][style*="background"]').forEach(el => {
      const style1 = el.getAttribute('style')?.replace(backgroundColorRegex, (m, g, r, g2, b, hex) => {
        if (g === 'rgb(255, 255, 255)') return 'background-color:#000000;';
        return m;
      });
      if (style1 !== el.getAttribute('style')) el.setAttribute('style', style1);

      const style2 = el.getAttribute('style')?.replace(backgroundRegex, (m, g, hex) => {
        if (g === 'rgba(255, 255, 255, 0.2)') return 'background:#121212;';
        if (g === 'rgb(242, 244, 246)') return 'background:#181818;';
        return m;
      });
      if (style2 !== el.getAttribute('style')) el.setAttribute('style', style2);
    });

    // Bottom sheet borders
    document.querySelectorAll('[style*="--nbc"]').forEach(el => {
      let val = el.style.getPropertyValue('--nbc')?.trim().toLowerCase();
      if (['#242526', '#252728', '#1c1c1d'].includes(val)) {
        el.style.setProperty('--nbc', '#000000');
        return;
      }
      if (val === '#3b3c3e') {
        el.style.setProperty('--nbc', '#121212');
        return;
      }
    });

    // "Feed" tab spinner background
    document.querySelectorAll('div[data-mcomponent="MSpinner"]')?.forEach(spinner => {
      const parent = spinner.closest('div[data-mcomponent="MContainer"][style*="margin-top:-1px"]');
      if (parent) parent.classList.add('spinner-parent');
    });

    const meta = document.querySelector('meta[name="theme-color"]')
    const content = meta?.getAttribute('content')?.toLowerCase().trim();
    // only theme white theme-color on the login and cookie screens
    if (!(['#242526', '#3b5998'].includes(content) || (content === '#ffffff' && document.querySelector('[class*="wbloks"]')))) return;
    meta?.setAttribute('content', '#000000');
  }

   processStyles();

  function loginAndCookieCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .wbloks_11 {
          --wbloks-cds-overlay-alpha-80: rgba(0, 0, 0, 0.5);
          --wbloks-cds-surface-background: #000;
      }

      .acw, .wbloks_73, ._algy, ._al7d { background-color: #000; }
      .spinner-parent::before { background-color:#000 !important; }

      .wbloks_76, ._algy, ._al5f, ._am37, ._al7j ._al66, ._al5g, ._albn, ._al7d { color: #fff; }
      .wbloks_75 { color: #dfdfdf; }
      div.wbloks_67 { border-top: 1px solid #363636; }

      ._albn, ._al4_, ._al5g, .toast-label { background-color: #121212; }
      ._al7j ._al66, ._9nqb { background-color: #242424; }
      .sp_M-AstDWg75z_3x { filter: invert(1) }

      :root, .__fb-light-mode:root, .__fb-light-mode {
        --card-background: #121212;
        --primary-text: #fff;
        --secondary-text: #dedede;
        --secondary-icon: #dedede;
        --secondary-button-background: #242424;
        --input-background: #242424;
        --overlay-alpha-80: rgba(0, 0, 0, 0.8);
        --web-wash: #000;
        --surface-background: #000;
        --always-white: #000;
        --comment-background: #242424;
        --primary-icon: #dedede;
        --secondary-button-text: #dedede;
        --card-background-flat: #242424;
      }
    `;
    document.head.appendChild(style);
  }

  loginAndCookieCSS();

  new MutationObserver(mutations => {
    if (mutations.some(m =>
      (m.type === 'childList' && Array.from(m.addedNodes).some(n =>
        n.tagName === 'STYLE' || (n.nodeType === 1 && n.hasAttribute('style')) ||
        (n.tagName === 'META' && n.getAttribute('name') === 'theme-color'))) ||
      (m.type === 'characterData' && m.target.parentNode?.tagName === 'STYLE') ||
      (m.type === 'attributes' && (m.attributeName === 'style' ||
        (m.target.tagName === 'META' && m.attributeName === 'content'))))
    ) processStyles();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['style', 'content']
  });
})();