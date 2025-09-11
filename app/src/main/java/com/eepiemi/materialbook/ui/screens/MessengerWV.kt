package com.eepiemi.materialbook.ui.screens

import androidx.compose.runtime.Composable
import com.eepiemi.materialbook.ui.MaterialbookViewModel

const val DESKTOP_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"

@Composable
fun MessengerWebView(onNavigateFB: () -> Unit, viewModel: MaterialbookViewModel) {
    BaseWebView(
        url = "https://www.facebook.com/messages",
        userAgent = DESKTOP_USER_AGENT,
        onInterceptAction = onNavigateFB,
        viewModel = viewModel
    )
}