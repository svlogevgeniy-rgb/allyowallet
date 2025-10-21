package com.allyowallet.domain

import javax.inject.Inject

class WalletInteractor @Inject constructor() {
    suspend fun loadSummary(): String = "Stub summary"
}
