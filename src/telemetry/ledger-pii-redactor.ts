/**
 * Recursive Counterparty PII, IBAN & Tax Identifier Telemetry Redactor
 * Ensures SOC 1, PCI-DSS, and GDPR privacy compliance across ledger audit logs.
 */
export class LedgerPiiRedactor {
  private static readonly SENSITIVE_KEYS = new Set([
    'iban',
    'accountnumber',
    'taxid',
    'pan',
    'counterpartyname',
    'signingkey'
  ]);

  public static maskIdentifier(raw: string): string {
    const trimmed = raw.replace(/\s+/g, '');
    if (trimmed.length <= 4) {
      return '****';
    }
    return `****-REDACTED-${trimmed.slice(-4)}`;
  }

  public static scrubLogObject(payload: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
      const normalized = key.toLowerCase().replace(/[_-]/g, '');

      if (this.SENSITIVE_KEYS.has(normalized) && typeof value === 'string') {
        sanitized[key] = this.maskIdentifier(value);
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.scrubLogObject(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
