package com.eepiemi.materialbook

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.eepiemi.materialbook.ui.viewmodel.SettingsViewModel
import org.junit.Assert.assertFalse
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

/**
 * Astryxbook ships with Facebook's original look out of the box: Material You theming
 * and AMOLED Black must be opt-in, not opt-out (see SettingsViewModel / SettingsDataStore).
 *
 * This guards that default from silently reverting — e.g. a future upstream merge from
 * Materialbook re-introducing `?: true` on one of these two flags without the other.
 */
@RunWith(AndroidJUnit4::class)
class SettingsDefaultsTest {

    @Before
    fun clearStoredPrefs() {
        // Simulate a fresh install: wipe any DataStore file left by a previous test run
        // or manual dogfooding on this device, so we're actually asserting the
        // "no stored value yet" default rather than whatever was last saved.
        val context = ApplicationProvider.getApplicationContext<Context>()
        File(context.filesDir, "datastore").deleteRecursively()
    }

    @Test
    fun materialYouIsOffByDefault() {
        val app = ApplicationProvider.getApplicationContext<Application>()
        val viewModel = SettingsViewModel(app)
        assertFalse(
            "materialYou should default to false so new installs show Facebook's own look",
            viewModel.materialYou.value
        )
    }

    @Test
    fun amoledBlackIsOffByDefault() {
        val app = ApplicationProvider.getApplicationContext<Application>()
        val viewModel = SettingsViewModel(app)
        assertFalse(
            "amoledBlack should default to false so new installs show Facebook's own look",
            viewModel.amoledBlack.value
        )
    }

    @Test
    fun pipEnabledIsOffByDefault() {
        // Entering a floating window unexpectedly (e.g. the first time a new
        // user backgrounds the app while a video happens to be playing) is
        // surprising behavior; must be opt-in, same reasoning as the two above.
        val app = ApplicationProvider.getApplicationContext<Application>()
        val viewModel = SettingsViewModel(app)
        assertFalse(
            "pipEnabled should default to false",
            viewModel.pipEnabled.value
        )
    }
}
