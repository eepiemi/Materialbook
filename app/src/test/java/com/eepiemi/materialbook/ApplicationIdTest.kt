package com.eepiemi.materialbook

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * ExampleInstrumentedTest checks internal consistency (runtime package name
 * matches BuildConfig.APPLICATION_ID) but doesn't pin the actual value — this
 * catches an accidental applicationId change nothing else would.
 *
 * Debug builds add an applicationIdSuffix of ".test" (see app/build.gradle.kts),
 * so that's stripped before comparing against the base id.
 */
class ApplicationIdTest {

    @Test
    fun applicationIdIsAstryxBook() {
        assertEquals("com.astryx.book", BuildConfig.APPLICATION_ID.removeSuffix(".test"))
    }
}
