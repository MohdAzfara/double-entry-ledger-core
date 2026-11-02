import { ImmutableJournalBatch } from '../journal/immutable-journal-poster';
import { MerkleBatchVerifier } from '../crypto/merkle-batch-verifier';

export interface TrialBalanceSnapshot {
  readonly cutoffDateIso: string;
  readonly currency: string;
  readonly lastSequenceNumber: number;
  readonly totalDebitsMinor: bigint;
  readonly totalCreditsMinor: bigint;
  readonly netDiscrepancyMinor: bigint;
  readonly merkleRootDigest: string;
  readonly isZeroSumVerified: boolean;
}

/**
 * End-of-Day (EOD) Trial Balance Snapshot Sealer (ADR 0006)
 * Aggregates committed journal batches and seals daily checkpoints with a Merkle root.
 */
export class TrialBalanceGenerator {
  public generateSnapshot(
    currency: string,
    batches: readonly ImmutableJournalBatch[],
    cutoffDateIso = new Date().toISOString()
  ): TrialBalanceSnapshot {
    const targetCurrency = currency.trim().toUpperCase();
    const filtered = batches.filter((b) => b.currency === targetCurrency);

    let totalDebitsMinor = 0n;
    let totalCreditsMinor = 0n;
    let lastSequenceNumber = 0;
    const digests: string[] = [];

    for (const batch of filtered) {
      for (const line of batch.lines) {
        if (line.direction === 'DEBIT') {
          totalDebitsMinor += line.amountMinor;
        } else {
          totalCreditsMinor += line.amountMinor;
        }
      }
      lastSequenceNumber = Math.max(lastSequenceNumber, batch.sequenceNumber);
      digests.push(batch.chainLink.entryHash);
    }

    const netDiscrepancyMinor = totalDebitsMinor - totalCreditsMinor;
    return {
      cutoffDateIso,
      currency: targetCurrency,
      lastSequenceNumber,
      totalDebitsMinor,
      totalCreditsMinor,
      netDiscrepancyMinor,
      merkleRootDigest: MerkleBatchVerifier.computeMerkleRoot(digests),
      isZeroSumVerified: netDiscrepancyMinor === 0n
    };
  }
}
