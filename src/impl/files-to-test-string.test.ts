import { describe, expect, it } from '@jest/globals';
import { filesToTestString } from './files-to-test-string';
import { FilePathContentAny } from '../types/file-content';

describe('files-to-test-string', () => {
  it('should return a proper test string', () => {
    const input: readonly FilePathContentAny[] = [
      {
        kind: 'text',
        path: 'src/example3.txt',
        content: 'Some content 3',
      },
      {
        kind: 'text',
        path: 'src/example1.txt',
        content: 'Some content 1',
      },
      {
        kind: 'binary',
        path: 'example2.bin',
        content: Buffer.from('736f6d652076616c7565', 'hex'), // 'some value' as binary data
      },
    ];

    const expected =
      `
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
    `.trim() + '\n';

    expect(filesToTestString(input)).toBe(expected);
  });
});
