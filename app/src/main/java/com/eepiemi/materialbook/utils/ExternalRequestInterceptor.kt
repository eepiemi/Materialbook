package com.eepiemi.materialbook.utils

import com.multiplatform.webview.request.RequestInterceptor
import com.multiplatform.webview.request.WebRequest
import com.multiplatform.webview.request.WebRequestInterceptResult
import com.multiplatform.webview.web.WebViewNavigator

class ExternalRequestInterceptor(
    private val handleExternalUrl: (String) -> Unit
) : RequestInterceptor {

    override fun onInterceptUrlRequest(
        request: WebRequest,
        navigator: WebViewNavigator
    ): WebRequestInterceptResult {

        if (!request.isForMainFrame) return WebRequestInterceptResult.Allow
        val uri = runCatching { java.net.URI(request.url) }.getOrNull()
        val host = uri?.host?.lowercase().orEmpty()
        val internal = uri?.scheme in listOf("https", "http") &&
            (host == "facebook.com" || host.endsWith(".facebook.com") ||
             host == "messenger.com" || host.endsWith(".messenger.com")) &&
            host !in setOf("l.facebook.com", "lm.facebook.com")
        return if (internal) {
            WebRequestInterceptResult.Allow
        } else {
            handleExternalUrl(fbRedirectSanitizer(request.url))
            WebRequestInterceptResult.Reject
        }
    }
}