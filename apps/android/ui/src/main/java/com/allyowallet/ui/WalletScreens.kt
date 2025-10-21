package com.allyowallet.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun PortfolioScreen(onTransferClick: () -> Unit, onRecoveryClick: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Card(colors = CardDefaults.cardColors()) {
            Text(
                text = "Баланс: TBD",
                style = MaterialTheme.typography.titleLarge
            )
        }
        Button(onClick = onTransferClick) {
            Text("Новый перевод")
        }
        Button(onClick = onRecoveryClick) {
            Text("Восстановление доступа")
        }
    }
}
