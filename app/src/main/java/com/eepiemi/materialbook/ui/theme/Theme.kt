package com.eepiemi.materialbook.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

// Facebook's own brand blue — used as the native chrome color when
// Material You dynamic theming is off (the "original" Facebook look).
// internal (not private): ThemeTest asserts against this directly.
internal val FacebookBlue = Color(0xFF1877F2)

internal val DarkColorScheme = darkColorScheme(
    primary = FacebookBlue,
    onBackground = Color.White,
    secondary = Color.DarkGray
)
internal val LightColorScheme = lightColorScheme(
    primary = FacebookBlue,
    onBackground = Color.Black,
    secondary = Color.LightGray
)

@Composable
fun MaterialbookTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}