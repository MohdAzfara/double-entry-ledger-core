# Contributing to Double-Entry Ledger Core

We welcome contributions from distributed systems engineers, financial cryptographers, and accounting systems architects. Because this engine enforces foundational ACID invariants across our fintech ecosystem, all contributions must adhere to strict mathematical rules.

## 1. Non-Negotiable Accounting Invariants

* **Strict Zero-Sum Conservation**: No journal transaction may be committed unless total debits strictly equal total credits (`sum(debitsMinor) === sum(creditsMinor)`) per currency.
* **Append-Only Ledger Semantics**: Never introduce mutating methods on committed journal lines; all adjustments must be modeled as compensating contra-entries.
* **Pure 64-Bit BigInt Arithmetic**: IEEE 754 floating-point numbers (`number` decimals) are strictly prohibited in monetary fields.

## 2. Commit Message Convention

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* `feat(journal): ...` for immutable journal posting and double-entry validation logic
* `feat(crypto): ...` for hash-chain sealing and Merkle audit verification
* `feat(concurrency): ...` for optimistic version locking and hot-account sharding
* `docs(verification): ...` for TLA+ formal specifications and ADRs
* `perf(bench): ...` for ledger throughput and trial-balance micro-benchmarks

## 3. Pull Request Quality Gates

1. Verify `npx tsc --noEmit` passes with zero errors.
2. Maintain 100% pure TypeScript consistency across all source and configuration files.
3. Update relevant Architecture Decision Records (`docs/adr/`) if modifying concurrency or invariant rules.
