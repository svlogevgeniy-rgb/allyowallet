# Allyo Wallet MVP Execution Plan

## Mission Focus
- Deliver backend platform + ESIA stub + blockchain contracts + Android client (no web UI).
- Ensure binding between verified ЕСИА identity and smart-account wallets across Ethereum, BNB Chain, Solana, Bitcoin.
- Provide managed recovery, antifraud policies, immutable audit logging, and legal-grade tracing.

## Phases
1. **Foundations**
   - Confirm architecture boundaries and interfaces (docs, diagrams, threat model outline).
   - Align monorepo tooling: pnpm workspaces for Node stack, Gradle for Android.
2. **Core Services**
   - Scaffold NestJS API with modular domains (auth, users, wallets, policies, tx, recovery, audit, blockchain connectors).
   - Define Prisma schema, migrations, seeds; integrate Zod DTO validation and Swagger.
   - Implement hash-chain + JWS utilities; stub blockchain connectors (EVM, Solana, Bitcoin).
3. **Identity & Auth**
   - Implement ЕСИА OIDC stub (PKCE) issuing JWT/id_token claims.
   - Integrate Auth flow in API (authorization code exchange, JWT access/refresh issuance, session persistence).
4. **Security Policies & Workflow**
   - Policy engine enforcing timelock, limits, allowlist, pause/cold mode, guardian recovery.
   - Transactions lifecycle: intent creation, antifraud screening, unsigned payload creation, signature submission, broadcast.
   - Audit trail hashing + signing; antifraud alerting hooks.
5. **Android Client**
   - Compose-based UI with Hilt DI, modular layers (core-crypto, keystore, data, domain, ui).
   - AppAuth OIDC login via Custom Tab + deeplink.
   - Retrofit service stack with interceptors, TLS pinning placeholder, offline storage for tokens (EncryptedSharedPreferences).
   - Wallet screens (portfolio, wallet detail, transfer flow, recovery, audit).
   - Integrate Trust Wallet Core bindings for key management & signing.
6. **Blockchain Contracts & Sims**
   - Solidity smart-account (Hardhat) implementing policies and recovery.
   - Anchor Solana program skeleton with multisig/timelock.
   - Bitcoin PSBT multisig builder templates.
7. **Infrastructure & QA**
   - Docker Compose for api + db + esia-stub + blockchain test services.
   - Makefile helpers, .env examples, Prisma seeds.
   - Tests: Jest + supertest, Hardhat unit tests, Vitest for utilities, Android unit/instrumented placeholders.
   - Threat model document, OpenAPI spec finalization.

## Deliverables
- `docs/ARCHITECTURE.md`, `docs/THREAT_MODEL.md`, `docs/OPENAPI.yaml`.
- NestJS API with modules, Prisma schema, migrations, tests.
- ЕСИА stub OIDC server.
- Types/crypto/connectors shared packages.
- Solidity + Anchor contract scaffolds.
- Android Gradle project meeting specified modules and features.
- Infra (docker-compose, Makefile, env samples).
- Seed/test data + automation scripts.
