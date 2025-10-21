# Allyo Wallet MVP Architecture

## Overview
Allyo Wallet is a security-focused, non-custodial wallet platform that enforces a legal-grade linkage between verified ЕСИА identities and blockchain smart accounts. The MVP serves Android clients exclusively, providing secure account management, antifraud controls, social recovery, and immutable audit trails while integrating with Ethereum (EVM), BNB Smart Chain (EVM), Solana, and Bitcoin networks.

## System Context
- **Android App (apps/android)**: Kotlin/Compose client handling identity login (OIDC via ЕСИА stub), portfolio & wallet management, transaction initiation, recovery flows, antifraud actions, and audit log visualization. Manages local keys (Trust Wallet Core + Android Keystore) and uses Retrofit for API calls.
- **API (apps/api)**: NestJS service providing REST/Swagger endpoints. Responsibilities include identity verification, wallet lifecycle, policies enforcement, antifraud checks, transaction orchestration, recovery workflows, audit logging, event notifications, and integration with blockchain connectors.
- **ESIA Stub (apps/esia-stub)**: Mock OIDC provider implementing authorization code + PKCE flow, exposing discovery, authorize, token, userinfo endpoints. Issues signed id_tokens with identity claims.
- **Connectors (packages/connectors)**: Abstraction layer for EVM, Solana, Bitcoin interactions (balance checks, transaction builders, broadcast, validation).
- **Crypto Utilities (packages/crypto)**: Implements hash-chain logging, service JWS signing, identity attestation verification, shared primitives.
- **Types & SDK (packages/types)**: Shared TypeScript DTOs, schema definitions (Zod), OpenAPI-derived client for reuse across backend services.
- **Smart Contracts (contracts/...)**:
  - `contracts/evm`: Hardhat project with AllyoSmartAccount (policies, m-of-n, recovery, timelock).
  - `contracts/solana`: Anchor program controlling multisig/timelock operations.
  - `contracts/bitcoin`: PSBT templates + Miniscript policies (2-of-3 multisig).
- **Infrastructure (infra/...)**: Docker Compose orchestrating Postgres, API, ESIA stub, blockchain testnets (anvil, solana-localnet, bitcoind). Makefile & scripts for migrations and seeds.

## Data & Domain Model
Core entities persisted in PostgreSQL via Prisma:
- `User`: ЕСИА identity (sub, fullName, snils, tin, assurance level).
- `Attestation`: Chain-bound attested addresses with JWS proof.
- `Wallet`: Per-chain smart accounts linked to policies, includes primary address, smart contract reference, and creation metadata.
- `Policy`: Security ruleset (daily limits, timelock, allowlist, m-of-n guardians, freeze/cold-mode states).
- `Tx`: Transaction lifecycle records capturing intents, statuses, unsigned payloads, blockchain references, and policy snapshots.
- `Recovery`: Social recovery workflow states, guardian approvals, target keys.
- `AuditLog`: Append-only ledger (hash-chain), metadata (ip, ua), payloads, optional service signatures.

## Security Controls
- **Identity Binding**: ЕСИА stub supply id_token (JWS) verifying user attributes; backend persists attestation linking identity to wallet addresses.
- **Authentication**: OIDC login via AppAuth + PKCE; API issues access & refresh JWTs. Android stores refresh tokens in EncryptedSharedPreferences; access tokens kept in-memory.
- **Authorization**: NestJS guards enforce roles, wallet ownership. Policy engine ensures every transaction passes timelock, limit, allowlist, m-of-n checks before broadcast.
- **Key Management**: Private keys generated on device, sealed in Android Keystore; Trust Wallet Core handles EVM/Solana/Bitcoin signing. Server never stores user private keys.
- **Audit**: Each action recorded with hash(prev_hash || entry) using SHA3-256; periodic JWS signatures by service Ed25519 key. Packages/crypto handles hash chain operations and signature verification.
- **Antifraud**: Rules evaluate transaction context (new recipients, large transfers, policy overrides) leading to `QUEUED`, `freeze`, or `coldMode` states; alerts generated for Android display.
- **Hardening**: Helmet, CORS, rate limiting, structured logging, input validation (Zod), TLS (mTLS ready), IP allowlist for admin endpoints, placeholder for 2FA of operators.

## Backend Modular Structure
- `AuthModule`: OIDC callback, token exchange, JWT issuance, refresh, logout.
- `UsersModule`: Profile retrieval, identity updates, attestation refresh.
- `WalletsModule`: Create/list wallets per chain, integrate with smart-account deployers.
- `PoliciesModule`: Retrieve/modify policy settings, toggle freeze/cold mode.
- `TransactionsModule`: Intent creation, antifraud pipeline, signature submission, broadcasting.
- `RecoveryModule`: Social recovery flows, guardian approvals, key rotation.
- `AuditModule`: Append entries, expose owner and admin views.
- `BlockchainModule`: Aggregates connectors, handles chain RPC config and caching.

## Android Architecture
- **Modules**:
  - `core-crypto`: Kotlin wrappers around Trust Wallet Core (key generation, signing).
  - `core-keystore`: Abstractions for Android Keystore + encrypted storage + biometric gating.
  - `data`: Retrofit services, DTO mapping, Room/DataStore for caching policies & history.
  - `domain`: Use cases coordinating data, policies, and crypto operations.
  - `ui`: Compose screens, navigation graph, state holders (ViewModels with Hilt).
- **Key Flows**:
  - Onboarding: AppAuth Custom Tab → callback scheme `allyo://auth` → token exchange.
  - Portfolio Dashboard: Aggregated balances (via API) with per-chain status.
  - Wallet Management: Policy editing forms, freeze/cold toggles with confirmation prompts.
  - Transfer Flow: Request unsigned payload → sign via Trust Wallet Core → submit signatures.
  - Recovery & Audit: Stepper UI for guardian approvals, timeline of key events.
  - WalletConnect: Baseline session management and approval screen (signing reused).

## Inter-Service Interactions
1. Android obtains identity via AppAuth → receives authorization code → exchanges with ESIA stub → obtains tokens from API.
2. Creating wallet triggers backend: instantiate policy defaults, deploy smart account via connectors (EVM/Anchor) or derive Bitcoin multisig script.
3. Transaction intent: Android sends request; API runs antifraud/policy engine, returns unsigned data (TypedData, Solana instruction set, PSBT). Client signs and uploads signatures; API broadcasts and logs audit entry.
4. Recovery: client initiates; API notifies guardians (stub), awaits signatures, finalizes by updating smart contract / multisig addresses, logs updates.

## Deployment & DevOps
- Local development via Docker Compose; API accessible at `http://localhost:3000`.
- Prisma migrations executed through `pnpm -F @allyo/api prisma migrate dev`.
- Seeds create demo users, wallets, guardians for Android QA flows.
- CI pipeline (future) runs lint, tests (Jest, Hardhat, Vitest), Android unit tests, builds Compose UI.

## Future Enhancements
- Real ЕСИА integration, hardware-backed attestation keys, push notifications, dedicated antifraud ML scoring, distributed event bus, multi-region deployments.
