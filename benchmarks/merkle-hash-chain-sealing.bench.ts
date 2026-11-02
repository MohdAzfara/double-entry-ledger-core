/**
 * Micro-benchmark: Sequential Cryptographic Hash-Chain Sealing (ADR 0003)
 * Computes 64-bit FNV-1a chained digests across sequential journal postings.
 */
function sealJournalDigest(prevDigest: bigint, seq: number, amountMinor: bigint): bigint {
  let hash = prevDigest ^ 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  hash = ((hash ^ BigInt(seq)) * prime) & 0xffffffffffffffffn;
  hash = ((hash ^ amountMinor) * prime) & 0xffffffffffffffffn;
  return hash;
}

function runHashChainBenchmark(iterations = 300_000): void {
  const startMs = Date.now();
  let headDigest = 0n;

  for (let i = 1; i <= iterations; i++) {
    headDigest = sealJournalDigest(headDigest, i, BigInt(i * 250));
  }

  const durationMs = Math.max(1, Date.now() - startMs);
  const opsPerSec = Math.round((iterations / durationMs) * 1000);

  console.info(`[Benchmark] Sequential Ledger Hash-Chain Sealing:`);
  console.info(`  Iterations : ${iterations.toLocaleString()} (Head Digest: ${headDigest.toString(16)})`);
  console.info(`  Duration   : ${durationMs} ms`);
  console.info(`  Throughput : ${opsPerSec.toLocaleString()} seals/sec`);
}

runHashChainBenchmark();
