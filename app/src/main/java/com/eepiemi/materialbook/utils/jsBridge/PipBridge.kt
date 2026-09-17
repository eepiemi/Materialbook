package com.eepiemi.materialbook.utils.jsBridge

import android.webkit.JavascriptInterface

/**
 * Reports whether any <video> element on the page is currently playing, so
 * MainActivity can decide whether to enter Picture-in-Picture when the user
 * leaves the app. See Activity-PiP-for-video-currently-playing.md for the
 * design this implements.
 */
class PipBridge(private val onVideoPlayingChanged: (Boolean) -> Unit) {
    @JavascriptInterface
    fun setVideoPlaying(isPlaying: Boolean) {
        onVideoPlayingChanged(isPlaying)
    }
}
