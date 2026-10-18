/**
 * @file double-entry-ledger-core/src/index.ts
 * @description Immutable double-entry accounting ledger engine enforcing ACID balance invariants and audit trails.
 */

export type EntryDirection = 'DEBIT' | 'CREDIT';

export interface PostingLine {
  accountId: string;
  amount: number; // Positive absolute value
  direction: EntryDirection;
}

export interface JournalEntry {
  entryId: string;
  referenceId: string;
  lines: PostingLine[];
  timestamp: string;
}

export interface LedgerValidationResult {
  isValid: boolean;
  totalDebits: number;
  totalCredits: number;
  error?: string;
}

export class DoubleEntryLedgerCore {
  private journalLog: JournalEntry[] = [];

  /**
   * Posts a balanced journal entry enforcing the strict Zero-Sum invariant (Sum Debits === Sum Credits).
   */
  public postJournalEntry(entry: JournalEntry): LedgerValidationResult {
    let totalDebits = 0;
    let totalCredits = 0;

    for (const line of entry.lines) {
      if (line.amount <= 0) {
        throw new Error(`Invalid posting amount: Amount must be strictly greater than zero for account ${line.accountId}`);
      }

      if (line.direction === 'DEBIT') {
        totalDebits += line.amount;
      } else if (line.direction === 'CREDIT') {
        totalCredits += line.amount;
      }
    }

    // Floating-point safety tolerance check (e.g., handling decimal rounding precision)
    const variance = Math.abs(totalDebits - totalCredits);
    if (variance > 0.0001) {
      return {
        isValid: false,
        totalDebits,
        totalCredits,
        error: `ACID Invariant Violation: Debits (${totalDebits}) do not equal Credits (${totalCredits}). Variance: ${variance}`
      };
    }

    // Append to immutable log
    this.journalLog.push({
      ...entry,
      timestamp: new Date().toISOString()
    });

    console.info(`[LedgerCore] Journal Entry ${entry.entryId} successfully posted. Balanced at ${totalDebits} [Immutable Audit Log]`);

    return {
      isValid: true,
      totalDebits,
      totalCredits
    };
  }

  public getLedgerLog(): JournalEntry[] {
    return [...this.journalLog];
  }
}

// Execution test harness for ledger engine
const ledger = new DoubleEntryLedgerCore();
ledger.postJournalEntry({
  entryId: 'je_001',
  referenceId: 'ref_tx_999',
  lines: [
    { accountId: 'acc_cash', amount: 500.00, direction: 'DEBIT' },
    { accountId: 'acc_revenue', amount: 500.00, direction: 'CREDIT' }
  ],
  timestamp: ''
});
