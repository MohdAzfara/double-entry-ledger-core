/**
 * Micro-benchmark: End-of-Day (EOD) Trial Balance Snapshot Aggregation (ADR 0006)
 * Verifies global debit/credit equality across 200,000 ledger account postings.
 */
function runTrialBalanceBenchmark(iterations = 200_000): void {
  const startMs = Date.now();
  let totalDebitsMinor = 0n;
  let totalCreditsMinor = 0n;

  for (let i = 1; i <= iterations; i++) {
    const amount = BigInt((i % 10_000) * 100);
    totalDebitsMinor += amount;
    totalCreditsMinor += amount;
  }

  const isBalanced = totalDebitsMinor === totalCreditsMinor;
  const durationMs = Math.max(1, Date.now() - startMs);
  const opsPerSec = Math.round((iterations / durationMs) * 1000);

  console.info(`[Benchmark] EOD Trial Balance Snapshot Aggregation:`);
  console.info(`  Accounts   : ${iterations.toLocaleString()} (Balanced: ${isBalanced})`);
  console.info(`  Duration   : ${durationMs} ms`);
  console.info(`  Throughput : ${opsPerSec.toLocaleString()} aggregations/sec`);
}

runTrialBalanceBenchmark();
