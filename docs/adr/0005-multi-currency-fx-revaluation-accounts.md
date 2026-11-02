# ADR 0005: Multi-Currency FX Intermediary Clearing and Revaluation Accounts

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Cross-border transactions (e.g., capturing `EUR` via `checkout-flow-sdk` and settling `USD` to a vendor via `payout-gateway-service`) cannot directly debit a `EUR` account and credit a `USD` account in a single currency-mixed journal leg without violating single-currency zero-sum conservation.

## Decision

All cross-currency conversions must route through **Paired FX Liquidity Clearing Accounts**:

1. **Source Currency Leg (`EUR`)**: Debit Merchant `EUR` Clearing / Credit Platform FX Position `EUR` ($\sum \text{EUR} = 0$).
2. **Target Currency Leg (`USD`)**: Debit Platform FX Position `USD` / Credit Vendor `USD` Available ($\sum \text{USD} = 0$).
3. **Deterministic Basis-Point FX Spread**: Exchange rates and FX fee spreads are applied using integer basis points (`BigInt`) with explicit remainder allocation.

## Consequences

* **Positive**: Preserves strict per-currency zero-sum conservation while accurately tracking platform FX exposure and unrealized gains/losses.
* **Negative**: Cross-currency transfers generate 4 journal lines (2 per currency) rather than 2.
