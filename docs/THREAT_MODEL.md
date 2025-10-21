# Threat Model Overview

## Assets
- User identities (ЕСИА claims, contact data).
- Wallet policies and transaction history.
- Audit log hash chain and service signing keys.
- User private keys (stored on Android device).
- Access/refresh tokens and API credentials.

## Adversaries
- **External attackers**: Attempt unauthorized access, replay attacks, MITM, API abuse.
- **Compromised clients**: Rooted device, malware stealing tokens or triggering malicious transfers.
- **Insider threat**: Rogue operator modifying policies or audit data.
- **Network-level attacker**: Intercepts OIDC or API traffic.

## Attack Surfaces & Mitigations
- **OIDC Login Flow**:
  - Risks: Code interception, CSRF, PKCE downgrade.
  - Mitigations: PKCE enforced by ESIA stub, state parameter validation, HTTPS/TLS pinning, short-lived auth codes.
- **API Endpoints**:
  - Risks: JWT theft, privilege escalation, injection.
  - Mitigations: Access/refresh rotation, Zod validation, Nest guards, RBAC, SQL injection prevention via Prisma, rate limiting.
- **Transaction Handling**:
  - Risks: Policy bypass, replay of intents, signature forgery.
  - Mitigations: Policy engine verifying timelock/limits, nonce tracking, signature validation (Trust Wallet Core), antifraud queue requiring manual confirmation.
- **Audit Log**:
  - Risks: Tampering, deletion.
  - Mitigations: Hash chain linking, periodic JWS signatures with off-line stored service key, append-only DB constraints.
- **Android Storage**:
  - Risks: Token theft, key extraction.
  - Mitigations: EncryptedSharedPreferences for refresh tokens, in-memory access tokens, Android Keystore-backed key wrapping, biometric gating for critical actions, root detection hooks (TODO).
- **Blockchain Connectors**:
  - Risks: RPC spoofing, incorrect fee estimation.
  - Mitigations: Configurable trusted RPC endpoints, TLS, response validation, optional quorum of RPC nodes.
- **Wallet Recovery**:
  - Risks: Social recovery abuse, guardian compromise.
  - Mitigations: Guardian threshold m-of-n, notifications, antifraud review, timelock before finalize.

## Open Items
- Implement device attestation (SafetyNet/Play Integrity).
- Integrate push notifications for antifraud alerts.
- Establish HSM for service signing keys in production.
- Add anomaly detection for behavioral analytics.
