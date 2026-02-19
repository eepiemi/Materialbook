package com.eepiemi.materialbook

import android.os.Bundle
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
            MaterialbookTheme {
                MaterialbookWebView(
                    url = intentUrl
                        ?: "https://facebook.com/"
                )
            }
        }
    }
}