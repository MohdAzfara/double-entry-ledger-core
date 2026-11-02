export type AccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type EntryDirection = 'DEBIT' | 'CREDIT';

export interface LedgerAccountMetadata {
  readonly accountId: string;
  readonly name: string;
  readonly category: AccountCategory;
  readonly currency: string;
  readonly allowNegativeBalance: boolean;
}

/**
 * Standard Chart of Accounts & Normal Balance Direction Evaluator
 * Enforces GAAP/IFRS debit-normal (ASSET, EXPENSE) vs. credit-normal (LIABILITY, EQUITY, REVENUE) semantics.
 */
export class ChartOfAccountsPolicy {
  public static getNormalDirection(category: AccountCategory): EntryDirection {
    if (category === 'ASSET' || category === 'EXPENSE') {
      return 'DEBIT';
    }
    return 'CREDIT';
  }

  public static computeSignedBalanceDelta(
    category: AccountCategory,
    direction: EntryDirection,
    amountMinor: bigint
  ): bigint {
    const normal = this.getNormalDirection(category);
    return direction === normal ? amountMinor : -amountMinor;
  }

  public static assertSolvencyAfterPosting(
    metadata: LedgerAccountMetadata,
    currentBalanceMinor: bigint,
    direction: EntryDirection,
    amountMinor: bigint
  ): bigint {
    const delta = this.computeSignedBalanceDelta(metadata.category, direction, amountMinor);
    const projectedBalanceMinor = currentBalanceMinor + delta;

    if (!metadata.allowNegativeBalance && projectedBalanceMinor < 0n) {
      throw new Error(
        `Normal-balance overdraft violation on account "${metadata.accountId}" (${metadata.category}): projected ${projectedBalanceMinor.toString()} < 0.`
      );
    }

    return projectedBalanceMinor;
  }
}
