# ADR 0003: Cryptographic Hash-Chained Audit Trail and Merkle Batch Sealing

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Even when application code enforces append-only semantics, privileged database administrators or compromised storage volumes could theoretically tamper with historical ledger records unless cryptographic integrity proofs are maintained.

## Decision

We embed a **Cryptographic Hash Chain and Merkle Tree Verifier** directly into the journal posting pipeline:

1. **Sequential Hash Chaining**: Each committed journal batch $n$ computes a deterministic digest over its canonical payload concatenated with batch $n-1$'s digest:
   $$H_n = \text{Digest}(H_{n-1} \parallel \text{journalId}_n \parallel \text{idempotencyKey}_n \parallel \text{lines}_n)$$
2. **Merkle Root Checkpointing**: Settlement windows aggregate individual journal digests into a binary Merkle tree root for O(log N) inclusion proofs.

## Consequences

* **Positive**: Any historical bit-flip, insertion, or deletion immediately invalidates the hash chain and Merkle root during audit verification.
* **Negative**: Sequential hash chaining requires deterministic canonical serialization of journal lines.
