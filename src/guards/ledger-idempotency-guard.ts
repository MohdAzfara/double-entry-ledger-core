export interface CommittedJournalReceipt {
  readonly idempotencyKey: string;
  readonly payloadFingerprint: string;
  readonly journalEntryId: string;
  readonly sequenceNumber: number;
  readonly entryHash: string;
}

/**
 * Deterministic Ledger Idempotency & Payload Fingerprint Guard
 * Prevents duplicate journal postings across upstream service retries.
 */
export class LedgerIdempotencyGuard {
  private readonly registry = new Map<string, CommittedJournalReceipt>();

  public static createCanonicalFingerprint(
    sourceService: string,
    correlationId: string,
    currency: string,
    totalVolumeMinor: bigint
  ): string {
    return `${sourceService.trim()}:${correlationId.trim()}:${currency.trim().toUpperCase()}:${totalVolumeMinor.toString()}`;
  }

  public checkBeforePosting(
    idempotencyKey: string,
    payloadFingerprint: string
  ): { alreadyCommitted: boolean; existingReceipt?: CommittedJournalReceipt } {
    const cleanKey = idempotencyKey.trim();
    if (cleanKey.length < 16 || cleanKey.length > 128) {
      throw new Error('Invalid Ledger Idempotency-Key: length must be between 16 and 128 characters.');
    }

    const existing = this.registry.get(cleanKey);
    if (existing) {
      if (existing.payloadFingerprint !== payloadFingerprint) {
        throw new Error(
          `Ledger idempotency conflict: key "${cleanKey}" reused with mutated journal lines.`
        );
      }
      return { alreadyCommitted: true, existingReceipt: existing };
    }

    return { alreadyCommitted: false };
  }

  public recordCommittedReceipt(receipt: CommittedJournalReceipt): void {
    this.registry.set(receipt.idempotencyKey.trim(), receipt);
  }
}
