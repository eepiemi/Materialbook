package com.eepiemi.materialbook

import android.content.Context
import android.content.res.Configuration
import android.graphics.drawable.AdaptiveIconDrawable
import android.graphics.drawable.Drawable
import android.os.Build
import androidx.core.content.ContextCompat
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Launcher icon was hand-redrawn as raw vector pathData (Astryx "A" monogram
 * on Facebook blue). A malformed path string still "compiles" — it just
 * renders blank/broken at runtime — so these load each resource for real
 * rather than just checking the XML is well-formed.
 *
 * ic_launcher_background/foreground colors are defined in FOUR qualified
 * files (values, values-night, values-v31, values-night-v31) that must all
 * agree. A previous bug: the two -v31 variants pulled Android's dynamic
 * system_accent1_* colors unconditionally, so the icon itself silently
 * reverted to Material You on any API31+ device — caught only because the
 * CI emulator happened to boot in dark mode that day. Forcing both night
 * states explicitly here so it can't depend on ambient device state again.
 *
 * Still can't force the API-level qualifier itself (unlike night mode,
 * that's tied to the real running OS version, not spoofable via
 * Configuration) — so on a 31+ test device this exercises values-v31 and
 * values-night-v31 but never plain values/values-night, and vice versa on
 * a pre-31 device. Can't force-load the mipmap-anydpi (pre-API26) adaptive
 * icon fallback either, for the same reason — see mipmap-anydpi/ic_launcher.xml.
 */
@RunWith(AndroidJUnit4::class)
class LauncherIconTest {

    private val context: Context
        get() = ApplicationProvider.getApplicationContext()

    private fun contextFor(nightMode: Int): Context {
        val baseContext = ApplicationProvider.getApplicationContext<Context>()
        val config = Configuration(baseContext.resources.configuration)
        config.uiMode = (config.uiMode and Configuration.UI_MODE_NIGHT_MASK.inv()) or nightMode
        return baseContext.createConfigurationContext(config)
    }

    @Test
    fun backgroundColorIsFacebookBlueInLightMode() {
        assertEquals(
            0xFF1877F2.toInt(),
            ContextCompat.getColor(contextFor(Configuration.UI_MODE_NIGHT_NO), R.color.ic_launcher_background)
        )
    }

    @Test
    fun backgroundColorIsFacebookBlueInDarkMode() {
        assertEquals(
            0xFF1877F2.toInt(),
            ContextCompat.getColor(contextFor(Configuration.UI_MODE_NIGHT_YES), R.color.ic_launcher_background)
        )
    }

    @Test
    fun foregroundColorIsWhiteInLightMode() {
        assertEquals(
            0xFFFFFFFF.toInt(),
            ContextCompat.getColor(contextFor(Configuration.UI_MODE_NIGHT_NO), R.color.ic_launcher_foreground)
        )
    }

    @Test
    fun foregroundColorIsWhiteInDarkMode() {
        assertEquals(
            0xFFFFFFFF.toInt(),
            ContextCompat.getColor(contextFor(Configuration.UI_MODE_NIGHT_YES), R.color.ic_launcher_foreground)
        )
    }

    @Test
    fun backgroundVectorLoadsWithoutError() {
        assertLoadsNonEmpty(R.drawable.ic_launcher_background)
    }

    @Test
    fun foregroundVectorLoadsWithoutError() {
        assertLoadsNonEmpty(R.drawable.ic_launcher_foreground)
    }

    @Test
    fun monochromeVectorLoadsWithoutError() {
        assertLoadsNonEmpty(R.drawable.ic_launcher_monochrome)
    }

    @Test
    fun adaptiveIconResolvesOnApi26Plus() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val drawable = ContextCompat.getDrawable(context, R.mipmap.ic_launcher)
        assertNotNull("adaptive icon failed to resolve on API 26+", drawable)
        assertTrue(drawable is AdaptiveIconDrawable)
    }

    private fun assertLoadsNonEmpty(resId: Int) {
        val drawable: Drawable? = ContextCompat.getDrawable(context, resId)
        assertNotNull("resource $resId failed to parse/render", drawable)
        assertTrue(drawable!!.intrinsicWidth > 0 && drawable.intrinsicHeight > 0)
    }
}
