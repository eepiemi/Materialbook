package com.eepiemi.materialbook

import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Guards the Astryxbook rebrand (app_name, theme style) from silently reverting
 * to "Materialbook" on a future upstream merge that touches strings.xml/themes.xml.
 */
@RunWith(AndroidJUnit4::class)
class AppIdentityTest {

    @Test
    fun appNameIsAstryxbook() {
        val context = ApplicationProvider.getApplicationContext<android.content.Context>()
        assertEquals("Astryxbook", context.getString(R.string.app_name))
    }
}
