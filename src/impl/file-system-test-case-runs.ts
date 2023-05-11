import { FilesContainer, TestCaseRun } from '../types';
import { findFileSystemTestCaseDirectories } from './find-file-system-test-case-directories';
import { runFileComparisonTestBody } from './run-file-comparison-test-body';

export interface FileSystemTestCaseRunsOptions {
  readonly sharedDirectoryRelativePath?: string;
  readonly testCaseRegex?: RegExp;
}

export function getFileSystemTestCaseRuns(
  testCasesParentDirectory: string,
  actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
  options?: FileSystemTestCaseRunsOptions
): readonly TestCaseRun[] {
  const finalOptions = getFinalOptions(options);

  const TEST_CASES: readonly string[] = findFileSystemTestCaseDirectories(
    testCasesParentDirectory,
    { testCaseRegex: finalOptions.testCaseRegex }
  );

  return TEST_CASES.map((example) => ({
    name: example,
    run: async () => {
      return await runFileComparisonTestBody(
        testCasesParentDirectory,
        example,
        actualFunction,
        {
          sharedDirectoryRelativePath: finalOptions.sharedDirectoryRelativePath,
        }
      );
    },
  }));
}

function getFinalOptions(
  options: FileSystemTestCaseRunsOptions | undefined
): FileSystemTestCaseRunsOptions {
  return options ?? {};
}
