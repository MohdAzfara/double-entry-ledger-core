/**
 * Zero-Trust Producer Signature & Replay Window Guard
 * Authenticates inbound journal posting events from internal microservices.
 */
export class LedgerSignatureAttestationGuard {
  constructor(private readonly maxReplayWindowSec = 300) {}

  public isTimestampValid(
    eventTimestampSec: number,
    nowSec = Math.floor(Date.now() / 1000)
  ): boolean {
    return Math.abs(nowSec - eventTimestampSec) <= this.maxReplayWindowSec;
  }

  public constantTimeDigestEquals(expectedHex: string, providedHex: string): boolean {
    if (expectedHex.length === 0 || expectedHex.length !== providedHex.length) {
      return false;
    }

    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) {
      diff |= expectedHex.charCodeAt(i) ^ providedHex.charCodeAt(i);
    }
    return diff === 0;
  }
}
