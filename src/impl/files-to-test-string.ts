import { hashMd5Hex } from '@gmjs/crypto';
import { FilePathContentAny } from '../types';

export function filesToTestString(
  files: readonly FilePathContentAny[]
): string {
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));
  return (
    sortedFiles.map((element) => fileToTestString(element)).join('\n') + '\n'
  );
}

function fileToTestString(file: FilePathContentAny): string {
  return [
    SEPARATOR,
    `Path: ${file.path}`,
    SEPARATOR,
    file.kind === 'text'
      ? file.content
      : `<binary> ${hashMd5Hex(file.content)}`,
    SEPARATOR,
  ].join('\n');
}

const SEPARATOR = '-'.repeat(20);
