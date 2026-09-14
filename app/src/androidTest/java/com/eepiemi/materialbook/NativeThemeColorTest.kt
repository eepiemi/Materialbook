package com.eepiemi.materialbook

import android.content.Context
import android.util.TypedValue
import android.view.ContextThemeWrapper
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

/**
 * The -v31/-night-v31 themes.xml variants used to pull Android's dynamic
 * system_accent1_* color into colorControlActivated unconditionally — outside
 * the Material You settings toggle. Fixed to a hardcoded Facebook blue.
 *
 * This resolves the *actually applied* Theme.Astryxbook attribute (not the
 * Kotlin-side fallback ThemeTest checks), so it catches a regression on
 * whatever API level / day-night mode the test device is running.
 */
@RunWith(AndroidJUnit4::class)
class NativeThemeColorTest {

    @Test
    fun colorControlActivatedIsFacebookBlue() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val themedContext = ContextThemeWrapper(context, R.style.Theme_Astryxbook)

        val typedValue = TypedValue()
        val resolved = themedContext.theme.resolveAttribute(
            android.R.attr.colorControlActivated,
            typedValue,
            true
        )

        assertTrue("Theme.Astryxbook must define colorControlActivated", resolved)
        assertEquals(0xFF1877F2.toInt(), typedValue.data)
    }
}
