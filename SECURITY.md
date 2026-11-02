# Security Policy & Immutable Ledger Integrity Boundary

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Accounting Integrity & Cryptographic Audit Boundaries

`double-entry-ledger-core` serves as the immutable system-of-record backing [`checkout-flow-sdk`](https://github.com/MohdAzfara/checkout-flow-sdk), [`payout-gateway-service`](https://github.com/MohdAzfara/payout-gateway-service), and [`automated-refund-worker`](https://github.com/MohdAzfara/automated-refund-worker):

1. **Zero-Sum Double-Entry Law**: Every posted journal batch strictly enforces $\sum \text{Debits} = \sum \text{Credits}$ using 64-bit `BigInt` integer minor units, preventing phantom money creation or rounding drift.
2. **Append-Only Immutability**: Posted ledger entries can never be updated or deleted (`UPDATE`/`DELETE` forbidden); corrections require explicit compensating reversal journal entries.
3. **Cryptographic Hash-Chained Audit Trail**: Each journal batch is cryptographically linked to the preceding batch digest (`prevHash` $\rightarrow$ `entryHash`), providing immediate tamper evidence.
4. **Serializable Optimistic Concurrency**: Account balance mutations enforce strict monotonic version checks to eliminate lost updates and Time-of-Check to Time-of-Use (TOCTOU) anomalies.

## Reporting a Vulnerability

Please **DO NOT** report security or accounting invariant vulnerabilities through public GitHub issues.

* **Email**: lumilieju@hotmail.com
* **RFC 9116 Policy**: See [`.well-known/security.txt`](.well-known/security.txt)

We acknowledge receipt of all vulnerability reports within **24 hours** and provide a remediation timeline within **72 hours**.
