/**
 * Micro-benchmark: Optimistic Concurrency Control (OCC) Compare-And-Swap Version Check
 */
interface VersionedAccount {
  balanceMinor: bigint;
  version: number;
}

function runOptimisticLockBenchmark(iterations = 500_000): void {
  const account: VersionedAccount = { balanceMinor: 0n, version: 1 };
  const startMs = Date.now();

  for (let i = 1; i <= iterations; i++) {
    const expectedVersion = account.version;
    if (account.version === expectedVersion) {
      account.balanceMinor += 100n;
      account.version += 1;
    }
  }

  const durationMs = Math.max(1, Date.now() - startMs);
  const opsPerSec = Math.round((iterations / durationMs) * 1000);

  console.info(`[Benchmark] Optimistic Concurrency Version Check (CAS):`);
  console.info(`  Iterations : ${iterations.toLocaleString()} (Final Version: ${account.version})`);
  console.info(`  Duration   : ${durationMs} ms`);
  console.info(`  Throughput : ${opsPerSec.toLocaleString()} transitions/sec`);
}

runOptimisticLockBenchmark();
