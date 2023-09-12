import { describe, expect, it } from '@jest/globals';
import { parsePathMapping } from './parse-path-mapping';
import { PathMappingFile } from '../../types';

describe('parsePathMapping', () => {
  describe('parsePathMapping()', () => {
    describe('valid', () => {
      interface Example {
        readonly description: string;
        readonly input: string;
        readonly expected: PathMappingFile;
      }

      const EXAMPLES: readonly Example[] = [
        {
          description: 'empty file list',
          input: `[]`,
          expected: [],
        },
        {
          description: 'single group',
          input: `
            [
              {
                "group": "some-group",
                "files": [
                  {
                    "fr": "a.ts.txt",
                    "to": "a.ts"
                  },
                  {
                    "fr": "b.png.bin",
                    "to": "b.png"
                  }
                ]
              }
            ]
          `,
          expected: [
            {
              group: 'some-group',
              files: [
                {
                  fr: 'a.ts.txt',
                  to: 'a.ts',
                },
                {
                  fr: 'b.png.bin',
                  to: 'b.png',
                },
              ],
            },
          ],
        },
      ];

      for (const example of EXAMPLES) {
        it(example.description, () => {
          const actual = parsePathMapping(example.input);
          expect(actual).toEqual(example.expected);
        });
      }
    });
  });

  describe('throws', () => {
    interface Example {
      readonly description: string;
      readonly input: string;
    }

    const EXAMPLES: readonly Example[] = [
      {
        description: 'empty json',
        input: '',
      },
      {
        description: 'ungrouped file',
        input: `
          [
            {
              "fr": "a.ts.txt",
              "to": "a.ts"
            },
          ]
        `,
      },
      {
        description: 'missing "group" property',
        input: `
          [
            {
              "files": [
                {
                  "fr": "a.ts.txt",
                  "to": "a.ts"
                }
              ]
            }
          ]
        `,
      },
      {
        description: 'missing "files" property',
        input: `
          [
            {
              "group": "some-group",
            }
          ]
        `,
      },
      {
        description: 'missing "fr" property',
        input: `
          [
            {
              "group": "some-group",
              "files": [
                {
                  "to": "a.ts"
                }
              ]
            }
          ]
        `,
      },
      {
        description: 'missing "to" property',
        input: `
          [
            {
              "group": "some-group",
              "files": [
                {
                  "fr": "a.ts.txt"
                }
              ]
            }
          ]
        `,
      },
      {
        description: 'invalid "fr" property (missing extension)',
        input: `
          [
            {
              "group": "some-group",
              "files": [
                {
                  "fr": "a.ts",
                  "to": "a.ts"
                }
              ]
            }
          ]
        `,
      },
    ];

    for (const example of EXAMPLES) {
      it(example.description, () => {
        const call = (): PathMappingFile => parsePathMapping(example.input);
        expect(call).toThrowError();
      });
    }
  });
});
