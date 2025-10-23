# Allyo Wallet — Технико-функциональное описание состояния проекта (MVP)

## 1. Контекст и цели MVP
Проект «Allyo Wallet» — небиржевой кошелёк с юридически значимой связкой «человек ↔ адрес», обязательной верификацией личности через stub ЕСИА и «защищёнными счетами» (смарт-аккаунтами). Продукт должен обеспечить:
- поддержку сетей Ethereum, BNB Smart Chain, Solana, Bitcoin;
- управление политиками безопасности (таймлок, лимиты, m-of-n, allowlist, пауза, эскроу);
- управляемое восстановление (social recovery);
- антифрод-режимы (freeze, cold mode, alerts);
- неизменяемые аудит-логи (hash-chain + подпись сервиса);
- единственный клиент — Android-приложение, backend на NestJS, mock ЕСИА-провайдер.

## 2. Что реализовано на текущий момент
### 2.1 Документация
- `docs/PLAN.md` — пошаговый план реализации MVP, актуализированный под Android + backend.
- `docs/ARCHITECTURE.md` — высокий уровень архитектуры (контекст, сервисы, доменная модель, безопасность).
- `docs/THREAT_MODEL.md` — первичное описание угроз и мер защиты.
- `docs/USE_CONTEXT7.md` — инструкция по использованию Upstash Context7 MCP-сервера для актуальной документации.
- `docs/adr/0001-record-architecture-decisions.md` — процесс ведения ADR.

### 2.2 Структура монорепозитория и инфраструктура разработки
- Корневой `pnpm` workspace с общими конфигами (`package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `turbo.json`, ESLint/Prettier).
- Папка `apps/`:
  - `apps/api` — NestJS-сервис со скелетом модулей (auth, users, wallets, policies, transactions, recovery, audit, blockchain, attestations), настроенной документацией Swagger и базовыми middleware (Helmet, CORS, rate limit, Pino).
  - `apps/esia-stub` — Fastify OIDC mock с health-check’ом, заготовлен для PKCE/JWT.
  - `apps/android` — многомодульный Gradle-проект (app, core-crypto, core-keystore, data, domain, ui) с Compose, Hilt, Retrofit, Trust Wallet Core (заготовка), базовыми экранами и навигацией.
- Папка `packages/`:
  - `packages/types` — общие типы/утилиты (цепочка хэшей, политики).
  - `packages/crypto` — hash-chain, JWS-подписи, тесты Vitest.
  - `packages/connectors` — абстракции и первые реализации для Ethereum/Solana/Bitcoin (поддержка балансов, заготовка трансферов).
- Папка `contracts/`:
  - `contracts/evm` — Hardhat, контракт `AllyoSmartAccount.sol` (пока минимальный), первый тест.
  - `contracts/solana` — Anchor workspace с заготовкой программы и инструкцией `initialize`.
- Папки `infra/` и `scripts/` — заготовлены под дальнейшие файлы (`.gitkeep` + скрипт `context7.sh`).
- Репозиторий инициализирован, выполнены коммиты и push в GitHub.

### 2.3 Дополнительные инструменты
- Скрипт `scripts/context7.sh` для запуска Upstash Context7 MCP сервера (подмешивание актуальной документации).

## 3. Планируемые блоки работ (согласно ТЗ из PDF)
### 3.1 Backend (NestJS + PostgreSQL + Prisma)
- Реализация модулей:
  - **Auth**: OIDC flow со stub ЕСИА, выдача access/refresh JWT, обновление токенов.
  - **Users/Attestations**: хранение профиля ЕСИА, выпуск JWS-привязок адресов.
  - **Wallets**: создание кошельков, привязка политик, деплой/инициализация смарт-аккаунтов, генерация BTC multisig.
  - **Policies**: CRUD политик безопасности, freeze/cold mode, guardians.
  - **Transactions**: сценарии transfer → antifraud → подготовка unsigned payload (EVM typed data, Solana instructions, Bitcoin PSBT), приём подписей и broadcast.
  - **Recovery**: social recovery, подтверждения guardians, таймлоки.
  - **Audit**: запись событий в hash-chain, сервисная подпись, выборки для владельцев и операторов.
  - **Blockchain connectors**: плотная интеграция с ethers.js, solana/web3.js, bitcoinjs-lib, управление RPC/fee.
- Prisma schema + миграции для сущностей (User, Attestation, Wallet, Policy, Tx, Recovery, AuditLog и т.д.).
- Тесты (Jest + supertest), Swagger/OpenAPI автогенерация (`docs/OPENAPI.yaml`).

### 3.2 ESIA stub
- Полный OIDC сервер: `.well-known` discovery, `/authorize`, `/token` (PKCE), `/userinfo`, выдача тестовых id_token.
- Настройка тех. данных для подмены ЕСИА в разработке.

### 3.3 Android (Kotlin/Compose)
- Интеграция AppAuth PKCE, Deeplink `allyo://auth`, хранение токенов (EncryptedSharedPreferences).
- Trust Wallet Core: генерация/хранение ключей (Keystore), подпись транзакций EVM/Solana/Bitcoin.
- Экранные потоки:
  - Onboarding/Auth.
  - Портфель (балансы, сети).
  - Детали кошелька + редактирование политики (таймлок, лимиты, guardians, freeze/cold).
  - Transfer (подготовка, подпись, отправка подписи).
  - Очередь транзакций / история.
  - Recovery (инициация, подтверждения).
  - Audit (хронология событий).
- WalletConnect v2 — базовый каркас подключения к dApp.
- Биометрия для критичных действий.
- Тесты (unit/instrumented), ktlint/detekt.

### 3.4 Смарт-контракты и блокчейн утилиты
- EVM `AllyoSmartAccount`:
  - политики (лимиты, allowlist, timelock), pause/cold mode, recovery (m-of-n).
  - Тесты в Hardhat (лимиты, пауза, recovery).
- Solana Anchor программа:
  - аккаунт состояния m-of-n, timelock, инструкции `propose/approve/execute transfer`, `set_policy`, `pause`, `initiate/finalize recovery`.
- Bitcoin:
  - генерация 2-of-3 P2WSH, PSBT-процесс с антифрод логикой и таймлоками (по возможности CLTV).

### 3.5 Инфраструктура и тестовая среда
- `infra/docker/docker-compose.yml`: Postgres, NestJS API, ESIA stub, anvil/ganache, solana-localnet, bitcoind testnet.
- `.env.example` для сервисов, Prisma seed.
- Makefile/скрипты: `up`, `down`, `logs`, `db:migrate`, `seed`.
- Настройка CI (lint/test/build) — приоритет ниже, но учитывается.

## 4. Риски и открытые вопросы
- Требуется детализировать антифрод-политику (алгоритмы, пороги, уведомления).
- Социальное восстановление и guardian UX на Android (нужны mock-данные и потоки).
- Безопасное хранение сервисных ключей (EdDSA) для подписи аудит-логов (на этапе MVP — файл или env, далее HSM).
- Масштабирование блокчейн-коннекторов (кэширование, ретраи, мониторинг RPC).
- WalletConnect интеграция и сигнатуры с Trust Wallet Core — требует проверки SDK на нужные фичи.

## 5. Следующие шаги
1. Завершить определение Prisma схемы и OpenAPI (`docs/OPENAPI.yaml`).
2. Реализовать OIDC-коннектор с ESIA stub, включая обработку токенов.
3. Подключить Prisma, модуль пользователей и базовую выдачу кошельков.
4. Расширить Android data/domain-слои для реальной работы с API.
5. Развить смарт-контракты и тесты до требуемого набора политик.
6. Подготовить Docker Compose и seed-данные для демонстрации end-to-end.

Документ будет обновляться по мере выполнения этапов и уточнения требований заказчика.
