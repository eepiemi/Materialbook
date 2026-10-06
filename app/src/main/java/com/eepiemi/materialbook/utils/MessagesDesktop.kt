package com.eepiemi.materialbook.utils

import java.net.URI

const val MESSAGES_DESKTOP_URL = "https://www.facebook.com/messages/"

private fun hostAndPath(url: String): Pair<String, String>? {
    val uri = runCatching { URI(url) }.getOrNull() ?: return null
    val scheme = uri.scheme?.lowercase()
    if (scheme != "http" && scheme != "https") return null
    return (uri.host ?: return null).lowercase() to (uri.path ?: "")
}

private fun isFacebookHost(host: String) =
    (host == "facebook.com" || host.endsWith(".facebook.com")) &&
        !host.startsWith("l.") && !host.startsWith("lm.")

/**
 * Every way Facebook Lite tries to open Messages/Messenger: the facebook.com/messages
 * page, m.me and messenger.com links, and the fb-messenger:// and intent:// deep links
 * that start the Messenger app (none of which render usefully in the mobile web view).
 */
fun isMessagesLink(url: String): Boolean {
    val scheme = url.substringBefore(':', "").lowercase()
    if (scheme == "fb-messenger" || scheme == "fb-messenger-share") return true
    if (scheme == "intent") return Regex("package=[^;]*(orca|messenger|mlite)").containsMatchIn(url)
    val (host, path) = hostAndPath(url) ?: return false
    if (host == "m.me" || host.endsWith(".m.me")) return true
    if (host == "messenger.com" || host.endsWith(".messenger.com")) return true
    return isFacebookHost(host) && path.startsWith("/messages")
}

/**
 * True for a regular Facebook page outside the Messages section, where the
 * desktop-mode override ends. Login/checkpoint pages are excluded because the
 * desktop Messages page may bounce through them.
 */
fun isLeavingMessages(url: String): Boolean {
    val (host, path) = hostAndPath(url) ?: return false
    if (!isFacebookHost(host)) return false
    return listOf("/messages", "/messenger", "/login", "/checkpoint").none { path.startsWith(it) }
}

/** The desktop Messages page (the one loaded with the desktop user agent). */
fun isDesktopMessagesUrl(url: String): Boolean {
    val uri = runCatching { java.net.URI(url) }.getOrNull() ?: return false
    return uri.host?.lowercase() == "www.facebook.com" && (uri.path ?: "").startsWith("/messages")
}

private val THREAD_PATH = Regex("^/messages/(?:e2ee/)?t/[^/]+")

/**
 * Desktop equivalent of any Messages/Messenger link, so deep links keep their conversation:
 * `facebook.com/messages/t/<id>`, `m.me/<name>`, `messenger.com/t/<id>` and
 * `fb-messenger://user/<id>` open that thread; anything else opens the inbox.
 */
fun messagesDesktopUrl(url: String): String {
    val inbox = MESSAGES_DESKTOP_URL
    val uri = runCatching { java.net.URI(url) }.getOrNull() ?: return inbox
    val scheme = uri.scheme?.lowercase()
    val host = uri.host?.lowercase() ?: ""
    val path = uri.path ?: ""
    fun thread(id: String) = if (id.isBlank()) inbox else "https://www.facebook.com/messages/t/$id"
    return when {
        scheme == "fb-messenger" && (host == "user" || host == "threads") ->
            thread(path.trim('/').substringBefore('/'))
        scheme != "http" && scheme != "https" -> inbox
        host == "m.me" || host.endsWith(".m.me") -> {
            val first = path.trim('/').substringBefore('/')
            // m.me/j/<code> is a group invite: no desktop equivalent
            if (first == "j") inbox else thread(first)
        }
        host == "messenger.com" || host.endsWith(".messenger.com") ->
            if (path.startsWith("/t/")) thread(path.removePrefix("/t/").substringBefore('/')) else inbox
        else -> THREAD_PATH.find(path)?.let { "https://www.facebook.com" + it.value } ?: inbox
    }
}
