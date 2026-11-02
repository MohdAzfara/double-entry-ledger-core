import { ProposedJournalLine, ZeroSumInvariantGuard } from '../guards/zero-sum-invariant-guard';
import { HashChainAuditSealer, SealedJournalChainLink } from '../crypto/hash-chain-audit-sealer';

export interface ImmutableJournalBatch {
  readonly journalEntryId: string;
  readonly sequenceNumber: number;
  readonly idempotencyKey: string;
  readonly correlationId: string;
  readonly sourceService: 'checkout-flow-sdk' | 'payout-gateway-service' | 'automated-refund-worker';
  readonly currency: string;
  readonly totalVolumeMinor: bigint;
  readonly lines: readonly ProposedJournalLine[];
  readonly chainLink: SealedJournalChainLink;
  readonly reversesJournalId?: string;
}

/**
 * Append-Only Immutable Double-Entry Journal Posting Engine (ADR 0001 & ADR 0002)
 */
export class ImmutableJournalPoster {
  private readonly appendOnlyStore: ImmutableJournalBatch[] = [];

  public postBatch(params: {
    journalEntryId: string;
    idempotencyKey: string;
    correlationId: string;
    sourceService: 'checkout-flow-sdk' | 'payout-gateway-service' | 'automated-refund-worker';
    lines: readonly ProposedJournalLine[];
    reversesJournalId?: string;
  }): ImmutableJournalBatch {
    const verification = ZeroSumInvariantGuard.verifyBatchConservation(params.lines);
    const sequenceNumber = this.appendOnlyStore.length + 1;
    const prevHash =
      this.appendOnlyStore.length === 0
        ? HashChainAuditSealer.GENESIS_HASH
        : this.appendOnlyStore[this.appendOnlyStore.length - 1].chainLink.entryHash;

    const canonicalLines = params.lines
      .map((l) => `${l.accountId}:${l.direction}:${l.amountMinor.toString()}`)
      .join('|');
    const canonicalLinesDigest = HashChainAuditSealer.computeDeterministicDigest(canonicalLines);

    const chainLink = HashChainAuditSealer.sealNextLink(
      sequenceNumber,
      params.journalEntryId,
      params.idempotencyKey,
      canonicalLinesDigest,
      prevHash
    );

    const committed: ImmutableJournalBatch = Object.freeze({
      journalEntryId: params.journalEntryId,
      sequenceNumber,
      idempotencyKey: params.idempotencyKey,
      correlationId: params.correlationId,
      sourceService: params.sourceService,
      currency: verification.currency,
      totalVolumeMinor: verification.totalDebitsMinor,
      lines: Object.freeze([...params.lines]),
      chainLink: Object.freeze(chainLink),
      reversesJournalId: params.reversesJournalId
    });

    this.appendOnlyStore.push(committed);
    return committed;
  }

  public getCommittedHistory(): readonly ImmutableJournalBatch[] {
    return this.appendOnlyStore;
  }
}
