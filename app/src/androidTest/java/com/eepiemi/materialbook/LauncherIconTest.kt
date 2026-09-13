package com.eepiemi.materialbook

import android.content.Context
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
 * Note: this can only exercise whichever ic_launcher variant the test
 * device's own API level resolves to. It can't force-load the
 * mipmap-anydpi (pre-API26) fallback specifically on a 26+ test device —
 * see the mipmap-anydpi/ic_launcher.xml comment for that gap.
 */
@RunWith(AndroidJUnit4::class)
class LauncherIconTest {

    private val context: Context
        get() = ApplicationProvider.getApplicationContext()

    @Test
    fun backgroundColorIsFacebookBlue() {
        assertEquals(
            0xFF1877F2.toInt(),
            ContextCompat.getColor(context, R.color.ic_launcher_background)
        )
    }

    @Test
    fun foregroundColorIsWhite() {
        assertEquals(
            0xFFFFFFFF.toInt(),
            ContextCompat.getColor(context, R.color.ic_launcher_foreground)
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
