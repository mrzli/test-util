import { readBinaryAsync, readTextAsync } from '@gmjs/fs-async';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { join } from '@gmjs/path';
import { FilesContainer, PathMapping } from '../types';

export interface ReadFakeFilesOptions {
  readonly sharedDirectoryRelativePath?: string;
}

export async function readFakeFiles(
  directory: string,
  options?: ReadFakeFilesOptions,
): Promise<FilesContainer> {
  const finalOptions = getFinalOptions(options);
  const { sharedDirectoryRelativePath } = finalOptions;

  const pathMappingContent = await getPathMappingContent(
    directory,
    sharedDirectoryRelativePath,
  );
  const pathMapping: readonly PathMapping[] =
    parsePathMapping(pathMappingContent);

  const filesDirectory = join(directory, 'files');

  const textFiles: readonly FilePathTextContent[] = await Promise.all(
    pathMapping
      .filter((entry) => entry.testFile.endsWith(TEXT_EXTENSION))
      .map(async (entry) => {
        const content = await readTextAsync(
          join(filesDirectory, entry.testFile),
        );
        return {
          kind: 'text',
          path: entry.path,
          content,
        };
      }),
  );

  const binaryFiles: readonly FilePathBinaryContent[] = await Promise.all(
    pathMapping
      .filter((entry) => entry.testFile.endsWith(BINARY_EXTENSION))
      .map(async (entry) => {
        const content = await readBinaryAsync(
          join(filesDirectory, entry.testFile),
        );
        return {
          kind: 'binary',
          path: entry.path,
          content: content,
        };
      }),
  );

  return {
    textFiles,
    binaryFiles,
  };
}

function getFinalOptions(
  options: ReadFakeFilesOptions | undefined,
): Required<ReadFakeFilesOptions> {
  options = options ?? {};

  return {
    sharedDirectoryRelativePath: options.sharedDirectoryRelativePath ?? '.',
  };
}

async function getPathMappingContent(
  directory: string,
  sharedDirectoryRelativePath: string,
): Promise<string> {
  const pathMappingPath = join(directory, PATH_MAPPING_FILE_NAME);
  const rawContent = await readTextAsync(pathMappingPath);
  return rawContent.replaceAll(
    SHARED_FILES_DIRECTORY_TOKEN,
    sharedDirectoryRelativePath,
  );
}

function parsePathMapping(content: string): readonly PathMapping[] {
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new TypeError('Path mapping data should be an array');
  }

  for (const item of data) {
    validatePathMappingEntru(item);
  }

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validatePathMappingEntru(item: any): asserts item is PathMapping {
  if (typeof item !== 'object' || item === null) {
    throw new TypeError('Path mapping entry should be an object.');
  }

  if (typeof item.testFile !== 'string') {
    throw new TypeError(
      "Path mapping entry should have a 'testFile' field of 'string' type.",
    );
  }
  if (typeof item.path !== 'string') {
    throw new TypeError(
      "Path mapping entry should have a 'path' field of 'string' type.",
    );
  }

  const testFile = item.testFile as string;

  if (
    !testFile.endsWith(TEXT_EXTENSION) &&
    !testFile.endsWith(BINARY_EXTENSION)
  ) {
    throw new TypeError(
      `'testFile' field value must end with '${TEXT_EXTENSION}' or '${BINARY_EXTENSION}'.`,
    );
  }
}

const PATH_MAPPING_FILE_NAME = 'path-mapping.json';
const SHARED_FILES_DIRECTORY_TOKEN = '<shared>';

const TEXT_EXTENSION = '.txt';
const BINARY_EXTENSION = '.bin';
