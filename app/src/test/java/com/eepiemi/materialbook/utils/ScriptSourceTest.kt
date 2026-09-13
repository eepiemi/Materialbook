package com.eepiemi.materialbook.utils

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Scripts (adblock.js, material_you.js, etc.) are fetched live from this URL at
 * runtime, with the bundled res/raw copy only as a fallback on fetch failure.
 * Must point at OUR fork's repo, not eepiemi's upstream — otherwise every
 * install silently runs whatever JS eepiemi's live main branch happens to have,
 * bypassing our own script changes entirely.
 */
class ScriptSourceTest {

    @Test
    fun scriptSrcPointsAtOwnFork() {
        assertTrue(SCRIPT_SRC.contains("ofirc73/Materialbook"))
    }

    @Test
    fun scriptSrcDoesNotPointUpstream() {
        assertFalse(SCRIPT_SRC.contains("eepiemi"))
    }
}
