# Double Entry Ledger Core

An immutable, ACID-compliant double-entry accounting ledger engine designed for high-throughput fintech infrastructure. It enforces strict balance invariants, preventing ledger drift and ensuring absolute auditability across distributed financial workflows.

---

## 🏗️ Architectural Core Invariants

1. **Zero-Sum Balance Law:** For every transaction, the sum of all debits must strictly equal the sum of all credits ($\sum \text{Debits} = \sum \text{Credits}$). Any violation halts the ledger entry at the database constraint level.
2. **Immutability & Append-Only Log:** Financial entries are never updated or deleted. Corrections or reversals are handled exclusively via counter-entries (compensating transactions) to maintain an uncompromised audit trail.
3. **Idempotent Posting:** Every journal entry requires a unique `Idempotency-Key` or transaction identifier, preventing double-posting caused by network retries or queue duplicates.

---

## 🛠️ Core Ledger Schema Concept

```sql
-- Conceptual double-entry schema design
CREATE TABLE journal_entries (
    entry_id UUID PRIMARY KEY,
    reference_id VARCHAR(128) UNIQUE NOT NULL,
    status VARCHAR(32) NOT NULL, -- POSTED, PENDING, REVERSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posting_lines (
    line_id UUID PRIMARY KEY,
    entry_id UUID REFERENCES journal_entries(entry_id),
    account_id UUID NOT NULL,
    amount NUMERIC(18, 4) NOT NULL, -- Positive for Debit, Negative for Credit (or explicit direction column)
    direction VARCHAR(8) NOT NULL CHECK (direction IN ('DEBIT', 'CREDIT'))
);

