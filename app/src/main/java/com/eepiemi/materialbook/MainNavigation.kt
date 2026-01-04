package com.eepiemi.materialbook

import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.toArgb
import androidx.core.graphics.ColorUtils
import androidx.lifecycle.viewmodel.compose.viewModel
import com.eepiemi.materialbook.ui.screens.MaterialbookWebView
import com.eepiemi.materialbook.ui.theme.MaterialbookTheme

@Composable
fun MainNavigation(data: Uri?) {

    val viewModel: MaterialbookViewModel = viewModel()
    val themeColor = viewModel.themeColor.collectAsState().value
    val isDarkTheme = remember(themeColor) {
        ColorUtils.calculateLuminance(
            themeColor.toArgb()
        ) < 0.5
    }

    MaterialbookTheme(darkTheme = isDarkTheme) {
        MaterialbookWebView(
            data?.toString() ?: "https://facebook.com/",
            viewModel = viewModel
        )
    }
}