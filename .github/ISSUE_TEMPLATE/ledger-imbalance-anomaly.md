---
name: "🚨 Ledger Imbalance or Hash-Chain Anomaly"
about: "Report a trial balance discrepancy, optimistic lock conflict, or hash-chain verification failure"
title: "[LEDGER-INVARIANT] "
labels: ["accounting-invariant", "priority:critical", "acid-compliance"]
---

## 1. Anomaly Summary
Describe the observed discrepancy in journal posting, trial balance aggregation, or cryptographic hash-chain sealing (redact all live counterparty PII).

## 2. Accounting Context
- **Account Normal Balance Category**: (`ASSET` / `LIABILITY` / `EQUITY` / `REVENUE` / `EXPENSE`)
- **Currency & Minor Units**: (e.g., `USD`, `BigInt cents`)
- **Upstream Producer**: (`checkout-flow-sdk` / `payout-gateway-service` / `automated-refund-worker`)

## 3. Deterministic Reproduction Steps
1. Submit journal batch with `Idempotency-Key`...
2. Evaluate debit/credit line postings...
3. Verify resulting account version and hash-chain digest...
