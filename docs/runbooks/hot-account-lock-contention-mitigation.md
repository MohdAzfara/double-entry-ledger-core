# Operational Runbook: Hot-Account Optimistic Lock Contention & Sharding SOP

## 1. Symptom Identification

During flash-sale checkout events (`checkout-flow-sdk`) or bulk payout sweeps (`payout-gateway-service`), platform-wide clearing accounts (e.g., `acct_platform_clearing_usd`) may experience elevated `ERR_LEDGER_OPTIMISTIC_VERSION_CONFLICT` retries.

## 2. Mitigation Procedure: Deterministic Sub-Account Sharding

1. **Step 1 — Enable Sharded Clearing Buckets**: Partition the hot clearing account into $N$ deterministic sub-accounts (`acct_platform_clearing_usd_shard_00` .. `shard_15`) hashed by `Idempotency-Key`.
2. **Step 2 — EOD Sweep Consolidation**: At the UTC cutoff window, post a single consolidated journal batch sweeping all 16 sub-account balances into the master control account prior to Trial Balance sealing.
