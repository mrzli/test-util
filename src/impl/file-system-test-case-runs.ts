import { FilesContainer, TestCaseRun } from '../types';
import { findFileSystemTestCaseDirectories } from './find-file-system-test-case-directories';
import { runFileComparisonTestBody } from './run-file-comparison-test-body';

export function getFileSystemTestCaseRuns(
  testCasesParentDirectory: string,
  actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
  sharedDirectoryRelativePath: string
): readonly TestCaseRun[] {
  const TEST_CASES: readonly string[] = findFileSystemTestCaseDirectories(
    testCasesParentDirectory
  );

  return TEST_CASES.map((example) => ({
    name: example,
    run: async () => {
      return await runFileComparisonTestBody(
        testCasesParentDirectory,
        example,
        actualFunction,
        sharedDirectoryRelativePath
      );
    },
  }));
}
