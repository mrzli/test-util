import { readBinaryAsync, readTextAsync } from '@gmjs/fs-async';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { join } from '@gmjs/path';
import { FilesContainer, PathMappingEntry, PathMappingFile } from '../../types';
import { parsePathMapping } from './parse-path-mapping';
import { TEXT_EXTENSION, BINARY_EXTENSION } from './constants';
import { CASES_DIRECTORY_NAME, SHARED_DIRECTORY_NAME } from '../util';

export async function readFakeFiles(
  rootDirectory: string,
  testCaseName: string,
): Promise<FilesContainer> {
  const pathMappingPath = join(
    rootDirectory,
    CASES_DIRECTORY_NAME,
    testCaseName,
    'expected',
    'path-mapping.json',
  );
  const pathMappingContent = await readTextAsync(pathMappingPath);
  const pathMapping: PathMappingFile = parsePathMapping(pathMappingContent);

  const textFiles: readonly FilePathTextContent[] = await Promise.all(
    pathMapping
      .flatMap((entry) => entry.files)
      .filter((entry) => entry.fr.endsWith('.' + TEXT_EXTENSION))
      .map((entry) =>
        pathMappingEntryToTextContent(rootDirectory, testCaseName, entry),
      ),
  );

  const binaryFiles: readonly FilePathBinaryContent[] = await Promise.all(
    pathMapping
      .flatMap((entry) => entry.files)
      .filter((entry) => entry.fr.endsWith('.' + BINARY_EXTENSION))
      .map((entry) =>
        pathMappingEntryToBinaryContent(rootDirectory, testCaseName, entry),
      ),
  );

  return {
    textFiles,
    binaryFiles,
  };
}

async function pathMappingEntryToTextContent(
  rootDirectory: string,
  testCaseName: string,
  entry: PathMappingEntry,
): Promise<FilePathTextContent> {
  const content = await readTextAsync(
    resolveFrFile(rootDirectory, testCaseName, entry.fr),
  );
  return {
    path: entry.to,
    content,
  };
}

async function pathMappingEntryToBinaryContent(
  rootDirectory: string,
  testCaseName: string,
  entry: PathMappingEntry,
): Promise<FilePathBinaryContent> {
  const content = await readBinaryAsync(
    resolveFrFile(rootDirectory, testCaseName, entry.fr),
  );
  return {
    path: entry.to,
    content,
  };
}

function resolveFrFile(
  rootDirectory: string,
  testCaseName: string,
  fr: string,
): string {
  return SHARED_DIRECTORY_REGEX.test(fr)
    ? join(
        rootDirectory,
        SHARED_DIRECTORY_NAME,
        fr.replaceAll(SHARED_DIRECTORY_REGEX, '$1'),
      )
    : join(
        rootDirectory,
        CASES_DIRECTORY_NAME,
        testCaseName,
        'expected',
        'files',
        fr,
      );
}

const SHARED_DIRECTORY_REGEX = /^<([\dA-Za-z]+(?:-[\dA-Za-z]+)*)>/g;
