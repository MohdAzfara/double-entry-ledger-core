import { HashChainAuditSealer } from './hash-chain-audit-sealer';

/**
 * Binary Merkle Tree Batch Root Calculator & Tamper Verifier (ADR 0003)
 * Compresses settlement window journal digests into a single cryptographic root.
 */
export class MerkleBatchVerifier {
  public static computeMerkleRoot(leafDigests: readonly string[]): string {
    if (leafDigests.length === 0) {
      return HashChainAuditSealer.GENESIS_HASH;
    }

    let currentLevel = [...leafDigests];

    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        nextLevel.push(HashChainAuditSealer.computeDeterministicDigest(`${left}:${right}`));
      }
      currentLevel = nextLevel;
    }

    return currentLevel[0];
  }
}
