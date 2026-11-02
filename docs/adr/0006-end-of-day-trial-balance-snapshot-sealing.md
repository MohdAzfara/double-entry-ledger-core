# ADR 0006: End-of-Day (EOD) Trial Balance Snapshot Sealing and Checkpointing

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Recomputing account balances by scanning millions of historical append-only journal lines from genesis degrades query performance over time and complicates daily regulatory cutoff reporting.

## Decision

We implement **Immutable End-of-Day (EOD) Trial Balance Snapshots**:

1. **Accounting Period Cutoff**: At each UTC daily boundary, the snapshot engine aggregates all account balances, verifies global $\sum \text{Debits} = \sum \text{Credits}$, and seals the snapshot with the latest journal hash-chain digest.
2. **Incremental Balance Reconstruction**: Real-time balance queries read the latest sealed snapshot digest plus only the delta journal entries posted since that cutoff sequence number.

## Consequences

* **Positive**: Guarantees O(1) bounded query latency for historical and real-time account balances regardless of total ledger age.
* **Negative**: Requires strict sequence-number watermarking during snapshot generation.
