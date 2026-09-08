package com.eepiemi.materialbook

import android.os.Bundle
import androidx.compose.runtime.collectAsState
import androidx.lifecycle.viewmodel.compose.viewModel
import com.eepiemi.materialbook.ui.viewmodel.SettingsViewModel
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.view.WindowCompat
import com.eepiemi.materialbook.ui.screens.MaterialbookWebView
import com.eepiemi.materialbook.ui.theme.MaterialbookTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            val intentUrl = intent?.data?.toString()
            val settings: SettingsViewModel = viewModel()
            MaterialbookTheme(
                dynamicColor = !settings.manualColors.collectAsState().value,
                accent = settings.accent.collectAsState().value
            ) {
                MaterialbookWebView(
                    url = intentUrl
                        ?: "https://facebook.com/"
                )
            }
        }
    }
}