package com.eepiemi.materialbook.ui.screens

import android.content.Intent
import android.view.View
import android.webkit.CookieManager
import android.widget.Toast
import androidx.activity.compose.BackHandler
import androidx.activity.compose.LocalActivity
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBars
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalResources
import androidx.core.graphics.ColorUtils
import androidx.core.net.toUri
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.multiplatform.webview.web.LoadingState
import com.multiplatform.webview.web.WebView
import com.multiplatform.webview.web.rememberSaveableWebViewState
import com.multiplatform.webview.web.rememberWebViewNavigator
import com.eepiemi.materialbook.R
import com.eepiemi.materialbook.ui.components.NetworkErrorDialog
import com.eepiemi.materialbook.ui.components.settings.SettingsDialog
import com.eepiemi.materialbook.ui.viewmodel.MainViewModel
import com.eepiemi.materialbook.ui.viewmodel.SettingsViewModel
import com.eepiemi.materialbook.utils.DESKTOP_USER_AGENT
import com.eepiemi.materialbook.utils.ExternalRequestInterceptor
import com.eepiemi.materialbook.utils.fileChooserWebViewParams
import com.eepiemi.materialbook.utils.isLeavingMessages
import com.eepiemi.materialbook.utils.jsBridge.ClipboardBridge
import com.eepiemi.materialbook.utils.jsBridge.DownloadBridge
import com.eepiemi.materialbook.utils.jsBridge.MaterialbookSettings
import com.eepiemi.materialbook.utils.jsBridge.ThemeChange
import com.eepiemi.materialbook.utils.jsBridge.MaterialYouBridge
import com.eepiemi.materialbook.utils.jsBridge.MessagesBridge
import com.eepiemi.materialbook.utils.isDesktopMessagesUrl
import com.eepiemi.materialbook.utils.messagesDesktopUrl
import com.eepiemi.materialbook.utils.rememberAutoDesktop
import com.eepiemi.materialbook.utils.rememberImeHeight
import kotlinx.coroutines.delay

@Composable
fun MaterialbookWebView(
    url: String,
    settingsVM: SettingsViewModel = viewModel()
) {
    val context = LocalContext.current
    val activity = LocalActivity.current
    val resources = LocalResources.current

    val state = rememberSaveableWebViewState(url)
    // Desktop-mode override that applies only while the Messages section is open.
    val messagesDesktopSetting by settingsVM.messagesDesktop.collectAsState()
    val currentMessagesDesktopSetting by rememberUpdatedState(messagesDesktopSetting)
    // Survives Activity recreation so the user agent matches the restored page.
    var messagesDesktop by rememberSaveable { mutableStateOf(false) }
    // Page to open for a fresh Messages request (null once handled; not saved, so a restored
    // page is never reloaded just because the Activity was recreated).
    var messagesTarget by remember { mutableStateOf<String?>(null) }
    // Bumped from the JS bridge when the desktop site navigates out of Messages in-page.
    var leftMessagesSignal by remember { mutableIntStateOf(0) }
    val navigator = rememberWebViewNavigator(
        requestInterceptor = ExternalRequestInterceptor(
            tryOpenMessagesDesktop = { messagesUrl ->
                if (currentMessagesDesktopSetting) {
                    messagesDesktop = true
                    messagesTarget = messagesDesktopUrl(messagesUrl)
                    true
                } else {
                    false
                }
            },
            isMessagesDesktopActive = { messagesDesktop },
            handleExternalUrl = { externalUrl ->
            val intent = Intent(Intent.ACTION_VIEW, externalUrl.toUri())
            runCatching {
                context.startActivity(intent)
            }.onFailure {
                Toast.makeText(
                    context,
                    resources.getString(R.string.not_supported),
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
        )
    )

    LaunchedEffect(navigator) {
        val bundle = state.viewState
        if (bundle == null) {
            navigator.loadUrl(url)
        }
    }

    // allow exiting while scrolling to top.
    var exitScroll by remember { mutableStateOf(false) }
    BackHandler {
        if (exitScroll) {
            activity?.finish()
        } else {
            navigator.evaluateJavaScript("backHandlerNB();") {
                val backHandled = it.removeSurrounding("\"")
                when (backHandled) {
                    "false" -> {
                        if (navigator.canGoBack) {
                            // Going back out of Messages: restore the normal user agent first, so the page behind
                            // it is fetched as the mobile site instead of being served as desktop and reloaded.
                            if (messagesDesktop) {
                                val history = state.nativeWebView.copyBackForwardList()
                                val previous = history.getItemAtIndex(history.currentIndex - 1)?.url
                                if (previous == null || !isDesktopMessagesUrl(previous)) {
                                    messagesDesktop = false
                                    state.nativeWebView.settings.userAgentString =
                                        if (settingsVM.desktopLayout.value) DESKTOP_USER_AGENT else ""
                                }
                            }
                            navigator.navigateBack()
                        } else {
                            activity?.finish()
                        }
                    }
                    "exit" -> activity?.finish()
                    "scrolling" -> exitScroll = true
                }
            }
        }
    }

    LaunchedEffect(exitScroll) {
        if (exitScroll) {
            delay(800)
            exitScroll = false
        }
    }

    val isDesktop by settingsVM.desktopLayout.collectAsState()
    val isAutoRevert by settingsVM.isRevertDesktop.collectAsState()
    val isAutoDesktop = rememberAutoDesktop()

    LaunchedEffect(Unit) {
        if (isAutoDesktop && !isDesktop) {
            settingsVM.setRevertDesktop(true)
            settingsVM.setDesktopLayout(true)
        }
        else if (!isAutoDesktop && isAutoRevert) {
            settingsVM.setRevertDesktop(false)
            settingsVM.setDesktopLayout(false)
        }
    }

    var isLoading by rememberSaveable { mutableStateOf(true) }
    val isError = state.errorsForCurrentRequest.lastOrNull()?.isFromMainFrame == true

    val viewModel: MainViewModel = viewModel {
        MainViewModel(
            resources = resources,
            settings = settingsVM
        )
    }

    val themeColor by viewModel.themeColor
    // Manual handling to fix visual & padding bug on settings dialog.
    var isImmersiveMode by rememberSaveable { mutableStateOf(settingsVM.immersiveMode.value) }

    fun setWindow(immersive: Boolean) {
        val window = activity?.window ?: return
        val windowInsetsController = WindowInsetsControllerCompat(window, window.decorView)

        if (immersive) {
            windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())
            windowInsetsController.systemBarsBehavior =
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        } else {
            val isLight = ColorUtils.calculateLuminance(themeColor.toArgb()) > 0.5
            windowInsetsController.show(WindowInsetsCompat.Type.systemBars())
            windowInsetsController.isAppearanceLightStatusBars = isLight
            windowInsetsController.isAppearanceLightNavigationBars = isLight
        }
        isImmersiveMode = immersive
    }

    LaunchedEffect(isImmersiveMode, themeColor.value) {
        setWindow(isImmersiveMode)
    }

    val userScripts by viewModel.scripts
    val loadingState = state.loadingState

    LaunchedEffect(loadingState, userScripts) {
        if (loadingState is LoadingState.Finished) {
            userScripts?.let { scripts ->
                navigator.evaluateJavaScript(scripts) {
                    isLoading = false
                }
            }
        }
    }

    if (isError && isLoading) {
        NetworkErrorDialog { activity?.finish() }
        return
    }

    val colorScheme = MaterialTheme.colorScheme
    val originalColor = remember { mutableStateOf(themeColor) }

    var settingsToggle by rememberSaveable { mutableStateOf(false) }
    if (settingsToggle) {
        setWindow(false)
        SettingsDialog(
            onDismiss = {
                setWindow(settingsVM.immersiveMode.value)
                viewModel.setThemeColor(originalColor.value)
                settingsToggle = false
            },
            onReload = {
                isLoading = true
                viewModel.setThemeColor(Color.Transparent)
                setWindow(settingsVM.immersiveMode.value)
                viewModel.refresh(
                    resources = resources,
                    settings = settingsVM
                )
                navigator.reload()
            }
        )
    }

    LaunchedEffect(settingsToggle) {
        if (settingsToggle) {
            originalColor.value = themeColor
            viewModel.setThemeColor(colorScheme.background)
        }
    }

    if (isLoading) {
        SplashLoading(
            if (loadingState is LoadingState.Loading) {
                loadingState.progress
            } else {
                0.8F
            }
        )
    }


    // Messages requested: switch to the desktop UA first, then open that conversation/inbox.
    LaunchedEffect(messagesTarget) {
        val target = messagesTarget ?: return@LaunchedEffect
        messagesTarget = null
        state.nativeWebView.settings.userAgentString = DESKTOP_USER_AGENT
        navigator.loadUrl(target)
    }

    // Left the Messages section: back to the normal user agent. Reload only when the page in
    // front of us is still the desktop site (an in-page navigation of the desktop site, or a
    // page that had to be fetched again). The Back button restores the user agent before it
    // navigates (see the BackHandler), so it lands on the mobile site and needs no reload.
    // loadUrl is not used because the page is already on the destination URL and it would
    // push a duplicate history entry.
    val leaveMessages = {
        messagesDesktop = false
        state.nativeWebView.settings.userAgentString =
            if (isDesktop) DESKTOP_USER_AGENT else ""
        navigator.evaluateJavaScript("(!!document.querySelector('html[id=\"facebook\"]')).toString()") { isDesktopPage ->
            if (isDesktopPage.contains("true")) navigator.reload()
        }
    }
    // (a) real page loads, which compose-webview reports through lastLoadedUrl. Wait for the
    // load to finish so the check above looks at the new document, not the one being left.
    val lastLoadedUrl = state.lastLoadedUrl
    val pageFinished = state.loadingState is LoadingState.Finished
    LaunchedEffect(lastLoadedUrl, pageFinished) {
        val u = lastLoadedUrl ?: return@LaunchedEffect
        if (pageFinished && messagesDesktop && isLeavingMessages(u)) leaveMessages()
    }
    // (b) in-page navigations of the desktop single-page app, reported by messages_tab.js
    LaunchedEffect(leftMessagesSignal) {
        if (leftMessagesSignal > 0 && messagesDesktop) leaveMessages()
    }

    LaunchedEffect(isDesktop, messagesDesktop) {
        val userAgent = if (isDesktop || messagesDesktop) DESKTOP_USER_AGENT else ""
        state.nativeWebView.settings.userAgentString = userAgent
    }

    // needed to consume extra padding when keyboard is open
    val barsInsets = WindowInsets.systemBars.asPaddingValues()
    val imeHeight = rememberImeHeight()

    val primaryColor = colorScheme.primary.toArgb()
    val onPrimaryColor  = colorScheme.onPrimary.toArgb()

    WebView(
        modifier = Modifier
            .fillMaxSize()
            .background(themeColor)
            .then(
                if (isImmersiveMode) {
                    Modifier.padding(bottom = imeHeight)
                } else {
                    Modifier.padding(
                        top = barsInsets.calculateTopPadding(),
                        bottom = maxOf(barsInsets.calculateBottomPadding(), imeHeight)
                    )
                }
            ),
        state = state,
        navigator = navigator,
        platformWebViewParams = fileChooserWebViewParams(),
        captureBackPresses = false,
        onCreated = { webView ->

            val cookieManager = CookieManager.getInstance()
            cookieManager.setAcceptCookie(true)
            cookieManager.setAcceptThirdPartyCookies(webView, true)
            cookieManager.flush()

            state.webSettings.apply {
                isJavaScriptEnabled = true

                androidWebSettings.apply {
                    //isDebugInspectorInfoEnabled = true
                    domStorageEnabled = true
                    hideDefaultVideoPoster = true
                    mediaPlaybackRequiresUserGesture = false
                }
            }

            webView.apply {
                addJavascriptInterface(
                    MaterialbookSettings { settingsToggle = true },
                    "SettingsBridge"
                )
                addJavascriptInterface(
                    ThemeChange { if (!settingsToggle) viewModel.setThemeColor(Color(it)) },
                    "ThemeBridge"
                )
                addJavascriptInterface(
                    DownloadBridge(context),
                    "DownloadBridge"
                )
                addJavascriptInterface(
                    ClipboardBridge(context),
                    "ClipboardBridge"
                )
                addJavascriptInterface(
                    MessagesBridge { leftMessagesSignal++ },
                    "MessagesBridge"
                )
                addJavascriptInterface(
                    MaterialYouBridge(primaryColor, onPrimaryColor),
                    "MaterialYouBridge"
                )

                setLayerType(View.LAYER_TYPE_HARDWARE, null)

                overScrollMode = View.OVER_SCROLL_NEVER
                isVerticalScrollBarEnabled = false
                isHorizontalScrollBarEnabled = false

                settings.setSupportZoom(true)
                settings.builtInZoomControls = true
                settings.displayZoomControls = false
            }
        }
    )
}