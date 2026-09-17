(function () {
  if (window.__astryxPipObserverInstalled) return;
  window.__astryxPipObserverInstalled = true;

  function isAnyVideoPlaying() {
    var videos = document.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      var v = videos[i];
      if (!v.paused && !v.ended && v.readyState > 2) {
        return true;
      }
    }
    return false;
  }

  // Polling rather than per-video event listeners: Facebook's feed constantly
  // adds new <video> elements as the user scrolls (infinite scroll, reels),
  // so a one-time querySelectorAll + listener attachment would miss anything
  // loaded after the initial scan. A 1s poll is simple, catches everything,
  // and only fires the bridge on actual state changes (not every tick).
  var lastState = null;
  setInterval(function () {
    var playing = isAnyVideoPlaying();
    if (playing !== lastState) {
      lastState = playing;
      if (window.PipBridge && window.PipBridge.setVideoPlaying) {
        window.PipBridge.setVideoPlaying(playing);
      }
    }
  }, 1000);
})();
