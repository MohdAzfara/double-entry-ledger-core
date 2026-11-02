# STRIDE Threat Model: Double-Entry Ledger Core

This document outlines the security and financial integrity threat analysis implemented within `double-entry-ledger-core` based on the Microsoft STRIDE framework.

## 1. Spoofing Identity
* **Threat**: Unauthorized microservices or external callers attempting to post fabricated journal entries into the core accounting ledger.
* **Mitigation**:
  * Cryptographic payload attestation (`src/security/signature-attestation-guard.ts`) verifying caller origin and timestamp freshness across upstream events from `checkout-flow-sdk`, `payout-gateway-service`, and `automated-refund-worker`.

## 2. Tampering with Data
* **Threat**: Retroactive modification or deletion of historical ledger entries to conceal fraudulent fund movements or balance inflation.
* **Mitigation**:
  * Strictly append-only journal architecture (`src/journal/immutable-journal-poster.ts`) combined with cryptographic hash chaining (`prevHash` $\rightarrow$ `entryHash`) and Merkle batch verification (`src/crypto/`).

## 3. Repudiation
* **Threat**: Upstream services or auditors disputing the ordering, causation, or completeness of posted balance mutations.
* **Mitigation**:
  * Mandatory `Idempotency-Key` deduplication correlated with monotonic sequence numbers, upstream `correlationId` links, and sealed end-of-day (EOD) Trial Balance snapshots.

## 4. Information Disclosure
* **Threat**: Exposure of sensitive counterparty tax identifiers, IBANs, or confidential merchant account metadata in ledger telemetry.
* **Mitigation**:
  * Automated recursive PII redaction (`src/telemetry/ledger-pii-redactor.ts`) sanitizing all structured log payloads prior to emission.

## 5. Denial of Service (DoS)
* **Threat**: High-contention lock convoys on platform clearing or fee accounts ("hot accounts") degrading overall ledger posting throughput.
* **Mitigation**:
  * Lock-free optimistic concurrency control (`src/concurrency/optimistic-version-lock.ts`) paired with deterministic account sharding runbooks (`docs/runbooks/hot-account-lock-contention-mitigation.md`).

## 6. Elevation of Privilege
* **Threat**: Application-layer bugs attempting to post unbalanced single-entry adjustments or bypass overdraft limits on liability/merchant accounts.
* **Mitigation**:
  * Non-bypassable kernel-level `ZeroSumInvariantGuard` (`src/guards/zero-sum-invariant-guard.ts`) and normal-balance direction enforcement (`src/domain/chart-of-accounts.ts`).
