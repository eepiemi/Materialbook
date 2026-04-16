(function() {
  const MATERIALYOU_PRIMARY = window.MaterialYouBridge.getMaterialYouPrimaryRgbString();
  const MATERIALYOU_ONPRIMARY = window.MaterialYouBridge.getMaterialYouOnPrimaryRgbString();
  const MATERIALYOU_PRIMARY_RGB = JSON.parse(window.MaterialYouBridge.getMaterialYouPrimaryRgb());
  const MATERIALYOU_ONPRIMARY_RGB  = JSON.parse(window.MaterialYouBridge.getMaterialYouOnPrimaryRgb());

  const backgroundColorRegex = /background-color\s*:\s*(rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d+)\s*\)|rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;
  const backgroundRegex = /background\s*:\s*(rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d+)\s*\)|rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;
  const colorRegex = /color\s*:\s*(rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d+)\s*\)|rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;
  const borderRegex = /border\s*:\s*(\d{1}px)\s+solid\s+(rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d+)\s*\)|rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;
  const borderColorRegex = /border-color\s*:\s*(rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d+)\s*\)|rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;

  function isFacebookBlue(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max - min;

    return (
      b > r + 40 &&
      b > g + 20 &&
      saturation > 60 &&
      b > 100
    );
  }

  // Mechanism to prevent some parts of the code infinitely triggering the MO, causing the function to loop
  const processedStyles = new WeakSet();

  function processMaterialYouStyles() {
    document.querySelectorAll('style')?.forEach(style => {
      if (processedStyles.has(style)) return;
      processedStyles.add(style);

      if (style.innerHTML) {
        style.innerHTML = style.innerHTML?.replace(backgroundColorRegex, (m, gr, Ar, Ag, Ab, Aa, r, g, b, hex) => {
          if ((r && g && b && isFacebookBlue(+r, +g, +b)) ||
          (hex && isFacebookBlue(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))))) return `background-color:${MATERIALYOU_PRIMARY};`;
          if (Ar && Ag && Ab && isFacebookBlue(+Ar, +Ag, +Ab)) return `background-color: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, ${+Aa});`;
          if (gr === 'rgba(0,152,124,1.0)') return `background-color:${MATERIALYOU_ONPRIMARY};`;
          if (gr === 'rgba(231,243,255,1.0)') return `background-color: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, 0.098);`;
          if (gr === 'rgba(235,245,255,1.0)') return `background-color: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, 0.2);`;
          if (gr === 'rgba(37,47,60,1.0)') return `background-color: rgb(${Object.values(MATERIALYOU_PRIMARY_RGB).map(c => Math.round(c * 0.49)).join(', ')});`;
          if (hex === '252f3c') return `background-color: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, 0.49);`;
          return m;
        });

        style.innerHTML = style.innerHTML?.replace(borderColorRegex, (m, gr, Ar, Ag, Ab, Aa, r, g, b, hex) => {
          if ((r && g && b && isFacebookBlue(+r, +g, +b)) ||
          (hex && isFacebookBlue(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))))) return `border-color:${MATERIALYOU_PRIMARY};`;
          if (Ar && Ag && Ab && isFacebookBlue(+Ar, +Ag, +Ab)) return `border-color: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, ${+Aa});`;
          return m;
        });
      }
    });

    document.querySelectorAll('[style*="color"]')?.forEach(el => {
      const style = el.getAttribute('style')?.replace(colorRegex, (m, gr, Ar, Ag, Ab, Aa, r, g, b, hex) => {
        if ((r && g && b && isFacebookBlue(+r, +g, +b)) ||
        (hex && isFacebookBlue(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)))) || hex === 'e8eaee') return `color:${MATERIALYOU_PRIMARY};`;
        if (Ar && Ag && Ab && isFacebookBlue(+Ar, +Ag, +Ab)) return `color: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, ${+Aa});`;
        if (gr === 'rgb(17, 17, 18)') return `color:#111112; caret-color:${MATERIALYOU_PRIMARY};`; // hacky communication between amoled_black.js and this file
        return m;
      });
      if (style !== el.getAttribute('style')) el.setAttribute('style', style);
    });

    document.querySelectorAll('[style*="background-color"]')?.forEach(el => {
      const style = el.getAttribute('style')?.replace(backgroundColorRegex, (m, gr, Ar, Ag, Ab, Aa, r, g, b, hex) => {
        if ((r && g && b && isFacebookBlue(+r, +g, +b)) ||
        (hex && isFacebookBlue(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))))) return `background-color:${MATERIALYOU_PRIMARY};`;
        if (Ar && Ag && Ab && isFacebookBlue(+Ar, +Ag, +Ab)) return `background-color: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, ${+Aa});`;
        if (gr === 'rgb(102, 106, 114)') return `background-color: ${MATERIALYOU_PRIMARY};`;
        if (hex === '252f3c') return `background-color: transparent;`;
        return m;
      });
      if (style !== el.getAttribute('style')) el.setAttribute('style', style);
    });

    document.querySelectorAll('[style*="background"]')?.forEach(el => {
      const style = el.getAttribute('style')?.replace(backgroundRegex, (m, gr, Ar, Ag, Ab, Aa, r, g, b, hex) => {
        if ((r && g && b && isFacebookBlue(+r, +g, +b)) ||
        (hex && isFacebookBlue(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))))) return `background:${MATERIALYOU_PRIMARY};`;
        if (Ar && Ag && Ab && isFacebookBlue(+Ar, +Ag, +Ab)) return `background: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, ${+Aa});`;
        return m;
      });
      if (style !== el.getAttribute('style')) el.setAttribute('style', style);
    });

    document.querySelectorAll('[style*="border:"]')?.forEach(el => {
      const style = el.getAttribute('style')?.replace(borderRegex, (m, px, gr, Ar, Ag, Ab, Aa, r, g, b, hex) => {
        if ((r && g && b && isFacebookBlue(+r, +g, +b)) ||
        (hex && isFacebookBlue(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))))) return `border: ${px} solid ${MATERIALYOU_PRIMARY};`;
        if (Ar && Ag && Ab && isFacebookBlue(+Ar, +Ag, +Ab)) return `border: ${px} solid rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, ${+Aa});`;
        if (gr === 'rgb(102, 106, 114)') return `border: ${px} solid ${MATERIALYOU_PRIMARY};`;
        return m;
      });
      if (style !== el.getAttribute('style')) el.setAttribute('style', style);
    });

    document.querySelectorAll('[style*="--nbc"]')?.forEach(el => {
      if (isFacebookBlue(...[1, 3, 5].map(i => parseInt(el.style.getPropertyValue('--nbc').slice(i, i + 2), 16)))) el.style.setProperty('--nbc', MATERIALYOU_PRIMARY);
    });

    // Recolor story ring on the profile page + feed FB logo in light mode
    document.querySelectorAll('img[src*="vTzapVsBgS_.webp"], img[src*="NtDLSQuICbO.webp"]')?.forEach(img => {
      if (processedStyles.has(img)) return;
      processedStyles.add(img);
      img.style.cssText += `
        background-color: ${MATERIALYOU_PRIMARY};
        mask: url(${img.src}) no-repeat center / contain;
        content-visibility: hidden;
      `;
    });

    // Swap FB logo on the login screen
    document.querySelectorAll('img[src*="DUiOg0mJTjz.webp"]')?.forEach(img => {
      size = img.style.maxHeight;
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="${parseInt(size) * 1.5}px" height="${parseInt(size) * 1.5}px">
                    <circle cx="54" cy="54" r="54" fill="${MATERIALYOU_PRIMARY}" />
                    <path d="M38.3351 43.8375V72.288H27.9532V36.284H37.7029L38.3351 43.8375ZM37.0041 53.0215L34.3753 53.0881C34.3753 50.5592 34.6748 48.241 35.2738 46.1335C35.8949 44.0039 36.7934 42.1516 37.9691 40.5766C39.1448 39.0015 40.5978 37.7814 42.3282 36.9163C44.0807 36.0511 46.0994 35.6185 48.3843 35.6185C49.9815 35.6185 51.4345 35.8625 52.7434 36.3506C54.0522 36.8164 55.1725 37.5596 56.1042 38.58C57.0581 39.5783 57.7901 40.8871 58.3004 42.5065C58.8106 44.1037 59.0657 46.0226 59.0657 48.2632V72.288H48.6838V49.5276C48.6838 47.9304 48.4841 46.7214 48.0848 45.9006C47.7077 45.0576 47.1531 44.4809 46.421 44.1703C45.689 43.8597 44.8127 43.7044 43.7923 43.7044C42.6831 43.7044 41.6959 43.9485 40.8308 44.4365C39.9878 44.9024 39.2779 45.5568 38.7011 46.3997C38.1244 47.2427 37.6918 48.2299 37.4034 49.3613C37.1372 50.4926 37.0041 51.7127 37.0041 53.0215ZM58.0009 52.4891L54.7066 52.7553C54.7066 50.3151 54.995 48.0524 55.5718 45.9672C56.1485 43.8819 57.0137 42.0739 58.1673 40.5433C59.3208 38.9904 60.7516 37.7814 62.4598 36.9163C64.1901 36.0511 66.1977 35.6185 68.4826 35.6185C70.1686 35.6185 71.6992 35.8625 73.0746 36.3506C74.4722 36.8386 75.6701 37.6261 76.6684 38.7131C77.6888 39.8001 78.4763 41.231 79.0309 43.0057C79.5855 44.7582 79.8628 46.91 79.8628 49.4611V72.288H69.4143V49.4611C69.4143 47.886 69.2147 46.6881 68.8154 45.8673C68.4383 45.0465 67.8837 44.4809 67.1516 44.1703C66.4417 43.8597 65.5877 43.7044 64.5894 43.7044C63.4802 43.7044 62.5152 43.9374 61.6944 44.4032C60.8737 44.8469 60.186 45.468 59.6314 46.2666C59.0768 47.0431 58.6664 47.9637 58.4002 49.0285C58.134 50.0933 58.0009 51.2469 58.0009 52.4891Z"
                          fill="${MATERIALYOU_ONPRIMARY}" />
                   </svg>`;
      img.outerHTML = svg;
    });
  }

  processMaterialYouStyles();

  function materialYouCSS() {
    const style = document.createElement('style');
    style.textContent = `
      ::selection {
        background: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, 0.5);
        color: ${MATERIALYOU_ONPRIMARY};
      }

      .wbloks_11 { --wbloks-fig-blue-tint-10: ${MATERIALYOU_ONPRIMARY} !important; }
      .wbloks_70, ._al7j a, ._aqwl { color: ${MATERIALYOU_PRIMARY}; }
      ._al7j ._al65, ._9nqa:checked + ._9nqb, .pull-to-refresh-spinner, .loading-bar-animation { background-color: ${MATERIALYOU_PRIMARY}; }
      .revamped-progress-bar-color .loading-bar-animation { background: ${MATERIALYOU_PRIMARY}; }
      .pull-to-refresh-spinner-icon { color: ${MATERIALYOU_ONPRIMARY}; }

      :root, .__fb-light-mode:root, .__fb-light-mode {
        --primary-button-background: ${MATERIALYOU_PRIMARY};
        --blue-link: ${MATERIALYOU_PRIMARY};
        --focus-ring-blue: ${MATERIALYOU_PRIMARY};
        --accent: ${MATERIALYOU_PRIMARY};
        --primary-deemphasized-button-text: ${MATERIALYOU_PRIMARY};
        --highlight-bg: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, 0.2);
        --primary-deemphasized-button-background: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, 0.2);
        --primary-deemphasized-button-pressed-overlay: rgba(${MATERIALYOU_PRIMARY_RGB.r}, ${MATERIALYOU_PRIMARY_RGB.g}, ${MATERIALYOU_PRIMARY_RGB.b}, 0.15);
      }
    `;
    document.head.appendChild(style);
  }

  materialYouCSS();

  new MutationObserver(() => {
    processMaterialYouStyles();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
  });
})();