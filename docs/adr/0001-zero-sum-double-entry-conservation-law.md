# ADR 0001: Strict Zero-Sum Double-Entry Conservation Law in BigInt Minor Units

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Single-entry balance tables (`UPDATE accounts SET balance = balance + X`) are fragile under partial failures and provide no mathematical guarantee against money creation or destruction when coordinating captures (`checkout-flow-sdk`), disbursements (`payout-gateway-service`), and reversals (`automated-refund-worker`).

## Decision

Every financial state mutation must be recorded as an atomic **Double-Entry Journal Batch** satisfying:

1. **Zero-Sum Equation**: For every currency $c$ in a journal batch, the sum of all debit lines must strictly equal the sum of all credit lines:
   $$\sum_{i} \text{Debit}_{i,c} - \sum_{j} \text{Credit}_{j,c} = 0$$
2. **64-Bit BigInt Minor Units**: All monetary quantities are represented as integer minor units (`bigint`), completely eliminating IEEE 754 floating-point precision loss.

## Consequences

* **Positive**: Mathematically guarantees global conservation of value; makes unrecorded balance drift impossible.
* **Negative**: Requires every business operation to specify at least two balanced journal lines (source and destination accounts).
