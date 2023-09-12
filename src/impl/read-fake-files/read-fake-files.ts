import { readBinaryAsync, readTextAsync } from '@gmjs/fs-async';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { join } from '@gmjs/path';
import { FilesContainer, PathMappingEntry, PathMappingFile } from '../../types';
import { parsePathMapping } from './parse-path-mapping';
import { TEXT_EXTENSION, BINARY_EXTENSION } from './constants';

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
  const pathMapping: PathMappingFile = parsePathMapping(pathMappingContent);

  const filesDirectory = join(directory, 'files');

  const textFiles: readonly FilePathTextContent[] = await Promise.all(
    pathMapping
      .flatMap((entry) => entry.files)
      .filter((entry) => entry.fr.endsWith('.' + TEXT_EXTENSION))
      .map((entry) => pathMappingEntryToTextContent(entry, filesDirectory)),
  );

  const binaryFiles: readonly FilePathBinaryContent[] = await Promise.all(
    pathMapping
      .flatMap((entry) => entry.files)
      .filter((entry) => entry.fr.endsWith('.' + BINARY_EXTENSION))
      .map((entry) => pathMappingEntryToBinaryContent(entry, filesDirectory)),
  );

  return {
    textFiles,
    binaryFiles,
  };
}

async function pathMappingEntryToTextContent(
  entry: PathMappingEntry,
  filesDirectory: string,
): Promise<FilePathTextContent> {
  const content = await readTextAsync(join(filesDirectory, entry.fr));
  return {
    path: entry.to,
    content,
  };
}

async function pathMappingEntryToBinaryContent(
  entry: PathMappingEntry,
  filesDirectory: string,
): Promise<FilePathBinaryContent> {
  const content = await readBinaryAsync(join(filesDirectory, entry.fr));
  return {
    path: entry.to,
    content,
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

const PATH_MAPPING_FILE_NAME = 'path-mapping.json';
const SHARED_FILES_DIRECTORY_TOKEN = '<shared>';
