import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';

export interface FakeFiles {
  readonly textFiles: readonly FilePathTextContent[];
  readonly binaryFiles: readonly FilePathBinaryContent[];
}

// export const KIND_OF_FILE_CONTENT_LIST = ['text', 'binary'] as const;

// export type KindOfFileContent = (typeof KIND_OF_FILE_CONTENT_LIST)[number];

// export interface FilePathContentBase {
//   readonly kind: KindOfFileContent;
//   readonly path: string;
// }

// export interface FilePathContentText extends FilePathContentBase {
//   readonly kind: 'text';
//   readonly content: string;
// }

// export interface FilePathContentBinary extends FilePathContentBase {
//   readonly kind: 'binary';
//   readonly content: Buffer;
// }

// export type FilePathContentAny = FilePathContentText | FilePathContentBinary;
