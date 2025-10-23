package com.allyowallet.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.painter.Painter

@Composable
fun LandingScreen(
    onCreateNewWallet: () -> Unit,
    onImportExistingWallet: () -> Unit,
    onCreateViaEsia: () -> Unit,
    logoPainter: Painter,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color(0xFF0B1220), Color(0xFF020617))
                )
            )
            .padding(horizontal = 24.dp, vertical = 32.dp)
    ) {
        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            AllyoLogo(painter = logoPainter)

            Text(
                text = "Allyo Wallet",
                style = MaterialTheme.typography.displaySmall.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Программный криптокошелёк с юридической связкой личности и смарт-политиками безопасности.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )

            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                WalletActionButton(
                    label = "Создать новый кошелёк",
                    onClick = onCreateNewWallet
                )
                WalletActionButton(
                    label = "Добавить существующий",
                    onClick = onImportExistingWallet
                )
                WalletActionButton(
                    label = "Создать кошелёк с помощью авторизации Госуслуг",
                    onClick = onCreateViaEsia
                )
            }
        }
    }
}

@Composable
private fun AllyoLogo(painter: Painter, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.size(112.dp),
        shape = CircleShape,
        tonalElevation = 6.dp,
        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.22f)
    ) {
        Box(contentAlignment = Alignment.Center) {
            Image(
                painter = painter,
                contentDescription = "Allyo Wallet icon",
                modifier = Modifier.padding(12.dp)
            )
        }
    }
}

@Composable
private fun WalletActionButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp)
    ) {
        Icon(imageVector = Icons.Filled.Folder, contentDescription = null)
        Spacer(modifier = Modifier.width(12.dp))
        Text(text = label, style = MaterialTheme.typography.titleMedium)
    }
}
