import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { hashMd5Hex } from '@gmjs/crypto';

export function filesToTestString(
  textFiles: readonly FilePathTextContent[],
  binaryFiles: readonly FilePathBinaryContent[]
): string {
  const normalizedFiles: FilePathTextContent[] = [
    ...textFiles,
    ...binaryFiles.map((file) => normalizeBinaryFile(file)),
  ];
  const sortedFiles = normalizedFiles.sort((a, b) =>
    a.path.localeCompare(b.path)
  );
  const fileStrings = sortedFiles.map((element) =>
    fileToTestString(element.path, element.content)
  );

  return fileStrings.join('\n') + '\n';
}

function fileToTestString(path: string, content: string): string {
  return [SEPARATOR, `Path: ${path}`, SEPARATOR, content, SEPARATOR].join('\n');
}

function normalizeBinaryFile(file: FilePathBinaryContent): FilePathTextContent {
  return {
    path: file.path,
    content: `<binary> ${hashMd5Hex(file.content)}`,
  };
}

const SEPARATOR = '-'.repeat(20);
