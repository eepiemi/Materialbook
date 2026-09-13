package com.eepiemi.materialbook

import android.content.Context
import android.content.res.Configuration
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import java.util.Locale

/**
 * app_name is hand-edited across 8 locale strings.xml files on every rebrand.
 * Sweeps all of them so a missed locale fails loudly here instead of shipping
 * half-branded ("Materialbook") in one language.
 */
@RunWith(AndroidJUnit4::class)
class LocaleAppNameTest {

    private val translatedLocales = listOf(
        Locale("ar"),
        Locale("bn"),
        Locale("de"),
        Locale("es"),
        Locale("fr"),
        Locale("pt"),
        Locale("zh", "TW"),
    )

    private fun contextFor(locale: Locale): Context {
        val baseContext = ApplicationProvider.getApplicationContext<Context>()
        val config = Configuration(baseContext.resources.configuration)
        config.setLocale(locale)
        return baseContext.createConfigurationContext(config)
    }

    @Test
    fun appNameIsAstryxbookInEveryTranslatedLocale() {
        translatedLocales.forEach { locale ->
            assertEquals(
                "app_name wrong for locale '$locale'",
                "Astryxbook",
                contextFor(locale).getString(R.string.app_name)
            )
        }
    }

    @Test
    fun appNameIsAstryxbookInDefaultFallback() {
        // A locale we have no translation for falls back to the default values/strings.xml.
        assertEquals("Astryxbook", contextFor(Locale("it")).getString(R.string.app_name))
    }
}
