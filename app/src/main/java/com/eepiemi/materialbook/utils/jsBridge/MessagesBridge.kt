package com.eepiemi.materialbook.utils.jsBridge

import android.webkit.JavascriptInterface

/**
 * Called by messages_tab.js when the desktop site navigates inside the page (pushState /
 * popstate) to somewhere outside Messages: WebView never reports those as page loads.
 */
class MessagesBridge(private val onLeftMessages: () -> Unit) {
    @JavascriptInterface
    fun onLeftMessages() = onLeftMessages.invoke()
}
