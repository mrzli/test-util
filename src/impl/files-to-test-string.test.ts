import { describe, expect, it } from '@jest/globals';
import { filesToTestString } from './files-to-test-string';
import { FilePathBinaryContent, FilePathTextContent } from '@gmjs/fs-shared';
import { FilesContainer } from '../types';

describe('files-to-test-string', () => {
  it('should return a proper test string', () => {
    const textFiles: readonly FilePathTextContent[] = [
      {
        path: 'src/example3.txt',
        content: 'Some content 3',
      },
      {
        path: 'src/example1.txt',
        content: 'Some content 1',
      },
    ];

    const binaryFiles: readonly FilePathBinaryContent[] = [
      {
        path: 'example2.bin',
        content: Buffer.from('736f6d652076616c7565', 'hex'), // 'some value' as binary data
      },
    ];

    const files: FilesContainer = {
      textFiles,
      binaryFiles,
    };

    const expected =
      `
--------------------
Path: a-missing-file.txt
--------------------
<MISSING_FILE>
--------------------
--------------------
Path: example2.bin
--------------------
<binary> 5946210c9e93ae37891dfe96c3e39614
--------------------
--------------------
Path: src/example1.txt
--------------------
Some content 1
--------------------
--------------------
Path: src/example3.txt
--------------------
Some content 3
--------------------
--------------------
Path: very-last-file-also-missing.bin
--------------------
<MISSING_FILE>
--------------------
    `.trim() + '\n';

    expect(
      filesToTestString(files, [
        'a-missing-file.txt',
        'very-last-file-also-missing.bin',
      ])
    ).toBe(expected);
  });
});
