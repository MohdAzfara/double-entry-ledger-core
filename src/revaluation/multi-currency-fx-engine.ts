import { ProposedJournalLine } from '../guards/zero-sum-invariant-guard';

export interface CrossCurrencySettlementSpec {
  readonly sourceMerchantAccountId: string;
  readonly fxPositionSourceAccountId: string;
  readonly fxPositionTargetAccountId: string;
  readonly targetVendorAccountId: string;
  readonly sourceCurrency: string;
  readonly targetCurrency: string;
  readonly sourceAmountMinor: bigint;
  readonly exchangeRateScaled1e6: bigint;
}

/**
 * Multi-Currency FX Intermediary Clearing & Revaluation Engine (ADR 0005)
 * Generates paired single-currency balanced journal legs for cross-border settlements.
 */
export class MultiCurrencyFxEngine {
  public buildPairedFxJournalLegs(spec: CrossCurrencySettlementSpec): {
    sourceCurrencyLeg: readonly ProposedJournalLine[];
    targetCurrencyLeg: readonly ProposedJournalLine[];
    convertedTargetMinor: bigint;
  } {
    if (spec.sourceAmountMinor <= 0n || spec.exchangeRateScaled1e6 <= 0n) {
      throw new Error('FX conversion requires positive source amount and scaled exchange rate.');
    }

    const convertedTargetMinor =
      (spec.sourceAmountMinor * spec.exchangeRateScaled1e6) / 1_000_000n;

    const sourceCurrencyLeg: ProposedJournalLine[] = [
      {
        accountId: spec.sourceMerchantAccountId,
        direction: 'DEBIT',
        amountMinor: spec.sourceAmountMinor,
        currency: spec.sourceCurrency
      },
      {
        accountId: spec.fxPositionSourceAccountId,
        direction: 'CREDIT',
        amountMinor: spec.sourceAmountMinor,
        currency: spec.sourceCurrency
      }
    ];

    const targetCurrencyLeg: ProposedJournalLine[] = [
      {
        accountId: spec.fxPositionTargetAccountId,
        direction: 'DEBIT',
        amountMinor: convertedTargetMinor,
        currency: spec.targetCurrency
      },
      {
        accountId: spec.targetVendorAccountId,
        direction: 'CREDIT',
        amountMinor: convertedTargetMinor,
        currency: spec.targetCurrency
      }
    ];

    return {
      sourceCurrencyLeg,
      targetCurrencyLeg,
      convertedTargetMinor
    };
  }
}
