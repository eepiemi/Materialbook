package com.eepiemi.materialbook.utils.jsBridge

import android.webkit.JavascriptInterface

class MaterialYouBridge(
    private val primary: Int,
    private val onPrimary: Int
) {

    @JavascriptInterface
    @Suppress("unused")
    fun getMaterialYouPrimaryRgb(): String {
        return colorToRgb(primary)
    }

    @JavascriptInterface
    @Suppress("unused")
    fun getMaterialYouOnPrimaryRgb(): String {
        return colorToRgb(onPrimary)
    }

    @JavascriptInterface
    @Suppress("unused")
    fun getMaterialYouPrimaryRgbString(): String {
        return colorToRgbString(primary)
    }
    @JavascriptInterface
    @Suppress("unused")
    fun getMaterialYouOnPrimaryRgbString(): String {
        return colorToRgbString(onPrimary)
    }

    private fun colorToRgb(color: Int): String {
        val r = (color shr 16) and 0xFF
        val g = (color shr 8) and 0xFF
        val b = color and 0xFF
        return """{"r":$r,"g":$g,"b":$b}"""
    }

    private fun colorToRgbString(color: Int): String {
        val r = (color shr 16) and 0xFF
        val g = (color shr 8) and 0xFF
        val b = color and 0xFF
        return "rgb($r, $g, $b)"
    }
}