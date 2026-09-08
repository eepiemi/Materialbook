package com.eepiemi.materialbook.utils

import androidx.annotation.RawRes

data class Script(val isEnabled: Boolean, @param:RawRes val resourceId: Int, val scriptTitle: String)

suspend fun fetchScripts(scripts: List<Script>, fallbackContent: (Int) -> String): String =
    scripts.filter { it.isEnabled }.joinToString("\n;\n") { fallbackContent(it.resourceId) }
