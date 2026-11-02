# Changelog

All notable changes to `double-entry-ledger-core` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-02

### Added
- Immutable double-entry journal posting engine enforcing strict $\sum \text{Debits} = \sum \text{Credits}$ zero-sum conservation in `BigInt` minor units.
- Normal-balance Chart of Accounts (`ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE`) with non-negative overdraft guards.
- Cryptographic hash-chained audit trail (`prevHash` $\rightarrow$ `entryHash`) and Merkle root batch verifier for tamper-evident compliance.
- Serializable optimistic concurrency control (OCC) with monotonic account version locking.
- Multi-currency FX split and unrealized revaluation journal generator.
- End-of-day (EOD) Trial Balance snapshot sealer and cross-service reconciliation auditor bridging `checkout-flow-sdk`, `payout-gateway-service`, and `automated-refund-worker`.
- Three TLA+ formal verification specifications (`docs/formal-verification/`), six ADRs (`docs/adr/`), STRIDE threat model, and OpenAPI 3.1 contract.
