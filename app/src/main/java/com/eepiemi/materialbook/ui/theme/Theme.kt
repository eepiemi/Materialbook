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

private val DarkColorScheme = darkColorScheme(
    onBackground = Color.White,
    secondary = Color.DarkGray
)
private val LightColorScheme = lightColorScheme(
    onBackground = Color.Black,
    secondary = Color.LightGray
)

@Composable
fun MaterialbookTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    accent: Int = 0,
    content: @Composable () -> Unit
) {
    val primary = listOf(Color(0xFF1565C0), Color(0xFF006C4C), Color(0xFF7451A8), Color(0xFFA23863), Color(0xFF805600))[accent.coerceIn(0, 4)]
    val darkPrimary = listOf(Color(0xFFA6C8FF), Color(0xFF79DBAE), Color(0xFFD5BAFF), Color(0xFFFFB0CD), Color(0xFFF6BF68))[accent.coerceIn(0, 4)]
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme.copy(primary = darkPrimary, onPrimary = Color.Black)
        else -> LightColorScheme.copy(primary = primary, onPrimary = Color.White)
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}