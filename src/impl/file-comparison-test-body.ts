import { join } from 'node:path';
import { FilesContainer, TestComparisonStrings } from '../types';
import { filesToTestString } from './files-to-test-string';
import { readFakeFiles } from './read-fake-files';

export async function fileComparisonTestBody(
  testCasesParentDirectory: string,
  exampleName: string,
  actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
  sharedDirectoryRelativePath: string
): Promise<TestComparisonStrings> {
  const testCaseDirectory = join(testCasesParentDirectory, exampleName);

  const testFiles = await readFakeFiles(join(testCaseDirectory, 'expected'), {
    sharedDirectoryRelativePath,
  });

  const generatedFiles = await actualFunction(testCaseDirectory);

  return toTestComparisonStrings(testFiles, generatedFiles);
}

function toTestComparisonStrings(
  expected: FilesContainer,
  actual: FilesContainer
): TestComparisonStrings {
  return {
    expected: filesToTestString(expected.textFiles, expected.binaryFiles),
    actual: filesToTestString(actual.textFiles, actual.binaryFiles),
  };
}
