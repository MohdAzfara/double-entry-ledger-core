export interface VersionedAccountSnapshot {
  readonly accountId: string;
  readonly balanceMinor: bigint;
  readonly version: number;
}

/**
 * Serializable Optimistic Concurrency Control (OCC) & Deadlock-Free Lock Sorter (ADR 0004)
 */
export class OptimisticVersionLock {
  public static sortAccountsLexicographically(accountIds: readonly string[]): string[] {
    return Array.from(new Set(accountIds)).sort((a, b) => a.localeCompare(b));
  }

  public static verifyAndIncrementVersion(
    snapshot: VersionedAccountSnapshot,
    expectedVersion: number,
    newBalanceMinor: bigint
  ): VersionedAccountSnapshot {
    if (snapshot.version !== expectedVersion) {
      throw new Error(
        `Optimistic concurrency version mismatch on account "${snapshot.accountId}": expected v${expectedVersion}, found v${snapshot.version}.`
      );
    }

    return {
      accountId: snapshot.accountId,
      balanceMinor: newBalanceMinor,
      version: snapshot.version + 1
    };
  }
}
