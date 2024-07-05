import nodePath from 'node:path';
import { FilesContainer, TestCaseRun, TestComparisonStrings } from '../types';
import { runFileComparisonTestCase } from './run-file-comparison-test-case';
import { FilePathStats, findFileSystemEntriesSync } from '@gmjs/file-system';
import { CASES_DIRECTORY_NAME } from './util';

export function createFsTestCases(
  rootDirectory: string,
  actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
): readonly TestCaseRun[] {
  const TEST_CASES: readonly string[] = findTestCaseDirectories(rootDirectory);

  return TEST_CASES.map((example) => ({
    name: example,
    run: async (): Promise<TestComparisonStrings> => {
      return await runFileComparisonTestCase(
        rootDirectory,
        example,
        actualFunction,
      );
    },
  }));
}

function findTestCaseDirectories(rootDirectory: string): readonly string[] {
  const casesDirectory = nodePath.join(rootDirectory, CASES_DIRECTORY_NAME);
  const testAssetsSubdirectories = findFileSystemEntriesSync(casesDirectory, {
    depthLimit: 0,
  });

  const testCases: readonly FilePathStats[] = testAssetsSubdirectories.filter(
    (item) => item.stats.isDirectory(),
  );

  return testCases.map((item) => nodePath.relative(casesDirectory, item.path));
}
