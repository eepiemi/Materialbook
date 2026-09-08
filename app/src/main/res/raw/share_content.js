/* Give Facebook's Web Share calls an Android chooser when WebView lacks one. */
(() => {
  if (window.__breeBookShare) return;
  window.__breeBookShare = true;
  const share = async data => {
    if (navigator.userActivation && !navigator.userActivation.isActive) {
      throw new DOMException('A user gesture is required', 'NotAllowedError');
    }
    if (data?.files?.length) throw new DOMException('File sharing is not supported', 'NotSupportedError');
    const url = new URL(data?.url || location.href, location.href);
    if (!['https:', 'http:'].includes(url.protocol)) throw new TypeError('Unsupported URL');
    location.href = 'breebook-share://link?url=' + encodeURIComponent(url.href);
  };
  if (!navigator.share) {
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    Object.defineProperty(navigator, 'canShare', {
      value: data => {
        try { return !data?.files?.length && ['https:', 'http:'].includes(new URL(data?.url || location.href, location.href).protocol); }
        catch (_) { return false; }
      }, configurable: true
    });
  }
})();
