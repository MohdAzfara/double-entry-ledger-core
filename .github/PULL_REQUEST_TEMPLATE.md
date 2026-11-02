## Summary of Changes

Please provide a concise architectural summary of the changes introduced in this Pull Request.

## Double-Entry Accounting & ACID Compliance Checklist

- [ ] **Zero-Sum Conservation**: All journal posting paths strictly enforce `sum(debitsMinor) === sum(creditsMinor)` per currency using 64-bit `BigInt`.
- [ ] **Append-Only Immutability**: No committed journal entry or hash-chain digest can be mutated or deleted in place.
- [ ] **Optimistic Concurrency**: Account balance updates verify monotonic version numbers to prevent lost updates.
- [ ] **Zero PII Leakage**: Sensitive counterparty identifiers and account metadata are scrubbed prior to telemetry emission.
- [ ] **Static Verification**: `npx tsc --noEmit` passes with zero compilation or type errors.
