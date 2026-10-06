package com.eepiemi.materialbook.utils

import com.multiplatform.webview.request.RequestInterceptor
import com.multiplatform.webview.request.WebRequest
import com.multiplatform.webview.request.WebRequestInterceptResult
import com.multiplatform.webview.web.WebViewNavigator

class ExternalRequestInterceptor(
    private val handleExternalUrl: (String) -> Unit,
    private val tryOpenMessagesDesktop: (String) -> Boolean = { false },
    private val isMessagesDesktopActive: () -> Boolean = { false },
) : RequestInterceptor {

    override fun onInterceptUrlRequest(
        request: WebRequest,
        navigator: WebViewNavigator
    ): WebRequestInterceptResult {

        // Messages/Messenger entry points are shown in desktop mode inside the app when
        // enabled; the caller switches the user agent and loads the desktop page.
        if (request.isForMainFrame && isMessagesLink(request.url)) {
            if (isMessagesDesktopActive()) {
                // Already on the desktop Messages page: let it navigate. Anything else that
                // points at Messages (m.me, messenger.com, deep links) is re-mapped below.
                if (!request.url.startsWith("http", ignoreCase = true)) return WebRequestInterceptResult.Reject
                if (isDesktopMessagesUrl(request.url)) return WebRequestInterceptResult.Allow
            }
            if (tryOpenMessagesDesktop(request.url)) return WebRequestInterceptResult.Reject
        }

        val internalUrlRegex = Regex(
            """https?://(?!(?:l|lm)\.)[^/]*(?:facebook|messenger)\.com/.*"""
        )
        return if (internalUrlRegex.containsMatchIn(request.url) && request.isForMainFrame) {
            WebRequestInterceptResult.Allow
        } else {
            handleExternalUrl(fbRedirectSanitizer(request.url))
            WebRequestInterceptResult.Reject
        }
    }
}