import { join } from '@gmjs/path';
import { FilesContainer, TestComparisonStrings } from '../types';
import { filesToTestString } from './files-to-test-string';
import { readFakeFiles } from './read-fake-files/read-fake-files';
import { CASES_DIRECTORY_NAME } from './util';

export async function runFileComparisonTestCase(
  rootDirectory: string,
  testCaseName: string,
  actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
): Promise<TestComparisonStrings> {
  const expectedFiles = await readFakeFiles(rootDirectory, testCaseName);

  const testCaseDirectory = join(
    rootDirectory,
    CASES_DIRECTORY_NAME,
    testCaseName,
  );

  const actualFiles = await actualFunction(testCaseDirectory);

  const missingFromExpectedFiles = getMissingFiles(expectedFiles, actualFiles);
  const missingFromActualFiles = getMissingFiles(actualFiles, expectedFiles);

  return {
    expected: filesToTestString(expectedFiles, missingFromExpectedFiles),
    actual: filesToTestString(actualFiles, missingFromActualFiles),
  };
}

function getMissingFiles(
  files: FilesContainer,
  compareAgainst: FilesContainer,
): readonly string[] {
  const filesSet: ReadonlySet<string> = new Set<string>([
    ...files.textFiles.map((file) => file.path),
    ...files.binaryFiles.map((file) => file.path),
  ]);

  return [
    ...compareAgainst.textFiles
      .filter((file) => !filesSet.has(file.path))
      .map((file) => file.path),
    ...compareAgainst.binaryFiles
      .filter((file) => !filesSet.has(file.path))
      .map((file) => file.path),
  ];
}
