import { join } from '@gmjs/path';
import { FilesContainer, TestComparisonStrings } from '../types';
import { filesToTestString } from './files-to-test-string';
import { readFakeFiles } from './read-fake-files/read-fake-files';

export interface RunFileComparisonTestBodyOptions {
  readonly sharedDirectoryRelativePath?: string;
}

export async function runFileComparisonTestBody(
  testCasesParentDirectory: string,
  exampleName: string,
  actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
  options?: RunFileComparisonTestBodyOptions,
): Promise<TestComparisonStrings> {
  const finalOptions = getFinalOptions(options);

  const testCaseDirectory = join(testCasesParentDirectory, exampleName);

  const expectedFiles = await readFakeFiles(
    join(testCaseDirectory, 'expected'),
    {
      sharedDirectoryRelativePath: finalOptions.sharedDirectoryRelativePath,
    },
  );

  const actualFiles = await actualFunction(testCaseDirectory);

  const missingFromExpectedFiles = getMissingFiles(expectedFiles, actualFiles);
  const missingFromActualFiles = getMissingFiles(actualFiles, expectedFiles);

  return {
    expected: filesToTestString(expectedFiles, missingFromExpectedFiles),
    actual: filesToTestString(actualFiles, missingFromActualFiles),
  };
}

function getFinalOptions(
  options: RunFileComparisonTestBodyOptions | undefined,
): RunFileComparisonTestBodyOptions {
  return options ?? {};
}

function getMissingFiles(
  files: FilesContainer,
  compareAgainst: FilesContainer,
): readonly string[] {
  const compareAgainstSet: ReadonlySet<string> = new Set<string>([
    ...compareAgainst.textFiles.map((file) => file.path),
    ...compareAgainst.binaryFiles.map((file) => file.path),
  ]);

  return [
    ...files.textFiles
      .filter((file) => !compareAgainstSet.has(file.path))
      .map((file) => file.path),
    ...files.binaryFiles
      .filter((file) => !compareAgainstSet.has(file.path))
      .map((file) => file.path),
  ];
}
