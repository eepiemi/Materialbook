package com.eepiemi.materialbook

import com.eepiemi.materialbook.utils.fbRedirectSanitizer
import org.junit.Assert.assertEquals
import org.junit.Test

class ShareLinkTest {
    @Test fun preservesEscapedValuesAndFragments() {
        val url = "https://www.facebook.com/story.php?story_fbid=a%2Fb%3D&id=42#replies"
        assertEquals(url, fbRedirectSanitizer(url))
    }
    @Test fun removesTrackingWithoutChangingSignedValues() {
        assertEquals("https://example.com/p?token=a%2Bb%25&flag#part", fbRedirectSanitizer("https://example.com/p?token=a%2Bb%25&fbclid=tracking&flag#part"))
    }
    @Test fun unwrapsMobileRedirectExactlyOnce() {
        assertEquals("https://www.facebook.com/reel/123/?id=a%2Fb", fbRedirectSanitizer("https://lm.facebook.com/l.php?u=https%3A%2F%2Fwww.facebook.com%2Freel%2F123%2F%3Fid%3Da%252Fb&h=1"))
    }
    @Test fun leavesMalformedAndNonWebLinksAlone() {
        listOf("https://example.com/?x=%%%", "mailto:test@example.com", "not a URL").forEach {
            assertEquals(it, fbRedirectSanitizer(it))
        }
    }
    @Test fun preservesLiteralPlusAndPort() {
        assertEquals("https://example.com:8443/?v=a+b", fbRedirectSanitizer("https://example.com:8443/?v=a+b"))
    }
    @Test fun isIdempotent() {
        val url = "https://www.facebook.com/reel/123/?x=%252F&fbclid=test"
        val cleaned = fbRedirectSanitizer(url)
        assertEquals(cleaned, fbRedirectSanitizer(cleaned))
    }
}
