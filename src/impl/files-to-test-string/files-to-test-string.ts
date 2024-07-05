import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/file-system';
import { hashMd5Hex } from '@gmjs/crypto';
import { FilesContainer } from '../../types';

export function filesToTestString(
  files: FilesContainer,
  missingFiles?: readonly string[],
): string {
  const normalizedFiles: FilePathTextContent[] = [
    ...files.textFiles,
    ...files.binaryFiles.map((file) => normalizeBinaryFile(file)),
    ...(missingFiles ?? []).map((path) => ({
      path,
      content: MISSING_FILE_TOKEN,
    })),
  ];
  const sortedFiles = normalizedFiles.sort((a, b) =>
    a.path.localeCompare(b.path),
  );
  const fileStrings = sortedFiles.map((element) =>
    fileToTestString(element.path, element.content),
  );

  return fileStrings.join('\n') + '\n';
}

function fileToTestString(path: string, content: string): string {
  return [SEPARATOR, `Path: ${path}`, SEPARATOR, content, SEPARATOR].join('\n');
}

function normalizeBinaryFile(file: FilePathBinaryContent): FilePathTextContent {
  return {
    path: file.path,
    content: `${BINARY_FILE_TOKEN} ${hashMd5Hex(file.content)}`,
  };
}

const SEPARATOR = '-'.repeat(20);
const BINARY_FILE_TOKEN = '<binary>';
const MISSING_FILE_TOKEN = '<MISSING_FILE>';
