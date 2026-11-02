/**
 * Deterministic Error Taxonomy for Immutable Double-Entry Ledger Core
 * Enforces strict separation between invariant violations and concurrency conflicts.
 */
export enum LedgerErrorCode {
  UNBALANCED_JOURNAL_BATCH = 'ERR_LEDGER_UNBALANCED_JOURNAL_BATCH',
  EMPTY_OR_SINGLE_LEG_JOURNAL = 'ERR_LEDGER_EMPTY_OR_SINGLE_LEG_JOURNAL',
  NON_POSITIVE_LINE_AMOUNT = 'ERR_LEDGER_NON_POSITIVE_LINE_AMOUNT',
  CROSS_CURRENCY_LEG_MISMATCH = 'ERR_LEDGER_CROSS_CURRENCY_LEG_MISMATCH',
  NORMAL_BALANCE_OVERDRAFT = 'ERR_LEDGER_NORMAL_BALANCE_OVERDRAFT',
  OPTIMISTIC_VERSION_CONFLICT = 'ERR_LEDGER_OPTIMISTIC_VERSION_CONFLICT',
  IDEMPOTENCY_KEY_PAYLOAD_CONFLICT = 'ERR_LEDGER_IDEMPOTENCY_KEY_PAYLOAD_CONFLICT',
  HASH_CHAIN_CONTINUITY_BROKEN = 'ERR_LEDGER_HASH_CHAIN_CONTINUITY_BROKEN',
  IMMUTABLE_ENTRY_MUTATION_FORBIDDEN = 'ERR_LEDGER_IMMUTABLE_ENTRY_MUTATION_FORBIDDEN'
}

export class LedgerInvariantError extends Error {
  public readonly code: LedgerErrorCode;
  public readonly retryable: boolean;
  public readonly timestampIso: string;

  constructor(code: LedgerErrorCode, message: string, retryable = false) {
    super(message);
    this.name = 'LedgerInvariantError';
    this.code = code;
    this.retryable = retryable;
    this.timestampIso = new Date().toISOString();
    Object.setPrototypeOf(this, LedgerInvariantError.prototype);
  }
}
