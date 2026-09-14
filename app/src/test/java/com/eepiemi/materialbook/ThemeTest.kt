package com.eepiemi.materialbook

import androidx.compose.ui.graphics.Color
import com.eepiemi.materialbook.ui.theme.DarkColorScheme
import com.eepiemi.materialbook.ui.theme.FacebookBlue
import com.eepiemi.materialbook.ui.theme.LightColorScheme
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Native chrome (splash, settings sheet, dialogs) must default to Facebook's own
 * blue, not Material You's dynamic/purple defaults — that's the whole point of
 * this fork. Guards against the fallback color schemes drifting off-brand.
 */
class ThemeTest {

    @Test
    fun facebookBlueMatchesBrandColor() {
        assertEquals(Color(0xFF1877F2), FacebookBlue)
    }

    @Test
    fun lightSchemePrimaryIsFacebookBlue() {
        assertEquals(FacebookBlue, LightColorScheme.primary)
    }

    @Test
    fun darkSchemePrimaryIsFacebookBlue() {
        assertEquals(FacebookBlue, DarkColorScheme.primary)
    }
}
