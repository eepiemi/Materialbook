package com.eepiemi.materialbook

import com.eepiemi.materialbook.utils.isDesktopMessagesUrl
import com.eepiemi.materialbook.utils.isLeavingMessages
import com.eepiemi.materialbook.utils.isMessagesLink
import com.eepiemi.materialbook.utils.messagesDesktopUrl
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class MessagesDesktopTest {
    @Test
    fun messagesLinks() {
        assertTrue(isMessagesLink("https://m.facebook.com/messages/"))
        assertTrue(isMessagesLink("https://www.facebook.com/messages/t/123"))
        assertTrue(isMessagesLink("https://m.me/someone"))
        assertTrue(isMessagesLink("https://www.messenger.com/"))
        assertTrue(isMessagesLink("fb-messenger://threads"))
        assertTrue(isMessagesLink("intent://x#Intent;scheme=fb-messenger;package=com.facebook.orca;end"))
        assertFalse(isMessagesLink("https://m.facebook.com/home.php"))
        assertFalse(isMessagesLink("https://l.facebook.com/messages"))
        assertFalse(isMessagesLink("https://example.com/messages"))
    }

    @Test
    fun leavingMessages() {
        assertTrue(isLeavingMessages("https://www.facebook.com/"))
        assertTrue(isLeavingMessages("https://m.facebook.com/profile.php?id=1"))
        assertFalse(isLeavingMessages("https://www.facebook.com/messages/t/1"))
        assertFalse(isLeavingMessages("https://www.facebook.com/login/"))
        assertFalse(isLeavingMessages("https://example.com/"))
    }

    @Test
    fun deepLinksKeepTheirConversation() {
        val inbox = "https://www.facebook.com/messages/"
        assertEquals("https://www.facebook.com/messages/t/12345", messagesDesktopUrl("https://www.facebook.com/messages/t/12345"))
        assertEquals("https://www.facebook.com/messages/t/12345", messagesDesktopUrl("https://m.facebook.com/messages/t/12345/?ref=notif"))
        assertEquals("https://www.facebook.com/messages/e2ee/t/777", messagesDesktopUrl("https://www.facebook.com/messages/e2ee/t/777/"))
        assertEquals("https://www.facebook.com/messages/t/someone", messagesDesktopUrl("https://m.me/someone"))
        assertEquals("https://www.facebook.com/messages/t/987", messagesDesktopUrl("https://www.messenger.com/t/987/"))
        assertEquals("https://www.facebook.com/messages/t/42", messagesDesktopUrl("fb-messenger://user/42"))
        assertEquals(inbox, messagesDesktopUrl("https://m.me/j/abcdef"))
        assertEquals(inbox, messagesDesktopUrl("https://m.me/"))
        assertEquals(inbox, messagesDesktopUrl("https://m.facebook.com/messages/"))
        assertEquals(inbox, messagesDesktopUrl("fb-messenger://threads"))
        assertEquals(inbox, messagesDesktopUrl("intent://x#Intent;package=com.facebook.orca;end"))
    }

    @Test
    fun desktopMessagesPage() {
        assertTrue(isDesktopMessagesUrl("https://www.facebook.com/messages/t/1"))
        assertFalse(isDesktopMessagesUrl("https://m.facebook.com/messages/t/1"))
        assertFalse(isDesktopMessagesUrl("https://www.facebook.com/home.php"))
    }
}
