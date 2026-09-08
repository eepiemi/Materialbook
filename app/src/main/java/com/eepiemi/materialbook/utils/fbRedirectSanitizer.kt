package com.eepiemi.materialbook.utils

import java.net.URI
import java.net.URLDecoder

/** Preserve raw query values: encoding an already escaped URL corrupts shared links. */
fun fbRedirectSanitizer(link: String): String {
    var current = link
    repeat(4) {
        val uri = runCatching { URI(current) }.getOrNull() ?: return current
        if (uri.scheme !in listOf("https", "http") || uri.host == null) return current
        if (uri.host.lowercase() in setOf("l.facebook.com", "lm.facebook.com") && uri.path == "/l.php") {
            val target = uri.rawQuery?.split("&")?.firstOrNull { it.substringBefore("=") == "u" }
                ?.substringAfter("=", "")
            val decoded = target?.let { runCatching { URLDecoder.decode(it, "UTF-8") }.getOrNull() }
            val destination = decoded?.let { runCatching { URI(it) }.getOrNull() }
            if (destination?.scheme in listOf("http", "https") && destination?.host != null) {
                current = decoded!!
                return@repeat
            }
        }
        val query = uri.rawQuery?.split("&")?.filterNot {
            it.substringBefore("=") == "fbclid"
        }?.joinToString("&")
        return buildString {
            append(uri.scheme).append("://").append(uri.rawAuthority)
            append(uri.rawPath.orEmpty())
            if (!query.isNullOrEmpty()) append('?').append(query)
            uri.rawFragment?.let { append('#').append(it) }
        }
    }
    return current
}
