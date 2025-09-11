package com.eepiemi.materialbook.utils.jsBridge

import android.webkit.JavascriptInterface
import androidx.compose.runtime.MutableState

class MaterialbookSettings (
    private val settingsToggle: MutableState<Boolean>,
) {
    @JavascriptInterface
    fun onSettingsToggle() {
        settingsToggle.value = true
    }
}