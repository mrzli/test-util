import { join } from 'node:path';
import { FilesContainer, TestComparisonStrings } from '../types';
import { filesToTestString } from './files-to-test-string';
import { readFakeFiles } from './read-fake-files';

export interface RunFileComparisonTestBodyOptions {
  readonly sharedDirectoryRelativePath?: string;
}

export async function runFileComparisonTestBody(
  testCasesParentDirectory: string,
  exampleName: string,
  actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
  options?: RunFileComparisonTestBodyOptions
): Promise<TestComparisonStrings> {
  const finalOptions = getFinalOptions(options);

  const testCaseDirectory = join(testCasesParentDirectory, exampleName);

  const testFiles = await readFakeFiles(join(testCaseDirectory, 'expected'), {
    sharedDirectoryRelativePath: finalOptions.sharedDirectoryRelativePath,
  });

  const generatedFiles = await actualFunction(testCaseDirectory);

  return {
    expected: filesToTestString(testFiles),
    actual: filesToTestString(generatedFiles),
  };
}

function getFinalOptions(
  options: RunFileComparisonTestBodyOptions | undefined
): RunFileComparisonTestBodyOptions {
  return options ?? {};
}
