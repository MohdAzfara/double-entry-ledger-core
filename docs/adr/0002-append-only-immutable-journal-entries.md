# ADR 0002: Append-Only Immutable Journal Entries and Contra-Entry Reversals

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

In regulated financial infrastructure (SOC 1 Type II, PCI-DSS, GAAP/IFRS), mutating or deleting historical transaction rows destroys auditability and invalidates previously generated financial statements.

## Decision

We enforce **Strict Append-Only Ledger Semantics**:

1. **No In-Place Updates or Deletions**: Once a journal entry is committed, its amount, accounts, currency, and timestamps are permanently immutable.
2. **Compensating Contra-Entries**: Refunds, chargebacks, or operational corrections triggered by `automated-refund-worker` must post a new offsetting journal batch that references the original `journalEntryId` via `reversesJournalId`.

## Consequences

* **Positive**: Preserves a 100% complete, point-in-time reconstructible audit history for regulatory examiners.
* **Negative**: Storage grows monotonically, requiring periodic Trial Balance snapshot checkpoints (`ADR 0006`).
