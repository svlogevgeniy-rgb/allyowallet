package com.allyowallet.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import com.allyowallet.ui.LandingScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AllyoAppRoot()
        }
    }
}

@Composable
fun AllyoAppRoot() {
    MaterialTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            LandingScreen(
                onCreateNewWallet = { /* TODO */ },
                onImportExistingWallet = { /* TODO */ },
                onCreateViaEsia = { /* TODO */ },
                logoPainter = painterResource(id = R.drawable.ic_allyo_logo)
            )
        }
    }
}
