/**
 * Micro-benchmark: Multi-Currency Basis-Point FX Conversion & Spread Allocation (ADR 0005)
 */
function convertWithBasisPointRate(
  sourceAmountMinor: bigint,
  rateScaled1e6: bigint,
  spreadBps: bigint
): { netTargetMinor: bigint; spreadFeeMinor: bigint } {
  const grossTargetMinor = (sourceAmountMinor * rateScaled1e6) / 1_000_000n;
  const spreadFeeMinor = (grossTargetMinor * spreadBps) / 10_000n;
  return {
    netTargetMinor: grossTargetMinor - spreadFeeMinor,
    spreadFeeMinor
  };
}

function runFxSplitBenchmark(iterations = 300_000): void {
  const startMs = Date.now();
  let totalConverted = 0n;

  for (let i = 1; i <= iterations; i++) {
    const res = convertWithBasisPointRate(BigInt(i * 1000), 1_085_400n, 35n);
    totalConverted += res.netTargetMinor + res.spreadFeeMinor;
  }

  const durationMs = Math.max(1, Date.now() - startMs);
  const opsPerSec = Math.round((iterations / durationMs) * 1000);

  console.info(`[Benchmark] Multi-Currency BigInt FX Conversion & Spread Split:`);
  console.info(`  Iterations : ${iterations.toLocaleString()} (Checksum: ${totalConverted > 0n})`);
  console.info(`  Duration   : ${durationMs} ms`);
  console.info(`  Throughput : ${opsPerSec.toLocaleString()} conversions/sec`);
}

runFxSplitBenchmark();
