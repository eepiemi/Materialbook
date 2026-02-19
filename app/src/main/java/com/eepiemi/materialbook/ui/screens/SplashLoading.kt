package com.eepiemi.materialbook.ui.screens

import androidx.compose.animation.animateColor
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import com.eepiemi.materialbook.R

@Composable
fun SplashLoading(progress: Float) {
    Column (
        modifier = Modifier
            .background(Color.Black)
            .fillMaxSize()
            .zIndex(2F),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Box(
            modifier = Modifier
                .size(80.dp)
                .background(colorResource(id = R.color.ic_launcher_background), shape = RoundedCornerShape(32.dp)),
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(R.drawable.ic_launcher_foreground),
                contentDescription = null,
                modifier = Modifier.size(80.dp),
            )
        }

        Spacer(Modifier.height(16.dp))

        Row (horizontalArrangement = Arrangement.SpaceBetween) {
            val animate = rememberInfiniteTransition()
            val progressColor by animate.animateColor(
                initialValue = Color.DarkGray,
                targetValue = Color.White,
                animationSpec = infiniteRepeatable(
                    animation = tween(800),
                    repeatMode = RepeatMode.Reverse
                )
            )
            repeat(5) {
                Text(
                    text = "•",
                    fontSize = 40.sp,
                    color = if (progress >= it*0.20) progressColor else Color.DarkGray
                )
            }
        }
    }
}