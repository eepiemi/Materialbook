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
                    <path d="m56.557,33.933c-0.246,0.057 -0.763,0.170 -1.153,0.249 -0.960,0.193 -3.772,1.296 -3.965,1.553 -0.034,0.045 -0.208,0.159 -0.386,0.249 -1.107,0.567 -3.179,2.385 -4.112,3.613 -0.423,0.559 -0.794,0.994 -0.820,0.968 -0.113,-0.113 -0.378,-3.163 -0.427,-4.868l-0.011,-0.480l-6.845,0.000 -6.845,0.000l0.000,2.472 0.000,2.472l0.952,0.170c1.175,0.208 2.169,0.779 2.676,1.527 0.200,0.299 0.476,0.998 0.612,1.565 0.238,0.975 0.246,1.500 0.212,11.550 -0.026,8.009 -0.076,10.613 -0.197,10.881 -0.087,0.197 -0.181,0.488 -0.212,0.646 -0.091,0.495 -0.850,1.493 -1.402,1.844 -0.578,0.367 -1.844,0.801 -2.332,0.801L32.001,69.150l0.000,2.498 0.000,2.498l9.339,0.000 9.339,0.000l-0.034,-2.517 -0.034,-2.517 -0.771,-0.219c-1.277,-0.359 -1.504,-0.522 -2.502,-1.761 -0.072,-0.091 -0.215,-0.484 -0.317,-0.881 -0.159,-0.605 -0.181,-2.317 -0.151,-10.927l0.034,-10.212 0.703,-0.669c3.386,-3.216 8.886,-3.825 11.512,-1.270 0.488,0.472 1.175,1.640 1.380,2.332 0.045,0.151 0.117,5.348 0.166,11.543 0.049,6.221 0.140,11.554 0.208,11.909 0.068,0.351 0.215,0.858 0.329,1.119 0.113,0.265 0.181,0.480 0.151,0.480 -0.121,0.000 0.903,1.500 1.338,1.958 0.544,0.571 1.368,1.085 2.245,1.402 0.567,0.204 1.175,0.227 5.851,0.227L75.999,74.147l0.000,-2.498 0.000,-2.498l-0.552,0.000c-0.915,0.000 -2.117,-0.484 -2.801,-1.126 -0.635,-0.597 -0.881,-0.983 -1.225,-1.946 -0.181,-0.506 -0.215,-1.950 -0.283,-12.163 -0.068,-10.522 -0.098,-11.671 -0.302,-12.484 -0.125,-0.491 -0.310,-1.058 -0.408,-1.259 -0.102,-0.200 -0.181,-0.435 -0.181,-0.525 0.000,-0.091 -0.121,-0.317 -0.265,-0.503 -0.147,-0.185 -0.234,-0.336 -0.197,-0.336 0.038,0.000 -0.057,-0.189 -0.215,-0.420 -1.493,-2.196 -3.557,-3.572 -6.425,-4.275 -0.881,-0.215 -5.858,-0.351 -6.588,-0.178z"
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