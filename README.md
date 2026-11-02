# Double-Entry Ledger Core

[![Ledger CI & Security Pipeline](https://img.shields.io/badge/Ledger%20CI%20%26%20Security%20Pipeline-passing-brightgreen)](https://github.com/MohdAzfara/double-entry-ledger-core/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1.0-6ba539.svg)](docs/api/double-entry-ledger-openapi.yaml)
[![SemVer](https://img.shields.io/badge/SemVer-1.0.0-green.svg)](https://semver.org/)

A production-grade, immutable double-entry accounting ledger engine enforcing strict ACID balance invariants, cryptographic hash-chained audit trails, and zero-sum conservation across distributed financial workflows.

---

## 🗺️ Immutable Double-Entry Journal & Hash-Chain Flow

```text
[ Upstream Event: Checkout Capture / Vendor Payout / Refund Saga ]
                                │
                                ▼
[ Signature & Idempotency Guard ] ──(Payload Fingerprint & Replay Check)
                                │
                                ▼
[ Zero-Sum Conservation Guard ] ────(Enforce: Σ Debits == Σ Credits in BigInt)
                                │
                                ▼
[ Optimistic Concurrency Lock ] ────(Lexicographical Sort & CAS Version + 1)
                                │
                                ▼
[ Append-Only Journal Poster ] ─────(Freeze Entry & Compute Chained SHA/FNV Hash)
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
[ EOD Trial Balance Merkle Seal ]   [ Cross-Service Liquidity Auditor ]
```

---

## 🏛️ Architectural Overview & Ecosystem Role

Serving as the foundational system-of-record beneath [`checkout-flow-sdk`](https://github.com/MohdAzfara/checkout-flow-sdk) (Inbound Capture), [`payout-gateway-service`](https://github.com/MohdAzfara/payout-gateway-service) (Outbound Disbursement), and [`automated-refund-worker`](https://github.com/MohdAzfara/automated-refund-worker) (Compensating Reversal Saga), this engine guarantees mathematical accounting integrity:

1. **Strict Zero-Sum Conservation Law**: Every state-mutating transaction is recorded as an atomic double-entry journal batch where total debits strictly equal total credits ($\sum \text{Debits} = \sum \text{Credits}$) per currency using 64-bit `BigInt` minor units (`src/guards/zero-sum-invariant-guard.ts`).
2. **Append-Only Immutable Journals**: Committed journal lines are permanently frozen (`src/journal/immutable-journal-poster.ts`); in-place updates and deletions are forbidden, requiring compensating contra-entries (`reversesJournalId`) for all adjustments.
3. **Cryptographic Hash-Chained Audit Trail**: Every journal batch $n$ seals a cryptographic digest over its payload linked to batch $n-1$'s `entryHash` (`src/crypto/hash-chain-audit-sealer.ts`) and aggregates settlement windows into binary Merkle tree roots (`src/crypto/merkle-batch-verifier.ts`).
4. **Deadlock-Free Optimistic Concurrency (OCC)**: Multi-account batches sort target account IDs lexicographically and enforce Compare-And-Swap (`CAS`) monotonic version increments (`src/concurrency/optimistic-version-lock.ts`).
5. **Multi-Currency FX & EOD Trial Balance Sealing**: Routes cross-currency conversions through paired FX position accounts (`src/revaluation/multi-currency-fx-engine.ts`) and generates Merkle-sealed End-of-Day Trial Balance checkpoints (`src/snapshots/trial-balance-generator.ts`).

---

## ✨ Key Architectural Features

* **GAAP/IFRS Chart of Accounts & Solvency Guards**: Enforces normal-balance direction semantics across `ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, and `EXPENSE` categories (`src/domain/chart-of-accounts.ts`).
* **Cross-Service Ecosystem Reconciliation**: Verifies end-to-end liquidity conservation across checkout captures, vendor payouts, refund clawbacks, and platform escrow liabilities (`src/reconciliation/cross-service-ledger-auditor.ts`).
* **Formal Verification (TLA+)**: Three mathematical specifications proving global zero-sum conservation, hash-chain continuity, and optimistic concurrency safety (`docs/formal-verification/`).
* **High-Throughput Micro-Benchmarks**: Deterministic benchmarks for zero-sum validation, hash-chain sealing, trial balance aggregation, CAS locking, and FX conversion (`benchmarks/`).

---

## 🔒 Security, Compliance & Vulnerability Disclosure

We treat accounting immutability and audit trail integrity as non-negotiable priorities:

* **Security Policy & Accounting Boundaries**: Review our [SECURITY.md](SECURITY.md) for zero-sum conservation, append-only semantics, and hash-chain verification standards.
* **STRIDE Threat Model**: Comprehensive threat analysis and cryptographic mitigations are documented in [docs/threat-model.md](docs/threat-model.md).
* **SOC 1 Type II, GAAP/IFRS & ISO 20022 Compliance Matrix**: Alignment with `camt.053` statement reporting and PCI-DSS v4.0 audit log integrity is documented in [docs/compliance/soc1-gaap-ifrs-ledger-controls.md](docs/compliance/soc1-gaap-ifrs-ledger-controls.md).
* **RFC 9116 Compliance**: Standardized vulnerability disclosure contact policy is published at [.well-known/security.txt](.well-known/security.txt).

---

## 📚 Documentation, Specifications & Runbooks

### Architecture Decision Records (ADRs)
* [ADR 0001: Strict Zero-Sum Double-Entry Conservation Law in BigInt Minor Units](docs/adr/0001-zero-sum-double-entry-conservation-law.md)
* [ADR 0002: Append-Only Immutable Journal Entries and Contra-Entry Reversals](docs/adr/0002-append-only-immutable-journal-entries.md)
* [ADR 0003: Cryptographic Hash-Chained Audit Trail and Merkle Batch Sealing](docs/adr/0003-cryptographic-hash-chained-audit-trail.md)
* [ADR 0004: Serializable Optimistic Concurrency Control (OCC) for Account Balances](docs/adr/0004-serializable-optimistic-version-locking.md)
* [ADR 0005: Multi-Currency FX Intermediary Clearing and Revaluation Accounts](docs/adr/0005-multi-currency-fx-revaluation-accounts.md)
* [ADR 0006: End-of-Day (EOD) Trial Balance Snapshot Sealing and Checkpointing](docs/adr/0006-end-of-day-trial-balance-snapshot-sealing.md)

### Formal Verification (TLA+), API Contracts & Operational Runbooks
* [TLA+ Invariant 1: Global Zero-Sum Double-Entry Specification](docs/formal-verification/zero-sum-double-entry.tla)
* [TLA+ Invariant 2: Cryptographic Hash-Chain Tamper Evidence Specification](docs/formal-verification/hash-chain-tamper-evidence.tla)
* [TLA+ Invariant 3: Optimistic Concurrency Versioning Specification](docs/formal-verification/optimistic-concurrency-versioning.tla)
* [OpenAPI 3.1 Specification: Double-Entry Ledger Core Contract](docs/api/double-entry-ledger-openapi.yaml)
* [Operational Runbook 1: Trial Balance & Hash-Chain Verification Recovery SOP](docs/runbooks/trial-balance-discrepancy-recovery.md)
* [Operational Runbook 2: Hot-Account Optimistic Lock Contention & Sharding SOP](docs/runbooks/hot-account-lock-contention-mitigation.md)

---

## 🤝 Contributing

We welcome contributions from distributed systems engineers and financial cryptographers. Please review our [CONTRIBUTING.md](CONTRIBUTING.md) and adhere strictly to [Conventional Commits](https://www.conventionalcommits.org/) standards.

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for details.
