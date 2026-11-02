# ADR 0004: Serializable Optimistic Concurrency Control (OCC) for Account Balances

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Concurrent journal postings affecting the same merchant account (e.g., simultaneous checkout captures from `checkout-flow-sdk` and vendor disbursements from `payout-gateway-service`) can cause lost updates or race-condition overdrafts if uncoordinated.

## Decision

Every ledger account maintains a monotonically increasing `version` counter enforced via **Optimistic Concurrency Control (OCC)** and deterministic account lock ordering:

1. **Deterministic Account Sorting**: Multi-account journal batches sort target `accountId`s lexicographically prior to lock acquisition, mathematically eliminating AB-BA deadlocks.
2. **Compare-And-Swap Version Check**: Balance updates require `expectedVersion === currentVersion`, atomically incrementing `version + 1` upon commit.

## Consequences

* **Positive**: Prevents deadlocks and lost updates without holding long-lived pessimistic database locks across network boundaries.
* **Negative**: High-contention clearing accounts require sub-account sharding under extreme burst loads.
