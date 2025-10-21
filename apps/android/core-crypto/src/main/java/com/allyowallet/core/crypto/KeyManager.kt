package com.allyowallet.core.crypto

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Thin wrapper around Trust Wallet Core functionality.
 * Actual key generation/signing will be implemented in later iteration.
 */
class KeyManager {
    suspend fun generateSeed(): ByteArray = withContext(Dispatchers.Default) {
        ByteArray(32) { 0 }
    }
}
