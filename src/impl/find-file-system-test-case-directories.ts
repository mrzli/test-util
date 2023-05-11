import { relative } from 'node:path';
import { findFileSystemEntriesSync } from '@gmjs/fs-sync';
import { FilePathStats } from '@gmjs/fs-shared';

export interface FindFileSystemTestCaseDirectoriesOptions {
  readonly testCaseRegex?: RegExp;
}

export function findFileSystemTestCaseDirectories(
  rootDirectory: string,
  options?: FindFileSystemTestCaseDirectoriesOptions
): readonly string[] {
  const finalOptions = getFinalOptions(options);
  const { testCaseRegex } = finalOptions;

  const testAssetsSubdirectories = findFileSystemEntriesSync(rootDirectory, {
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
  options?: FindFileSystemTestCaseDirectoriesOptions
): Required<FindFileSystemTestCaseDirectoriesOptions> {
  options = options ?? {};

  return {
    testCaseRegex: options.testCaseRegex ?? /^example-/,
  };
}
