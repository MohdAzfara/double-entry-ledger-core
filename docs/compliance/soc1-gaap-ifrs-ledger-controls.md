# SOC 1 Type II, GAAP/IFRS & ISO 20022 Accounting Controls Matrix

This document maps `double-entry-ledger-core` engineering invariants to global financial auditing and accounting standards.

| Control Domain | Engineering Implementation | Regulatory / Audit Standard |
| :--- | :--- | :--- |
| **Double-Entry Completeness** | Atomic $\sum \text{Debits} = \sum \text{Credits}$ enforcement per currency (`BigInt`) | GAAP / IFRS Double-Entry Bookkeeping Standard |
| **Immutable Audit Trail** | Append-only journal store with contra-entry reversals (`ADR 0002`) | SOC 1 Type II Change & Data Integrity Controls |
| **Tamper-Evident Sealing** | Sequential SHA-256 / FNV-1a hash chaining & Merkle batch roots (`ADR 0003`) | PCI-DSS v4.0 Requirement 10 Audit Log Integrity |
| **Statement Reconciliation** | EOD Trial Balance snapshots & cross-service parity verification | ISO 20022 `BankToCustomerStatement` (`camt.053`) |
| **Counterparty Privacy** | Recursive redaction of tax IDs, IBANs, and cardholder metadata | GDPR & Banking Secrecy Compliance |
