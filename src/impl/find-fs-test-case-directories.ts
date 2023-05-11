import { relative } from 'node:path';
import { findFsEntriesSync } from '@gmjs/fs-sync';
import { FilePathStats } from '@gmjs/fs-shared';

export interface FindFsTestCaseDirectoriesOptions {
  readonly testCaseRegex?: RegExp;
}

export function findFsTestCaseDirectories(
  rootDirectory: string,
  options?: FindFsTestCaseDirectoriesOptions
): readonly string[] {
  const finalOptions = getFinalOptions(options);
  const { testCaseRegex } = finalOptions;

  const testAssetsSubdirectories = findFsEntriesSync(rootDirectory, {
    depthLimit: 0,
  });

  const testCases: readonly FilePathStats[] = testAssetsSubdirectories
    .map((item) => ({
      path: relative(rootDirectory, item.path),
      stats: item.stats,
    }))
    .filter(
      (item) => item.stats.isDirectory() && testCaseRegex.test(item.path)
    );

  return testCases.map((item) => item.path);
}

function getFinalOptions(
  options?: FindFsTestCaseDirectoriesOptions
): Required<FindFsTestCaseDirectoriesOptions> {
  options = options ?? {};

  return {
    testCaseRegex: options.testCaseRegex ?? /^example-/,
  };
}
