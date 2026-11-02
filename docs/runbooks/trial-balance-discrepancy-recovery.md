# Operational Runbook: Trial Balance & Hash-Chain Verification Recovery SOP

## 1. Alert Trigger Conditions

This critical runbook is triggered if the End-of-Day (EOD) Trial Balance sealer (`src/snapshots/trial-balance-generator.ts`) or Merkle batch verifier (`src/crypto/merkle-batch-verifier.ts`) raises:
1. `ERR_LEDGER_TRIAL_BALANCE_MISMATCH`: Aggregate account balances do not sum to zero across normal debit/credit categories.
2. `ERR_LEDGER_HASH_CHAIN_BROKEN`: Sequential `prevHash` link mismatch detected between consecutive journal batches.

## 2. Standard Operating Procedure (SOP)

1. **Step 1 — Halt Outbound Settlement Dispatch**: Immediately pause automated payout workers in `payout-gateway-service` while preserving inbound read-only status.
2. **Step 2 — Binary Search Merkle Audit Windows**: Use `MerkleBatchVerifier` to isolate the exact sequence number range `[seqStart, seqEnd]` where the digest diverged.
3. **Step 3 — Cross-Service Reconciliation**: Run `CrossServiceLedgerAuditor` against upstream events from `checkout-flow-sdk`, `payout-gateway-service`, and `automated-refund-worker` to post a signed compensating journal entry.
