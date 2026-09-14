package com.eepiemi.materialbook

import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.ext.junit.runners.AndroidJUnit4

import org.junit.Test
import org.junit.runner.RunWith

import org.junit.Assert.*

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class ExampleInstrumentedTest {
    @Test
    fun useAppContext() {
        // Context of the app under test.
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        // Compare against BuildConfig rather than a hardcoded string, so this doesn't
        // silently go stale the next time applicationId changes (e.g. rebrand, release vs. debug).
        assertEquals(BuildConfig.APPLICATION_ID, appContext.packageName)
    }
}