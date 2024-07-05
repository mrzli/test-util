import { performance } from 'node:perf_hooks';

export async function asyncMeasurePeformanceTime(
  fn: () => Promise<void>,
): Promise<number> {
  const start = performance.now();
  await fn();
  return performance.now() - start;
}

export function measurePeformanceTime(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}
