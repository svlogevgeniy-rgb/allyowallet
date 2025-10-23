# Allyo Wallet Monorepo

Staff-level MVP implementation of the Allyo Wallet platform. The project collects the backend API, smart-contracts, identity stub, Android client, and infrastructure tooling in a single polyglot workspace.

## Getting Started
1. Install Node.js 20 and pnpm (`npm install -g pnpm`).
2. Install Android Studio (Arctic Fox+) with Kotlin/Compose toolchain.
3. Copy `.env.example` files (to be added per service) and configure secrets.
4. Run `pnpm install`.
5. Build Android client via Gradle (`./gradlew assembleDebug`).
6. To install on an emulator/device run `./gradlew installDebug` (requires a running device via `adb devices`).

### Android Preview

The Android app now ships with a branded launcher icon (`ic_allyo_logo`) and a landing screen that offers quick actions:

- "Создать новый кошелёк"
- "Добавить существующий"
- "Создать кошелёк с помощью авторизации Госуслуг"

The interface lives in `apps/android/ui/src/main/java/com/allyowallet/ui/LandingScreen.kt` and uses the new vector drawable located at `apps/android/app/src/main/res/drawable/ic_allyo_logo.xml`.

## Repository Structure
- `docs/` — plan, architecture, threat model, API spec.
- `apps/api/` — NestJS backend API with Prisma, policy engine, antifraud, OpenAPI.
- `apps/esia-stub/` — OIDC/OAuth2 ЕСИА emulator.
- `apps/android/` — Kotlin/Compose client with Hilt, Retrofit, Trust Wallet Core.
- `packages/types/` — shared DTOs, enums, schema definitions.
- `packages/crypto/` — hash-chain + JWS utilities for audit attestation.
- `packages/connectors/` — blockchain connectors (EVM, Solana, Bitcoin).
- `contracts/` — smart contracts (Hardhat Solidity, Anchor Solana).
- `infra/` — Docker Compose, env samples, database migrations/seeds (pending).
- `scripts/` — helper scripts (pending).
- `docs/USE_CONTEXT7.md` — how to enable Upstash Context7 MCP server for live documentation.

Refer to `docs/ARCHITECTURE.md` for detailed architecture and roadmap.
