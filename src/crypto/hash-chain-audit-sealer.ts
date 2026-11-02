export interface SealedJournalChainLink {
  readonly sequenceNumber: number;
  readonly journalEntryId: string;
  readonly idempotencyKey: string;
  readonly canonicalLinesDigest: string;
  readonly prevHash: string;
  readonly entryHash: string;
}

/**
 * Cryptographic Hash-Chained Audit Trail Sealer (ADR 0003)
 * Links each committed journal batch to its predecessor for immediate tamper evidence.
 */
export class HashChainAuditSealer {
  public static readonly GENESIS_HASH = '0000000000000000';

  public static computeDeterministicDigest(payload: string): string {
    let hash = 0xcbf29ce484222325n;
    const prime = 0x100000001b3n;

    for (let i = 0; i < payload.length; i++) {
      hash ^= BigInt(payload.charCodeAt(i));
      hash = (hash * prime) & 0xffffffffffffffffn;
    }

    return hash.toString(16).padStart(16, '0');
  }

  public static sealNextLink(
    sequenceNumber: number,
    journalEntryId: string,
    idempotencyKey: string,
    canonicalLinesDigest: string,
    prevHash: string
  ): SealedJournalChainLink {
    const preimage = `${sequenceNumber}:${prevHash}:${journalEntryId}:${idempotencyKey}:${canonicalLinesDigest}`;
    const entryHash = this.computeDeterministicDigest(preimage);

    return {
      sequenceNumber,
      journalEntryId,
      idempotencyKey,
      canonicalLinesDigest,
      prevHash,
      entryHash
    };
  }

  public static verifyChainContinuity(chain: readonly SealedJournalChainLink[]): boolean {
    let expectedPrevHash = this.GENESIS_HASH;

    for (let i = 0; i < chain.length; i++) {
      const link = chain[i];
      if (link.sequenceNumber !== i + 1 || link.prevHash !== expectedPrevHash) {
        return false;
      }
      const recomputed = this.sealNextLink(
        link.sequenceNumber,
        link.journalEntryId,
        link.idempotencyKey,
        link.canonicalLinesDigest,
        link.prevHash
      );
      if (recomputed.entryHash !== link.entryHash) {
        return false;
      }
      expectedPrevHash = link.entryHash;
    }

    return true;
  }
}
