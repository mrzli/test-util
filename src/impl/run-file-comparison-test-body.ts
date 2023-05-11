import { join } from 'node:path';
import { FilesContainer, TestComparisonStrings } from '../types';
import { filesToTestString } from './files-to-test-string';
import { readFakeFiles } from './read-fake-files';

export async function runFileComparisonTestBody(
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

  return {
    expected: filesToTestString(testFiles),
    actual: filesToTestString(generatedFiles),
  };
}
