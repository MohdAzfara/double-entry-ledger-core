---
name: "🏛️ Accounting Rule or Multi-Currency FX Proposal"
about: "Propose a new chart-of-accounts invariant, FX revaluation rule, or hot-account sharding strategy"
title: "[LEDGER-PROPOSAL] "
labels: ["enhancement", "double-entry", "architecture"]
---

## 1. Proposed Accounting Mechanism
Describe the proposed ledger capability (e.g., sub-account sharding for hot settlement accounts, unrealized FX revaluation journal automation, Merkle tree checkpointing).

## 2. Mathematical Invariant Proof
- How does this change preserve $\sum \text{Debits} = \sum \text{Credits}$ across all currencies?
- Does it require an update to our TLA+ specifications (`docs/formal-verification/`)?
