package com.eepiemi.materialbook

import com.eepiemi.materialbook.utils.isLeavingMessages
import com.eepiemi.materialbook.utils.isMessagesLink
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
}
