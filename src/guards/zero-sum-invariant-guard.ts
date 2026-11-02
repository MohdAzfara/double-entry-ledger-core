export interface ProposedJournalLine {
  readonly accountId: string;
  readonly direction: 'DEBIT' | 'CREDIT';
  readonly amountMinor: bigint;
  readonly currency: string;
}

export interface ZeroSumVerificationResult {
  readonly balanced: boolean;
  readonly totalDebitsMinor: bigint;
  readonly totalCreditsMinor: bigint;
  readonly currency: string;
}

/**
 * Kernel-Level Zero-Sum Double-Entry Invariant Guard (ADR 0001)
 * Guarantees that every journal batch satisfies: sum(Debits) === sum(Credits) > 0
 */
export class ZeroSumInvariantGuard {
  public static verifyBatchConservation(
    lines: readonly ProposedJournalLine[]
  ): ZeroSumVerificationResult {
    if (lines.length < 2) {
      throw new Error('Double-entry violation: journal batch must contain at least 2 lines.');
    }

    const expectedCurrency = lines[0].currency.trim().toUpperCase();
    let totalDebitsMinor = 0n;
    let totalCreditsMinor = 0n;

    for (const line of lines) {
      if (line.amountMinor <= 0n) {
        throw new Error(
          `Invalid journal line amount on account "${line.accountId}": must be a positive BigInt minor unit.`
        );
      }

      const normalizedCurrency = line.currency.trim().toUpperCase();
      if (normalizedCurrency !== expectedCurrency) {
        throw new Error(
          `Cross-currency mismatch within single journal leg: expected "${expectedCurrency}", got "${normalizedCurrency}".`
        );
      }

      if (line.direction === 'DEBIT') {
        totalDebitsMinor += line.amountMinor;
      } else {
        totalCreditsMinor += line.amountMinor;
      }
    }

    if (totalDebitsMinor !== totalCreditsMinor) {
      throw new Error(
        `Zero-sum invariant violation: total debits (${totalDebitsMinor.toString()}) !== total credits (${totalCreditsMinor.toString()}).`
      );
    }

    return {
      balanced: true,
      totalDebitsMinor,
      totalCreditsMinor,
      currency: expectedCurrency
    };
  }
}
